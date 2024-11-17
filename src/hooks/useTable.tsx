import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { TABLE_ROW_PER_PAGE } from '../utils/config'
import useUpdateRouteQueryWithReplace from './useUpdateRouteQueryWithReplace'

interface IProps {
  // data: object[];
  pageSize?: number
  defaultOrderBy?: string
  defaultOrder?: 'asc' | 'desc'
  defaultPage?: number
  defaultRowsPerPage?: number
  defaultSelected?: string[]
  onSort?: (orderBy: string, order: 'asc' | 'desc') => void
  onSelectRow?: (selected: string[]) => void
  onChangePage?: (page: number) => void
  onChangeRowsPerPage?: (rowsPerPage: number) => void
  onChangeDense?: (dense: boolean) => void
}

const useTable = (props: IProps) => {
  const {
    // data,
    pageSize = TABLE_ROW_PER_PAGE,
    defaultOrderBy = '',
    defaultOrder = 'asc',
    defaultPage = 1,
    defaultRowsPerPage = pageSize,
    defaultSelected = [],
    onSort,
    onSelectRow,
    onChangePage,
    onChangeRowsPerPage,
    onChangeDense,
  } = props

  const location = useLocation()
  const [searchParams] = useSearchParams()

  // const updateRouteQuery = useUpdateRouteQuery();
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()

  const [orderBy, setOrderBy] = useState(defaultOrderBy)
  const [order, setOrder] = useState<'asc' | 'desc'>(defaultOrder)
  const [page, setPage] = useState(defaultPage)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)
  const [selected, setSelected] = useState(defaultSelected)
  const [dense, setDense] = useState(false)

  useEffect(() => {
    if (defaultOrderBy && !searchParams.get('orderBy')) {
      updateRouteQueryWithReplace({
        query: {
          orderBy: defaultOrderBy,
          order,
        },
        pathName: location.pathname,
      })
    }
  }, [location.search, location.pathname])

  useEffect(() => {
    // console.log(
    //   location && location.pathname + location.search && location.search !== location.pathname
    // )
    if (location && location.pathname + location.search && location.search !== location.pathname) {
      const queryPage = searchParams.get('page') as string
      setPage(queryPage && !Number.isNaN(+queryPage) ? +queryPage : 1)

      const queryRowPerPage = searchParams.get('rowsPerPage') as string
      setRowsPerPage(
        queryRowPerPage && !Number.isNaN(+queryRowPerPage) ? +queryRowPerPage : defaultRowsPerPage
      )

      const orderByValue = searchParams.get('orderBy')
      setOrderBy(typeof orderByValue === 'string' ? orderByValue : '')

      const queryOrder = searchParams.get('order') as 'asc' | 'desc'
      const orderValue = (
        queryOrder === 'asc' || queryOrder === 'desc' ? searchParams.get('order') : 'desc'
      ) as 'asc' | 'desc'
      if (orderValue !== null) {
        setOrder(orderValue)
      }
    }
  }, [location])

  const handleSort = (_orderBy: string, _order: 'asc' | 'desc') => {
    setOrderBy(_orderBy)
    updateRouteQueryWithReplace({
      query: { orderBy: _orderBy, order: _order },
      pathName: location.pathname,
    })
    if (onSort) {
      onSort(_orderBy, _order)
    }
  }

  const handleOrder = (_order: 'asc' | 'desc') => {
    setOrder(_order)
  }

  const handleSelectRow = (_selectedId: string) => {
    const selectedIndex = selected.indexOf(_selectedId)

    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _selectedId)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
    if (onSelectRow) {
      onSelectRow(newSelected)
    }
  }

  const handleSelectAllRow = (selectAll: boolean, _selectedIds: string[]) => {
    if (selectAll) {
      // Select all rows
      setSelected(_selectedIds)
    } else {
      // Deselect all rows
      setSelected([])
    }
  }

  const handleChangePage = (_page: number) => {
    setPage(_page)
    if (onChangePage) {
      onChangePage(_page)
    }
  }

  const handleChangeRowsPerPage = (_rowsPerPage: number) => {
    handleChangePage(1)
    setRowsPerPage(_rowsPerPage)
    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(_rowsPerPage)
    }
  }

  const handleChangeDense = (_dense: boolean) => {
    setDense(_dense)
    if (onChangeDense) {
      onChangeDense(_dense)
    }
  }

  return {
    orderBy,
    order,
    page,
    rowsPerPage,
    selected,
    dense,
    handleSort,
    handleOrder,
    handleSelectRow,
    handleSelectAllRow,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeDense,
  }
}

export default useTable

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number): number {
  return page > 1 ? Math.max(0, page * rowsPerPage - arrayLength) : 0
}

// export function descendingComparator<T>(a: T, b: T, orderBy: string): number {
//     if (Object.values(a).indexOf(orderBy)) {
//         if (b[orderBy] < a[orderBy]) {
//             return -1;
//         }
//         if (b[orderBy] > a[orderBy]) {
//             return 1;
//         }
//     }

//     return 0;
// }

// export function getComparator(
//     order: string,
//     orderBy: string,
// ): <T>(a: T, b: T) => number {
//     function descendingComparator1<T>(a: T, b: T) {
//         return descendingComparator(a, b, orderBy);
//     }
//     function descendingComparator2<T>(a: T, b: T) {
//         return -descendingComparator(a, b, orderBy);
//     }
//     return order === "desc" ? descendingComparator1 : descendingComparator2;
// }
