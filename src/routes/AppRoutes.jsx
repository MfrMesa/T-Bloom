import { Routes, Route } from 'react-router-dom';
import LogIn from '../pages/LogIn';
import NewPassword from '../pages/NewPassword';
import GetPassword from '../pages/GetPassword';
import NewAccount from '../pages/NewAccount';
import Empresa from '../pages/Empresa';
import PremiosEmpresa from '../pages/PremiosEmpresa';
import PerfilEmpresa from '../pages/PerfilEmpresa';
import ProductosEmpresa from '../pages/ProductosEmpresa';
import OfertasEmpresa from '../pages/OfertasEmpresa';
import LocalesEmpresa from '../pages/LocalesEmpresa';
import Cliente from '../pages/Cliente';
import BeneficiosCliente from '../pages/BeneficiosCliente';
import PerfilCliente from '../pages/PerfilCliente';
import MisLocalesCliente from '../pages/MisLocalesCliente';
import OfertasCliente from '../pages/OfertasCliente';
import RecompensasCliente from '../pages/RecompensasCliente';
import ProductosLocales from '../pages/ProductosLocales';
import PerfilLocalCliente from '../pages/PerfilLocalCliente';
import CRM from '../pages/CRM';







export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LogIn />} /> 
      {/* <Route path="/login/newpassword" element={<NewPassword />} />
      <Route path="/login/getpassword" element={<GetPassword />} />
      <Route path="/login/newaccount" element={<NewAccount />} /> */}

      <Route path="/empresa" element={<Empresa />} />
      <Route path="/empresa/perfil" element={<PerfilEmpresa />} />
      {/* <Route path="/empresa/premios" element={<PremiosEmpresa />} />
      <Route path="/empresa/productos" element={<ProductosEmpresa />} />
      <Route path="/empresa/ofertas" element={<OfertasEmpresa />} />
      <Route path="/empresa/locales" element={<LocalesEmpresa />} /> */}

      <Route path="/cliente" element={<Cliente />} />
      {/* <Route path="/cliente/beneficios" element={<BeneficiosCliente />} />
      <Route path="/cliente/recompensas" element={<RecompensasCliente/>} /> */}
      <Route path="/cliente/misLocales" element={<MisLocalesCliente />} /> 
      <Route path="/cliente/perfil/" element={<PerfilCliente />} /> 
      {/* <Route path="/cliente/perfil/newpassword" element={<NewPassword />} />
      <Route path="/cliente/ofertas" element={<OfertasCliente />} /> */}

      {/* <Route path="/cliente/local" element={<PerfilLocalCliente />} /> */}
      {/* <Route path="/cliente/local/productos" element={<ProductosLocales />} /> */}
        {/* <Route path="/CRM" element={<CRM />} /> */}
    </Routes>
  );
}
