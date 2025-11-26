import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    basicSsl()
  ],
  // Resolve absolute imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Server configuration
  server: {
    port: 3000,
    open: false,
    // Proxy configuration if you need to proxy API requests
    proxy: {
      // Example: proxy FHIR API requests
      // '/fhir': {
      //   target: 'https://your-fhir-server.com',
      //   changeOrigin: true,
      //   secure: false,
      // }
    }
  },
  
  // Build configuration
  build: {
    outDir: 'build',
    sourcemap: true,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          fhir: ['fhirclient']
        }
      }
    }
  },
  
  // Define global constants
  define: {
    global: 'globalThis',
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'fhirclient']
  }
})