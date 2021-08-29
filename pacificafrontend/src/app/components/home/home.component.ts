import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {SheetService} from "../../services/sheet.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  content?: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private sheetService: SheetService,
  ) { }

  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate(['/login']);
      // this.roles = this.tokenStorage.getUser().roles;
    }
    this.sheetService.deleteAll().subscribe(
    // this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
}
