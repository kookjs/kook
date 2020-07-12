import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: "200", unique: true })
  email: string;

  @Field()
  @Column()
  fullName: string;

  @Column()
  password: string;

  @Column({nullable: true})
  secret: string; // used for JWT token creation

  @Column("bool", { default: false })
  confirmed: boolean;
}
