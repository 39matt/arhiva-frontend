import { useEffect, useState } from "react";
import client from "../../common/axios";
import Cookies from "js-cookie";
import Modal from "../../components/modals/Modal";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../common/useAxiosPrivate";

const NeodobreniBlanketi = () => {
  const [neodobreniBlanketi, setNeodobreniBlanketi] = useState<Blanket[]>();
  const [showSlika, setShowSlika] = useState(false);
  const [slikaUrl, setSlikaUrl] = useState("");
  const navigate = useNavigate();
  const axioss = useAxiosPrivate();

  const odobriBlanket = async (id) => {
    let response = await axioss.put(
      `http://localhost:5073/api/Blanket/Approve?id=${id}`,
      {}
    );
    response = await axioss.get(
      `http://localhost:5073/api/Blanket/GetUnapproved`
    );
    setNeodobreniBlanketi(response.data);
  };
  const obrisiBlanket = async (courseCode, year, term, type) => {
    let response = await axioss.delete(
      `http://localhost:5073/api/Blanket/Delete?courseCode=${courseCode}&year=${year}&term=${term}&type=${type}`,
      {}
    );
    response = await axioss.get(
      `http://localhost:5073/api/Blanket/GetUnapproved`
    );
    setNeodobreniBlanketi(response.data);
  };

  useEffect(() => {
    if (Cookies.get("role") === "Korisnik") navigate("/");
    const getBlanketi = async () => {
      const response = await axioss.get(
        `http://localhost:5073/api/Blanket/GetUnapproved`
      );
      setNeodobreniBlanketi(response.data);
    };
    getBlanketi();
  }, []);

  return (
    <>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center my-10 text-black">
        Neodobreni blanketi
      </h1>
      <div className="mx-5 sm:mx-10 my-10">
        <div className="w-full lg:w-3/4 m-auto bg-slate-800 rounded-t-xl p-5 sm:p-10 text-white">
          <div className="flex gap-3 sm:gap-5">
            <div className="flex justify-between w-2/3 font-bold">
              <div>Predmet</div>
              <div>Rok</div>
              <div>Tip</div>
              <div>Godina</div>
            </div>
            <div className="w-1/3 flex"></div>
          </div>
          <div className="h-[2px] mt-3 bg-black w-full"></div>
        </div>
        {neodobreniBlanketi?.map((blanket, index) => {
          const isLast = index === neodobreniBlanketi.length - 1;
          return (
            <div
              key={index}
              className={`w-full lg:w-3/4 m-auto bg-slate-800 ${
                isLast ? "rounded-b-xl" : ""
              } text-white p-5 sm:p-10`}
            >
              <div className="flex gap-3 sm:gap-5">
                <div className="flex justify-between w-2/3">
                  <div>{blanket.courseCode}</div>
                  <div>{blanket.term}</div>
                  <div>{blanket.type}</div>
                  <div>{blanket.year}</div>
                </div>
                <div className="w-1/3 flex">
                  <div
                    className="w-fit m-auto text-blue-500 hover:cursor-pointer"
                    onClick={() => {
                      setShowSlika(true);
                      setSlikaUrl(blanket.documentUrl);
                    }}
                  >
                    Slika
                  </div>
                  <div
                    className="w-fit p-2 m-auto text-blue-500 hover:cursor-pointer border-blue-500 border rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-500"
                    onClick={() => {
                      odobriBlanket(blanket.id);
                    }}
                  >
                    Odobri
                  </div>
                  <div
                    className="w-fit p-2 m-auto text-red-500 hover:cursor-pointer border-red-500 border rounded-lg hover:bg-red-500 hover:text-white transition-all duration-500"
                    onClick={() => {
                      obrisiBlanket(
                        blanket.courseCode,
                        blanket.year,
                        blanket.term,
                        blanket.type
                      );
                    }}
                  >
                    Obriši
                  </div>
                </div>
              </div>
              {!isLast && <div className="h-[2px] mt-3 bg-black w-full"></div>}
            </div>
          );
        })}
      </div>
      <Modal
        open={showSlika}
        onClose={() => {
          setShowSlika(false);
        }}
      >
        <img src={slikaUrl} alt="Slika dokumenta" />
      </Modal>
    </>
  );
};

export default NeodobreniBlanketi;
