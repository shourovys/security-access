export interface IHolidayItemResult {
  ItemNo: number // Item No - Integer - Primary Key
  HolidayNo: number // Holiday No - Integer - Holidays->HolidayNo
  StartDate: string // Start Date - Validate - Text - YYYY-MM-DD
  EndDate: string // End Date - Validate - Text - YYYY-MM-DD
  DateName: string // Date Name - Validate - Text
}

export interface IHolidayItemFormData {
  StartDate: string // Start Date - Validate - Text - YYYY-MM-DD
  EndDate: string // End Date - Validate - Text - YYYY-MM-DD
  DateName: string // Date Name - Validate - Text
}
