import React, { useEffect, useState } from "react";
import Spinner from "../../../spinner";
import { errorToast, successToast } from "../../../toast";
import {
  getChatsByIdAdminRole,
  sentSingleMessageRoleAdmin,
} from "../../../api/admin";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(`http://localhost:8080`);
function ParentCommunication() {
  const [loading, setLoading] = useState(false);
  const [message, setSentMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { id,name } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (!id) {
      navigate("/admin/manage-parents-communication");
    }
  }, [id]);

  // React.useEffect(() => {
  //   fetchAPI();
  // }, [refresh]);

React.useEffect(() => {
    socket.emit("fetch-user", {
      sender: JSON.parse(localStorage.getItem("admin-details"))?._id,
      receiver: id,
      role: "parent",
    });
    socket.on("fetched-user", (response) => {
      setUser(response.result);
    });
    socket.emit("get-messages", {
      sender: JSON.parse(localStorage.getItem("admin-details"))?._id,
      receiver: id,
    });
    socket.on("all-messages", (response) => {
      console.log(response, "--");
      setData(response.result);
    });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      socket.emit("sent-message", {
        sender: JSON.parse(localStorage.getItem("admin-details"))?._id,
        message,
        receiver: id,
      });

      socket.emit("get-messages", {
        sender: JSON.parse(localStorage.getItem("admin-details"))?._id,
        receiver: id,
      });
      setSentMessage("");
    } catch (error) {
      errorToast(
        error.response.data.message || error.message || "something went wrong!"
      );
    }
  };

  const goToDashBoard = `/admin/communication`;
  const goToParentDir =`/admin/manage-parents-communication`
  const goToCurrent = `/admin/admin-parent-message/${id}/${name}`
  const breadCrubmberClassName = "hover:text-slate-500 hover:underline";
  const breadCrumbContainer = "flex gap-2 text-[14px] my-3";



  return (
    <div className="bg-white px-4 my-5">

<ul className={breadCrumbContainer}>
        <li className={`${breadCrubmberClassName}`}>
          <Link to={goToDashBoard}>Main</Link> <span>/</span>
        </li>
        <li className={`${breadCrubmberClassName}`}>
          <Link to={goToParentDir}>Parents</Link> <span>/</span>
        </li>
        <li className={`${breadCrubmberClassName}`}>
          <Link to={goToCurrent}>{name}</Link> 
        </li>
      </ul>

      <div className="px-3 py-2 shadow-md rounded-md border border-green-500">
        <p>
          {user.isOnline ? (
            <>
              <span className="block bg-green-600 rounded-full w-3 h-3"></span>
              <span className="block">{user.name}</span>
            </>
          ) : (
            <>
              <span className="block bg-red-600 rounded-full w-3 h-3"></span>
              <span className="block">{user.name}</span>
            </>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setSentMessage(e.target.value)}
          type="text"
          value={message}
          className="appearance-none py-3 px-3 bg-white shadow-lg w-[600px] border rounded-md mb-4"
          placeholder="Message..."
        />
        <button
          type="submit"
          className="appearance-none py-2.5 px-3 bg-green-500 text-white  shadow-lg w-[100px] ms-4 border "
        >
          Sent
        </button>
      </form>

      {loading ? (
          <div className=" w-full flex justify-center h-screen items-center">
          <Spinner />
        </div>
      ) : (
        <div className="max-h-[400px] overflow-auto">
          {data &&
            data.map((item) => {
              return (
                <p key={item._id} className={`${item.sender === JSON.parse(localStorage.getItem("admin-details"))._id && ' flex items-center justify-end   text-white '}  `} >
                  <p className={`${item.sender === JSON.parse(localStorage.getItem("admin-details"))._id ?  'rounded-tr-[20px] pe-10  bg-green-500 ps-3' : 'rounded-tl-[20px] border ps-6 w-fit pe-5'}  my-2  py-3  `}>{item.message}</p>
                </p>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default ParentCommunication;
