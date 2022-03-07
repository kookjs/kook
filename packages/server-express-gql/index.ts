import { injectable, inject } from "inversify";
import path from "path";
import _ from 'lodash'

import { ApolloServer, ApolloError } from "apollo-server-express";

import {
  GraphQLError,
  GraphQLFormattedError
} from 'graphql';

import { buildSchema, NonEmptyArray, ArgumentValidationError } from "type-graphql";

import Hook from '@khanakiajs/hook'
import ServerExpress from '@kookjs/server-express'
import { config } from '@kookjs/core'

import { RecipeResolver } from "./sample/recipe-resolver";
import _config , { IConfig } from './config'
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

type TResolver = Function | string;
type TResolvers = NonEmptyArray<Function> | NonEmptyArray<string>;

type ContextFn  = (ctx: ExpressContext) => any;

import { authChecker } from "../auth/auth-checker";

@injectable()
export default class ServerExpressGql {
  private _hook: Hook
  private _serverExpress: ServerExpress
  public version: string;

  protected config : IConfig

  protected resolvers: TResolver[]

  constructor(@inject('Hook') hook: Hook, @inject('ServerExpress') serverExpress: ServerExpress  ) {
    this.version = "1.0.0"

    this._hook = hook

    this._serverExpress = serverExpress

    this.config = Object.assign({}, _config, config('server-express-gql'))

    this.resolvers = [RecipeResolver]
  }

  async boot() {
    // build TypeGraphQL executable schema
    const schema = await buildSchema({
      // resolvers: [RecipeResolver],
      resolvers: <TResolvers>this.resolvers,
      // automatically create `schema.gql` file with schema definition in current folder
      emitSchemaFile: path.resolve(__dirname, "schema.gql"),
      // validate: false
      authChecker: authChecker
    });

    const server = new ApolloServer({
      introspection: true,
      playground: true,
      debug: false,
      // schema: schemaHello,
      schema,
      context: async (args) => {
        
        const argsFilterd = await this._hook.Filter.applyRaw("ApolloServer/Context", args)
        // console.log(argsFilterd)
        // console.log(args.res.getHeaders())
        return argsFilterd
        // return {
        //   req,
        //   res,
        //   userId: "222"
        //   // authorsLoader: createAuthorsLoader()
        // }
      },
      
      formatError: (error: GraphQLError): GraphQLFormattedError => {
        if (error.originalError instanceof ApolloError) {
          return error;
        }

        /**
         * Graphql was showing INTERNAL_SERVER_ERROR when exeuting queries from Apollo Client but
         * it was working fine when executing same queries with GraphIQL
         * https://github.com/apollographql/apollo-server/issues/3498#issuecomment-554966929
         */
        if (
          error.extensions &&
           (error.message.startsWith(`Variable "`) ||
             error.extensions.code === "GRAPHQL_VALIDATION_FAILED")
         ) {
          error.extensions.code = "GRAPHQL_VALIDATION_FAILED";
          return error;
        }
      
        if (error.originalError instanceof ArgumentValidationError) {
          error.extensions.code = 'ARGUMENT_VALIDATION_FAILED';
        }
      
        return error;
      }
      

    });
    
    await server.start()
    
    /**
     * Do not enable cors here if you have to use cors then use the server-express cors
     * Otherwise we will have set the same option twice if you enable and will get withCrendentials origin errors
     */
    server.applyMiddleware({ 
      app: this._serverExpress.app,
      cors: false
      // cors: { origin: ['http://localhost:7002'], credentials: true }
    });
  }

  async filterContext(fn: ContextFn) {    
    this._hook.Filter.add("ApolloServer/Context", fn)
  }

  // setConfig(config: any) {
  //   config = Object.assign({}, this.config, config)
  //   this.config = config
  //   return config
  // }
  
  addResolver(resolver: TResolver): TResolver[] {
    this.resolvers = [...this.resolvers, ...[resolver]]
    return this.resolvers
  }

  addResolvers(resolvers: TResolver[]): TResolver[] {
    for (const resolver of resolvers) {
      this.addResolver(resolver)
    }
    return this.resolvers
  }

  getResolvers(): TResolver[] {
    return this.resolvers
  }
}