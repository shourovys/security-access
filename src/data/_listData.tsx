export interface IListData {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
