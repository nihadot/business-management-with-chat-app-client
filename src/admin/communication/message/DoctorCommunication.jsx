import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getChatsByIdAdminRole, sentSingleMessageRoleAdmin } from "../../../api/admin";
import { errorToast, successToast } from "../../../toast";
import Spinner from "../../../spinner";

function ParentCommunication() {
  const [loading, setLoading] = useState(false);
  const [message, setSentMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      navigate("/admin/manage-doctors-communication");
    }
  }, [id]);

  React.useEffect(() => {
    fetchAPI();
  }, [refresh]);

  const fetchAPI = async () => {
    try {
      setLoading(true);
      const response = await getChatsByIdAdminRole(id);
      setData(response.result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sentSingleMessageRoleAdmin(
        { message: message },
        id
      );
      successToast(response?.message || "Successfully Updated");
      setRefresh(!refresh);
      setSentMessage('')
    } catch (error) {
      errorToast(
        error.response.data.message || error.message || "something went wrong!"
      );
    }
  };
  return (
    <div className="bg-white px-4 py-10">
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
        <>
          {data &&
            data.map((item) => {
              return (
                <p key={item._id} className="border py-3 px-3 my-2 rounded">
                  {item.message}
                </p>
              );
            })}
        </>
      )}
    </div>
  );
}

export default ParentCommunication;
