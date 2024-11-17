import { IPageInfo } from '../types/pages/favorite'
import pagesLicenseFilter from '../utils/pagesLicenseFilter'
import useAuth from './useAuth'

// Custom hook to filter license pages
function useUserPermittedPages(): IPageInfo[] {
  const { permissions, license, has_license, user } = useAuth()
  let userPermittedPagesData: IPageInfo[] = []

  if (user?.Role.Pages) {
    const filterAccessPages = user?.Role.Pages.filter((item) => {
      return permissions.find(
        (permission) => permission.id == item.PageNo && permission.access && permission.is_favorite
      )
    })

    userPermittedPagesData = pagesLicenseFilter(filterAccessPages, license, has_license)
  }

  return userPermittedPagesData
}

export default useUserPermittedPages
