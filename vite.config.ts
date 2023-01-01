import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuePugPlugin from 'vue-pug-plugin'
import markdown from 'vite-plugin-vue-markdown'
import unocss from 'unocss/vite'
import { presetUno, presetTypography } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({
			include: [/\.vue$/, /\.md$/],
			template: {
				preprocessOptions: {
					plugins: [
						vuePugPlugin,
					]
				},
			},
		}),
		markdown(),
		unocss({
			presets: [
				presetUno(),
				presetTypography(),
			],
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},

	server: {
		port: 8080,
	},
})
