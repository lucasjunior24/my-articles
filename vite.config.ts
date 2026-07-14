import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // -------------------------------------------------------------------
  // Build otimizado para produção (10.2.5)
  // -------------------------------------------------------------------
  build: {
    // Target moderno para bundles menores
    target: "es2020",

    // Gerar source maps apenas em staging (false em produção)
    sourcemap: false,

    // Tamanho mínimo de chunk para code splitting automático
    chunkSizeWarningLimit: 500,

    // Minificação
    minify: "esbuild",

    // CSS code splitting
    cssCodeSplit: true,

    // Configuração avançada de rollup
    rollupOptions: {
      output: {
        // Separação manual de chunks por vendor (função compatível com Vite 8+)
        manualChunks(id: string) {
          // Firebase — maior lib, isolada para cache próprio
          if (id.includes("node_modules/firebase")) {
            return "firebase";
          }
          // React + React DOM
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "react";
          }
          // React Router
          if (id.includes("node_modules/react-router")) {
            return "router";
          }
          // Markdown
          if (id.includes("node_modules/react-markdown")) {
            return "markdown";
          }
          // Fallback: deixa o rollup decidir
          return undefined;
        },

        // Nomeação determinística de chunks
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});
