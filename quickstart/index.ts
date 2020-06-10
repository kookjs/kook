import {createApp, env} from '@kookjs/core'
import path from 'path'

const app = createApp({
  root: __dirname
})

import DB from '@kookjs/db'
import Server from '@kookjs/server'
import ServerExpress from '@kookjs/server-express'
import ServerExpressGql from '@kookjs/server-express-gql'
import Option from '@kookjs/option'
import Auth from '@kookjs/auth'
import Cache from '@kookjs/cache'
import Mail from '@kookjs/mail'
import nodemailer from 'nodemailer'

app.registerPlugin(DB)
app.registerPlugin(Server)
app.registerPlugin(ServerExpress)
app.registerPlugin(ServerExpressGql)
app.registerPlugin(Option)
app.registerPlugin(Auth)
app.registerPlugin(Cache)
app.registerPlugin(Mail)


const main = async () => {
  await app.boot()
  console.log('App started.')
  
  console.log(path.join(app.config.root, '/resources/path'))
  console.log(app.config.root)
  const mail = app.getPlugin(Mail)
  // mail.default._transport
  // mail.default.sendMail({
  //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //     to: "bar@example.com, baz@example.com", // list of receivers
  //     subject: "Hello ✔", // Subject line
  //     text: "Hello world?", // plain text body
  //     html: "<b>Hello world?</b>", // html body
  //   })
  
  // mail.default.sendMail
  // console.log(mail)
  // let info = await mail.default.send({
  //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //   to: "bar@example.com, baz@example.com", // list of receivers
  //   subject: "Hello ✔", // Subject line
  //   text: "Hello world?", // plain text body
  //   html: "<b>Hello world?</b>", // html body
  // });

  // console.log("Message sent: %s", info.messageId);
  // // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // const cm = app.getPlugin(CacheManager)
  
  // await cm.store('database')
  // await cm.store('memory')
  // await cm.default.put('name', 'ram', 60)
  // console.log(await cm.default.get('name'))
  // console.log(cm.default)
  // await cm.store('database')
  // console.log(await cm.store('database'))
  // const CacheRdbms = require('@khanakiajs/cache-rdbms')
  // const CacheRdbms = await (await import('@khanakiajs/cache-rdbms')).default
  // console.log(CacheRdbms)
  
}

main();
