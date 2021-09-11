import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "./services/token-storage.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pacificafrontend';
  isLoggedIn = false;
  username?: string;
  options: FormGroup;

  constructor(private tokenStorageService: TokenStorageService, fb: FormBuilder) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = JSON.parse(user).username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    localStorage.clear();
    window.location.reload();
  }
}
