import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MealListComponent } from './components/meal-list/meal-list.component';
import { LoginComponent } from './components/login/login.component';
import { MealDetailsComponent } from './components/meal-details/meal-details.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'meal-list', component: MealListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'meal-details/:id', component: MealDetailsComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: '**', component: NotFoundComponent },
];
