import { injectable } from "inversify";
import { Resolver, Query, Arg, Mutation } from "type-graphql";

import { getRepository } from "typeorm";
import { UserCapToRoleAddInput } from "./UserCapToRoleInput";
import { UserRole } from "../entity/UserRole";
import { UserCapToRole } from "../entity/UserCapToRole";

import { FilterInput, MetaInput, SortDirection, PaginatedResponse, IPaginatedResponse } from "@kookjs/core/gql";
import { DbHelper } from "@kookjs/db";

const PaginatedItemResponse = PaginatedResponse(UserCapToRole);
type PaginatedItemResponse = InstanceType<typeof PaginatedItemResponse>;

@injectable()
@Resolver()
export class UserCapToRoleResolver {
	constructor() {}

	@Mutation(() => String)
	async autAcl_UserCapToRole_Assign(@Arg("args") args: UserCapToRoleAddInput): Promise<String | undefined> {
		const result = await UserCapToRole.grant(args.roleKey, args.capKeys);
		await UserCapToRole.deny(args.roleKey, args.denyCapKeys);
		// if(result.error) throw new ForbiddenError(result.error.message)
		return "Assigned successfully";
	}

	@Query(() => PaginatedItemResponse)
	async autAcl_UserCapToRole_List(
		@Arg("meta", { nullable: true }) metaArgs?: MetaInput,
		@Arg("filters", (type) => [FilterInput], { nullable: true }) filters?: FilterInput[]
	): Promise<IPaginatedResponse> {
		let qb = getRepository(UserCapToRole)
			.createQueryBuilder("userCapToRole")
			.leftJoinAndSelect("userCapToRole.cap", "cap")
			.leftJoinAndSelect("userCapToRole.role", "role");
		const meta = Object.assign(
			{},
			{
				page: 1,
				limit: 10,
				orderBy: [
					{
						key: "userCapToRole.id",
						value: SortDirection.ASC,
					},
				],
			},
			metaArgs
		);
		if (meta.orderBy) {
			for (const { key, value } of meta.orderBy) {
				qb.addOrderBy(key, value);
			}
		}
		const total = await qb.getCount();
		const skip = (meta.page - 1) * meta.limit;
		qb = qb.skip(skip).take(meta.limit);
		DbHelper.addFilters(qb, filters);
		// console.log(DbHelper.queryToSql(qb));
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
