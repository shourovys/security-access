import React from 'react'
import { TIcon } from '../../utils/icons'
import { IPermission } from '../context/auth'

export interface IRouteBase {
  path: (id?: number | string, id2?: number | string) => string
  routePath: string
  component: React.ComponentType
  permissions: IPermission
}

export interface IRouteWithLabel extends IRouteBase {
  id: string // id for match with server data
  label: string // label route will show in menu
  icon: TIcon
}

export interface IRouteWithOutLabel extends IRouteBase {
  id?: never // id for match with server data
  label?: never // label route will show in menu
  icon?: never
}

export type IRoute = IRouteWithLabel | IRouteWithOutLabel

export interface IRouteProperty {
  [key: string]: IRoute
}
export interface IRoutesArrayInGroup {
  [key: string]: IRoute[]
}

export interface IAllRoutesInGroup {
  [key: string]: IRouteProperty
}

export interface ILabeledRoute {
  id: string
  label: string
  path: (id?: number | string) => string
  routePath: string
  icon: TIcon
  permissions: IPermission
}

export interface ILabeledRoutes {
  [key: string]: ILabeledRoute[]
}
