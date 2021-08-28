import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddSheetComponent } from './components/add-sheet/add-sheet.component';
import { SheetDetailsComponent } from './components/sheet-details/sheet-details.component';
import { SheetsListComponent } from './components/sheets-list/sheets-list.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {SheetService} from "./services/sheet.service";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from "@angular/material/slider";

@NgModule({
  declarations: [
    AppComponent,
    AddSheetComponent,
    SheetDetailsComponent,
    SheetsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatSliderModule,
  ],
  providers: [
    SheetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
