
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api/generate-image': {
        target: 'https://pqehihvidbnltyzdcvtl.supabase.co/functions/v1/generate-image',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/generate-image/, ''),
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZWhpaHZpZGJubHR5emRjdnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTU3MjAsImV4cCI6MjA1NjkzMTcyMH0.4EdMpSHjNZ5MQmRvLgn7qpYFPyRRXV_7HgX21Rjl4CY',
        }
      }
    }
  }
});
