import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SheetsListComponent} from "./components/sheets-list/sheets-list.component";
import {AddSheetComponent} from "./components/add-sheet/add-sheet.component";
import {SheetDetailsComponent} from "./components/sheet-details/sheet-details.component";

const routes: Routes = [
  { path: '', redirectTo: 'sheets', pathMatch: 'full' },
  { path: 'sheets', component: SheetsListComponent },
  { path: 'sheets/:id', component: SheetDetailsComponent },
  { path: 'add', component: AddSheetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
