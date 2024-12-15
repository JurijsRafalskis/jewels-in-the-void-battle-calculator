import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //It is neccessary to set base here, due to github pages disliking leading '/' in scrip and style urls.
  base: ''
})
