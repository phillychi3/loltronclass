import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import fs from 'fs'

const FILE_NAME = 'tronclass_util.js'
const headerText = fs.readFileSync('./src/header.js').toString()

export default ({ mode }) => {
	return defineConfig({
		plugins: [svelte(), cssInjectedByJsPlugin()],
		build: {
			minify: false,
			lib: {
				entry: 'src/main.js',
				formats: ['iife'],
				fileName: () => FILE_NAME,
				name: 'TronclassUtil'
			},
			rollupOptions: {
				output: {
					banner: headerText
				}
			},
			watch: mode === 'dev' ? {} : null
		}
	})
}
