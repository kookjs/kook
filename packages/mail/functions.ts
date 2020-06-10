// import { config, getApp } from '@kookjs/core'
// import dotObject from '@khanakiajs/dot-object'
// import Transport from './lib/Transport'
// import Mail from './lib/Mail'

// export function getMailer(name: string): Mail {
//   const _config = config('mail')

//   const transportOption = dotObject.getArrayValue(_config, ['mailers', name])

//   /// ytd create a global variable check if transporter is already created or not


//   const transport = new Transport(name, transportOption)
//   const mail = new Mail(transport)
//   // console.log(transportOption)
//   return mail

// }