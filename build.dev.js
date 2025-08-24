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
    'process.env.NODE_ENV': '"development"'
  },
  external: [],
  minify: false,
  sourcemap: true,
  watch: {
    onRebuild(error) {
      if (error) console.error('❌ Rebuild failed:', error)
      else console.log('✅ Rebuilt')
    }
  },
}).then(() => {
  console.log('👀 Watching for JS changes...')
  // Notify the worker to broadcast a reload to connected clients
  try {
    fetch('http://localhost:8787/__reload-trigger', { method: 'POST' }).catch(() => {})
  } catch {}
}).catch((err) => {
  console.error('❌ Build failed:', err)
  process.exit(1)
})

