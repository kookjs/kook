
// ts-node examples/mail/index.ts 

var appRoot = require('app-root-path');
appRoot.setPath(__dirname)

import {env, createApp, config, getApp} from '@kookjs/core'
import path from 'path'

const app = createApp()

import Mail from '@kookjs/mail'
import nodemailer from 'nodemailer'

app.registerPlugin(Mail)

const main = async () => {
  await app.boot()
  console.log('App started')
  // console.log(env('DB_CONNECTION'))
  // console.log(config('app'))
  const mail = app.getPlugin(Mail)
  // const mailer = await mail.mailer()
  
  const message = await mail.template.compile({
    path: 'page.twig',
    base: __dirname + '/resources/views/',
    context: {
      name: 'aman',
      student: {
        class: '1st'
      }
    }
  })

  console.log(message)

  // await mailer.sendMail({
  //   from: 'from@test.com',
  //   to: 'to@test.com',
  //   html: message
  // })
}

main();
