import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  usernameFormControl = new FormControl('', [
    Validators.required,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
  ]);

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    console.log("init login page")
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      console.log("init login page: routing to home")
      this.router.navigate(['/home'])
      // this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    console.log("submit!")
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe(
      data => {
        console.log("data:", data);
        this.tokenStorage.saveToken(data.access);
        this.userService.getUser().subscribe(
          data => {
            this.tokenStorage.saveUser(data);
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            // this.roles = this.tokenStorage.getUser().roles;

            this.reloadPage();
            // this.router.navigate(['/login']).then(k => {
            //   this.router.navigate(['/home'])
            // })
            // window.location.
          }
        )

      },
      err => {
        console.log("ERR!")
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    console.log("reload page")
    window.location.reload();
  }
}
