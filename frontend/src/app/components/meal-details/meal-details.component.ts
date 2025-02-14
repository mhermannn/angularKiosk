import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MealDto } from '../../shared/models/meal.dto';
import { environment } from '../../../enviroments/enviroments';
import { AuthService } from '../../services/auth.service';
import { AddMealModalComponent } from '../add-meal-modal/add-meal-modal.component';

@Component({
  selector: 'app-meal-details',
  imports: [AddMealModalComponent],
  templateUrl: './meal-details.component.html',
  styleUrl: './meal-details.component.scss',
  standalone: true,
})
export class MealDetailsComponent implements OnInit {
  public meal: MealDto | null = null;

  public constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public authService: AuthService,
  ) {}

  public ngOnInit(): void {
    const mealId = this.route.snapshot.paramMap.get('id');
    if (mealId) {
      this.http.get<MealDto>(`${environment.apiUrl}/meals/${mealId}`).subscribe((meal) => {
        this.meal = meal;
      });
    }
  }

  public goBack(): void {
    this.router.navigate(['/meal-list']);
  }

  public async deleteMeal(): Promise<void> {
    if (!this.meal) return;
  
    if (!this.authService.isAdmin()) {
      alert("You don't have permission to delete meals.");

      return;
    }
  
    const confirmDelete = window.confirm(`Are you sure you want to delete ${this.meal.name}?`);
    if (!confirmDelete) return;
  
    const mealId = this.route.snapshot.paramMap.get('id');
    if (!mealId) return;
  
    try {
      await this.http
        .delete(`${environment.apiUrl}/meals/${mealId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .toPromise();
  
      alert('Meal deleted successfully!');
      this.router.navigate(['/meal-list']);
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Failed to delete meal. Please try again.');
    }
  }
  

  public getMealImage(mealId: number): string {
    const imagePath = `assets/${mealId}.jpg`;
    const backupImagePath = 'assets/backup.png';

    return mealId <= 16 ? imagePath : backupImagePath;
  }

  public isEditMealModalVisible = false;

  public openEditMealModal(): void {
    this.isEditMealModalVisible = true;
  }

  public closeEditMealModal(): void {
    this.isEditMealModalVisible = false;
  }

  public onMealUpdated(updatedMeal: MealDto): void {
    this.meal = updatedMeal;
    this.closeEditMealModal();
  }
}