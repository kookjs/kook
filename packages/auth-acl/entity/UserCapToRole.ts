import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, ManyToOne } from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";

import { UserRole } from './UserRole'
import { UserCap } from './UserCap'

@ObjectType()
@Entity()
@Unique(['roleId', 'capId'])
export class UserCapToRole extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  roleId: number;

  @Field()
  @Column()
  capId: number;

  @Field(type => UserRole)
  @ManyToOne(type => UserRole, role => role.userCapToRoles)
  public role: UserRole;

  @Field(type => UserCap)
  @ManyToOne(type => UserCap, cap => cap.userCapToRoles)
  public cap: UserCap;

  static async grant(roleKey, capKeys = []) {
        const ur = await UserRole.findOne({ key: roleKey });
        if (!ur) {
            return {
                error: {
                    message: `Role: ${roleKey} not found in database.`
                }
            };
        }
        for (const capKey of capKeys) {
            try {
                const uc = await UserCap.findOne({ key: capKey });
                if (!uc) {
                    // console.log(`Cap: ${capKey} not found in database.`)
                    continue;
                }
                const uctr = new UserCapToRole();
                uctr.cap = uc;
                uctr.role = ur;
                await uctr.save();
            }
            catch (error) {
                // console.log(error)
            }
        }
        return true;
    }
    static async deny(roleKey, capKeys = []) {
        const ur = await UserRole.findOne({ key: roleKey });
        if (!ur) {
            return {
                error: {
                    message: `Role: ${roleKey} not found in database.`
                }
            };
        }
        for (const capKey of capKeys) {
            try {
                const uc = await UserCap.findOne({ key: capKey });
                if (!uc) {
                    // console.log(`Cap: ${capKey} not found in database.`)
                    continue;
                }
                await UserCapToRole.delete({
                    roleId: ur.id,
                    capId: uc.id
                });
            }
            catch (error) {
                // console.log(error)
            }
        }
        return true;
    }
}
