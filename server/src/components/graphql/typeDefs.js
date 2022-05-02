
// import path from 'path'
// import { mergeTypeDefs } from '@graphql-tools/merge'
// import { loadFilesSync } from '@graphql-tools/load-files'

// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const typesArray = loadFilesSync(path.join(__dirname, './typeDefs'), { extensions: ['graphql'] })
// const mergedTypes = mergeTypeDefs(typesArray)

// export default mergedTypes

import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'

const schemas = await loadSchema('./src/**/*.graphql', {
  loaders: [new GraphQLFileLoader()]
})

export default schemas