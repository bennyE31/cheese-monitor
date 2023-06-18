
import { Component } from 'react';
import ToggleButton from 'react-toggle-button';

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
  
    tick() {
      const request = {
        method: "GET",
        headers: { "Content-Type": "application/json"}
      };
      const request_url = "/lamp/" + this.state.lamp;
      fetch(request_url, request)
        .then(r => r.json())
        .then(j => {
          this.setState({val:j.val===1});
        });
    }

    toggleLamp() {
      
      const request = {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ lamp: this.state.lamp })
      };
      fetch("/lamp", request)
        .then(r => r.json())
        .then(j => {
          this.setState({val:j.val===1});
        });;
    }
  
    render() {
      return (
        <div className={"LampButton " + ((this.state.lamp === 0) ? "Hot" : "Light")}>
          
          <div className="LampButton-button">
            <ToggleButton 
            value={ this.state.val }
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

    updateTemp() {
        const request = {
            method: "GET",
            headers: { "Content-Type": "application/json"}
        };
        const request_url = "/temp";
        console.log("fetching from",request_url);
        fetch(request_url, request)
            .then(r => r.json())
            .then(j => {
            console.log("Temp json:", j)
            this.setState({temp:j.temp.toFixed(2)});
            });
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
