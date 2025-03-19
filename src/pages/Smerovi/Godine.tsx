import { useNavigate } from "react-router-dom";
import config from "../../config/config.json";

interface GodineProps {
  code: string;
}

const Godine: React.FC<GodineProps> = ({ code }: GodineProps) => {
  const navigate = useNavigate();
  const godine = config.blanketi.godine;
  return godine?.map((godina) => {
    return (
      <div
        key={godina.id}
        onClick={() => navigate(`/blanketi/${code}/${godina.id}`)}
        className="mb-10 text-left text-nowrap font-normal text-l sm:text-2xl lg:text-3xl hover:cursor-pointer hover:underline transition-all duration-1000 "
      >
        {godina.naziv}
      </div>
    );
  });
};

export default Godine;
