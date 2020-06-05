import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
var router = express.Router()

// var compression = require('compression');
var cors = require('cors');
var path = require('path');
// Dependencies
const fs = require('fs');
const http = require('http');
// const https = require('https');

import { injectable, inject } from "inversify";
import _ from 'lodash'

import Server from '@kookjs/server'
import Hook from '@kookjs/hook'
// import { TYPES } from "../../types";
// import {IPlugin} from '@kookjs/core'

import _config , { IConfig } from './config'

@injectable()
export default class ServerExpress {
  private _hook: Hook
  private _server: Server
  
  public version: string;

  protected config : IConfig

  protected router: express.Router

  public app: express.Application

  constructor(@inject('Hook') hook: Hook, @inject('Server') server: Server ) {
    this.version = "1.0.0"

    this._hook = hook
    this._server = server

    // console.log('Server Express - consturctor called')
    // console.log(this._hook.version)

    this.config = _config

    this.router = express.Router()
    let app = express();
    
    // // app.set('views', this.config.dirView);
    // // app.set('view engine', this.config.templateEngine);

    
    app.use(morgan('dev'));
    app.use(bodyParser.json({limit: '10mb'}));
    app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
    app.use(cookieParser());
    app.use(cors())

    app.use(async (req, res, next) => {
        await hook.Filter.apply('Www/GlobalMiddleware', {
          req, 
          res, 
          next
        })

        await hook.Action.do('Www/GlobalMiddleware', {
          req, 
          res, 
          next
        })

        // console.log(res.getHeader('Set-Cookie'))

        if(!res.headersSent) {
            next()
        }
    })

    app.get('/ping', (req, res, ) => res.send('ok'))
    
    // app.use('/', express.static(this.config.dirPublic));
    // console.log(this.config.dirUploadsPublic)
    // app.use('/uploads', express.static(this.config.dirUploadsPublic));

    for (const route of this._server.getRoutes()) {
      app[route.method](route.url, route.middlewares||[], route.handler )
    }

    this.app = app
  }

  async boot() {
    // Don't Init any routes in this Action this is only to add Top Level Middlewares
    await this._hook.Action.do('Www/InitMiddleware', {})

    await this._hook.Action.do('Www/Init', {})

    this.app.listen(this.config.port || 80, (err) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(`HTTP - Express Server is now running on localhost:${this.config.port || 80}`)
    })

  }

  setConfig(config: any) {
    config = Object.assign({}, this.config, config)
    this.config = config
    return config
  }
  
  helloServer() {
    console.log('server hello', this._hook.version)
  }
}