import { createApp, env } from "@kookjs/core";

const app = createApp({
	root: __dirname,
});

const plugins = [
	"@kookjs/server",
	"@kookjs/server-express",
	"@kookjs/server-express-gql",
	// "@kookjs/db",
	// "@kookjs/option",
	// "@kookjs/auth",
	// __dirname+"/../packages/auth",
	// "@kookjs/cache",
	// "@kookjs/mail",
	// "@kookjs/auth-acl",
];

const main = async () => {
	app.registerPlugins(plugins);
	await app.boot();
	console.log("App booted.");
};

main();