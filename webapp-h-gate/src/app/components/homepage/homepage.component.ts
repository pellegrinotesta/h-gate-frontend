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
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SharedModule, MenuComponent, MatToolbarModule, RouterLink, RouterOutlet, MatMenuModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent extends BasePageComponent {

  me: User | undefined;

  constructor(private userService: UserService, private authService: AuthService) {
    super();
    this.userService.getById().subscribe({
      next: (res) => {
        this.me = res.data
      },
      error: (err) => {
        console.error('Errore nel recupero dei dati: ', err);
      }
    })
  }

  onLogout() {
    this.authService.logout();
  }
}
