import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity({database: 'mysql'})
@ObjectType()
export default class Option extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column({
        unique: true
    })
    key: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: String,
        nullable: true
    })
    value: string|null;    
}