import { getApp, env } from '@kookjs/core'
import path from 'path'
import {IConfig} from '@kookjs/mail'

const config: IConfig = {
  'default' : 'smtp1',

  'mailers' : {
   'smtp': {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'tommie.jast@ethereal.email',
          pass: 'vpuDPdFGK3nM7mgHXx',
      },
      tls: {
          rejectUnauthorized: false
      }
    }
  },

  'from' : {
    'address' : env('MAIL_FROM_ADDRESS', 'hello@example.com'),
    'name' : env('MAIL_FROM_NAME', 'Example'),
  },

  'path': path.resolve(__dirname, '../resources/views/')
}

export default config