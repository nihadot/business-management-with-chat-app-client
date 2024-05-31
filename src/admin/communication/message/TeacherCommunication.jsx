import React, { useEffect, useRef, useState } from "react";
import Spinner from "../../../spinner";
import { errorToast, successToast } from "../../../toast";
import {
  getChatsByIdAdminRole,
  sentSingleMessageRoleAdmin,
  uploadeImage,
} from "../../../api/admin";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { API_BASE_URL, SERVER } from "../../../api/instance";

const socket = io(`http://localhost:8080`);
function TeacherCommunication() {
  const [loading, setLoading] = useState(false);
  const [message, setSentMessage] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { id, name } = useParams();
  const [user, setUser] = useState({});
  const [image, setImage] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!id) {
      navigate("/admin/manage-teachers-communication");
    }
  }, [id]);

  const imageUplpoadField = useRef(null);

  const onUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUploading = () => imageUplpoadField.current.click();

  React.useEffect(() => {
    socket.emit("fetch-user", {
      sender: JSON.parse(localStorage.getItem("admin-details"))?._id,
      receiver: id,
      role: "teacher",
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

    socket.on("error", (response) => {
      errorToast(response.message);
    });
  }, []);


  const startRecording = async () => {
    // Get user permission to use the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      setAudioChunks((prevChunks) => [...prevChunks, e.data]);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append(
        "sender",
        JSON.parse(localStorage.getItem("admin-details"))?._id
      );
      formData.append("receiver", id);


      // Send the audio file to the server
      const response = await axios.post('http://localhost:3000/api/upload-audio', formData,{
        headers: { "Content-Type": "multipart/form-data" },
      });
      socket.emit("get-messages", {
        sender: JSON.parse(localStorage.getItem("admin-details"))?._id,
        receiver: id,
      });
      // console.log(response.data);

      setAudioChunks([]);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };
    const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
     
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (image) {
        const formdata = new FormData();

        formdata.append("image", image);
        formdata.append(
          "sender",
          JSON.parse(localStorage.getItem("admin-details"))?._id
        );
        formdata.append("receiver", id);

        await axios.post(`${API_BASE_URL}/image-uploading`, formdata);
        setImage("");

        socket.emit("get-messages", {
          sender: JSON.parse(localStorage.getItem("admin-details"))?._id,
          receiver: id,
        });
      }

      if (image && message) {
        socket.emit("sent-message", {
          sender: JSON.parse(localStorage.getItem("admin-details"))?._id,
          message,
          receiver: id,
        });
        const formdata = new FormData();

        formdata.append("image", image);
        formdata.append(
          "sender",
          JSON.parse(localStorage.getItem("admin-details"))?._id
        );
        formdata.append("receiver", id);

        console.log(id, "----");
        console.log(
          JSON.parse(localStorage.getItem("admin-details"))?._id,
          "----"
        );
        await axios.post(`${API_BASE_URL}/image-uploading`, formdata, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setImage("");
        setSentMessage("");
        socket.emit("get-messages", {
          sender: JSON.parse(localStorage.getItem("admin-details"))?._id,
          receiver: id,
        });
      }

      if (message) {
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
      }
    } catch (error) {
      errorToast(
        error.response.data.message || error.message || "something went wrong!"
      );
    }
  };

  const goToDashBoard = `/admin/communication`;
  const goToParentDir = `/admin/manage-teachers-communication`;
  const goToCurrent = `/admin/admin-teacher-message/${id}/${name}`;
  const breadCrubmberClassName = "hover:text-slate-500 hover:underline";
  const breadCrumbContainer = "flex gap-2 text-[14px] my-3";

  return (
    <div className="bg-white px-4 my-5">
      <ul className={breadCrumbContainer}>
        <li className={`${breadCrubmberClassName}`}>
          <Link to={goToDashBoard}>Main</Link> <span>/</span>
        </li>
        <li className={`${breadCrubmberClassName}`}>
          <Link to={goToParentDir}>Teachers</Link> <span>/</span>
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
        <div className="">
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt=""
              className="w-[150px] rounded-lg h-[100px] object-cover"
            />
          )}

          {isRecording ? (
            <button onClick={stopRecording}>Stop Recording</button>
          ) : (
            <button onClick={startRecording}>Start Recording</button>
          )}
          {audioFiles.map((file, index) => (
            <audio key={index} controls src={""} />
          ))}
        </div>
        <div className="flex my-4 gap-3 justify-center items-center">
          <input
            onChange={(e) => setSentMessage(e.target.value)}
            type="text"
            value={message}
            className="appearance-none  outline-none py-3 px-3 bg-white shadow-lg w-[600px] border rounded-md mb-4"
            placeholder="Message..."
          />

          <input
            type="file"
            accept="images/*"
            className="hidden"
            onChange={onUpload}
            ref={imageUplpoadField}
          />
          <button
            onClick={handleImageUploading}
            className="rounded-full w-9 text-[20px] h-9 text-center bg-slate-200 shadow-lg cursor-pointer text-black"
          >
            +
          </button>
        </div>
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
              const date = new Date(item?.createdAt);
              return (
                <p
                  key={item._id}
                  className={`${
                    item.sender ===
                      JSON.parse(localStorage.getItem("admin-details"))._id &&
                    " flex items-center justify-end   text-white "
                  }  `}
                >
                  <p
                    className={`${
                      item.sender ===
                      JSON.parse(localStorage.getItem("admin-details"))._id
                        ? "rounded-tr-[20px] pe-10  bg-green-500 ps-3"
                        : "rounded-tl-[20px] border ps-6 w-fit pe-5"
                    }  my-2  py-3  `}
                  >
                    {item.message}
                  </p>
{ item.image &&
                  <img
                    src={`${SERVER}/${item?.image}`}
                    alt=""
                    className="w-[150px] rounded-lg h-[100px] object-cover"
                  />}
                  { item.audio &&
                    <audio controls src={`http://localhost:3000/${item.audio}`} />
                  }
                  {/* <span className="block">{date && `${date.getMinutes()} ${date.getDay()} ${date.getMonth()}`}</span> */}
                </p>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default TeacherCommunication;
