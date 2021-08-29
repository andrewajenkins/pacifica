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
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import { NoteComponent } from './components/note/note.component';

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
    UserUserComponent,
    NoteComponent
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
  ],
  providers: [
    SheetService,
    authInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
