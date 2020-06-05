import { injectable, inject, Container } from "inversify";
import { getCustomRepository } from "typeorm";
import { Resolver, Query, Arg, Mutation } from "type-graphql";

import OptionEntity from "./entity/Option";
import OptionRepository from "./OptionRepository";
import { OptionInput } from "./OptionInput";

@injectable()
@Resolver()
export default class OptionResolver {
	constructor() {
		
	}

	@Query(() => [OptionEntity])
	async options() {
		const records = await OptionEntity.find();
		return records;
	}

	@Query(() => String, { nullable: true })
	async option(@Arg("option_name") option_name: string): Promise<any | undefined> {
		const optionRepo = getCustomRepository(OptionRepository);
		return await optionRepo.findByName(option_name);
	}

	@Mutation(() => OptionEntity)
	async addOption(@Arg("option") optionInput: OptionInput): Promise<Boolean> {
		const optionRepo = getCustomRepository(OptionRepository);
		const result = await optionRepo.add(optionInput.option_name, optionInput.option_value);
		// if (!result) throw new Error("Option already exists");
		// await this.items.push(recipe);
		return result;
	}

	@Mutation(() => Boolean)
	async updateOption(@Arg("option") optionInput: OptionInput): Promise<Boolean> {
		const optionRepo = getCustomRepository(OptionRepository);
		const result = await optionRepo.updateByKey(optionInput.option_name, optionInput.option_value);
		return result;
	}

	@Mutation(() => Boolean)
	async removeOption(@Arg("option_name") option_name: string): Promise<Boolean | undefined> {
		const optionRepo = getCustomRepository(OptionRepository);
		return await optionRepo.removeByKey(option_name);
	}
}
