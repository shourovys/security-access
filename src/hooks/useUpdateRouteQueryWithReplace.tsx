import QueryString from 'qs'
import { useNavigate } from 'react-router-dom'

interface IProps {
  query: { [key: string]: string | number | null | undefined } | object
  pathName: string
}

const useUpdateRouteQueryWithReplace = () => {
  const navigate = useNavigate()

  const prevQuery: Record<string, string> = decodeURI(window.location.search)
    .replace('?', '')
    .split('&')
    .map((param) => param.split('='))
    .reduce((values, [key, value]) => {
      return { ...values, [key]: value }
    }, {})

  return ({ query, pathName }: IProps): void => {
    const queryStringValue = {
      ...prevQuery,
      ...query,
    }

    // filter out null values
    Object.keys(queryStringValue).forEach((key) => {
      if (
        queryStringValue[key] === null ||
        queryStringValue[key] === '' ||
        queryStringValue[key] === undefined
      ) {
        delete queryStringValue[key]
      }
    })

    const qs = QueryString.stringify(queryStringValue, { encode: true })

    navigate(`${pathName}?${qs}`, { replace: true })

    // navigate(
    //     {
    //         pathname: pathName,
    //         query: queryStringValue,
    //     },
    //     undefined,
    //     { scroll: false },
    // );
  }
}

export default useUpdateRouteQueryWithReplace
