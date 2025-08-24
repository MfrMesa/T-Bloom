import React from "react";
import ReactDOM from "react-dom/client";
import RouterWrapper from "/src/App";
import { ClienteProvider } from "./contexts/ClienteProvider";
import { EmpresaProvider } from "./contexts/EmpresaProvider";
import { ModalProvider } from "./contexts/Modal";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> 
      <ModalProvider>
        <ClienteProvider>
          <EmpresaProvider>
            <RouterWrapper />
          </EmpresaProvider>
        </ClienteProvider>
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
