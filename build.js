const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['src/client.tsx'],
  bundle: true,
  outfile: 'public/dist/app.js',
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  external: [],
  minify: true,
  sourcemap: true,
}).then(() => {
  console.log('✅ React app built successfully')
}).catch((err) => {
  console.error('❌ Build failed:', err)
  process.exit(1)
})