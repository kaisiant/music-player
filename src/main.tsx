import App from "./App.tsx";
import "./index.css";
import store, { persistor } from "./store/index.ts";
import Wrapper from "components/Wrapper/index.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Wrapper>
          <App />
        </Wrapper>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
