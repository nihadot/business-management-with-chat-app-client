import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { errorToast } from "../toast";
import Spinner from "../spinner";
import { io } from "socket.io-client";

function MessageAdmin() {
  const [loading, setLoading] = useState(false);
  const [message, setSentMessage] = useState("");
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { id } = useParams();
  const socket = io(`http://localhost:8080`);

  useEffect(() => {
    if (!id) {
      navigate("/admin/manage-admin-communication");
    }
  }, [id]);

  React.useEffect(() => {
    socket.emit("fetch-user", {
      sender: JSON.parse(localStorage.getItem("teacher-details"))?._id,
      receiver: id,
      role:"admin"
    });
    socket.on("fetched-user", (response) => {
      setUser(response.result);
    });
    socket.emit("get-messages", {
      sender: JSON.parse(localStorage.getItem("teacher-details"))?._id,
      receiver: id,
    });
    socket.on("all-messages", (response) => {
      console.log(response, "--");
      setData(response.result);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hyy");
    try {
      socket.emit("sent-message", {
        sender: JSON.parse(localStorage.getItem("teacher-details"))?._id,
        message,
        receiver: id,
      });

      socket.emit("get-messages", {
        sender: JSON.parse(localStorage.getItem("teacher-details"))?._id,
        receiver: id,
      });
      setSentMessage("");
    } catch (error) {
      errorToast(
        error.response.data.message || error.message || "something went wrong!"
      );
    }
  };

  return (
    <div className="bg-white px-4 py-10">
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
          className="appearance-none py-2.5 px-3 bg-white shadow-lg w-[200px] ms-4 border "
        >
          Sent
        </button>
      </form>

      {loading ? (
        <Spinner />
      ) : (
        <div className="max-h-[400px] overflow-auto">
          {data &&
            data?.length > 0 &&
            data?.map((item) => {
              return (
                <p
                  key={item._id}
                  className={`${
                    item.sender ===
                      JSON.parse(localStorage.getItem("teacher-details"))._id &&
                    " flex items-center justify-end   text-white "
                  }  `}
                >
                  <p
                    className={`${
                      item.sender ===
                      JSON.parse(localStorage.getItem("teacher-details"))._id
                        ? "rounded-tr-[20px] pe-10  bg-green-500 ps-3"
                        : "rounded-tl-[20px] border ps-6 w-fit pe-5"
                    }  my-2  py-3  `}
                  >
                    {item.message}
                  </p>
                </p>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default MessageAdmin;
