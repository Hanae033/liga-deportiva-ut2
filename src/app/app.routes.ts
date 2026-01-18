import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminComponent } from './pages/admin/admin';
import { UserComponent } from './pages/user/user';
import { CaptainComponent } from './pages/captain/captain';
import { RefereeComponent } from './pages/referee/referee';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'user', component: UserComponent },
  { path: 'captain', component: CaptainComponent },
  { path: 'referee', component: RefereeComponent }
];

