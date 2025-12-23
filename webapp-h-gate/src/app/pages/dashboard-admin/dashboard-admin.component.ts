import { Component, inject } from '@angular/core';
import { BasePageComponent } from '../../shared/components/base/base-page.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-admin',
  imports: [SharedModule, RouterLink],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent extends BasePageComponent {

  readonly dashboardService = inject(DashboardService);

  override ngOnInit(): void {
    this.dashboardService.dashboardAdmin().subscribe({
      next: (res) => {
        console.log('Admin Dashboard Data:', res.data);
      }
    })
  }

}
