import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "sonner";
import App from "./App.tsx";
import { StoreProvider } from "./store-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StoreProvider>
		<Toaster position="top-right" />
		<App />
	</StoreProvider>,
);
