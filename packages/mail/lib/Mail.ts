// import nodemailer, { SentMessageInfo } from 'nodemailer'
// import { Address } from 'nodemailer/lib/mailer'
// import NodeMail from 'nodemailer/lib/mailer'
// // import { ITransport } from '../interface/ITransport'
// import Transport from './Transport'

// type TAddress = string | Address | Array<string | Address>

// export default class Mail {
//   readonly version: string = "1.0";
//   // public transporter: Transport
  
//   protected $to : TAddress = [];
//   protected $cc : TAddress = [];
//   protected $bcc : TAddress = [];
  
//   constructor(public transporter: Transport) {
      
//   }

//   to(users : TAddress) {
//     this.$to = users
//     return this
//   }

//   cc(users : TAddress) {
//     this.$cc = users
//     return this
//   }

//   bcc(users : TAddress) {
//     this.$bcc = users
//     return this
//   }

//   async send(mailOptions: NodeMail.Options): Promise<SentMessageInfo> {
    
//     return await this.transporter.sendMail(mailOptions)
//   }

//   mailer(name: string): any {

//   }
 
// }