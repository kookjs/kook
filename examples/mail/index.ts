
import {env, createApp, config, getApp} from '@kookjs/core'
import path from 'path'

const app = createApp({
  root: __dirname
})

import Mail from '@kookjs/mail'
import nodemailer from 'nodemailer'

app.registerPlugin(Mail)

const main = async () => {
  await app.boot()
  console.log('App started')
  
  const mail = app.getPlugin(Mail)
  const message = await mail.template.compile({
    path: 'page.twig',
    base: __dirname + '/resources/views1/',
    context: {
      name: 'aman'
    }
  })

  console.log(message)
}

main();
