import { Location } from 'react-router-dom'
import generateTitle from './routerTitle'
import { formatDateTimeTzView } from './formetTime'

const downloadCsv = (data: string, location: Location) => {
  const generatedTitle = generateTitle(location.pathname + location.search)
  const rows = Array.isArray(data) ? data : data.split('\n')

  let csvContent = ''
  let headerRow = ''

  // Identify the indices of columns containing "Time"
  const headerColumns = rows[0].split(',')
  const timeColumnIndices: number[] = []
  headerColumns.forEach((columnName: string, index: number) => {
    if (columnName.includes('Time')) {
      timeColumnIndices.push(index)
    }
    headerRow += columnName + ','
  })
  headerRow = headerRow.slice(0, -1) // remove the last comma

  // Process each row and convert time columns if available
  csvContent += headerRow + '\n'
  if (timeColumnIndices.length) {
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].trim().split(',')
      for (const index of timeColumnIndices) {
        if (rowData[index]) {
          rowData[index] =
            rowData[index].toString() !== '0' ? formatDateTimeTzView(rowData[index]) : '0'
        }
      }
      csvContent += rowData.join(',') + '\n'
    }
  }

  const link = document.createElement('a')
  link.setAttribute('href', encodeURI('data:text/csv;charset=utf-8,' + csvContent))
  link.setAttribute('download', `${generatedTitle ? generatedTitle : 'data-list'}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
export default downloadCsv
