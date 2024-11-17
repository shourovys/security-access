import { IAccessResult } from '../../types/pages/access'
import { IGroupResult } from '../../types/pages/group'

export type IAccessElementResult = Pick<IAccessResult, 'AccessName' | 'AccessNo'>
export type IGroupElementResult = Pick<IGroupResult, 'GroupName' | 'GroupNo'>
