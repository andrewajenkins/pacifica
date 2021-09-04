import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ReportService} from "./services/report.service";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import {MatInputModule} from "@angular/material/input";
import { HomeComponent } from './components/home/home.component';
import {authInterceptorProviders} from "./services/auth.interceptor";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import { ReportDetailComponent } from './components/report-detail/report-detail.component';
import {MatTableModule} from "@angular/material/table";
import {MatGridListModule} from "@angular/material/grid-list";
import { DailyListComponent } from './components/daily-list/daily-list.component';
import { ReportTableComponent } from './components/report-table/report-table.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import { AbcListComponent } from './components/abc-list/abc-list.component';
import {UserService} from "./services/user.service";
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ReportDetailComponent,
    DailyListComponent,
    ReportTableComponent,
    AbcListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatGridListModule,
    MatPaginatorModule,
    MatOptionModule,
    MatSelectModule,
  ],
  providers: [
    ReportService,
    authInterceptorProviders,
    UserService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
