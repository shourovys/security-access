import react from '@vitejs/plugin-react-swc'
import {defineConfig, Plugin} from 'vite'
import {ViteMinifyPlugin} from 'vite-plugin-minify'

function ClassMinifyPlugin(): Plugin {
    const fs = require('fs')
    const r = fs.readFileSync('node_modules/.cache/postcss/postcss-rename.json', 'utf8')
    const classmap = JSON.parse(r)

    const class_keys = Object.keys(classmap)

    console.log('minifying ' + class_keys.length + ' classes')

    return {
        name: 'class-plugin-minify',
        enforce: 'post',
        apply: 'build',
        transform(code, path) {
            console.log('transforming ' + path)
            if (!path.endsWith('.tsx')) return code
            if (path.includes('node_modules') && !path.includes('react-datepicker')) return code

            let code_changed = code
            for (const key of class_keys) {
                // capture the class name inside classNames() function call maybe include return

                const regex = new RegExp('classNames\\(([^)]*?)\\)', 'g')
                const matches = code_changed.match(regex)

                console.log('minifying ' + key + ' to ' + classmap[key])
                // make key compatible with regex  []() to \[\]\(\)
                const regex_key = key.replace(/([[\]()])/g, '\\$1')
                code_changed = code_changed.replace(new RegExp(regex_key + ' ', 'g'), classmap[key] + ' ')
                code_changed = code_changed.replace(new RegExp(regex_key + '"', 'g'), classmap[key] + '"')
                code_changed = code_changed.replace(new RegExp(regex_key + "'", 'g'), classmap[key] + "'")
            }
            return code_changed
        },
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        ...(process.env.NODE_ENV === 'production'
            ? [
                ViteMinifyPlugin({
                    removeConsole: true,
                    removeDebugger: true,
                    removeUndefined: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    minifyCSS: true,
                    minifyJS: true,
                    minifyURLs: true,
                }),
                // ClassMinifyPlugin(),
            ]
            : []),
    ],
    server: {
        port: 3000,
    },

    build: {
        target: 'esnext',
        minify: process.env.NODE_ENV === 'production' ? 'terser' : 'esbuild',
        outDir: '../jupiter/static',
        emptyOutDir: true,
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                entryFileNames: 'main-sp-[hash].js',
                chunkFileNames: 'js/sp-[hash].js',
                assetFileNames: 'css/[name]-[hash].[ext]',
            },
        },
    },
})
