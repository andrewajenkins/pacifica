import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SheetsListComponent} from "./components/sheets-list/sheets-list.component";
import {AddSheetComponent} from "./components/add-sheet/add-sheet.component";
import {SheetDetailsComponent} from "./components/sheet-details/sheet-details.component";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/register/register.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {UserUserComponent} from "./components/users/user-user/user-user.component";
import {UserModeratorComponent} from "./components/users/user-moderator/user-moderator.component";
import {UserAdminComponent} from "./components/users/user-admin/user-admin.component";

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'sheets', component: SheetsListComponent },
  { path: 'sheets/:id', component: SheetDetailsComponent },
  { path: 'add', component: AddSheetComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: UserUserComponent },
  { path: 'mod', component: UserModeratorComponent },
  { path: 'admin', component: UserAdminComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
