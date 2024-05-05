import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react({
      plugins: [
        // Enable automatic signals support.
        // SEE: [preact-signals/packages/react at main · XantreDev/preact-signals](https://github.com/XantreDev/preact-signals/tree/main/packages/react#vite-integration-swc)
        ["@preact-signals/safe-react/swc", {}],
      ],
    }),
  ],
});
