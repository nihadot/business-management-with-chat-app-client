mport React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    // Listen for new audio messages
    socket.on('audio', (data) => {
      setAudioFiles((prevFiles) => [...prevFiles, data.filePath]);
    });

    return () => {
      socket.off('audio');
    };
  }, []);

  const startRecording = async () => {
    // Get user permission to use the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      setAudioChunks((prevChunks) => [...prevChunks, e.data]);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob);

      // Send the audio file to the server
      const response = await axios.post('http://localhost:3000/api/upload-audio', formData);
      console.log(response.data);

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

  return (
    <div>
      <h1>Chat Voice App</h1>
      {isRecording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
      <div>
        {audioFiles.map((file, index) => (
          <audio key={index} controls src={http://localhost:3000${file}} />
        ))}
      </div>
    </div>
  );
};

export default App;