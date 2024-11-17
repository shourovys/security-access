import { ISelectOption } from '../../components/atomic/Selector'
import { IPartitionResult, IPartitionResultOld } from '../../types/pages/partition'
import { IApiQueryParamsBase } from './common'

// export interface IUserRoleResultOld {
//   id: number
//   partition: IPartitionResultOld
//   created_at: string
//   updated_at: string
//   name: string
//   description: string
//   permissions: IUserRulePermissionResult[]
// }

export interface IUserRulePermissionResult {
  name: string
  codename: string
}

export interface IPageResult {
  PageDesc: string
  PageName: string
  PageNo: number
  PartitionPage: number
}

export interface IUserRoleResult {
  RoleNo: number // Primary Key, 0: Administrator
  Partition: IPartitionResult // Partitions -> PartitionNo
  RoleName: string
  RoleDesc: string
  Pages: IPageResult[]
}

export interface IUserRoleFilters {
  RoleNo: string
  RoleName: string
  Partition: ISelectOption | null
  Apply: boolean
}

export interface IUserRoleRouteQueryParams {
  Page: number
  RoleNo: string
  RoleName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
}

export interface IUserRoleApiQueryParams extends IApiQueryParamsBase {
  RoleNo_icontains?: string
  RoleName_icontains?: string
  PartitionNo?: string
}

export interface IUserRoleFormData {
  RoleNo: number
  RoleName: string
  RoleDesc: string
  Partition: ISelectOption | null
  PageIds: string[]
}
export interface IUserRoleInfoFormData extends IUserRoleFormData {
  Pages: IPageResult[]
}
