export interface ITransport {
  sendMail(mail: any): Promise<void>
  verify?(): Promise<void>
}