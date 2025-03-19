import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../common/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const NoviBlanket: React.FC = () => {
  const { register,  handleSubmit } = useForm<IDodajBlanketFormInput>();
  const [message, setMessage] = useState("");
  const [majors, setMajors] = useState<Smer[]>();
  const [courses, setCourses] = useState<Predmet[]>();
  const [majorSelected, setMajorSelected] = useState("");
  const [godinaSelected, setGodinaSelected] = useState("");
  const axioss = useAxiosPrivate();
  const navigate = useNavigate();

  async function getAllMajors() {
    const response = await axioss.get("https://arhiva-backend.azurewebsites.net/api/Major/GetAll");
    return response.data;
  }

  const dodajBlanket = async (data) => {
    const formData = new FormData();
    formData.append("file", data.document[0]);
    const url = `/api/Blanket/CreateUpload?CourseCode=${data.courseCode}&Term=${
      data.term
    }&Year=${data.year}&Type=${data.type}&username=${Cookies.get("username")}`;
    try {
      const response = await axioss.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data);
      return response.data;
    } catch (error) {
      console.error("Greska pri uploadovanju!", error);
    }
  };

  const getPredmeti = async (major, godina) => {
    const response = await axioss.get(
      `/api/MajorCourse/GetCoursesInMajorByYear?majorCode=${major}&year=${godina}`
    );
    setCourses(response.data);
  };

  useEffect(() => {
    async function set() {
      setMajors(await getAllMajors());
    }
    set();

    if (
      Cookies.get("role") !== "Moderator" &&
      Cookies.get("role") !== "Admin" &&
      Cookies.get("role") !== "Korisnik"
    )
      navigate("/");
  }, []);
  return (
    <>
      <div className="w-3/4 m-auto bg-slate-800 text-white rounded-xl p-10">
        <h1 className="text-5xl text-center mb-10">Novi blanket</h1>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(dodajBlanket)}
        >
          <select
            defaultValue=""
            id="selectMajor"
            className="p-4 m-auto w-1/2 lg:w-3/4 bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600"
            onChange={(e) => setMajorSelected(e.target.value)}
          >
            <option value="" disabled>
              Odaberi smer...
            </option>
            {majors?.map((major, index) => {
              return (
                <option key={index} value={major.code}>
                  {major.name}
                </option>
              );
            })}
          </select>
          <select
            defaultValue=""
            id="selectGodina"
            className={`${
              !majorSelected ? "hidden" : ""
            } p-4 m-auto w-1/2 lg:w-3/4 bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600 `}
            onChange={async (e) => {
              setGodinaSelected(e.target.value);
              await getPredmeti(majorSelected, e.target.value);
            }}
          >
            <option value="" disabled>
              Odaberi godinu...
            </option>
            <option value="2">II godina</option>
            <option value="3">III godina</option>
            <option value="4">IV godina</option>
          </select>
          <select
            defaultValue=""
            id="selectMajor"
            className={`${
              !godinaSelected ? "hidden" : ""
            } p-2 m-auto w-1/2 lg:w-3/4 bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600`}
            {...register("courseCode", { required: true })}
          >
            <option value="" disabled>
              Odaberi predmet...
            </option>
            {courses?.map((course, index) => {
              return (
                <option key={index} value={course.code}>
                  {course.name}
                </option>
              );
            })}
          </select>
          <select
            defaultValue=""
            id="selectYear"
            className="p-4 m-auto w-1/2 lg:w-3/4 bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600"
            {...register("year", { required: true })}
          >
            <option value="" disabled>
              Izaberi godinu...
            </option>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
          <select
            defaultValue=""
            id="selectTerm"
            className="p-4 m-auto w-1/2 lg:w-3/4 bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600"
            {...register("term", { required: true })}
          >
            <option value="" disabled>
              Izaberi rok...
            </option>
            <option value="Januar">Januar</option>
            <option value="April">April</option>
            <option value="Jun">Jun</option>
            <option value="Jun2">Jun2</option>
            <option value="Septembar">Septembar</option>
            <option value="Oktobar">Oktobar</option>
            <option value="Oktobar2">Oktobar2</option>
          </select>
          <select
            defaultValue=""
            id="selectType"
            className="p-4 m-auto w-1/2 lg:w-3/4 bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600"
            {...register("type", { required: true })}
          >
            <option value="" disabled>
              Izaberi tip...
            </option>
            <option value="Pismeni">Pismeni</option>
            <option value="Usmeni">Usmeni</option>
            <option value="PismeniUsmeni">PismeniUsmeni</option>
            <option value="I_kolokvijum">I kolokvijum</option>
            <option value="II_kolokvijum">II kolokvijum</option>
          </select>
          <input
            type="file"
            className="p-4 m-auto w-1/2 lg:w-3/4 bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600"
            {...register("document", { required: true })}
          />
          <p
            className={`${
              message.indexOf("Uspesno") > -1
                ? "text-green-500"
                : "text-red-500"
            } text-center text-xl`}
          >
            {message}
          </p>
          <button
            type="submit"
            className="w-1/2 m-auto bg-blue-500/80 hover:bg-blue-500 rounded-md text-white p-3 font-bold text-xl"
          >
            Unesi blanket u bazu
          </button>
        </form>
      </div>
    </>
  );
};

export default NoviBlanket;
