import queso_pic from './queso.png';
import './App.css';
import LampButton from './Components';
import {TemperatureReading} from './Components';

function App() {
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
