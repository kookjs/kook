import { injectable } from "inversify";
import { getApp, getPlugin } from "@kookjs/core";

import DB from "@kookjs/db";
import Hook from "@khanakiajs/hook";
import ServerExpressGql from "@kookjs/server-express-gql";

import { UserRole } from "./entity/UserRole";
import { UserCap } from "./entity/UserCap";
import { UserCapToRole } from "./entity/UserCapToRole";
import { UserRoleResolver } from "./gql/UserRoleResolver";
import { UserCapResolver } from "./gql/UserCapResolver";
import { UserCapToRoleResolver } from "./gql/UserCapToRoleResolver";

import Option from "@kookjs/option"
import {convertToBool} from "@khanakiajs/util"

import { getConnection } from "typeorm"

@injectable()
export default class AuthAcl {
	readonly version: string = "1.0.0";

	constructor() {
		const app = getApp();
		const db = app.getPlugin(DB);
    db.addEntity(UserRole);
    db.addEntity(UserCap);
    db.addEntity(UserCapToRole);

    const serverExpressGql = app.getPlugin(ServerExpressGql);
    serverExpressGql.addResolver(UserRoleResolver);
    serverExpressGql.addResolver(UserCapResolver);
    serverExpressGql.addResolver(UserCapToRoleResolver);

  }
  
  async boot() {
    await this.createDefaultRoles();
}
async createDefaultRoles() {
    const option = getPlugin(Option);
    const hasAclSetup = await option.get('hasAclSetup', false);
    // console.log('hasAclSetup', hasAclSetup, convertToBool(hasAclSetup))
    if (convertToBool(hasAclSetup))
        return false;
    await getConnection().query('TRUNCATE TABLE user_cap_to_role RESTART IDENTITY');
    await getConnection().query('TRUNCATE TABLE user_role RESTART IDENTITY CASCADE');
    await getConnection().query('TRUNCATE TABLE user_cap RESTART IDENTITY CASCADE');
    const roles = [
        { key: "sa", title: "Super Admin", isDefault: true },
        { key: "administrator", title: "Administrator", isDefault: true },
        { key: "subscriber", title: "Subscriber", isDefault: true },
    ];
    // await UserRole.create({ id: 4, key: "subscriber", title: "Subscriber" }).save()
    await UserRole.createQueryBuilder()
        .insert()
        .into(UserRole)
        .values(roles)
        // .onConflict(`("id") DO UPDATE SET "title" = excluded."title"`)
        .execute();
    const caps = [
        { key: "dash_login", title: "Allow login to dashboard", isDefault: true },
        { key: "add_users", title: "Add Users", isDefault: true },
        { key: "edit_users", title: "Edit Users", isDefault: true },
        { key: "read_users", title: "Add Users", isDefault: true },
        { key: "delete_users", title: "Delete Users", isDefault: true },
    ];
    await UserCap.createQueryBuilder()
        .insert()
        .into(UserCap)
        .values(caps)
        // .onConflict(`("id") DO UPDATE SET "title" = excluded."title"`)
        .execute();
    // await UserCapToRole.assign('sa', ['allow_all']);
    await UserCapToRole.grant('administrator', ["dash_login", "add_users", "edit_users", "read_users", "delete_users"]);
    await option.update('hasAclSetup', true);
}
}