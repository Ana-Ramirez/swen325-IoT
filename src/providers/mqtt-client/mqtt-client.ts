import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timer } from 'rxjs/observable/timer'
import { Subscription } from "rxjs/Subscription";


/*
  Generated class for the MqttClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var Paho : any;

@Injectable()
export class MqttClientProvider {

  private mqttStatus: string = 'Disconnected';
  private mqttClient: any = null;
  private message: String = '';
  private messageToSend: string = 'Your message';
  private topic: string = 'swen325/a3';
  private clientId: string = 'ramireana';

  private batteryDataObj = {};
  private lastMovementLocation: String = 'Unknown';
  private timerInSecs : number = 0;

  private timerSubscription : Subscription;


  constructor(){
    this.connect();

  }

  public connect = () => {
    this.mqttStatus = 'Connecting...';
    this.mqttClient = new Paho.MQTT.Client('m15.cloudmqtt.com', 30928, '/mqtt', this.clientId);
    //this.mqttClient = new Paho.MQTT.Client('barretts.ecs.vuw.ac.nz', 8883, '/mqtt', this.clientId);

    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageArrived = this.onMessageArrived;

    // connect the client
    this.mqttClient.connect({timeout:10, userName:'zlkeyfjr', password:'__70vczj02nW', useSSL:true, onSuccess:this.onConnect, onFailure:this.onFailure});
    //this.mqttClient.connect({timeout:10, useSSL:false, onSuccess:this.onConnect, onFailure:this.onFailure});
  };

  public disconnect () {
    if(this.mqttStatus == 'Connected') {
      this.mqttStatus = 'Disconnecting...';
      this.mqttClient.disconnect();
      this.mqttStatus = 'Disconnected';
    }
  }

  public sendMessage () {
    if(this.mqttStatus == 'Connected') {
      this.mqttClient.publish(this.topic, this.messageToSend);
    }
  }

  public onConnect = () => {
    console.log('Connected');
    this.mqttStatus = 'Connected';

    // subscribe
    this.mqttClient.subscribe(this.topic);
  };

  public onFailure = (responseObject) => {
    console.log('Failed to connect');
    this.mqttStatus = 'Failed to connect';
  };

  public onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      this.mqttStatus = 'Disconnected';
    }
  };

  public onMessageArrived = (message) => {
    this.message = message.payloadString.toString();
    console.log('Received message:' + this.message);

    this.getBatteryReading();
    this.getLastLocationInfo();
  };

  public getBatteryReading = () => {
    let sensorOutput = this.message;
    const split = sensorOutput.split(",");

    let room = split[1];
    let battery = split[3] + '%';

    console.log("Room: " + room);
    console.log("Battery: " + battery);

    const temp = {
      [room]: battery
    };

    const roomNotInInBatteryReadings = Object.keys(this.batteryDataObj).indexOf(room) === -1;
    if (roomNotInInBatteryReadings) {
      Object.assign(this.batteryDataObj, temp);
    }
    else {
      this.batteryDataObj[room] = battery;
    }
  };

  getLastLocationInfo = () => {
    const split = this.message.split(",");

    const movementDetected = parseInt(split[2]) === 1

    if (movementDetected) {
      this.lastMovementLocation = split[1];

      this.timerInSecs = 0;
      if (this.timerSubscription !== undefined) {this.timerSubscription.unsubscribe();}
      this.timerSubscription = this.getNewTimer().subscribe((timer => {
        this.timerInSecs = timer;
      }))
    }
  };


  getBatteryReadings() {
    return this.batteryDataObj;
  }

  getLastLocation() {
    return this.lastMovementLocation;
  }

  getNewTimer() {
    return timer(0, 1000);
  }

  getTimeSinceLastMovement() {
    return this.timerInSecs
  }

}
