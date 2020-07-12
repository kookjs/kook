import { createApp } from "@kookjs/core";

const app = createApp({
	root: __dirname,
});

import DB from "@kookjs/db";
import Cache from "@kookjs/cache";

app.registerPlugin(DB);
app.registerPlugin(Cache);

const main = async () => {
	await app.boot();
  const cache = await app.getPlugin(Cache).store();
  
  await cache.put('name', 'aman')
  console.log(await cache.get('name'))
  // console.log(await cache.default.del('name'))
};

main();
