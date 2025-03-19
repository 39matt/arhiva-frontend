import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

const Register = () => {
  const [err, setErr] = useState("");
  const [successfulRegister, setSuccessfulRegister] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IRegisterFormInput>();
  //const onSubmit: SubmitHandler<IFormInput> = (data, e) => console.log(data, e);
  return (
    <>
      <div className="h-[80vh] from-slate-900 via-slate-800 to-slate-900 bg-gradient-to-b flex justify-center">
        <div className="w-3/4 h-[80vh] bg-slate-900 flex justify-center">
          <div className="w-2/5 py-5 px-2 bg-slate-400 rounded-3xl self-center">
            <h1 className="text-3xl font-bold text-center">Register</h1>

            <p className="alerts text-center text-red-600">{err}</p>
            <form
              onSubmit={handleSubmit(async (data) => {
                await fetch("http://localhost:5073/api/User/Register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: data.ime,
                    surname: data.prezime,
                    username: data.nadimak,
                    password: data.sifra,
                    email: data.email,
                    phoneNumber: data.telefon,
                  }),
                }).then(async (r) => {
                  var text = await r.text();
                  if (r.ok) setSuccessfulRegister(true);
                  else setErr(text);
                });
                navigate("/");
              })}
              method="post"
              className="flex flex-col m-5"
            >
              <div className="flex space-x-4 mb-4">
                <input
                  {...register("ime", { required: true })}
                  placeholder="Ime"
                  type="text"
                  className="p-2 lg:w-1/2 w-full bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600 "
                />
                <input
                  {...register("prezime", { required: true })}
                  placeholder="Prezime"
                  type="text"
                  className="p-2 lg:w-1/2 w-full bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600"
                />
              </div>
              <input
                {...register("nadimak", { required: true })}
                type="text"
                placeholder="Nadimak"
                className="p-2 w-full bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600 mb-4"
              />
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Email"
                className="p-2 w-full bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600 mb-4"
              />
              <input
                {...register("potvrdiEmail", {
                  required: true,
                  validate: (val: string) => {
                    if (watch("email") !== val) {
                      return "Emailovi nisu isti!";
                    }
                  },
                })}
                type="email"
                placeholder="Potvrda Email-a"
                className="p-2 w-full bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600 mb-4"
              />
              {errors?.potvrdiEmail && (
                <p className="alerts text-red-600 text-center">
                  {errors?.potvrdiEmail?.message}
                </p>
              )}
              <input
                {...register("telefon")}
                type="text"
                placeholder="Telefon"
                className="p-2 w-full bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600 mb-4"
              />
              <input
                {...register("sifra", { required: true })}
                type="password"
                placeholder="Šifra"
                className="p-2 w-full bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600 mb-4"
              />
              <input
                {...register("potvrdiSifru", {
                  required: true,
                  validate: (val: string) => {
                    return (
                      val === watch("sifra") || "Sifre bi trebalo da budu iste!"
                    );
                  },
                })}
                type="password"
                placeholder="Potvrda šifre"
                className="p-2 w-full bg-gray-700 text-white border-0 rounded-md focus:bg-gray-600 mb-4"
              />
              {errors.potvrdiSifru && (
                <p className="alerts text-red-600 text-center">
                  {errors?.potvrdiSifru?.message}
                </p>
              )}
              {successfulRegister && (
                <p className="text-2xl text-green-700 font-bold text-center my-5">
                  Uspešno napravljen nalog!
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-500 rounded-md text-white p-3 font-bold text-xl"
              >
                Registruj se!
              </button>
              <p
                onClick={() => {
                  navigate("/login");
                }}
                className="hover:cursor-pointer hover:text-white text-gray-600 text-center pt-2"
              >
                Već imaš nalog?
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
