import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile.service';
import { AuthFacadeService } from '../../shared/services/auth/auth-facade.service';

@Component({
  selector: 'app-profile',
  imports: [
    SharedModule,
    MatCardModule,
    TitleCasePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends BasePageComponent {

  currentUser!: User | null;
  group: string = '';
  displayName: string = '';
  readonly profileService = inject(ProfileService);
  readonly authFacadeService = inject(AuthFacadeService);

  override ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {

     console.log('User profile loaded:', this.authFacadeService.getUser());
    this.profileService.get().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.displayName = `${user.nome} ${user.cognome}`;
       
      },
      error: (err) => {
        //this.handleError(err);
      }
    });
  }



}
