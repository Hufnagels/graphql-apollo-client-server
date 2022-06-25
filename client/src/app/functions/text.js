import _ from 'lodash'
import pluralize from 'pluralize'

/**
 * @functionName convertToSlug
 * @param {Text} post title
 * @output slug from post title
 */
export const convertToSlug = (Text) => {
  return Text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    ;
}

/**
 * @functionName makePageTitleFromPath
 * @param {path} location.pathname
 * @output singularized pathname 
 */
export const makePageTitleFromPath = (path, camelcase = false) => {
  const pageTitle = _.capitalize(path.slice(path.lastIndexOf("/") + 1, path.length))
  if (camelcase) return _.camelCase(pluralize.singular(pageTitle))
  return pluralize.singular(pageTitle)
}

/**
 * @function makeListTitleFromPath
 * @param {path} location.pathname
 * @oputput Camelcased pathname + text 'list'
 */
export const makeListTitleFromPath = (path, camelcase = false) => {
  let listTitle = _.capitalize(path.slice(path.lastIndexOf("/") + 1, path.length))
  if (camelcase) listTitle = _.camelCase(listTitle)
  return pluralize.isSingular(listTitle) ? pluralize(listTitle) : listTitle
}
// const [title, setTitle] = React.useState(_.capitalize(location.pathname.slice(location.pathname.lastIndexOf("/") + 1, location.pathname.length)) + ' list')

/**
 * @function capitalizeString
 * @param text
 * @oputput Capitalized text string
 */
export const capitalizeString = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}