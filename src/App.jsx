import { useState, useEffect, use } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { io } from 'socket.io-client';

function App() {
  const [count, setCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState(null)
  const [username, setUsername] = useState('')
  const [userinput, setUserinput] = useState('')

  function connectToChatServer() {
    console.log(connectToChatServer);
    const _socket = io('http://localhost:3000', {
      autoConnect: false,
      query: {
        username: username,
      }
    });
    _socket.connect();
    setSocket(_socket);
  }

  function disconnectToChatServer() {
    console.log(disconnectToChatServer);
    socket?.disconnect();
  }

  function onCon() {
    console.log('onCon Log');
    setIsConnected(true);
  }
  function onDiscon() {
    console.log('onDiscon Log');
    setIsConnected(false);
  }
  function onMsgReceived(msg) {
    console.log(`onMsg : ${msg}`);
  }

  useEffect( () => {
    console.log('useEffect call');
    socket?.on('connect', onCon);
    socket?.on('disconnect', onDiscon);
    socket?.on('new message', onMsgReceived);

    return () => {
      //console.log('useEffect Clean up');
      socket?.off('connect', onCon);
      socket?.off('disconnect', onDiscon);
      socket?.off('new message', onMsgReceived);
    };
  }, [socket]);

  function sendMessage() {
    console.log(`sendMessage ${userinput}`);
    socket?.emit('new message', userinput, (response) => {
      console.log(response);
    });
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <h2>사용자: {username}</h2>
      <h3>현재 접속상태: {isConnected ? '접속중' : '미접속'}</h3>

      <div className='card'>
        <input value={username} onChange={e => setUsername(e.target.value)} />
        <button onClick={() => connectToChatServer()}>
          접속
        </button>
        <button onClick={() => disconnectToChatServer()}>
          접속종료
        </button>
      </div>

      <div className='card'>
        <input value={userinput} onChange={e => setUserinput(e.target.value)} />
        <button onClick={() => sendMessage()}>
          보내기
        </button>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
