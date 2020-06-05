import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity({database: 'mysql'})
@ObjectType()
export default class Option extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    option_id: number;

    @Field(() => String)
    @Column({
        unique: true
    })
    option_name: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: String,
        nullable: true
    })
    option_value: string|null;    
}