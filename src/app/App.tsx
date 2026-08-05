import { useEffect } from "react";
import { installScreenshotBridge } from "../utils/screenshotBridge";
import { AppRouter } from "./router";

export function App() {
  useEffect(() => {
    installScreenshotBridge();
  }, []);

  return <AppRouter />;
}
