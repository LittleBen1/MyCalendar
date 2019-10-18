import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import firebaseConfig from './firebase';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import config from './firebase';
import { UserService } from './user.service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ShareModule } from './share.module';
import { CalendarService } from './calendar.service';
import { ModalPageModule } from './modal/modal.module';
import { WeatherComponent } from './weather/weather.component';
import { WeatherService } from './weather.service';
import { SettingsComponent } from './setting/setting.component';
import { EventTransferService } from './event-transfer.service';


@NgModule({
  declarations: [AppComponent, WeatherComponent, SettingsComponent],
  entryComponents: [SettingsComponent],
  imports: [BrowserModule,
     IonicModule.forRoot(),
     AppRoutingModule,
     AngularFireModule.initializeApp(config),
     AngularFireAuthModule,
     AngularFirestoreModule,
     HttpClientModule,
     ShareModule,
     ModalPageModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UserService,
    AuthService,
    CalendarService,
    WeatherService,
    EventTransferService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
