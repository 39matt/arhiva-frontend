import { useEffect, useState } from "react";
import axios from "../../common/axios";

const SviKorisnici = () => {
  const [korisnici, setKorisnici] = useState<User[]>();

  useEffect(() => {
    const getKorisnici = async () => {
      const response = await axios.get("http://localhost:5073/api/User/GetAll");
      setKorisnici(response.data);
    };
    getKorisnici();
  }, []);

  return (
    <>
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl text-center font-bold m-10">
        Svi korisnici
      </h1>
      <div className="w-11/12 sm:w-3/4 m-auto grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3  bg-slate-900 p-10 sm:p-20 md:p-30 lg:p-40 rounded-2xl">
        {korisnici?.map((korisnik, index) => {
          return (
            <div
              key={index}
              className="bg-white hover:bg-slate-200 rounded-lg text-slate-800 p-5 sm:p-6 md:p-8 lg:p-10 truncate"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl text-center font-bold">
                {korisnik.username}
              </h2>
              <img
                src={korisnik.avatarUrl}
                alt="pfp"
                className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 m-auto rounded-full"
              />
              <p className="text-sm sm:text-base md:text-lg">
                <span className="font-bold">Ime:</span> {korisnik.name}
              </p>
              <p className="text-sm sm:text-base md:text-lg">
                <span className="font-bold">Preizme:</span> {korisnik.surname}
              </p>
              <p className="text-sm sm:text-base md:text-lg">
                <span className="font-bold">Email:</span> {korisnik.email}
              </p>
              <p className="text-sm sm:text-base md:text-lg">
                <span className="font-bold">Broj telefona:</span>{" "}
                {korisnik.phoneNumber}
              </p>
              <p className="text-sm sm:text-base md:text-lg">
                <span className="font-bold">Karma:</span> {korisnik.karma}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SviKorisnici;
