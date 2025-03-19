import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Godine from "./Godine";
import axios from "axios";
import Cookies from "js-cookie";
import { MdOutlinePostAdd } from "react-icons/md";

async function getAllMajors() {
  const response = await axios.get("http://localhost:5073/api/Major/GetAll", {
    method: "get",
    headers: { "Content-Type": "application/json" },
  });
  //console.log(response.data.map((x) => x.name));
  return response.data;
}

const Smerovi: React.FC = () => {
  const navigate = useNavigate();
  const [smerovi, setSmerovi] = useState<Smer[]>();
  const [showGodine, setShowGodine] = useState("");
  const role = Cookies.get("role");

  useEffect(() => {
    async function set() {
      setSmerovi(await getAllMajors());
    }
    set();
  }, []);

  return (
    <>
      {role && (
        <div className="w-full m-10 ">
          <div
            className="p-5 h-fit w-fit hover:cursor-pointer text-white bg-blue-900/80 hover:bg-blue-900 border-slate-700 rounded-md"
            onClick={() => navigate("/blanketi/noviBlanket")}
          >
            Dodaj novi blanket <MdOutlinePostAdd size={40} className="inline" />
          </div>
        </div>
      )}

      <div className="bg-white h-3/4 w-3/4 my-20 mx-auto grid grid-cols-1 text-center gap-5 sm:gap-7 lg:gap-10 font-Oswald">
        <div
          className="text-left font-extralight text-3xl sm:text-6xl lg:text-8xl hover:tracking-widest hover:cursor-pointer transition-all duration-1000 "
          onClick={() => navigate("/blanketi/OS")}
        >
          I godina
        </div>
        {smerovi?.map((smer) => {
          if (smer.code !== "OS")
            return (
              <>
                <div
                  key={smer.num.toString()}
                  className={`text-left text-nowrap font-extralight text-2xl sm:text-5xl lg:text-7xl w-fit max-w-full  hover:cursor-pointer transition-all duration-1000 ${
                    smer.code === "EKM"
                      ? "hover:tracking-wide lg:hover:tracking-wider"
                      : "hover:tracking-wide sm:hover:tracking-wider lg:hover:tracking-widest"
                  }`}
                  onClick={() => {
                    if (showGodine === smer.code) {
                      setShowGodine("");
                    } else setShowGodine(smer.code);
                  }}
                >
                  {smer.name}
                </div>
                {/* {showGodine === smer.code && (
                <div className="flex flex-row gap-5 transition-all">
                  <Godine code={smer.code} />
                </div>
              )} */}

                <div
                  className={`flex flex-row gap-10 transition-all ease-in-out duration-500 ${
                    showGodine === smer.code
                      ? "opacity-100 block"
                      : "opacity-0 hidden"
                  }`}
                >
                  <Godine code={smer.code} />
                </div>
              </>
            );
        })}

        {/* {smerovi?.map((smer) => {
          <div
            key={smer.num.toString()}
            className="text-left font-extralight text-7xl hover:tracking-widest hover:cursor-pointer transition-all duration-1000"
          >
            {smer.name}
          </div>;
          if (smer.code != "OS")
            if (smerovi.length % 2 !== 1 && smer.num === 2) {
              return (
                <div
                  key={smer.num.toString()}
                  className="w-full h-full col-span-1 lg:col-span-2 group cursor-pointer"
                >
                  <div className="group-active:[transform:rotateY(180deg)] group-hover:[transform:rotateY(180deg)] [transformStyle:preserve-3d] w-full h-full duration-1000 ">
                    <div
                      className="w-full h-full p-20 transition-all duration-500 [backfaceVisibility:hidden] bg-slate-900 bg-no-repeat bg-cover"
                      //style={{ backgroundImage: `url(${smer.img})` }}
                    >
                      <div className="text-6xl font-bold text-white">
                        {smer.name}
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 p-20 [transform:rotateY(180deg)] [backfaceVisibility:hidden] bg-slate-900 text-white w-full h-full bg-no-repeat">
                      <div className="w-full h-full grid grid-cols-2">
                        <Godine code={smer.code} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else
              return (
                <div
                  key={smer.num.toString()}
                  className="w-full h-full col-span-2 lg:col-span-1 group cursor-pointer"
                >
                  <div className="group-hover:[transform:rotateY(180deg)] [transformStyle:preserve-3d] w-full h-full duration-1000 ">
                    <div
                      className="w-full h-full p-20 transition-all duration-500 [backfaceVisibility:hidden] bg-slate-900 bg-no-repeat bg-cover"
                      //style={{ backgroundImage: `url(${smer.img})` }}
                    >
                      <div className="text-5xl font-bold text-white">
                        {smer.name}
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 p-20 [transform:rotateY(180deg)] [backfaceVisibility:hidden] bg-slate-900 text-white w-full h-full bg-cover bg-no-repeat">
                      <div className="grid grid-cols-2 m-auto">
                        <Godine code={smer.code} />
                      </div>
                    </div>
                  </div>
                </div>
              );
        })} */}
      </div>
    </>
  );
};

export default Smerovi;
