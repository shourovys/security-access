import { IApiQueryParamsBase } from './common'

export interface IPartitionResultOld {
  id: number
  created_at: string
  updated_at: string
  name: string
  description: string
  image: string | null
}
export interface IPartitionResult {
  PartitionNo: number // Primary Key, 0: System Partition
  PartitionName: string
  PartitionDesc: string
  ImageFile: string // partition-1.jpg
}

export interface IPartitionFilters {
  PartitionNo: string
  PartitionName: string
  Apply: boolean // Filters to apply to partition data
}

export interface IPartitionRouteQueryParams {
  page: number
  PartitionNo: string
  PartitionName: string
  // Comment: Query parameters for partition routes
}

export interface IPartitionApiQueryParams extends IApiQueryParamsBase {
  PartitionNo_icontains?: string
  PartitionName_icontains?: string
  IsDeletedIds?: string
  // Comment: Query parameters for partition API endpoints
}

export interface IPartitionFormData {
  PartitionName: string
  PartitionDesc: string
  ImageFile: File | string | null // Path to image file
  // Comment: Form data for creating or updating a partition
}
