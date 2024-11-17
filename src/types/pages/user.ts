import { ISelectOption } from '../../components/atomic/Selector'
import { IUserRoleResult } from '../../types/pages/userRole'
import { IPartitionResult } from './partition'
import { IPersonResult } from './person'

export interface IUserResult {
  UserNo: number
  UserId: string
  // Password: string
  UserDesc: string
  Email: string
  Partition: IPartitionResult
  Role: IUserRoleResult
  Person: IPersonResult
  Launch: number
  Language: number
  DateFormat: number
  TimeFormat: number
}

export interface IUserFormData {
  UserNo: string // Primary Key. 0: Administrator
  UserId: string // Validate Text, Unique
  Password: string // Validate Text
  UserDesc: string // User Description
  Email: string // Email Notification
  Partition: ISelectOption | null // Partitions -> PartitionNo
  Role: ISelectOption | null // Validate Integer, Roles -> RoleNo
  Person: ISelectOption | null // Persons -> PersonNo
}

export interface IUserFilters {
  UserNo: string
  UserId: string
  Partition: ISelectOption | null
  Role: ISelectOption | null
  Apply: boolean
}

// export const systemMediaOptions = [
//   {
//     label: t`User`,
//     value: '0',
//   },
//   {
//     label: t`SD Card`,
//     value: '1',
//   },
//   {
//     label: t`USB Memory`,
//     value: '2',
//   },
// ]
