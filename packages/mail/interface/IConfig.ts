import SMTPTransport from 'nodemailer/lib/smtp-transport'
import SMTPConnection from 'nodemailer/lib/smtp-connection'
import JSONTransport = require('nodemailer/lib/json-transport');
import SendmailTransport = require('nodemailer/lib/sendmail-transport');
import SESTransport = require('nodemailer/lib/ses-transport');
import StreamTransport = require('nodemailer/lib/stream-transport');

export type TTransportOptions = SMTPTransport.Options | SMTPConnection.Options | JSONTransport.Options | SendmailTransport.Options | SESTransport.Options | StreamTransport.Options

export interface ITransportOptions extends SMTPConnection.Options,JSONTransport.Options,SendmailTransport.Options,SESTransport.Options, StreamTransport.Options {}

type TTransporters = {[key: string]: TTransportOptions}

export interface IConfig {
  default: string,
  mailers: TTransporters,
  from: {
    address: string,
    name: string
  },
  path: string
}