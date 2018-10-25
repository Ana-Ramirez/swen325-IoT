import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MqttClientProvider} from "../../providers/mqtt-client/mqtt-client";

declare var Paho : any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  private mqttStatus: string = 'Disconnected';
  private mqttClient: any = null;
  private message: String = '';
  private messageToSend: string = 'Your message';
  private topic: string = 'swen325/a3';
  private clientId: string = 'ramireana'

  constructor(public navCtrl: NavController, public mqtt: MqttClientProvider) {
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
    console.log('Connecting to mqtt via websocket');
    this.mqttClient.connect({timeout:10, userName:'zlkeyfjr', password:'__70vczj02nW', useSSL:true, onSuccess:this.onConnect, onFailure:this.onFailure});
    //this.mqttClient.connect({timeout:10, useSSL:false, onSuccess:this.onConnect, onFailure:this.onFailure});
  }

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

    console.log("HERE");


    // subscribe
    this.mqttClient.subscribe(this.topic);



  }

  public onFailure = (responseObject) => {
    console.log('Failed to connect');
    this.mqttStatus = 'Failed to connect';
  }

  public onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      this.mqttStatus = 'Disconnected';
    }
  }

  public onMessageArrived = (message) => {
    this.message = message.payloadString.toString();
    console.log('Received message:' + this.message);
    this.calPercent(this.message);
  }

  public calPercent = (message) => {
    console.log(this)
    console.log("CALC %");
    console.log('CALC-MESSAGE:' + message);

    let sensorOutput = message;
    const split = sensorOutput.split(",");

    let room = split[1];
    let battery = split[3];

    console.log("Room: " + room);
    console.log("Battery: " + battery);

    // this.message = message.payloadString;
    // console.log('Received message:' + this.message);
  }
}

