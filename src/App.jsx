import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home/Home'
import { CuidadoFacial } from './pages/CuidadoFacial/CuidadoFacial'
import { Fragancias } from './pages/Fragancias/Fragancias'
import { CuidadoCorporal } from './pages/CuidadoCorporal/CuidadoCorporal'
import { CuidadoPersonal } from './pages/CuidadoPersonal/CuidadoPersonal'
import { CuidadoCapilar } from './pages/CuidadoCapilar/CuidadoCapilar'
import { Contacto } from './pages/Contacto/Contacto'
import { Productos } from './pages/Productos/Productos'
import { Nosotros } from './pages/Nosotros/Nosotros'
import { Blogs } from './pages/Blogs/Blogs'
import { Login } from './pages/Login/Login';
import { Registro } from './pages/Registro/Registro';
import { Navbar } from './componentes/Navbar/Navbar';
import { TopBar } from './componentes/TopBar/TopBar';
import { AdministracionProductos } from './componentes/Admin/AdministracionProductos';
import { Usuario } from './componentes/Usuario/Usuario';
import { MiPerfil } from './componentes/MiPerfil/MiPerfil'
import Pago from './componentes/Pago/Pago'
import CompraExitosa from './compra-exitosa/compra-exitosa'
import Ordenes from './componentes/Ordenes/Ordenes'
import { ModalProductos } from'./componentes/MostrarProductos/MostrarProductos'
import { PanelAdministracion } from "./componentes/Admin/PanelAdministracion";
import { AdministracionUsuarios } from "./componentes/Admin/AdministracionUsuarios";


function App() {
  

  return (
    <>
     <Router>
      <TopBar/>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ModalProductos />} />
        <Route path="/Cuidado-Capilar" element={<CuidadoCapilar />} />
        <Route path="/cuidado-facial" element={<CuidadoFacial />} />
        <Route path="/cuidado-corporal" element={<CuidadoCorporal />} />
        <Route path="/fragancias" element={<Fragancias />} />
        <Route path="/cuidado-personal" element={<CuidadoPersonal />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inventario" element={<AdministracionProductos />} />
        <Route path="/admin" element={<PanelAdministracion />} />
        <Route path="/admin/usuarios" element={<AdministracionUsuarios />} />
        <Route path="/admin/ordenes" element={<Ordenes />} />
        <Route path="/usuario" element={<Usuario/>} />
        <Route path="/Perfil" element={<MiPerfil/>}/>
        <Route path="/pago" element={<Pago/>}/>
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/ordenes" element={<Ordenes/>}/>


      </Routes>
    </Router>
    </>
  )
}

export default App
