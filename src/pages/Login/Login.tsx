import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import sleep from "../../common/sleep";
import useAxiosPrivate from "../../common/useAxiosPrivate";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInput>();
  const [successfulLogin, setSuccessfulLogin] = useState("");

  const onSubmit: SubmitHandler<ILoginFormInput> = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5073/api/User/Login`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        //console.log(response.data);
        Cookies.set("token", response.data["token"], { expires: 7 });
        Cookies.set("username", response.data["username"], { expires: 7 });
        Cookies.set("email", response.data["email"], { expires: 7 });
        Cookies.set("profileUrl", response.data["profileUrl"], { expires: 7 });
        Cookies.set("role", response.data["role"], { expires: 7 });

        axios.defaults.baseURL = "http://localhost:5073/";
        axios.defaults.headers.common = {
          Authorization: `Bearer ${Cookies.get("token")}`,
        };

        setSuccessfulLogin("Uspesno ste ulogovani!");
        await sleep(2000);
        navigate("/");
        window.location.reload();
      } else {
        setSuccessfulLogin("Neuspesan pokusaj. Pokusajte ponovo!");
      }
    } catch (error) {
      setSuccessfulLogin("Neuspesan pokusaj. Pokusajte ponovo!");
    }
  };

  return (
    <div className="h-[80vh] from-slate-900 via-slate-800 to-slate-900 bg-gradient-to-b flex justify-center">
      <div className="w-3/4 h-[80vh] bg-slate-900 flex justify-center">
        <div className="w-2/5 py-5 px-2 bg-slate-400 rounded-3xl self-center">
          <h1 className="text-3xl font-bold text-center">Log in</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col m-5">
            <div className="flex space-x-4 mb-4">
              <input
                {...register("email", { required: true })}
                placeholder="Email"
                type="email"
                className="p-2 lg:w-1/2 w-full bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600"
              />
              {errors.email && (
                <span className="text-red-500">This field is required</span>
              )}
              <input
                {...register("password", { required: true })}
                placeholder="Sifra"
                type="password"
                className="p-2 lg:w-1/2 w-full bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600"
              />
              {errors.password && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            {successfulLogin && (
              <p
                className={`text-2xl font-bold text-center my-5 ${
                  successfulLogin === "Uspesno ste ulogovani!"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {successfulLogin}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 rounded-md text-white p-3 font-bold text-xl"
            >
              Loguj se!
            </button>
            <p
              onClick={() => {
                navigate("/register");
              }}
              className="hover:cursor-pointer hover:text-white text-gray-600 text-center pt-2"
            >
              Nemaš nalog?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
