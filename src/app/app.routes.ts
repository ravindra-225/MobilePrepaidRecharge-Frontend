import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { FooterComponent } from './components/footer/footer.component';
import { RechargeComponent } from './components/recharge/recharge.component';
import { UserHistoryComponent } from './components/user-history/user-history.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { UserValidateComponent } from './components/user-validate/user-validate.component';

export const routes: Routes = [
  { path: '', redirectTo: 'user-validate', pathMatch: 'full' },
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'user-validate', component: UserValidateComponent },
  { path: 'recharge', component: RechargeComponent },
  { path: 'user-history', component: UserHistoryComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-register', component: AdminRegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'footer', component: FooterComponent },
];
