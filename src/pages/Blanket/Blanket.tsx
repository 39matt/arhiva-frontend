import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { BiLike } from "react-icons/bi";
import axios from "axios";
import { useForm } from "react-hook-form";
import Komentar from "../../components/common/Komentar/Komentar";
import useAxiosPrivate from "../../common/useAxiosPrivate";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "../../components/modals/Modal";

const Blanket: React.FC = () => {
  const [blanket, setBlanket] = useState<Blanket>();
  const [predmet, setPredmet] = useState<Predmet>();
  const [resenja, setResenja] = useState<Resenje[]>([]);
  const [komentari, setKomentari] = useState<Komentar[]>([]);
  const [dodajResenjeOpen, setDodajResenjeOpen] = useState(false);
  const {
    register: registerResenje,
    reset: resetResenje,
    handleSubmit: handleSubmitResenje,
  } = useForm<IDodajResenjeFormInput>();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(-1);
  const [message, setMessage] = useState("");
  const [resenjeMessage, setResenjeMessage] = useState("");
  const [korisnik, setKorisnik] = useState<string | undefined>(undefined);
  const { blanketId } = useParams<{ blanketId: string }>();
  const { register, handleSubmit } = useForm<Komentar>();
  const axioss = useAxiosPrivate();

  const refresh = async () => {
    try {
      const response = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/Blanket/GetById?id=${blanketId}`, { headers: { "Content-Type": "application/json" }, withCredentials: false}
      );
      const commentResponse = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/Comment/GetForCourseOrBlanket?id=${response.data.id}`, { headers: { "Content-Type": "application/json" }, withCredentials: false}
      );
      setKomentari(commentResponse.data);
    } catch (err) {
      setKomentari([]);
      setMessage("Još uvek nema komentara!");
    }
  };

  const dodajKomentar = async (data: Komentar) => {
    try {
      await axioss.post(
        `https://arhiva-backend.azurewebsites.net/api/Comment/Create?postedByUsername=${Cookies.get(
          "username"
        )}&postedOnBlanketPredmet=${blanket?.id}&content=${data.content}`, { headers: { "Content-Type": "application/json" }, withCredentials: false}
      );
      const response = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/Comment/GetForCourseOrBlanket?id=${blanket?.id}`, { headers: { "Content-Type": "application/json" }, withCredentials: false}
      );
      setKomentari(response.data);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const dodajResenje = async (data: IDodajResenjeFormInput) => {
    const formData = new FormData();
    formData.append("file", data.document[0]);
    const url = `https://arhiva-backend.azurewebsites.net/api/Blanket/AddSolution?blanketId=${blanketId}`;
    try {
      const response = await axioss.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      resetResenje();
      setDodajResenjeOpen(false);
      setResenjeMessage(response.data);
    } catch (error) {
      console.error("Greska pri uploadovanju!", error);
    }
  };

  const like = async () => {
    try {
      const response = await axioss.put(
        `https://arhiva-backend.azurewebsites.net/api/Blanket/Like?id=${
          blanket?.id
        }&username=${Cookies.get("username")}`,
        {}
      );
      setLikes(response.data);
      const isLikedResponse = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/User/IsLiked?username=${Cookies.get(
          "username"
        )}&blanketId=${blanket?.id}`
      );
      setIsLiked(isLikedResponse.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data);
      }
    }
  };

  useEffect(() => {
    const getKomentari = async () => {
      const response = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/Comment/GetForCourseOrBlanket?id=${blanketId}`, { headers: { "Content-Type": "application/json" }, withCredentials: false}
      );
      setKomentari(response.data);
    };
    getKomentari();
    setKorisnik(Cookies.get("role"));
  }, [blanketId, axioss]);

  useEffect(() => {
    const getBlanket = async () => {
      const response = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/Blanket/GetById?id=${blanketId}`, { headers: { "Content-Type": "application/json" }, withCredentials: false}
      );
      setBlanket(response.data);
      setLikes(response.data.likes);
      const resenjaResponse = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/Solution/GetBlanketApproved?blanketId=${blanketId}`, { headers: { "Content-Type": "application/json" }, withCredentials: false}
      );
      setResenja(resenjaResponse.data);
    };
    getBlanket();
  }, [blanketId, axioss]);

  useEffect(() => {
    const getPredmet = async () => {
      if (blanket) {
        const response = await axioss.get(
          `https://arhiva-backend.azurewebsites.net/api/Course/GetByCode?code=${blanket.courseCode}`, { headers: { "Content-Type": "application/json" }, withCredentials: false}
        );
        setPredmet(response.data);
      }
    };
    getPredmet();
  }, [blanket?.courseCode, axioss, blanket]);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    arrows: true,
  };

  return (
    <div>
      <div className="w-5/6 lg:w-3/4 p-10 sm:p-24 pb-0 m-auto bg-slate-800 text-white rounded-t-lg grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="w-full m-auto">
          <img
            src={blanket?.documentUrl}
            alt="blanket"
            className="w-full rounded"
          />
        </div>
        <div className="flex flex-col justify-between">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold underline underline-offset-8 mb-4">
            Osnovne informacije
          </h1>
          <div className="font-semibold text-lg sm:text-xl">
            Predmet: <span className="font-light">{predmet?.name}</span>
          </div>
          <div className="font-semibold text-lg sm:text-xl">
            Ispitni rok: <span className="font-light">{blanket?.term}</span>
          </div>
          <div className="font-semibold text-lg sm:text-xl">
            Tip: <span className="font-light">{blanket?.type}</span>
          </div>
        </div>
      </div>
      <div className="w-5/6 lg:w-3/4 mb-10 mx-auto rounded-b-lg bg-slate-700 flex justify-center p-5">
        <div>
          <BiLike
            size={50}
            className={`${
              isLiked ? "text-white" : "text-black hover:text-white"
            } hover:cursor-pointer`}
            onClick={like}
          />
          <p className="text-center">{likes}</p>
        </div>
      </div>
      <div className="w-5/6 lg:w-3/4 mb-10 mx-auto rounded-lg bg-slate-800 p-5 text-white">
        <h1 className="text-5xl mb-4 text-center">Rešenja</h1>
        {resenja && resenja.length > 0 && (
          <div>
            <Slider {...settings}>
              {resenja.map((resenje, index) => (
                <div key={index} className="w-1/2 m-auto">
                  <img
                    src={resenje.solutionUrl}
                    alt="resenje"
                    className="w-1/2 m-auto h-auto"
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
        <div>
          {resenja.length === 0 && (
            <p className="text-center mb-4">Još uvek nema rešenja</p>
          )}

          <div
            className="p-5 bg-blue-900/80 rounded-lg w-fit m-auto hover:cursor-pointer"
            onClick={() => setDodajResenjeOpen(true)}
          >
            Dodaj rešenje!
          </div>
          <p>{resenjeMessage}</p>
        </div>
      </div>
      <div className="w-5/6 lg:w-3/4 m-auto p-5 sm:p-10 rounded-lg bg-slate-800 text-white flex flex-col lg:flex-row">
        {korisnik && (
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Dodaj komentar
            </h2>
            <hr className="mb-4" />
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(dodajKomentar)}
            >
              <input
                type="text"
                className="h-10 bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600"
                placeholder="Komentar..."
                {...register("content", { required: true })}
              />
              <button
                type="submit"
                className="self-end bg-blue-500 rounded-md text-white p-3"
              >
                Objavi
              </button>
            </form>
          </div>
        )}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Komentari</h2>
          <hr className="mb-4" />
          {message}
          {komentari?.map((komentar, index) => (
            <Komentar key={index} komentar={komentar} onDelete={refresh} />
          ))}
        </div>
      </div>
      {dodajResenjeOpen && (
        <Modal
          open={dodajResenjeOpen}
          onClose={() => setDodajResenjeOpen(false)}
        >
          <form
            onSubmit={handleSubmitResenje(dodajResenje)}
            className="flex flex-col space-y-7 bg-white p-10 rounded-xl"
          >
            <h3 className="text-center text-2xl font-bold">Novo rešenje</h3>
            <input
              type="file"
              {...registerResenje("document", { required: true })}
              className="p-2 bg-slate-800 text-white rounded-lg"
            />
            <button
              type="submit"
              className="m-2 p-2 hover:bg-slate-700 w-3/4 mx-auto bg-slate-800 text-white rounded-md"
            >
              Dodaj rešenje!
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Blanket;
