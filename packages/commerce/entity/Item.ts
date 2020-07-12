import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";

@ObjectType()
export class Item extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  slug: string;

  @Column("bool", { default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at'})
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  UpdatedAt!: Date;

  @VersionColumn()
  version!: number;
}