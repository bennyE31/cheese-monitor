
import { Component } from 'react';
import ToggleButton from 'react-toggle-button';
import api from './api';

class LampButton extends Component {
    constructor(props) {
      super(props);
      this.state = { lamp:props.lamp, val:true }
      console.log("button created with state:", this.state);
    }
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        300
      );
    }
  
    async tick() {
      this.setState({val:await api.getLamp(this.state.lamp)});
    }

    async toggleLamp() {
      this.setState({val:await api.toggleLamp(this.state.lamp)});
    }
  
    render() {
      return (
        <div className={"LampButton " + ((this.state.lamp === 0) ? "Hot" : "Light")}>
          
          <div className="LampButton-button">
            <ToggleButton 
            value={ !this.state.val }
            onToggle={ value => this.toggleLamp(value) }
            />
          </div>
          <div className="LampButton-caption">
            <div>{(this.state.lamp === 0 ? "Heat" : "") + " Lamp"}</div>
          </div>
        </div>
      );
    }
  }

class TemperatureReading extends Component {
    
    constructor(props) {
        super(props);
        this.state = { tempReading:props.tempReading, temp:this.updateTemp() }
        console.log("temperature reading created with this state:", this.state);
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    tick() {
        this.updateTemp()
    }

    async updateTemp() {
      this.setState({temp: await api.getTemp()});
    }
    
    getColor(temp){
        var percent = (temp - 60.0) / (85.0 - 60.0)
        //value from 0 to 1
        if (percent < 0) {
            percent = 0;
        }
        else if (percent > 1) {
            percent = 1;
        }
        var hue=((1-percent)*120).toString(10);
        return ["hsl(",hue,",100%,50%)"].join("");
    }

    render() {
        console.log("Rendering Temperature Reading", this.state);
        return (
            <div style={{color: this.getColor(this.state.temp)}}>
                <>{"" + this.state.temp}</>&deg;
            </div>
        );
    }

}
  
export default LampButton
export {TemperatureReading}
