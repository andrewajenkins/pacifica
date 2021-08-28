import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddSheetComponent } from './components/add-sheet/add-sheet.component';
import { SheetDetailsComponent } from './components/sheet-details/sheet-details.component';
import { SheetsListComponent } from './components/sheets-list/sheets-list.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
