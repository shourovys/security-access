module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: 'default',
          },
          // 'postcss-rename': {
          //   strategy: 'minimal',
          //   by: 'whole',
          //   ids: true,
          //   outputMapCallback: (map) => {
          //     // write the output map node_modules/.cache/postcss/postcss-rename.json
          //     // for postcss-url to use
          //     const fs = require('fs')
          //     if (!fs.existsSync('node_modules/.cache/postcss')) {
          //       fs.mkdirSync('node_modules/.cache/postcss')
          //     }
          //
          //     fs.writeFileSync(
          //       // check if folder exists
          //       'node_modules/.cache/postcss/postcss-rename.json',
          //       JSON.stringify(map)
          //     )
          //   },
          // },
        }
      : {}),
  },
}
