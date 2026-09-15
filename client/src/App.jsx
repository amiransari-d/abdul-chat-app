import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off('receive_message');
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', { user: username, text: message });
      setMessage('');
    }
  };

  if (!isJoined) {
    return (
      <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
        <h2>Chat App me Login Karein</h2>
        <input 
          type="text" 
          placeholder="Apna Naam Likhein..." 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={() => username && setIsJoined(true)} style={{ padding: '8px 15px' }}>
          Enter Chat
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>Live Chat (`{username}`)</h2>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'auto', padding: '10px', marginBottom: '10px' }}>
        {chat.map((msg, index) => (
          <p key={index}><strong>{msg.user}:</strong> {msg.text}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type message..." 
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 15px' }}>Send</button>
      </form>
    </div>
  );
}

export default App;