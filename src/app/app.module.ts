import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BatteryReadings } from '../pages/battery-readings/battery-readings';
import { SeniorStatus } from '../pages/senior-status/senior-status';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MqttClientProvider } from '../providers/mqtt-client/mqtt-client';

@NgModule({
  declarations: [
    MyApp,
    BatteryReadings,
    SeniorStatus,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BatteryReadings,
    SeniorStatus,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MqttClientProvider
  ]
})
export class AppModule {}
