import { ISelectOption } from '../../components/atomic/Selector'

export interface IEmailResult {
  No: number
  Enable: number
  ServerAddr: string
  ServerPort: number
  UserId: string
  Password: string
  Tls: number
  Sender: string
  Receiver: string
}

export interface IEmailFormData {
  Enable: ISelectOption | null
  ServerAddr: string
  ServerPort: string
  UserId: string
  Password: string
  Tls: ISelectOption | null
  Sender: string
  Receiver: string
}
