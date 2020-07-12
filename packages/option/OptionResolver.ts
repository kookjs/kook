import { injectable, inject, Container } from "inversify";
import { getCustomRepository, getRepository } from "typeorm";
import { Resolver, Query, Arg, Mutation } from "type-graphql";

import OptionRepository from "./OptionRepository";
import { OptionInput } from "./OptionInput";
import Option from "./entity/Option";

import { FilterInput, MetaInput, SortDirection, PaginatedResponse } from "@kookjs/core/gql";
import { DbHelper } from "@kookjs/db";
import { sleep } from '@khanakiajs/util'

const PaginatedItemResponse = PaginatedResponse(Option);
type PaginatedItemResponse = InstanceType<typeof PaginatedItemResponse>;

@injectable()
@Resolver()
export default class OptionResolver {
	constructor() {}

	@Query(() => PaginatedItemResponse)
	async options(
		@Arg("meta", { nullable: true }) metaArgs?: MetaInput,
		@Arg("filters", (type) => [FilterInput], { nullable: true }) filters?: FilterInput[]
	): Promise<PaginatedItemResponse> {
		let qb = getRepository(Option).createQueryBuilder("option");

		const meta: MetaInput = Object.assign(
			{},
			{
				page: 1,
				limit: 10,
				orderBy: [
					{
						key: 'id',
						value: SortDirection.ASC
					} 
				]
			},
			metaArgs
		);

		console.log(meta)

		if (meta.orderBy) {
			for (const { key, value } of meta.orderBy) {
				qb.addOrderBy(key, value as SortDirection);
			}
		}

		const total = await qb.getCount();

		const skip = (meta.page - 1) * meta.limit;
		qb = qb.skip(skip).take(meta.limit);

		// qb.orWhere(`value like '%jeo%'`)

		// qb.orWhere(`value IN ('5', '6')`)
		// qb.where("id IN (:...ids)", {
		// 	ids: [5,6],
		// })

		// qb.andWhere('value like :value1', {
		// 	value1: 'Jeoga'
		// })

		// qb.orWhere('value = :value2', {
		// 	value2: 'dd'
		// })

		DbHelper.addFilters(qb, filters);

		// console.log(qb.getQueryAndParameters())
		// console.log(DbHelper.queryToSql(qb))

		const items = await qb.getMany();
		// console.log(items)

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

	@Query(() => Option, { nullable: true })
	async option(@Arg("id") id: number): Promise<Option | undefined> {
		// await sleep(2000)
		const optionRepo = getCustomRepository(OptionRepository);
		return await optionRepo.findOne(id);
	}

	@Query(() => String, { nullable: true })
	async optionValue(@Arg("key") key: string): Promise<any | undefined> {
		const optionRepo = getCustomRepository(OptionRepository);
		return await optionRepo.findByKey(key);
	}

	@Mutation(() => Option)
	async optionAdd(@Arg("args") optionInput: OptionInput): Promise<Option | Error> {
		const optionRepo = getCustomRepository(OptionRepository);
		const result = await optionRepo.add(optionInput.key, optionInput.value);
		// if (!result) throw new Error("Option already exists");
		// await this.items.push(recipe);
		return result;
	}

	@Mutation(() => Option)
	async optionUpdate(@Arg("args") optionInput: OptionInput): Promise<Option> {
		const optionRepo = getCustomRepository(OptionRepository);
		const result = await optionRepo.updateByKey(optionInput.key, optionInput.value);
		console.log(optionInput.key)
		return optionRepo.findOne({ key: optionInput.key })
		
		// return result;
	}

	@Mutation(() => Boolean)
	async optionDelete(@Arg("key") key: string): Promise<boolean | undefined> {
		const optionRepo = getCustomRepository(OptionRepository);
		return await optionRepo.removeByKey(key);
	}
}
