import {Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { MqttClientProvider } from "../../providers/mqtt-client/mqtt-client";
import {BaseChartDirective} from "ng4-charts";

@Component({
  selector: 'page-senior-status',
  templateUrl: 'senior-status.html'
})

export class SeniorStatus {

  lastLocation: String = '';
  timeSinceLastMotion: number = 0;
  brokerStatus: String = '';

  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;

  // Chart options
  barChartData = [
    { data: this.getData(), label: 'House 1' }
  ];

  barChartLabels = ['Living Room', 'Kitchen', 'Dining Room', 'Toilet', 'Bedroom']
  barChartType = 'pie'
  barChartOptions = {

  };


  constructor(public mqtt: MqttClientProvider) {}

  ngOnInit() {
    this.launch();
  }

  public launch(){
    setInterval(() => {
      this.lastLocation = this.mqtt.getLastLocation();
      this.timeSinceLastMotion = (this.mqtt.getTimeSinceLastMovement() / 60)
      this.brokerStatus = this.mqtt.getBrokerStatus();

      // Realtime update chart
      let set1 = this.chart.datasets[0].data;
      let set2 = this.getData();
      if (!this.dataSame(set1, set2)) {
        this.chart.datasets[0].data = set2;
        if (this.chart !== undefined) {
          this.chart.ngOnDestroy();
          this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
        }
      }
    }, 100);
  }

  getData() {
    if (this.mqtt.getData() === undefined) {
      return [];
    }
    else {
      return (<any>Object).values(this.mqtt.getData()[0]);
    }
  }

  dataSame(set1, set2) {
    if (set1.length !== set2.length) return false;

    for (let i = 0; i < set1.length; i++) {
      if (set1[i] !== set2[i]) return false;
    }
    return true;
  }
}

