import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import sleep from "../../common/sleep";
import useAxiosPrivate from "../../common/useAxiosPrivate";

const Profil: React.FC = () => {
  const [user, setUser] = useState<User>();
  const [editOpen, setEditOpen] = useState(false);
  const [editPasswordOpen, setEditPasswordOpen] = useState(false);
  const [editPictureOpen, setEditPictureOpen] = useState(false);
  const [poruka, setPoruka] = useState("");
  const [porukaPass, setPorukaPass] = useState("");
  const axioss = useAxiosPrivate();
  const {
    register: registerKorisnik,
    reset: resetKorisnik,
    handleSubmit: handleSubmitKorisnik,
  } = useForm<IIzmeniKorisnika>();
  const {
    register: registerPicture,
    handleSubmit: handleSubmitPicture,
  } = useForm<IDodajResenjeFormInput>();
  const {
    register: registerLozinka,
    handleSubmit: handleSubmitLozinka,
  } = useForm<IPromeniLozinku>();

  async function getUser() {
    return await axioss
      .get(
        `https://arhiva-backend.azurewebsites.net/api/User/GetByUsername?username=${Cookies.get(
          "username"
        )}`
      )
      .then((r) => r.data);
  }
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
      resetKorisnik(userData);
    };
    fetchUser();
  }, [resetKorisnik]);

  const onSubmitKorisnik: SubmitHandler<IIzmeniKorisnika> = async (data) => {
    try {
      const response = await axioss.put(
        `https://arhiva-backend.azurewebsites.net/api/User/IzmeniKorisnika?username=${user?.username}`,
        {
          name: data.ime || user?.name,
          surname: data.prezime || user?.surname,
          username: data.nadimak || user?.username,
          email: data.email || user?.email,
          phoneNumber: data.brojTelefona || user?.phoneNumber,
        }
      );
      if (response.status === 200) {
        setEditOpen(false);
        setPoruka(response.data);
        await sleep(2000);
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPoruka(err.response?.data);
        setEditOpen(false);
      }
    }
  };

  const onSubmitLozinka: SubmitHandler<IPromeniLozinku> = async (data) => {
    try {
      const response = await axioss.put(
        `https://arhiva-backend.azurewebsites.net/api/User/PromeniLozinku?username=${user?.username}`,
        {
          staraLozinka: data.staraLozinka,
          novaLozinka: data.novaLozinka,
          potvrdiNovuLozinku: data.potvrdiNovuLozinku,
        }
      );
      if (response.status === 200) {
        setEditPasswordOpen(false);
        setPoruka(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPorukaPass(err.response?.data);
      }
    }
  };

  const onSubmitPicture: SubmitHandler<IDodajResenjeFormInput> = async (
    data
  ) => {
    const formData = new FormData();
    formData.append("image", data.document[0]);
    const url = `https://arhiva-backend.azurewebsites.net/api/User/UpdatePicture?username=${Cookies.get(
      "username"
    )}`;
    try {
      const response = await axioss.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPoruka(response.data);
      return response.data;
    } catch (error) {
      console.error("Greska pri uploadovanju!", error);
    }
  };

  return (
    <div className="w-1/2 m-auto bg-slate-800 text-white rounded-lg grid grid-cols-1 lg:grid-cols-3">
      <div className="col-span-1">
        <img
          src={user?.avatarUrl}
          alt="Avatar korisnika"
          className="h-full w-full object-cover"
        />
      </div>
      {!editOpen && !editPasswordOpen && !editPictureOpen && (
        <div className="col-span-1 lg:col-span-2">
          <div className="m-10 h-3/4">
            <h1 className="text-3xl font-bold text-center">
              Korisnička kartica
            </h1>
            {poruka && (
              <p
                className={`font-bold text-lg text-center ${
                  poruka.indexOf("Uspesno") > -1
                    ? "text-green-600"
                    : "text-red-500"
                } `}
              >
                {poruka}
              </p>
            )}
            <div className="font-bold">
              Ime: <span className="font-light">{user?.name}</span>
            </div>
            <div className="font-bold">
              Prezime: <span className="font-light">{user?.surname}</span>
            </div>
            <div className="font-bold">
              Nadimak: <span className="font-light">{user?.username}</span>
            </div>
            <div className="font-bold">
              Email: <span className="font-light">{user?.email}</span>
            </div>
            <div className="font-bold">
              Broj telefona:{" "}
              <span className="font-light">{user?.phoneNumber}</span>
            </div>
            <div className="font-bold">
              Karma: <span className="font-light">{user?.karma}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div
                onClick={() => setEditOpen(true)}
                className="bg-slate-700 hover:bg-slate-600 cursor-pointer w-fit p-4 text-white"
              >
                Izmeni podatke
              </div>
              <div
                onClick={() => setEditPasswordOpen(true)}
                className="bg-slate-700 hover:bg-slate-600 cursor-pointer w-fit p-4 text-white"
              >
                Promeni šifru
              </div>
              <div
                onClick={() => setEditPictureOpen(true)}
                className="bg-slate-700 hover:bg-slate-600 cursor-pointer w-fit p-4 text-white"
              >
                Promeni sliku
              </div>
            </div>
          </div>
        </div>
      )}
      {editOpen && (
        <div className="col-span-1 lg:col-span-2 text-black">
          <form
            noValidate
            className="m-10 h-3/4 flex flex-col justify-between"
            onSubmit={handleSubmitKorisnik(onSubmitKorisnik)}
          >
            <h1 className="text-xl font-bold text-center text-white">
              Izmena korisnika
            </h1>
            <input
              {...registerKorisnik("ime", { required: false })}
              type="text"
              placeholder="Ime"
            />
            <input
              {...registerKorisnik("prezime", { required: false })}
              type="text"
              placeholder="Prezime"
            />
            <input
              {...registerKorisnik("nadimak", { required: false })}
              type="text"
              placeholder="Nadimak"
            />
            <input
              {...registerKorisnik("email", { required: false })}
              type="text"
              placeholder="Email"
            />
            <input
              {...registerKorisnik("brojTelefona", { required: false })}
              type="text"
              placeholder="Broj telefona"
            />
            <div className="flex space-x-5">
              <button
                type="submit"
                className="bg-green-700/70 hover:bg-slate-600 cursor-pointer w-fit p-4 text-white"
              >
                Izmeni
              </button>
              <div
                onClick={() => setEditOpen(false)}
                className="bg-red-700/70 hover:bg-slate-600 cursor-pointer w-fit p-4 text-white"
              >
                Odustani
              </div>
            </div>
          </form>
        </div>
      )}
      {editPasswordOpen && (
        <div className="col-span-1 lg:col-span-2">
          <form
            className="m-10 h-3/4 flex flex-col justify-between"
            onSubmit={handleSubmitLozinka(onSubmitLozinka)}
          >
            <h1 className="text-xl font-bold text-center">Izmena sifre</h1>
            {porukaPass && (
              <p
                className={`font-bold text-lg text-center ${
                  poruka.indexOf("Uspesno") > -1
                    ? "text-green-600"
                    : "text-red-500"
                } `}
              >
                {porukaPass}
              </p>
            )}
            <input
              {...registerLozinka("staraLozinka", { required: false })}
              type="text"
              placeholder="Stara lozinka"
            />
            <input
              {...registerLozinka("novaLozinka", { required: false })}
              type="text"
              placeholder="Nova lozinka"
            />
            <input
              {...registerLozinka("potvrdiNovuLozinku", { required: false })}
              type="text"
              placeholder="Potvrda nove lozinka"
            />
            <div className="flex space-x-5">
              <button
                type="submit"
                className="bg-green-700/70 hover:bg-slate-600 cursor-pointer w-fit p-4 text-white"
              >
                Izmeni lozinku!
              </button>
              <div
                onClick={() => setEditPasswordOpen(false)}
                className="bg-red-700/70 hover:bg-slate-600 cursor-pointer w-fit p-4 text-white"
              >
                Odustani
              </div>
            </div>
          </form>
        </div>
      )}
      {editPictureOpen && (
        <div className="col-span-1 lg:col-span-2">
          <form
            className="m-10 h-3/4 flex flex-col justify-between"
            onSubmit={handleSubmitPicture(onSubmitPicture)}
          >
            <h1 className="text-xl font-bold text-center">Izmena sifre</h1>
            {porukaPass && (
              <p
                className={`font-bold text-lg text-center ${
                  poruka.indexOf("Uspesno") > -1
                    ? "text-green-600"
                    : "text-red-500"
                } `}
              >
                {porukaPass}
              </p>
            )}
            <input
              {...registerPicture("document", { required: false })}
              type="file"
            />
            <div className="flex space-x-5">
              <button
                type="submit"
                className="bg-green-700/70 hover:bg-slate-600 cursor-pointer w-fit p-4 text-white"
              >
                Izmeni sliku!
              </button>
              <div
                onClick={() => setEditPictureOpen(false)}
                className="bg-red-700/70 hover:bg-slate-600 cursor-pointer w-fit p-4 text-white"
              >
                Odustani
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profil;
