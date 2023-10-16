import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';

/**
 * The response type from the APIs, denoting as interface.
 */
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

/**
 * Class helps to auth the user.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Helps to create user account.
   * @param email Email of the user.
   * @param password Password of the user.
   * @returns Observable to subscribe.
   */
  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCaAsaVQDcO_x2BHNcNzAGr4R_nQf4GeQM',
        {
          email: email,
          password: password,
          returnSecureToke: true,
        }
      )
      .pipe(
        catchError((errorRes) => {
          return this.handleError(errorRes);
        }),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  /**
   * Logins the user to use the application.
   * @param email Email of the user.
   * @param password Password of the user.
   * @returns Observable to subscribe.
   */
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCaAsaVQDcO_x2BHNcNzAGr4R_nQf4GeQM',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorRes) => {
          return this.handleError(errorRes);
        }),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  /**
   * Hadles the errors with respect to the error code.
   * @param errorRes Error response from the observable.
   * @returns Error message.
   */
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An uknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists!';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'Server is not responding, please try again later.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage =
          'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email not found, please sign up!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Email or password is not correct!';
        break;
      case 'USER_DISABLED':
        errorMessage =
          'The user account has been disabled by an administrator.';
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Email or password is not valid!';
    }
    return throwError(errorMessage);
  }

  handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin() {
    const user: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!user) {
      return;
    }

    const loadedUser = new User(
      user.email,
      user.id,
      user._token,
      new Date(user._tokenExpirationDate)
    );

    console.log(loadedUser);

    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }
}
