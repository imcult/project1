import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // 临时移除 basicSsl()
  build: {
    rollupOptions: {
      input: {
        //spa: resolve(__dirname, 'index-spa.html'),
        main: resolve(__dirname, 'index.html'),
        focus: resolve(__dirname, 'focus.html'),
      },
    },
  },
  server: {
		// https: true, // 临时禁用HTTPS
		host: true, // same as "--host" flag
	},
})
