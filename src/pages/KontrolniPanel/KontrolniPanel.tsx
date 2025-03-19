import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { redirect, useNavigate } from "react-router-dom";
import client from "../../common/axios";
import Modal from "../../components/modals/Modal";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import useAxiosPrivate from "../../common/useAxiosPrivate";

const KontrolniPanel = () => {
  const navigate = useNavigate();
  const {
    register: registerDodajPredmet,
    handleSubmit: handleSubmitDodajPredmet,
    reset: resetDodajPredmet,
  } = useForm<IDodajPredmetFormInput>();
  const {
    register: registerDodajPredmetNaSmeru,
    handleSubmit: handleSubmitDodajPredmetNaSmeru,
    reset: resetDodajPredmetNaSmeru,
  } = useForm<IDodajPredmetNaSmeruFormInput>();
  const {
    register: registerUnaprediKorisnikaOpen,
    handleSubmit: handleSubmitUnaprediKorisnikaOpen,
    reset: resetUnaprediKorisnikaOpen,
  } = useForm<IUnaprediKorisnikaFormInput>();

  const [dodajPredmetOpen, setDodajPredmetOpen] = useState(false);
  const [dodajPredmetNaSmeruOpen, setDodajPredmetNaSmeruOpen] = useState(false);
  const [unaprediKorisnikaOpen, setUnaprediKorisnikaOpen] = useState(false);
  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const [user, setUser] = useState<User>();
  const [poruka, setPoruka] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const axioss = useAxiosPrivate();

  useEffect(() => {
    if (Cookies.get("role") === "Moderator") setIsMod(true);
    if (Cookies.get("role") === "Admin") setIsAdmin(true);
    // if (
    //   Cookies.get("role") !== "Moderator" &&
    //   Cookies.get("role") !== "Moderator"
    // )
    //   navigate("/");
  }, []);

  const dodajPredmet: SubmitHandler<IDodajPredmetFormInput> = async (
    predmet
  ) => {
    try {
      const response = await axioss.post(
        "http://localhost:5073/api/Course/Add",
        {
          name: predmet.name,
          code: predmet.code,
          espb: predmet.espb,
        }
      );
      if (response.status === 200) {
        setPoruka(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPoruka(err.response?.data);
      }
    }
  };

  const dodajPredmetNaSmeru: SubmitHandler<
    IDodajPredmetNaSmeruFormInput
  > = async (data) => {
    try {
      const response = await axioss.post(
        `http://localhost:5073/api/MajorCourse/AddCourseToMajor?majorCode=${data.majorCode}&courseCode=${data.courseCode}&year=${data.year}`,
        {}
      );
      if (response.status === 200) {
        setPoruka(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPoruka(err.response?.data);
      }
    }
  };
  const unaprediKorisnika: SubmitHandler<IUnaprediKorisnikaFormInput> = async (
    data
  ) => {
    try {
      const response = await axioss.put(
        `http://localhost:5073/api/User/UnaprediUModeratora?username=${data.username}`,
        {}
      );
      if (response.status === 200) {
        setPoruka(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPoruka(err.response?.data);
      }
    }
  };

  return (
    <>
      <h1 className="text-3xl sm:text-6xl lg:text-8xl font-bold text-center">
        Kontrolni panel
      </h1>
      {poruka && (
        <p
          className={`${
            poruka.indexOf("Uspesno") > -1 || poruka.indexOf("uspesno") > -1
              ? "text-green-600"
              : "text-red-600"
          } font-bold text-xl text-center`}
        >
          {poruka}
        </p>
      )}
      <div className="my-10 mx-auto w-3/4 text-md sm:text-lg lg:text-xl bg-slate-800 rounded-xl text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-10">
        {isAdmin && (
          <div className="col-span-1 bg-white rounded-xl flex flex-col gap-3 p-5 items-center">
            <h1 className="text-black font-bold">Predmeti</h1>
            <div className="w-full h-0.5 bg-gray-400"></div>
            <div
              onClick={() => setDodajPredmetOpen(true)}
              className="p-5 w-fit bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
            >
              Novi predmet
            </div>
          </div>
        )}
        {isAdmin && (
          <div className="col-span-1 bg-white rounded-xl flex flex-col gap-3 p-5 items-center">
            <h1 className="text-black font-bold">Predmeti na smerovima</h1>
            <div className="w-full h-0.5 bg-gray-400"></div>
            <div className="flex space-x-10">
              <div
                onClick={() => setDodajPredmetNaSmeruOpen(true)}
                className="p-5 w-fit bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
              >
                Dodaj postojeci predmet na smer
              </div>
              {/* <div
          onClick={() => setDodajPredmetOpen(true)}
          className="p-5 w-fit bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
        >
          Izbrisi predmet sa smera
        </div> */}
            </div>
          </div>
        )}
        {isAdmin && (
          <div className="col-span-1 bg-white rounded-xl flex flex-col gap-3 p-5 items-center">
            <h1 className="text-black font-bold">Korisnici</h1>
            <div className="w-full h-0.5 bg-gray-400"></div>
            <div className="flex gap-5">
              <div
                onClick={() => setUnaprediKorisnikaOpen(true)}
                className="p-5 w-fit bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
              >
                Unapredi korisnika u moderatora
              </div>
              <div
                onClick={() => navigate("/kontrolniPanel/sviKorisnici")}
                className="p-5 w-fit bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
              >
                Svi korisnici
              </div>
            </div>
          </div>
        )}
        {(isAdmin || isMod) && (
          <div className="col-span-1 bg-white rounded-xl flex flex-col gap-3 p-5 items-center">
            <h1 className="text-black font-bold">Blanketi</h1>
            <div className="w-full h-0.5 bg-gray-400"></div>
            <div
              onClick={() => navigate("/kontrolniPanel/neodobreniBlanketi")}
              className="p-5 w-fit bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
            >
              Neodobreni blanketi
            </div>
            <div
              onClick={() => navigate("/kontrolniPanel/neodobrenaResenja")}
              className="p-5 w-fit bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
            >
              Neodobrena resenja
            </div>
          </div>
        )}
      </div>

      <Modal
        open={dodajPredmetOpen}
        onClose={() => {
          setDodajPredmetOpen(false);
          resetDodajPredmet();
        }}
      >
        <form
          onSubmit={handleSubmitDodajPredmet(dodajPredmet)}
          className="flex flex-col space-y-7 bg-white p-10 rounded-xl"
        >
          <h3 className="text-center text-l font-bold">Novi predmet</h3>
          <input
            type="text"
            {...registerDodajPredmet("name", { required: true })}
            placeholder="Ime predmeta (Osnovi elektrotehnike 1)"
            className="p-2 bg-slate-800 text-white rounded-lg"
          />
          <input
            type="text"
            {...registerDodajPredmet("code", { required: true })}
            placeholder="Kod predmeta (OE1)"
            className="p-2 bg-slate-800 text-white rounded-lg"
          />
          <input
            type="text"
            {...registerDodajPredmet("espb", { required: true })}
            placeholder="ESPB poeni (6)"
            className="p-2 bg-slate-800 text-white rounded-lg"
          />
          <button
            type="submit"
            className="m-2 p-2 hover:bg-slate-700 w-3/4 mx-auto bg-slate-800 text-white rounded-md"
            onClick={() => setDodajPredmetOpen(false)}
          >
            Dodaj predmet!
          </button>
        </form>
      </Modal>
      <Modal
        open={dodajPredmetNaSmeruOpen}
        onClose={() => {
          setDodajPredmetNaSmeruOpen(false);
          resetDodajPredmetNaSmeru();
        }}
      >
        <form
          onSubmit={handleSubmitDodajPredmetNaSmeru(dodajPredmetNaSmeru)}
          className="flex flex-col space-y-7 bg-white p-10"
        >
          <h3 className="text-center text-l font-bold">Novi smer</h3>
          <input
            type="text"
            {...registerDodajPredmetNaSmeru("courseCode", { required: true })}
            placeholder="Kod kursa (OE1)"
            className="p-2 bg-slate-800 text-white rounded-lg"
          />
          <input
            type="text"
            {...registerDodajPredmetNaSmeru("majorCode", { required: true })}
            placeholder="Kod smera (RII)"
            className="p-2 bg-slate-800 text-white rounded-lg"
          />
          <input
            type="text"
            {...registerDodajPredmetNaSmeru("year", { required: true })}
            placeholder="Godina (4)"
            className="p-2 bg-slate-800 text-white rounded-lg"
          />
          <button
            type="submit"
            className="m-2 p-2 hover:bg-slate-700 w-3/4 mx-auto bg-slate-800 text-white rounded-md"
            onClick={() => setDodajPredmetNaSmeruOpen(false)}
          >
            Dodaj predmet na smeru!
          </button>
        </form>
      </Modal>
      <Modal
        open={unaprediKorisnikaOpen}
        onClose={() => {
          setUnaprediKorisnikaOpen(false);
          resetUnaprediKorisnikaOpen();
        }}
      >
        <form
          onSubmit={handleSubmitUnaprediKorisnikaOpen(async (data) => {
            const response = await axioss.get(
              `http://localhost:5073/api/User/GetByUsername?username=${data.username}`
            );
            setUser({
              name: response.data["name"],
              surname: response.data["surname"],
              username: data.username,
              karma: response.data["karma"],
              email: response.data["email"],
              phoneNumber: response.data["phoneNumber"],
              avatarUrl: response.data["avatarUrl"],
            });

            setShowAreYouSure(true);
          })}
          className="flex flex-col space-y-7 bg-white p-10"
        >
          <h3 className="text-center text-l font-bold">
            Unapredi korisnika u moderatora
          </h3>
          <input
            type="text"
            {...registerUnaprediKorisnikaOpen("username", { required: true })}
            placeholder="Nadimak korisnika (Matija)"
            className="p-2 bg-slate-800 text-white rounded-lg"
          />
          {showAreYouSure && (
            <div className="w-3/4 bg-slate-800 m-auto text-white flex flex-col items-center">
              <div className="flex flex-col space-y-3">
                <p>Ime: {user?.name}</p>
                <p>Prezime: {user?.surname}</p>
                <p>Karma: {user?.karma}</p>
              </div>
              <button
                className="my-3 w-1/2 mx-auto bg-red-600 hover:bg-red-700 text-white rounded-md "
                onClick={async () => {
                  try {
                    const response = await axioss.put(
                      `http://localhost:5073/api/User/UnaprediUModeratora?username=${user?.username}
                        `,
                      {}
                    );
                    setPoruka(response.data);
                  } catch (err) {
                    if (axios.isAxiosError(err)) {
                      setPoruka(err.response?.data);
                    }
                  }
                  setShowAreYouSure(false);
                  setUnaprediKorisnikaOpen(false);
                }}
              >
                Siguran sam!
              </button>
            </div>
          )}
          <button
            type="submit"
            className="m-2 p-2 hover:bg-slate-700 w-3/4 mx-auto bg-slate-800 text-white rounded-md"
          >
            Unapredi korisnika!
          </button>
        </form>
      </Modal>
    </>
  );
};

export default KontrolniPanel;
