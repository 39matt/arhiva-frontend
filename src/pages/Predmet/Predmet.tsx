import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../common/useAxiosPrivate";
import Komentar from "../../components/common/Komentar/Komentar";
import { useForm } from "react-hook-form";
import { FaBell, FaBellSlash } from "react-icons/fa";
import Modal from "../../components/modals/Modal";

const Predmet: React.FC = () => {
  const { predmetCode } = useParams();
  const [blanketi, setBlanketi] = useState<Blanket[]>();
  const [predmet, setPredmet] = useState<Predmet>();
  const [komentari, setKomentari] = useState<Komentar[]>();
  const [message, setMessage] = useState("");
  const [korisnik, setKorisnik] = useState(undefined);
  const [isFollowing, setIsFollowing] = useState(false);
  const [godine, setGodine] = useState([]);
  const [pismeni, setPismeni] = useState(false);
  const [usmeni, setUsmeni] = useState(false);
  const [kolokvijum1, setKolokvijum1] = useState(false);
  const [kolokvijum2, setKolokvijum2] = useState(false);
  const [showKolokvijum1, setShowKolokvijum1] = useState(false);
  const [showKolokvijum2, setShowKolokvijum2] = useState(false);
  const [showIspit, setShowIspit] = useState(false);
  const axioss = useAxiosPrivate();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Komentar>();
  const { register: registerD, handleSubmit: handleSubmitD } =
    useForm<IDodajDatumFormInput>();

  const dodajKolokvijum1 = async (data: IDodajDatumFormInput) => {
    const k1 = async () => {
      try {
        await axioss.post(
          `https://arhiva-backend.azurewebsites.net/api/Course/AddK1?code=${predmetCode}&date=${data.date}`
        );
        window.location.reload();
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
        }

      }
    };
    k1();
  };
  const obrisiK1 = async () => {
    const k1 = async () => {
      try {
        await axioss.delete(
          `https://arhiva-backend.azurewebsites.net/api/Course/RemoveK1?code=${predmetCode}`
        );
        window.location.reload();
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
        }      }
    };
    k1();
  };
  const dodajKolokvijum2 = async (data: IDodajDatumFormInput) => {
    const k1 = async () => {
      try {
        await axioss.post(
          `https://arhiva-backend.azurewebsites.net/api/Course/AddK2?code=${predmetCode}&date=${data.date}`
        );
        window.location.reload();
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
        }
      }
    };
    k1();
  };
  const obrisiK2 = async () => {
    const k1 = async () => {
      try {
        await axioss.delete(
          `https://arhiva-backend.azurewebsites.net/api/Course/RemoveK2?code=${predmetCode}`
        );
        window.location.reload();
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
        }
      }
    };
    k1();
  };
  const dodajIspit = async (data: IDodajDatumFormInput) => {
    const k1 = async () => {
      try {
        await axioss.post(
          `https://arhiva-backend.azurewebsites.net/api/Course/AddI?code=${predmetCode}&date=${data.date}`
        );
        window.location.reload();
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
        }
      }
    };
    k1();
  };
  const obrisiI = async () => {
    const k1 = async () => {
      try {
        await axioss.delete(
          `https://arhiva-backend.azurewebsites.net/api/Course/RemoveI?code=${predmetCode}`
        );
        window.location.reload();
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
        }
      }
    };
    k1();
  };

  const dodajKomentar = async (data) => {
    let predmett;
    try {
      predmett = await axioss
        .get(`https://arhiva-backend.azurewebsites.net/api/Course/GetByCode?code=${predmetCode}`)
        .then((r) => r.data);
      let response = await axioss.post(
        `https://arhiva-backend.azurewebsites.net/api/Comment/Create?postedByUsername=${Cookies.get(
          "username"
        )}&postedOnBlanketPredmet=${predmett.id}&content=${data.content}`,
        {}
      );
      response = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/Comment/GetForCourseOrBlanket?id=${predmett.id}`
      );
      setKomentari(response.data);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const refresh = async () => {
    const getComments = async () => {
      let response = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/Course/GetByCode?code=${predmetCode}`
      );
      try {
        response = await axioss.get(
          `https://arhiva-backend.azurewebsites.net/api/Comment/GetForCourseOrBlanket?id=${response.data["id"]}`
        );
        setKomentari(response.data);
      } catch (err) {
        setKomentari([]);
        setMessage("Još uvek nema komentara!");
      }
    };
    getComments();
  };

  const follow = async () => {
    const getFollowing = async () => {
      try {
        const response = await axioss.put(
          `https://arhiva-backend.azurewebsites.net/api/Course/FollowUnfollow?code=${predmetCode}&email=${Cookies.get(
            "email"
          )}`
        );
        setIsFollowing(response.data);
      } catch (err) {
        setMessage("Još uvek nema komentara!");
      }
    };
    getFollowing();
  };

  useEffect(() => {
    try {
      const getBlanketi = async () => {
        const response = await axioss.get(
          `https://arhiva-backend.azurewebsites.net/api/Blanket/GetByCourse?courseCode=${predmetCode}`,
            {
              method: "get",
              headers: { "Content-Type": "application/json" },
            }
        );
        setBlanketi(response.data);
      };
      getBlanketi();
    } catch (err) {
      console.error(err);
    }
  }, [predmetCode, axioss]);

  useEffect(() => {
    try {
      const getYears = async () => {
        const response = await axioss.get(
          `https://arhiva-backend.azurewebsites.net/api/Blanket/GetCourseYears?courseCode=${predmetCode}`
        ,{
          method: "get",
              headers: { "Content-Type": "application/json" },
        });
        setGodine(response.data.sort((a, b) => b.localeCompare(a)));
      };
      getYears();
    } catch (err) {
      console.error(err);
    }
  }, [predmetCode, axioss]);

  useEffect(() => {
    const getPredmet = async () => {
      const response = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/Course/GetByCode?code=${predmetCode}`
      ,{
        method: "get",
            headers: { "Content-Type": "application/json" },
      });
      setPredmet(response.data);
    };
    getPredmet();
  }, [predmetCode, axioss]);

  useEffect(() => {
    if (predmet?.followers.includes(Cookies.get("email"))) setIsFollowing(true);
  }, [predmet]);

  useEffect(() => {
    const r = async () => {
      await refresh();
    };
    r();
    setKorisnik(Cookies.get("role"));
  }, []);

  const filterBlanketi = (blanket) => {
    if (pismeni && usmeni) return blanket.type === "PismeniUsmeni";
    if (pismeni) return blanket.type === "Pismeni";
    if (usmeni) return blanket.type === "Usmeni";
    if (kolokvijum1) return blanket.type === "I_kolokvijum";
    if (kolokvijum2) return blanket.type === "II_kolokvijum";
    return true;
  };

  return (
    <>
      <div className="w-11/12 lg:w-3/4 m-auto my-10">
        <h1 className="text-center text-5xl md:text-7xl lg:text-8xl font-bold mb-5">
          {predmet?.name}
        </h1>
        <h2 className="text-center text-3xl lg:text-5xl mb-5">
          ESPB: {predmet?.espb}
        </h2>
        {korisnik && (
          <div
            onClick={follow}
            className={`${
              isFollowing
                ? "text-white bg-blue-500 hover:bg-white hover:border-blue-500 hover:text-blue-500"
                : "text-blue-500 bg-white hover:bg-blue-500 border-blue-500 hover:text-white"
            } p-5 font-bold ml-auto border-2 rounded-full cursor-pointer transition-all duration-500 w-fit`}
          >
            {isFollowing ? <FaBell size={30} /> : <FaBellSlash size={30} />}
          </div>
        )}
        <div className="flex gap-4">
          <h2 className="text-2xl lg:text-4xl mt-5">
            I Kolokvijum: {predmet?.kolokvijum1Date?.toString() || "N/A"}
          </h2>
          {(Cookies.get("role") === "Admin" ||
            Cookies.get("role") === "Moderator") && (
            <div className="flex gap-4">
              <div
                className="p-2 h-fit my-auto text-blue-500 hover:cursor-pointer border-blue-500 border rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-500"
                onClick={() => setShowKolokvijum1(true)}
              >
                Dodaj
              </div>
              <div
                className="p-2 h-fit my-auto text-red-500 hover:cursor-pointer border-red-500 border rounded-lg hover:bg-red-500 hover:text-white transition-all duration-500"
                onClick={() => obrisiK1()}
              >
                Obriši
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <h2 className="text-2xl lg:text-4xl mt-2">
            II Kolokvijum: {predmet?.kolokvijum2Date?.toString() || "N/A"}
          </h2>
          {(Cookies.get("role") === "Admin" ||
            Cookies.get("role") === "Moderator") && (
            <div className="flex gap-4">
              <div
                className="p-2 h-fit my-auto text-blue-500 hover:cursor-pointer border-blue-500 border rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-500"
                onClick={() => setShowKolokvijum2(true)}
              >
                Dodaj
              </div>
              <div
                className="p-2 h-fit my-auto text-red-500 hover:cursor-pointer border-red-500 border rounded-lg hover:bg-red-500 hover:text-white transition-all duration-500"
                onClick={() => obrisiK2()}
              >
                Obriši
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <h2 className="text-2xl lg:text-4xl mt-2">
            Ispit: {predmet?.ispitDate?.toString() || "N/A"}
          </h2>
          {(Cookies.get("role") === "Admin" ||
            Cookies.get("role") === "Moderator") && (
            <div className="flex gap-4">
              <div
                className="p-2 h-fit my-auto text-blue-500 hover:cursor-pointer border-blue-500 border rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-500"
                onClick={() => setShowIspit(true)}
              >
                Dodaj
              </div>
              <div
                className="p-2 h-fit my-auto text-red-500 hover:cursor-pointer border-red-500 border rounded-lg hover:bg-red-500 hover:text-white transition-all duration-500"
                onClick={() => obrisiI()}
              >
                Obriši
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-11/12 lg:w-3/4 mx-auto my-10 gap-5 grid grid-flow-row">
        <div className="grid grid-flow-col w-1/3 text-cyan-800 text-3xl">
          <div
            className={`hover:cursor-pointer ${pismeni ? "underline" : ""}`}
            onClick={() => setPismeni(!pismeni)}
          >
            Pismeni
          </div>
          <div
            className={`hover:cursor-pointer ${usmeni ? "underline" : ""}`}
            onClick={() => setUsmeni(!usmeni)}
          >
            Usmeni
          </div>
          <div
            className={`hover:cursor-pointer ${kolokvijum1 ? "underline" : ""}`}
            onClick={() => setKolokvijum1(!kolokvijum1)}
          >
            I kolokvijum
          </div>
          <div
            className={`hover:cursor-pointer ${kolokvijum2 ? "underline" : ""}`}
            onClick={() => setKolokvijum2(!kolokvijum2)}
          >
            II kolokvijum
          </div>
        </div>
        {godine.map((godina, index) => (
          <div key={index} className="my-5">
            <h2 className="text-left text-2xl sm:text-5xl lg:text-7xl font-extralight mb-5">
              {godina}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {blanketi
                ?.filter(
                  (blanket) =>
                    blanket.year === godina && filterBlanketi(blanket)
                )
                .map((blanket, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/blanketi/blanket/${blanket.id}`)}
                    className={`p-10 rounded-md text-xl text-center cursor-pointer transition-colors ${
                      blanket.type === "Pismeni"
                        ? "bg-red-400/80 hover:bg-red-400"
                        : blanket.type === "PismeniUsmeni"
                        ? "bg-orange-400/80 hover:bg-orange-400"
                        : "bg-blue-400/80 hover:bg-blue-400"
                    }`}
                  >
                    <div className="text-5xl">{blanket.term}</div>
                    <div>{blanket.type}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="w-11/12 lg:w-3/4 m-auto">
        {korisnik && (
          <div className="my-10">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(dodajKomentar)}
            >
              <h2 className="text-xl font-semibold mb-2">Dodaj komentar</h2>
              <input
                type="text"
                className="p-5 h-10 bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600"
                placeholder="Komentar..."
                {...register("content", { required: true })}
              />
              <button
                type="submit"
                className="self-end bg-blue-500 rounded-md text-white p-3 w-1/4"
              >
                Objavi
              </button>
            </form>
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold mb-5">Komentari</h2>
          <hr className="mb-5" />
          {message}
          {komentari?.map((komentar, index) => (
            <Komentar key={index} komentar={komentar} onDelete={refresh} />
          ))}
        </div>
      </div>
      {showKolokvijum1 && (
        <Modal open={showKolokvijum1} onClose={() => setShowKolokvijum1(false)}>
          <form
            onSubmit={handleSubmitD(dodajKolokvijum1)}
            className="flex flex-col space-y-7 bg-white p-10 rounded-xl"
          >
            <h3 className="text-center text-2xl font-bold">Dodaj datum</h3>
            <input
              type="text"
              {...registerD("date", { required: true })}
              className="p-2 bg-slate-800 text-white rounded-lg"
            />
            <button
              type="submit"
              className="m-2 p-2 hover:bg-slate-700 w-3/4 mx-auto bg-slate-800 text-white rounded-md"
            >
              Dodaj I kolokvijum!
            </button>
          </form>
        </Modal>
      )}
      {showKolokvijum2 && (
        <Modal open={showKolokvijum2} onClose={() => setShowKolokvijum2(false)}>
          <form
            onSubmit={handleSubmitD(dodajKolokvijum2)}
            className="flex flex-col space-y-7 bg-white p-10 rounded-xl"
          >
            <h3 className="text-center text-2xl font-bold">Dodaj datum</h3>
            <input
              type="text"
              {...registerD("date", { required: true })}
              className="p-2 bg-slate-800 text-white rounded-lg"
            />
            <button
              type="submit"
              className="m-2 p-2 hover:bg-slate-700 w-3/4 mx-auto bg-slate-800 text-white rounded-md"
            >
              Dodaj II kolokvijum!
            </button>
          </form>
        </Modal>
      )}
      {showIspit && (
        <Modal open={showIspit} onClose={() => setShowIspit(false)}>
          <form
            onSubmit={handleSubmitD(dodajIspit)}
            className="flex flex-col space-y-7 bg-white p-10 rounded-xl"
          >
            <h3 className="text-center text-2xl font-bold">Dodaj datum</h3>
            <input
              type="text"
              {...registerD("date", { required: true })}
              className="p-2 bg-slate-800 text-white rounded-lg"
            />
            <button
              type="submit"
              className="m-2 p-2 hover:bg-slate-700 w-3/4 mx-auto bg-slate-800 text-white rounded-md"
            >
              Dodaj Ispit!
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Predmet;
