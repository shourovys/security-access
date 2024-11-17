import { ISelectOption } from '../components/atomic/Selector'

const findSelectOption = (
  options: ISelectOption[],
  value: string | number
): ISelectOption | null => {
  return options.find((option) => option.value === value.toString()) || null
}

const findSelectOptionOrDefault = (
  options: ISelectOption[],
  value: string | number
): ISelectOption => {
  return options.find((option) => option.value === value.toString()) || options[0]
}

export { findSelectOption, findSelectOptionOrDefault }
