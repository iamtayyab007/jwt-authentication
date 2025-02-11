import { useEffect, useState } from "react";
import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useSubmit } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function Secret() {
  const navigate = useNavigate("/");
  const [cookies, setCookie, removeCookie] = useCookies([]);

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:3000",
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else {
          toast(`Hi ${data.user}`, { theme: "dark" });
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);
  const handleClick = () => {
    removeCookie("jwt");
    navigate("/login");
  };
  return (
    <>
      <div className="private">
        <ToastContainer />
        <h1>Super secret Page</h1>
        <button onClick={handleClick}>Log Out</button>
      </div>
    </>
  );
}
