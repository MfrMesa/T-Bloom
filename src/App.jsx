// RouterWrapper.jsx

import { useLocation } from "react-router-dom";
import AppRoutes from "/src/routes/AppRoutes";
import Header from "/src/components/Header";
import ModalRoot from "/src/components/ModalRoot";

function LayoutWrapper() {
  const location = useLocation();
  const isCliente = location.pathname === "/cliente";

  const rutasSinPadding = [
    "/cliente/beneficios",
    "/cliente/premios",
    "/cliente/ofertas",
    "/cliente/local/productos",
  ];

  const sinPaddingBottom = rutasSinPadding.includes(location.pathname);

  return (
    <div className="mobile-wrapper">
      <div className="mobile-border-effect">
        <div className="mobile-content">
          <div className="app-layout">
            <Header />
            <div className="scroll-area" style={{ top: isCliente ? 0 : undefined }}>
              <div
                className="scroll-inner"
                style={{
                  paddingBottom: isCliente || sinPaddingBottom ? 0 : undefined,
                }}
              >
                <AppRoutes />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RouterWrapper() {
  return (
    <>
      <LayoutWrapper />
      <ModalRoot />
    </>
  );
}
