import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../common/useAxiosPrivate";
import Cookies from "js-cookie";
import { FaRegTrashAlt } from "react-icons/fa";

const Komentar = ({ komentar, onDelete }) => {
  const [korisnik, setKorisnik] = useState<User>();
  const axioss = useAxiosPrivate();

  const obrisiKomentar = () => {
    const obrisi = async () => {
      await axioss.delete(
        `http://localhost:5073/api/Comment/Delete?by=${komentar.postedById}&on=${komentar.postedOnId}&content=${komentar.content}`,
        {}
      );
    };
    obrisi();
  };

  useEffect(() => {
    const getKorisnik = async () => {
      const response = await axioss.get(
        `http://localhost:5073/api/User/GetById?id=${komentar.postedById}`
      );
      setKorisnik(response.data);
    };
    getKorisnik();
  }, []);

  return (
    <>
      <div className="w-full m-5 flex bg-white rounded-lg text-gray-800">
        <div className="flex items-center">
          <img
            src={korisnik?.avatarUrl}
            alt="korisnik slika"
            className="w-10 h-10 m-2 rounded-full ring-2"
          />
        </div>
        <div className="flex flex-col grow ml-4">
          <p className="font-bold h-fit">{korisnik?.username}</p>
          <p>{komentar.content}</p>
        </div>
        {Cookies.get("username") === korisnik?.username && (
          <div
            className="m-5 text-red-600 hover:cursor-pointer flex items-center"
            onClick={() => {
              obrisiKomentar();
              onDelete();
            }}
          >
            <FaRegTrashAlt size={20} />
          </div>
        )}
      </div>
    </>
  );
};

export default Komentar;
