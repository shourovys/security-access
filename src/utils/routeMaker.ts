export type TPageRoutes = { href: string; text: string }[]

interface iProps {
  title: string
  pageRoutes: TPageRoutes
}

const replaceColonBySpace = (test: string): string => {
  return test.replace(/-/g, ' ')
}

export default function generateBreadcrumbs(path: string): iProps {
  // Remove any query parameters, as those aren't included in breadcrumbs
  const asPathWithoutQuery = path.split('?')[0]

  // Break down the path between "/"s, removing empty entities
  // Ex:"/my/nested/path" --> ["my", "nested", "path"]
  const asPathNestedRoutes = asPathWithoutQuery.split('/').filter((v) => v.length > 0)

  // Iterate over the list of nested route parts and build
  // a "crumb" object for each one.
  const crumbList = asPathNestedRoutes.map((subpath, idx) => {
    // We can get the partial nested route for the crumb
    // by joining together the path parts up to this point.
    const href = `/${asPathNestedRoutes.slice(0, idx + 1).join('/')}`
    // The text will just be the route string for now
    const text = replaceColonBySpace(subpath)
    return { href, text }
  })

  // Add in a default list crumb if crumbList has only 1 link
  const updateCrumbList =
    crumbList.length === 1 ? [...crumbList, { href: '', text: `List` }] : crumbList

  // update info to information and href
  if (crumbList[1]?.text === 'info') {
    const popCrumb = crumbList.pop()
    if (popCrumb) {
      if (popCrumb.text === 'info') {
        crumbList.push(popCrumb)
      }

      crumbList[1].text = 'information'
      crumbList[1].href = popCrumb.href
      return {
        title: crumbList[0].text,
        pageRoutes: updateCrumbList,
      }
    }
  }

  // update edit path and href
  if (crumbList[1]?.text === 'edit') {
    const popCrumb = crumbList.pop()
    if (popCrumb) {
      if (popCrumb.text === 'edit') {
        crumbList.push(popCrumb)
      }
      crumbList[1].text = 'Edit'
      crumbList[1].href = popCrumb.href
      return {
        title: crumbList[0].text,
        pageRoutes: updateCrumbList,
      }
    }
  }

  return {
    title: crumbList[0]?.text,
    pageRoutes: updateCrumbList,
  }
}
