import { ISelectOption } from '../components/atomic/Selector'

function optionsToObject(options: ISelectOption[]): { [key: string]: string } {
  return options.reduce(
    (acc, option) => {
      acc[option.value] = option.label
      return acc
    },
    {} as { [key: string]: string }
  )
}

export default optionsToObject
