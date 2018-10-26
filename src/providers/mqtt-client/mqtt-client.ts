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
  private lastMovementLocation: string = 'No motion data come through yet';
  private timerInSecs : number = 0;

  private numberOfMovementsByLocation : [{}] = [{}];

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
    this.mqttStatus = 'Connected';

    // subscribe
    this.mqttClient.subscribe(this.topic);
  };

  public onFailure = (responseObject) => {
    this.mqttStatus = 'Failed to connect';
  };

  public onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      this.mqttStatus = 'Disconnected';
    }
  };

  public onMessageArrived = (message) => {
    this.message = message.payloadString.toString();

    this.getBatteryReading();
    this.getLastLocationInfo();
  };

  public getBatteryReading = () => {
    let sensorOutput = this.message;
    const split = sensorOutput.split(",");

    let room = split[1];
    let battery = split[3] + '%';

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

    const movementDetected = parseInt(split[2]) === 1;

    const location = split[1];

    const locationInMotionReadings = Object.keys(this.numberOfMovementsByLocation[0]).includes(location);
    if (!locationInMotionReadings) {
      const motionReadingLocation = {
        [location]: 0
      };
      Object.assign(this.numberOfMovementsByLocation[0], motionReadingLocation);
    }

    if (movementDetected) {
      this.lastMovementLocation = split[1];

      this.numberOfMovementsByLocation[0][this.lastMovementLocation] = this.numberOfMovementsByLocation[0][this.lastMovementLocation] + 1;

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

  getBrokerStatus() {
    return this.mqttStatus;
  }

  getData() {
    return this.numberOfMovementsByLocation;
  }
}
