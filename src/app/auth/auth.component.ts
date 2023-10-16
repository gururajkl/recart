import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isPasswordEnable = false;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceHolderDirective, { static: true })
  alertHost: PlaceHolderDirective;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onShowPassword() {
    this.isPasswordEnable = !this.isPasswordEnable;
  }

  onFormSubmit(authForm: NgForm) {
    let authObservable: Observable<AuthResponseData>;

    if (authForm.invalid) {
      return;
    }
    this.isLoading = true;
    const email = authForm.value.email;
    const password = authForm.value.password;

    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signUp(email, password);
    }

    authObservable.subscribe(
      (resData) => {
        this.router.navigate(['/recipes']);
        this.isLoading = false;
      },
      (errorMessage) => {
        this.error = errorMessage;
        // this.showError(this.error);
        this.isLoading = false;
      }
    );

    authForm.reset();
  }

  onHandleError() {
    this.error = null;
  }

  // Dynamic component can be used programatically.
  private showError(message: string) {
    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.subscription = componentRef.instance.close.subscribe(() => {
      this.subscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
