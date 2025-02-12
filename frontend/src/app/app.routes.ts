import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MealListComponent } from './components/meal-list/meal-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { CartComponent } from './components/cart/cart.component';
import { MealDetailsComponent } from './components/meal-details/meal-details.component';
export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'meal-list', component: MealListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-account', component: UserAccountComponent },
  { path: 'cart', component: CartComponent },
  { path: 'meal-details/:id', component: MealDetailsComponent },
];
