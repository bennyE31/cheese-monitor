import queso_pic from './queso.png';
import './App.css';
import LampButton from './Components';
import {TemperatureReading} from './Components';
import { useState } from 'react';
import { getLamp, setAuth } from './api';

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const login = async () => {
    setAuth(username, password);

    try {
      await getLamp(0); // test login
      setLoggedIn(true);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  if (!loggedIn) {
    return (
      <div>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
    );
  }
  return (
    <div className="App">
      <header className="App-header">
        <header className="Logo">
          <img src={queso_pic} className="App-logo" alt="logo" />
        </header>
      </header>
      <div className="App-body">

        <TemperatureReading />
        <LampButton lamp={0} />
        <LampButton lamp={1} />

      </div>

    < div className="App-footer">
    </div>

    </div>
  );
}

export default App;
