import { EntityRepository, Repository } from "typeorm";
import Option from "./entity/Option";

@EntityRepository(Option)
export default class OptionRepository extends Repository<Option> {
	async findByKey(key: string, defaultValue = null) {
		try {
			const record = await this.findOne({ key });
			if (!record) return defaultValue;
			return record.value;
		} catch (e) {
			// console.log(e);
			return defaultValue;
		}
	}

	async add(key: string, value: any) : Promise<Option | Error> {
		try {
			let record = new Option();
			record.key = key.trim();
			record.value = value;
			await this.save(record);
			return record;
		} catch (e) {
			console.log(e);
			return new Error('Option already exists.');
		}
	}

	async updateByKey(key: string, value: any) : Promise<boolean> {
		try {			
			const record = await this.findOne({ key: key });
			if (record) {
				record.value = value;
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

	async removeByKey(key: string): Promise<boolean> {
		try {
			await this.delete({ key: key });
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
}
