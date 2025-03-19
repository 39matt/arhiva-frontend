import { useEffect } from "react";
import { axiosPrivate } from "./axios";
import Cookies from "js-cookie";

function useAxiosPrivate() {
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${Cookies.get("token")}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, []);

  return axiosPrivate;
}

export default useAxiosPrivate;
