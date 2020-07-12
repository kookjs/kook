
import nodemailer, { SentMessageInfo } from 'nodemailer'
import NodeMail from 'nodemailer/lib/mailer'

import { config } from "@kookjs/core";
import { ConfigOptions } from '../interface/ConfigOptions'

export default class Transport {
  readonly name: string;  // we need this for QUEUE so we can idenfiy the transporter
  readonly transport: NodeMail

  constructor(name, options) {
    this.name = name
    this.transport = nodemailer.createTransport(options||{})
  }

  async sendMail(mailOptions: NodeMail.Options) : Promise<SentMessageInfo> {
    const config_ : ConfigOptions= config('mail')
    
    // Add from name and address fro env varaible if from not specified as arguments
    mailOptions.from = mailOptions.from || `"${config_.from.name}" ${config_.from.address}`

    const info = await this.transport.sendMail(mailOptions)
    console.log("Message sent: %s", info.messageId);
    
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return info
  }
}