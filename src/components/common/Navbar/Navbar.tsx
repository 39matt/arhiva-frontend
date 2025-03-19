import config from "../../../config/config.json";
import React, { Fragment, useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-scroll";
import { redirect, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { MdOutlinePostAdd } from "react-icons/md";

const Navbar: React.FC = () => {
  const { navigation, project, callToAction } = config;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isModerator, setIsModerator] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    setToken(Cookies.get("token"));
    setUsername(Cookies.get("username"));
    setIsAdmin(Cookies.get("role") === "Admin" ? "admin" : null);
    setIsModerator(Cookies.get("role") === "Moderator" ? "mod" : null);
  }, []);

  async function Logout() {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("profileUrl");
    Cookies.remove("role");
    navigate("/");
    window.location.reload();
  }

  const ProfileDDL: React.FC = () => {
    return (
      <div
        className={`bg-gray-500/50 rounded-lg text-white p-7 max-w-fit mx-auto lg:absolute lg:right-12 text-center transition-opacity ease-in-out duration-500 ${
          isProfileOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <p
          onClick={() => {
            navigate("/profil");
            setIsProfileOpen(false);
          }}
          className="py-3 px-2 hover:cursor-pointer hover:bg-gray-400/50 rounded-md"
        >
          Profil
        </p>
        {(isAdmin || isModerator) && (
          <p
            onClick={() => {
              navigate("/kontrolniPanel");
              setIsProfileOpen(false);
            }}
            className="py-3 px-2 hover:cursor-pointer hover:bg-gray-400/50 rounded-md my-3"
          >
            Kontrolni panel
          </p>
        )}
        <p
          className="py-3 px-2 hover:cursor-pointer bg-red-500/50 hover:bg-red-600/50 rounded-md"
          onClick={Logout}
        >
          Izloguj se!
        </p>
      </div>
    );
  };
  const Profile: React.FC = () => {
    return (
      <div className="flex text-center">
        {token && (
          <div
            className="py-2 px-5 m-auto w-fit h-fit hover:cursor-pointer text-white bg-blue-900/80 hover:bg-blue-900 border-slate-700 rounded-md"
            onClick={() => navigate("/blanketi/noviBlanket")}
          >
            <MdOutlinePostAdd size={20} className="inline" />
          </div>
        )}
        <p className="text-white font-bold my-auto mx-3">{username}</p>
        <img
          className="rounded-full w-12 hover:cursor-pointer ring-2 p-1 hover:ring-gray-500 mx-auto"
          src={Cookies.get("profileUrl")}
          alt="avatar"
          onClick={toggleProfile}
        />
      </div>
    );
  };

  return (
    <>
      <div className="m-4 ">
        <header className="w-full bg-slate-900 rounded-lg">
          <nav className="py-4 md:px-8 px-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-2x1 cursor-pointer text-black">
                <a href="/">
                  <img className="size-16" src={project.logo} alt="logo" />
                </a>
              </div>
              <div className="lg:flex items-center gap-e hidden ">
                {navigation.map((item) => (
                  <p
                    key={item.name}
                    className="mx-1 font-bold text-white hover:text-yellow-500 hover:cursor-pointer"
                    onClick={() => navigate(item.href)}
                  >
                    {item.name}
                  </p>
                ))}
              </div>
              <div className="lg:block hidden relative">
                {!token && (
                  <button
                    className="px-4 py-2 m-2 border border-yellow-500 rounded-md text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all duration-300"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Register
                  </button>
                )}
                {!token && (
                  <button
                    className="mx-2 text-gray-400"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Log In
                  </button>
                )}

                {token && <Profile />}
                {isProfileOpen && <ProfileDDL />}
              </div>
              <button
                onClick={toggleMenu}
                className="lg:hidden text-yellow-500"
              >
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            {/* nav za male uredjaje */}
            {isMenuOpen && (
              <div className={`mt-4 bg-gray-500/50 rounded-lg z-10 lg:hidden`}>
                {token && <Profile />}
                {isProfileOpen && <ProfileDDL />}
                {navigation.map((item) => (
                  <Link
                    spy={true}
                    active="active"
                    smooth={true}
                    duration={1000}
                    key={item.name}
                    to={item.href}
                    className="block text-center font-bold text-white hover:text-gray-900 hover:cursor-pointer hover:bg-gray-300 rounded-lg "
                  >
                    {item.name}
                  </Link>
                ))}
                {!token && (
                  <button
                    className="w-full border border-yellow-500 rounded-md text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all duration-300"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Register
                  </button>
                )}
                {!token && (
                  <button
                    className="w-full text-gray-400 hover:text-white"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Log In
                  </button>
                )}
              </div>
            )}
          </nav>
        </header>
      </div>
    </>
  );
};

export default Navbar;
