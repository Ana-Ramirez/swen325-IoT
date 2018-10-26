import { Component } from '@angular/core';

import { BatteryReadings } from '../battery-readings/battery-readings';
import { SeniorStatus } from '../senior-status/senior-status';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SeniorStatus;
  tab2Root = BatteryReadings;

  constructor() {

  }
}
