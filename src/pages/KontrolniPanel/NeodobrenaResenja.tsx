import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Modal from "../../components/modals/Modal";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../common/useAxiosPrivate";

const NeodobreniBlanketi = () => {
  const [neodobrenaResenja, setNeodobrenaResenja] = useState<Resenje[]>();
  const [blanketi, setBlanketi] = useState({});
  const [showBlanket, setShowBlanket] = useState(false);
  const [showResenje, setShowResenje] = useState(false);
  const [blanketSlikaUrl, setBlanketSlikaUrl] = useState("");
  const [resenjeSlikaUrl, setResenjeSlikaUrl] = useState("");
  const navigate = useNavigate();
  const axioss = useAxiosPrivate();

  const odobriResenje = async (id) => {
    let response = await axioss.put(
      `https://arhiva-backend.azurewebsites.net/api/Solution/Approve?solutionId=${id}`,
      {}
    );
    response = await axioss.get(
      `https://arhiva-backend.azurewebsites.net/api/Solution/GetUnapproved`
    );
    setNeodobrenaResenja(response.data);
  };

  const obrisiResenje = async (id) => {
    let response = await axioss.delete(
      `https://arhiva-backend.azurewebsites.net/api/Solution/Delete?solutionId=${id}`,
      {}
    );
    response = await axioss.get(
      `https://arhiva-backend.azurewebsites.net/api/Solution/GetUnapproved`
    );
    setNeodobrenaResenja(response.data);
  };

  useEffect(() => {
    if (Cookies.get("role") === "Korisnik") navigate("/");
    const getResenja = async () => {
      const response = await axioss.get(
        `https://arhiva-backend.azurewebsites.net/api/Solution/GetUnapproved`
      );
      setNeodobrenaResenja(response.data);

      // Fetch all associated blanketi
      const blanketiData = await Promise.all(
        response.data.map((resenje) =>
          axioss.get(
            `https://arhiva-backend.azurewebsites.net/api/Blanket/GetById?id=${resenje.blanketId}`
          )
        )
      );
      const blanketiMap = {};
      blanketiData.forEach((response) => {
        blanketiMap[response.data.id] = response.data;
      });
      setBlanketi(blanketiMap);
    };
    getResenja();
  }, [axioss, navigate]);

  return (
    <>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center my-10 text-black">
        Neodobrena resenja
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
        {neodobrenaResenja?.map((resenje, index) => {
          const isLast = index === neodobrenaResenja.length - 1;
          const blanket = blanketi[resenje.blanketId];
          return (
            <div
              key={index}
              className={`w-full lg:w-3/4 m-auto bg-slate-800 ${
                isLast ? "rounded-b-xl" : ""
              } text-white p-5 sm:p-10`}
            >
              <div className="flex gap-3 sm:gap-5">
                <div className="flex justify-between w-2/3">
                  <div>{blanket?.courseCode}</div>
                  <div>{blanket?.term}</div>
                  <div>{blanket?.type}</div>
                  <div>{blanket?.year}</div>
                </div>
                <div className="w-1/3 flex">
                  <div
                    className="w-fit m-auto text-blue-500 hover:cursor-pointer"
                    onClick={() => {
                      setShowBlanket(true);
                      setBlanketSlikaUrl(blanket?.documentUrl);
                    }}
                  >
                    Blanket
                  </div>
                  <div
                    className="w-fit m-auto text-blue-500 hover:cursor-pointer"
                    onClick={() => {
                      setShowResenje(true);
                      setResenjeSlikaUrl(resenje.solutionUrl);
                    }}
                  >
                    Resenje
                  </div>
                  <div
                    className="w-fit p-2 m-auto text-blue-500 hover:cursor-pointer border-blue-500 border rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-500"
                    onClick={() => {
                      odobriResenje(resenje.id);
                    }}
                  >
                    Odobri
                  </div>
                  <div
                    className="w-fit p-2 m-auto text-red-500 hover:cursor-pointer border-red-500 border rounded-lg hover:bg-red-500 hover:text-white transition-all duration-500"
                    onClick={() => {
                      obrisiResenje(resenje.id);
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
        open={showBlanket}
        onClose={() => {
          setShowBlanket(false);
        }}
      >
        <img src={blanketSlikaUrl} alt="Slika blanketa" />
      </Modal>
      <Modal
        open={showResenje}
        onClose={() => {
          setShowResenje(false);
        }}
      >
        <img src={resenjeSlikaUrl} alt="Slika resenja" />
      </Modal>
    </>
  );
};

export default NeodobreniBlanketi;
