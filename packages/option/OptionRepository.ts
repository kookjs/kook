import { EntityRepository, Repository } from "typeorm";
import Option from "./entity/Option";

@EntityRepository(Option)
export default class OptionRepository extends Repository<Option> {
	async findByName(option_name: string, defaultValue = null) {
		try {
			const record = await this.findOne({ option_name });
			if (!record) return defaultValue;
			return record.option_value;
		} catch (e) {
			// console.log(e);
			return defaultValue;
		}
	}

	async add(key: string, value: any) : Promise<Boolean> {
		try {
			let record = new Option();
			record.option_name = key.trim();
			record.option_value = value;
			await this.save(record);
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async updateByKey(key: string, value: any) : Promise<Boolean> {
		try {			
			const record = await this.findOne({ option_name: key });
			if (record) {
				record.option_value = value;
				await this.save(record);
			} else {
				await this.add(key, value);
			}
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async removeByKey(key: string): Promise<Boolean> {
		try {
			await this.delete({ option_name: key });
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
}
