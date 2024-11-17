export interface IPageInfo {
  PageNo: number
  PageName: string
  PageDesc: string
  PartitionPage: number
}

export interface IFavoriteResult {
  id: number
  Page: IPageInfo
  UserNo: number
  PageNo: number
  Position: number
}

export interface IFavoriteFormData {
  PageIds: string[]
}
