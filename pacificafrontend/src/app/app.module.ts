import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddSheetComponent } from './components/add-sheet/add-sheet.component';
import { SheetDetailsComponent } from './components/sheet-details/sheet-details.component';
import { SheetsListComponent } from './components/sheets-list/sheets-list.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SheetService} from "./services/sheet.service";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import {MatInputModule} from "@angular/material/input";
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserAdminComponent } from './components/users/user-admin/user-admin.component';
import { UserModeratorComponent } from './components/users/user-moderator/user-moderator.component';
import { UserUserComponent } from './components/users/user-user/user-user.component';
import {authInterceptorProviders} from "./services/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    AddSheetComponent,
    SheetDetailsComponent,
    SheetsListComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    UserAdminComponent,
    UserModeratorComponent,
    UserUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    SheetService,
    authInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
