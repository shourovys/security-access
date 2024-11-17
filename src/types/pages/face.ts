import { ISelectOption } from '../../components/atomic/Selector'

export interface IFaceResult {
  No: number
  Enable: number
  ImagePath: string
  CapturePath: string
}

export interface IFaceFormData {
  Enable: ISelectOption | null
  ImagePath: string
}
