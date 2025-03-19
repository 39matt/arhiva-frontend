import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

async function getPredmeti(smer: string, godina: number) {
  return await axios
    .get(
      `https://arhiva-backend.azurewebsites.net/api/MajorCourse/GetCoursesInMajorByYear?majorCode=${smer}&year=${godina}`,
      { headers: { "Content-Type": "application/json" } }
    )
    .then((r) => r.data);
}
const Predmeti: React.FC = () => {
  const [predmeti, setPredmeti] = useState<Predmet[]>();
  const { smerCode, smerGodina } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPredmeti = async () => {
      const data = await getPredmeti(smerCode!, +smerGodina!);
      setPredmeti(data);
      //console.log(data);
    };

    fetchPredmeti();
  }, []);

  return (
    <>
      <h1 className="text-9xl text-center font-bold">Predmeti</h1>
      <div className="w-3/4 m-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
        {predmeti?.map((p, index) => {
          return (
            <div
              key={index}
              className="bg-white text-gray-800 border-4 border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-1000 m-10 text-center text-2xl cursor-pointer px-20 py-10 flex justify-center items-center"
              onClick={() =>
                navigate(`/blanketi/${smerCode}/${smerGodina}/${p.code}`)
              }
            >
              {p.name}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Predmeti;
