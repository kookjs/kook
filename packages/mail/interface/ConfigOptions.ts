import SMTPTransport from 'nodemailer/lib/smtp-transport'
import SMTPConnection from 'nodemailer/lib/smtp-connection'
import JSONTransport = require('nodemailer/lib/json-transport');
import SendmailTransport = require('nodemailer/lib/sendmail-transport');
import SESTransport = require('nodemailer/lib/ses-transport');
import StreamTransport = require('nodemailer/lib/stream-transport');

export type TransportOptions = SMTPTransport.Options | SMTPConnection.Options | JSONTransport.Options | SendmailTransport.Options | SESTransport.Options | StreamTransport.Options

export interface ITransportOptions extends SMTPConnection.Options,JSONTransport.Options,SendmailTransport.Options,SESTransport.Options, StreamTransport.Options {}

type TransportersOptions = {[key: string]: TransportOptions}

export interface ConfigOptions {
  default: string,
  mailers: TransportersOptions,
  from: {
    address: string,
    name: string
  },
  path: string
}