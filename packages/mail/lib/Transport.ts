
import nodemailer, { SentMessageInfo } from 'nodemailer'
import NodeMail from 'nodemailer/lib/mailer'

// import { ITransport } from '../interface/ITransport'

export default class Transport {
  readonly name: string;  // we need this for QUEUE so we can idenfiy the transporter
  readonly _transport: NodeMail

  constructor(name, options) {
    this.name = name
    this._transport = nodemailer.createTransport(options||{})
  }

  async sendMail(mailOptions: NodeMail.Options) : Promise<SentMessageInfo> {
    const info = await this._transport.sendMail(mailOptions)
    console.log("Message sent: %s", info.messageId);
    
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return info
  }
}