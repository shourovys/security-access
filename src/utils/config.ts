import Cookies from 'js-cookie'
export const TABLE_ROW_HEIGHT = 30
export const TABLE_ROW_PER_PAGE = 10

// input
export const INPUT_FIELD_HEIGHT = '30px'
export const TEXTAREA_FIELD_HEIGHT = '130.6px'

// error
export const ERROR_CLASS = 'input_error'

// Local Storage
export const LOCAL_STORAGE_KEY = {
  accessToken: 'accessToken',
  timeFormat: 'time_format',
  dateFormat: 'date_format',
  timezone: 'timezone',
  UserId: 'UserId',
  Password: 'Password',
}

// query
export const SERVER_QUERY = {
  selectorDataQuery: 'limit=100',
}

// image urls (proxy)
const get_image_path = (() => {
  const is_proxy = Cookies.get('is_proxy_site') === 'True'
  if (is_proxy) {
    const site_no = Cookies.get('site_no') || '1'
    return `/proxy/${site_no}/image/`
  }
  return import.meta.env.VITE_IMAGE_URL
})()

// server urls
// const API_URL =  'http://127.0.0.1:8000/api/'
const API_URL = import.meta.env.VITE_API_URL
const IMAGE_URL = get_image_path
const STREAM_URL = import.meta.env.VITE_STREAM_URL

export { API_URL, IMAGE_URL, STREAM_URL }
