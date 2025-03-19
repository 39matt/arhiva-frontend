import Layout from "./Layout";
import "./styles/index.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.tsx";
import NotFound from "./pages/NotFound/NotFound.tsx";
import Register from "./pages/Register/Register.tsx";
import Login from "./pages/Login/Login.tsx";
import Smerovi from "./pages/Smerovi/Smerovi.tsx";
import Smer from "./pages/Smerovi/Smer.tsx";
import Predmeti from "./pages/Smerovi/Predmeti.tsx";
import KontrolniPanel from "./pages/KontrolniPanel/KontrolniPanel.tsx";
import Profil from "./pages/Profil/Profil.tsx";
import Predmet from "./pages/Predmet/Predmet.tsx";
import Blanket from "./pages/Blanket/Blanket.tsx";
import NoviBlanket from "./pages/NoviBlanket/NoviBlanket.tsx";
import NeodobreniBlanketi from "./pages/KontrolniPanel/NeodobreniBlanketi.tsx";
import NeodobrenaResenja from "./pages/KontrolniPanel/NeodobrenaResenja.tsx";
import SviKorisnici from "./pages/KontrolniPanel/SviKorisnici.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="profil" element={<Profil />} />
          <Route path="kontrolniPanel">
            <Route index element={<KontrolniPanel />} />
            <Route path="neodobreniBlanketi" element={<NeodobreniBlanketi />} />
            <Route path="neodobrenaResenja" element={<NeodobrenaResenja />} />
            <Route path="sviKorisnici" element={<SviKorisnici />} />
          </Route>
          <Route path="smerovi" element={<Smerovi />} />
          <Route path="blanketi">
            <Route index element={<Smerovi />} />

            <Route path="blanket/:blanketId" element={<Blanket />} />
            <Route path="noviBlanket" element={<NoviBlanket />} />

            <Route path=":smerCode" element={<Smer />} />
            <Route path=":smerCode/:smerGodina" element={<Predmeti />} />
            <Route
              path=":smerCode/:smerGodina/:predmetCode"
              element={<Predmet />}
            />
          </Route>

          {/* <Route path="US">
              <Route index element={<US />} />
              <Route path=":godina" element={<US />} />
            </Route>

            <Route path="TK">
              <Route index element={<TK />} />
              <Route path=":godina" element={<TK />} />
            </Route>

            <Route path="EKM">
              <Route index element={<EKM />} />
              <Route path=":godina" element={<EKM />} />
            </Route>

            <Route path="EE">
              <Route index element={<EE />} />
              <Route path=":godina" element={<EE />} />
            </Route> */}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
