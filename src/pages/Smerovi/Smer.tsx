import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Godine from "./Godine";
import axios from "axios";

async function getMajorByCode(code: string) {
  return await axios
    .get(`https://arhiva-backend.azurewebsites.net/api/Major/GetByCode?code=${code}`, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => response.data);
}

const Smer: React.FC = () => {
  const navigate = useNavigate();
  let { smerCode } = useParams();
  const [smer, setSmer] = useState<Smer>({
    name: "Računarstvo i informatika",
    num: 2,
    img: "",
    code: "RII",
  });

  useEffect(() => {
    if (smerCode === "OS") navigate("/blanketi/OS/1");
    const fetchData = async () => {
      const data = await getMajorByCode(smerCode!);
      setSmer(data);
    };

    fetchData();
  }, [smerCode]);
  return (
    <div
      key={smer.num.toString()}
      className="w-3/4 mx-auto h-full col-span-1 lg:col-span-2 group cursor-pointer"
    >
      <div className="group-active:[transform:rotateY(180deg)] group-hover:[transform:rotateY(180deg)] [transformStyle:preserve-3d] w-full h-full duration-1000 ">
        <div
          className="w-full h-full p-20 transition-all duration-500 [backfaceVisibility:hidden] bg-slate-600 bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${smer.img})` }}
        >
          <div className="text-2xl font-bold">{smer.name}</div>
        </div>
        <div
          className="absolute top-0 left-0 p-20 [transform:rotateY(180deg)] [backfaceVisibility:hidden] bg-slate-700 text-white w-full h-full bg-no-repeat"
          style={{ backgroundImage: `url(${smer.img})` }}
        >
          <div className="w-full h-full grid grid-cols-2">
            <Godine code={smer.code} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Smer;
