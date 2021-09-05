import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {ReportDetailComponent} from "./components/report-detail/report-detail.component";
import {DailyListComponent} from "./components/daily-list/daily-list.component";
import {AbcListComponent} from "./components/abc-list/abc-list.component";
import {
  AuthGuardService as AuthGuard
} from './services/auth-guard.service';
import {MessageBoardComponent} from "./components/message-board/message-board.component";
import {ArchiveComponent} from "./components/archive/archive.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'report/:id', component: ReportDetailComponent, canActivate: [AuthGuard] },
  { path: 'daily-list', component: DailyListComponent, canActivate: [AuthGuard] },
  { path: 'abc-list', component: AbcListComponent, canActivate: [AuthGuard] },
  { path: 'message-board', component: MessageBoardComponent, canActivate: [AuthGuard] },
  { path: 'archive', component: ArchiveComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
