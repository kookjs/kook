import { SelectQueryBuilder, Entity } from 'typeorm'
import { FilterInput } from '@kookjs/core/gql'
import { isArray } from "lodash";

/**
 * It Convert the Query with Parameters to Raw SQL with embedded paramters
 * E.g. [
  'SELECT "option"."id" AS "option_id", "option"."key" AS "option_key", "option"."value" AS "option_value" FROM "option" "option" WHERE value like $1 OR value = $2 LIMIT 10',
    [ '%j%', 'Jeoga' ]
  ] 
  
  will transform to

  SELECT "option"."id" AS "option_id", "option"."key" AS "option_key", "option"."value" AS "option_value" FROM "option" "option" WHERE value like '%j%' OR value = 'Jeoga' LIMIT 10
 *
 * @param qb SelectQueryBuilder $qb
 * @returns string
 */
export const queryToSql = <T>(qb: SelectQueryBuilder<T>): string => {
	const queryWithParameters = qb.getQueryAndParameters()
	let text = queryWithParameters[0]
	let values = queryWithParameters[1]
	let i = 1;
	for (const value of values) {
		text = text.replace(`$${i}`, `'${value}'`);
		i++;
	}
	return text
}

export const addFilters = <T>(qb: SelectQueryBuilder<T>, filters: FilterInput[]): void => {
  if(!filters || filters.length <= 0) return
    let index = 0
    for(const filter of filters) {
      let indexKey  = 'i'+index
      let argNum = ":"+indexKey
      // if(filter.condition=="or") {
      // 	console.log(`${filter.key} ${filter.operator} :${indexKey}`)
      // 	qb.orWhere(`${filter.key} ${filter.operator} :${indexKey}`, { [indexKey]: filter.value })
      // } else {
      // 	qb.where(`${filter.key} ${filter.operator} :${indexKey}`, { [indexKey]: filter.value })
      // }

      // console.log(filter.value)
      if(isArray(filter.value) || filter.operator=="IN") {
        filter.operator = 'IN'
        argNum = `(:...${indexKey})`
      }

      const whereString = [filter.field, filter.operator, argNum].join(' ');
      const arg = { [indexKey]: filter.value }

      // console.log(`${filter.field} ${filter.operator} ${indexKey}`)
      console.log(whereString, arg)
      if(filter.condition=="or") {
        // qb.orWhere(`${filter.field} ${filter.operator} '${filter.value}'`)
          qb.orWhere(whereString, arg)
      } else {
        // qb.andWhere(`${filter.field} ${filter.operator} '${filter.value}'`)
        qb.andWhere(whereString, arg)
      }
      index++
    } 
}