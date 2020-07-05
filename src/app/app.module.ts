import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayersComponent } from './players/players.component';
import { ShipsComponent } from './ships/ships.component';
import { HttpClientModule } from '@angular/common/http';
import { MainMapComponent } from './main-map/main-map.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { ConfigsComponent } from './configs/configs.component';
import { EventsComponent } from './events/events.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    ShipsComponent,
    MainMapComponent,
    ChatComponent,
    HeaderComponent,
    ConfigsComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
