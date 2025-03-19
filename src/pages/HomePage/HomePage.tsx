import config from "../../config/config.json";
import { FaArchive } from "react-icons/fa";
import { LuMousePointerClick } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";

const HomePage: React.FC = () => {
  const { mainHero, threeSection } = config;

  return (
    <>
      <div className={`m-16 grid grid-cols-1 gap-10`}>
        <div
          className="w-full bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${mainHero.img})` }}
        >
          <div className="bg-gradient-to-b from-slate-900 h-full rounded-lg">
            <h1 className="pt-32 text-center text-white font-extrabold text-7xl lg:text-8xl">
              {mainHero.title}
            </h1>
            <h3 className="py-12 text-center text-gray-200 font-bold text-4xl">
              {mainHero.subtitle}
            </h3>
            <p className="w-1/2 text-center m-auto text-yellow-600 font-semibold text-xl">
              {mainHero.description}
            </p>
            <p className="text-center my-16 p-10">
              <a
                className="m-auto px-7 py-5 border rounded-2xl border-red-600 text-red-600 font-bold text-4xl bg-transparent hover:bg-red-600 hover:text-white hover:px-9 hover:py-7 hover:cursor-pointer transition-all duration-300"
                href={mainHero.primaryAction.href}
              >
                {mainHero.primaryAction.text}
              </a>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {threeSection.map((x, index) => {
            const Icon =
              x.icon === "archive"
                ? FaArchive
                : x.icon === "simple"
                ? LuMousePointerClick
                : x.icon === "community"
                ? FaPeopleGroup
                : null;
            return (
              <div
                key={index}
                className={`${
                  index % 2 == 0
                    ? "bg-white text-gray-800 border-4 border-slate-900"
                    : "bg-slate-900 text-white"
                } text-center px-5 py-10 grid grid-cols-1 rounded-lg`}
              >
                {Icon && (
                  <Icon className="hover:text-white mx-auto" size={50} />
                )}
                <h3 className="text-2xl font-bold">{x.title}</h3>
                <p className="text-lg">{x.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HomePage;
