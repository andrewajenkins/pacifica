import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SheetsListComponent} from "./components/sheets-list/sheets-list.component";
import {AddSheetComponent} from "./components/add-sheet/add-sheet.component";
import {SheetDetailsComponent} from "./components/sheet-details/sheet-details.component";
import {LoginComponent} from "./components/login/login.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'sheets', component: SheetsListComponent },
  { path: 'sheets/:id', component: SheetDetailsComponent },
  { path: 'add', component: AddSheetComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
