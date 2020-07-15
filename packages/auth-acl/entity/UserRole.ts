import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";

import { UserCapToRole } from './UserCapToRole'

@ObjectType()
@Entity()
export class UserRole extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  key: string;

  @Field()
  @Column({nullable: true})
  title: string;

  @Field()
  @Column({ default: false })
  isDefault: boolean;

  @OneToMany(type => UserCapToRole, userCapToRole => userCapToRole.role)
  public userCapToRoles: UserCapToRole;
}
