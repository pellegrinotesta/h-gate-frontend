import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../shared/services/auth/auth.service';
import { AuthenticatedUser } from '../../models/authenticated-user.model';
import { AuthFacadeService } from '../../shared/services/auth/auth-facade.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SharedModule, MenuComponent, MatToolbarModule, RouterLink, RouterOutlet, MatMenuModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent extends BasePageComponent {

  me: AuthenticatedUser | undefined;

  constructor(private authService: AuthService, private readonly authFacadeService: AuthFacadeService,) {
    super();
    this.authFacadeService
      .getUser()
      .pipe(take(1))
      .subscribe((user) => {
        this.me = user;
      });
  }

  onLogout() {
    this.authService.logout();
  }
}
