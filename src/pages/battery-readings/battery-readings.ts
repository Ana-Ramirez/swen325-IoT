import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MqttClientProvider} from "../../providers/mqtt-client/mqtt-client";

@Component({
  selector: 'page-battery-readings',
  templateUrl: 'battery-readings.html'
})
export class BatteryReadings {

  batteryReadingKeys = [];
  batteryReadings = {};


  constructor(public mqtt: MqttClientProvider) {
    this.launch();
  }

  public launch(){
    setInterval(() => {
      this.batteryReadings = this.mqtt.getBatteryReadings();
      this.batteryReadingKeys = Object.keys(this.batteryReadings);
    }, 100);
  }

}
