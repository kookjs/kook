import { injectable } from "inversify";
import { Resolver, Query, Arg, Mutation } from "type-graphql";

import { ForbiddenError } from 'apollo-server-errors'

import { UserRoleAddInput, UserRoleEditInput } from "./UserRoleInput";
import { UserRole } from "../entity/UserRole";

import { FilterInput, MetaInput, SortDirection, PaginatedResponse, IPaginatedResponse } from "@kookjs/core/gql";
import { DbHelper } from "@kookjs/db";

const PaginatedItemResponse = PaginatedResponse(UserRole);
type PaginatedItemResponse = InstanceType<typeof PaginatedItemResponse>;

@injectable()
@Resolver()
export class UserRoleResolver {
	constructor() {}

	@Mutation(() => UserRole)
	async autAcl_UserRole_Add(@Arg("args") args: UserRoleAddInput): Promise<UserRole | undefined> {
    let urExisting = await UserRole.findOne({ key: args.key });
    if (urExisting)
    throw new ForbiddenError(`Key: ${args.key} already exists.`);
    let ur = new UserRole();
    ur.key = args.key;
    ur.title = args.title;
    await ur.save();
    return ur;
	}
  
  @Query(() => UserRole)
  async autAcl_UserRole_Get(@Arg("id") id: number): Promise<UserRole | undefined> {
    return await UserRole.findOne(id);
  }

  @Mutation(() => UserRole)
	async autAcl_UserRole_Update(@Arg("args") args: UserRoleEditInput): Promise<UserRole | undefined> {
    let ur = await UserRole.findOne({ key: args.key });
    if (!ur) throw new ForbiddenError(`Key: ${args.key} does not exists.`);
    // let ur = await UserRole.findOne(args.id);
    ur.key = args.key;
    ur.title = args.title;
    await ur.save();
    return ur;
  }
  
  @Mutation(() => Boolean)
	async autAcl_UserRole_Delete(@Arg("id") id: number): Promise<Boolean | undefined> {
    let ur = await UserRole.findOne(id);
    if (!ur)
        throw new ForbiddenError('User Role does not exists.');
    if (ur.isDefault)
        throw new ForbiddenError('Default User Role cannot be delete.');
    let urDelete = await UserRole.delete({ id: id });
    return urDelete.affected >= 1 ? true : false;
  }
  
  @Query(() => PaginatedItemResponse)
	async autAcl_UserRole_List(
		@Arg("meta", { nullable: true }) metaArgs?: MetaInput,
		@Arg("filters", (type) => [FilterInput], { nullable: true }) filters?: FilterInput[]
	): Promise<IPaginatedResponse> {
    let qb = UserRole.createQueryBuilder();
    const meta = Object.assign({}, {
        page: 1,
        limit: 10,
        orderBy: [
            {
                key: 'id',
                value: SortDirection.ASC
            }
        ]
    }, metaArgs);
    if (meta.orderBy) {
        for (const { key, value } of meta.orderBy) {
            qb.addOrderBy(key, value);
        }
    }
    const total = await qb.getCount();
    const skip = (meta.page - 1) * meta.limit;
    qb = qb.skip(skip).take(meta.limit);
    DbHelper.addFilters(qb, filters);
    const items = await qb.getMany();
    return {
        items,
        meta: {
            page: meta.page,
            limit: meta.limit,
            orderBy: meta.orderBy,
            total: total,
        },
    };
	}
}
