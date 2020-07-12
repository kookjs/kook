<p align="center">
  <a href="https://kook.khanakia.com/" target="blank"><img src="https://avatars2.githubusercontent.com/u/66347265?s=400&u=b1b91a259fdc55c20a14b18b144ca6af4ed33931&v=4" width="70" alt="Kook Js Logo" /></a>
</p>


[![Node.js CI](https://github.com/node-cache/node-cache/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/node-cache/node-cache/actions?query=workflow%3A%22Node.js+CI%22+branch%3A%22master%22)
![Dependency status](https://img.shields.io/david/node-cache/node-cache)

Kook provides a clean, simple API over the popular [nodemailer](https://nodemailer.com/) library with drivers for SMTP, Amazon SES, and sendmail, allowing you to quickly get started sending mail through a local or cloud based service of your choice.

Check examples directory [examples](https://github.com/kookjs/kook/tree/master/examples/mail)


### Usage
Create a new config file in your app root `config/mail.ts`.
Note: for the `mailer` options you can check [nodemailer](https://nodemailer.com/)
```
import { env } from '@kookjs/core'
import path from 'path'
import { ConfigOptions } from '@kookjs/mail'

const config: ConfigOptions = {
  'default' : env('MAIL_MAILER', 'test1'),

  'mailers' : {
   'test1': {
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
    },
    'test2': {
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    }
  },

  'from' : {
    'address' : env('MAIL_FROM_ADDRESS', 'hello@example.com'),
    'name' : env('MAIL_FROM_NAME', 'Example'),
  },

  'path': path.resolve(__dirname, '../resources/views/')
}

export default config
```

After that you can register your plugin in your bootstrap file. if 
```
import {createApp, env} from '@kookjs/core'
import Mail from '@kookjs/mail'
const app = createApp({
  root: __dirname
})
app.registerPlugin(Mail)
```

### Usage

```
const mail = app.getPlugin(Mail)
const mailer = await mail.mailer()
const message = 'Hello World !!!';
await mailer.sendMail({
  from: 'from@test.com',
  to: 'to@test.com',
  html: message
})
```

Note: By default sendMail function takes the `from` param from the config file but you can override the `from` param by specifying explicitly like we did in the above example.


### Get Different Mailler
You can get different mailer by using below function. If no mailer argument is specified then it will take the default mailer from defined in mail config.ts.
```
  const mail = app.getPlugin(Mail)
  const mailer = await mail.mailer('test2')
  await mailer.sendMail({
    from: 'from@test.com',
    to: 'to@test.com',
    html: message
  })

```

### Using Template
Mail plugin also provides `Template` function so you can create Mail Templates. 
```
  const message = await mail.template.compile({
    path: 'mail/register.twig',
    base: __dirname + '/resources/views/',
    context: {
      name: 'kook'
    }
  })
```

**Note:** Mail template will override the template file by looking at the `path` specified in global config.
In order to override the template simply copy and paste the template files under the global `path` directory.

For e.g. let say you have template file in auth plugin `${base}/mail/register.twig` so mailer will try to find the same file on global path `${path}//mail/register.twig` first if found it will override the default template with the template found on global directory.


## Contribute

If you would like to contribute to the project, please fork it and send us a pull request.  Please add tests
for any new features or bug fixes.

## Stay in touch

* Author - [Aman Khanakia](https://twitter.com/mrkhanakia)
* Website - [https://khanakia.com](https://khanakia.com/)

## License

[MIT licensed](LICENSE).