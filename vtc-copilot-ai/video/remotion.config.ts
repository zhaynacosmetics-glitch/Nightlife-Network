import path from "node:path";
import { Config } from "@remotion/cli/config";

// Le film importe les écrans partagés de ../shared : on force une seule copie de React.
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      react: path.resolve(process.cwd(), "node_modules/react"),
      "react-dom": path.resolve(process.cwd(), "node_modules/react-dom"),
      "lucide-react": path.resolve(process.cwd(), "../node_modules/lucide-react"),
    },
  },
}));

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setConcurrency(null);
