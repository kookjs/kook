import { createApp, env } from "@kookjs/core";
import path from "path";

const app = createApp({
	root: __dirname,
});

const plugins = [
	"@kookjs/db",
	"@kookjs/server",
	"@kookjs/server-express",
	"@kookjs/server-express-gql",
	"@kookjs/option",
	"@kookjs/auth",
	"@kookjs/cache",
	"@kookjs/mail",
	"@kookjs/upwork"
];

const main = async () => {
	app.registerPlugins(plugins);
	await app.boot();
	console.log("App booted.");
};

main();