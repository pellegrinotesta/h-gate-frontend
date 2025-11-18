import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { interval, first } from "rxjs";
import { AuthService } from "./auth.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import moment from 'moment';
import { environment } from "../../../../environment/environment";
import { AuthenticatedUser } from "../../../models/authenticated-user.model";


@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  private minutesBeforeTokenExpiration =
    environment.jwt.refresh.minutesBeforeTokenExpiration || 5;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService,
    private readonly jwtHelperService: JwtHelperService
  ) {
    authService.userLoggedIn.subscribe(userLoggedIn => {
      if(userLoggedIn) {
        this.scheduleSilentRefresh();
      }
    });
  }

  private refreshToken(): void {
    const storedUser = this.authService.getStoredUsed();
    if (storedUser) {
      this.httpClient.put<AuthenticatedUser>(environment.endpoints.auth, {}).subscribe({
        next: (user: AuthenticatedUser) => {
          this.authService.storeUser(user);
        },
        error: () => {
          this.authService.logout();
        }
      });
    }
  }

  private getExpirationDateFromToken(user: AuthenticatedUser): Date | null {
    try {
      return this.jwtHelperService.getTokenExpirationDate(user?.authentication);
    } catch (err) {
      this.authService.logout();
    }
    return null;
  }

  private getExpirationTime(tokenExpiration: Date): number {
    return moment(tokenExpiration)
      .subtract(this.minutesBeforeTokenExpiration, 'minute')
      .diff(moment())
      .valueOf();
  }

  public scheduleSilentRefresh(user?: AuthenticatedUser): void {
    const storedUser = user || this.authService.getStoredUsed();
    if (storedUser) {
      const expirationDate = this.getExpirationDateFromToken(storedUser);
      if (expirationDate) {
        interval(this.getExpirationTime(expirationDate))
          .pipe(first())
          .subscribe(() => this.refreshToken());
      }
    }
  }
  
}
