import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['index.js', 'thread.js'],
	format: ['cjs'],
	splitting: false,
	sourcemap: false,
	clean: true,
	minify: false,
	shims: true
})
