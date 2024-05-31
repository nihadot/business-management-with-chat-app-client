import { FaBars } from "react-icons/fa";
// import {useNavigate} from 'react-router'
import { Outlet, useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import { useEffect } from "react";
import { io } from "socket.io-client";

function UserLayout() {

  const navigate = useNavigate()

  useEffect(() => {
    const Token = localStorage.getItem("parent-token")
    const Details = localStorage.getItem("parent-details")

    console.log(Token,Details);
    if (!Token || !Details) {
      navigate("/parent-login", { state: { from: '/protected-route' } });
    }

    if (Token && Details) {
      const socket = io(`http://localhost:8080`);
      socket.emit("is-online", {
        isOnline: true,
        role: "parent",
        userId: JSON.parse(localStorage.getItem("parent-details"))?._id,
      });
    }

  }, [navigate]);

  return (
    <div className="">
      <UserHeader/>
      <div className="">
        <Outlet/>
      </div>
      <div className="">
        <UserFooter/>
      </div>
    </div>
  )
}

export default UserLayout