import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MqttClientProvider } from "../../providers/mqtt-client/mqtt-client";

@Component({
  selector: 'page-senior-status',
  templateUrl: 'senior-status.html'
})

export class SeniorStatus {

  batteryReadingKeys = [];
  batteryReadings = {};
  lastLocation: String = '';
  timeSinceLastMotion: number = 0;


  constructor(public navCtrl: NavController, public mqtt: MqttClientProvider) {
    this.launch();
  }

  public launch(){
    setInterval(() => {
      this.batteryReadings = this.mqtt.getBatteryReadings();
      this.batteryReadingKeys = Object.keys(this.batteryReadings);
      this.lastLocation = this.mqtt.getLastLocation();
      this.timeSinceLastMotion = (this.mqtt.getTimeSinceLastMovement() / 60)
    }, 100);
  }


}

