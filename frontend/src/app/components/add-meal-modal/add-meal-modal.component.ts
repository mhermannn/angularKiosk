import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MealCategories } from '../../shared/enums/meal-categories';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { IngredientDto } from '../../shared/models/ingredient.dto';
import { MealDto } from '../../shared/models/meal.dto';
import { environment } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-add-meal-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-meal-modal.component.html',
  styleUrl: './add-meal-modal.component.scss',
  standalone: true,
})
export class AddMealModalComponent implements OnInit {
  @Input() public isVisible = false;
  @Output() public closeModal = new EventEmitter<void>();
  @Output() public mealAdded = new EventEmitter<MealDto>();

  public meal: MealDto = {
    id: 0,
    name: '',
    category: MealCategories.DESSERTS_ICECREAM,
    price: '',
    ingredients: []
  };

  public categories = Object.values(MealCategories);
  public ingredients: IngredientDto[] = [];
  public selectedIngredients: number[] = [];
  public ingredientSelection: Record<number, boolean> = {};

  public constructor(private http: HttpClient, private authService: AuthService) {}

  public ngOnInit(): void {
    this.fetchIngredients();
  }

  private fetchIngredients(): void {
    this.http.get<IngredientDto[]>(`${environment.apiUrl}/meals/ingredients`).subscribe({
      next: (data) => {
        this.ingredients = data;
        this.ingredients.forEach((ingredient) => {
          this.ingredientSelection[ingredient.id] = false;
        });
      },
      error: (error) => {
        console.error('Failed to fetch ingredients:', error);
      }
    });
  }

  public onSubmit(): void {
    this.selectedIngredients = this.ingredients
      .filter((ingredient) => this.ingredientSelection[ingredient.id])
      .map((ingredient) => ingredient.id);
  
    if (!this.meal.name || !this.meal.price || this.selectedIngredients.length === 0) {
      alert('Please fill out all fields and select at least one ingredient.');

      return;
    }
  
    if (parseFloat(this.meal.price) <= 0) {
      alert('Price must be greater than 0.');
      
      return;
    }
  
    this.http.get<MealDto[]>(`${environment.apiUrl}/meals`).subscribe({
      next: (meals) => {
        const maxId = meals.length > 0 ? Math.max(...meals.map((meal) => meal.id)) : 100;
        this.meal.id = maxId + 1;
  
        this.meal.ingredients = this.selectedIngredients.map((id) => {
          return this.ingredients.find((ingredient) => ingredient.id === id)!;
        });
  
        this.http.post<MealDto>(`${environment.apiUrl}/meals`, this.meal, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).subscribe({
          next: (newMeal) => {
            this.mealAdded.emit(newMeal);
            this.closeModal.emit();
          },
          error: (error) => {
            console.error('Failed to add meal:', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to fetch meals for ID generation:', error);
      }
    });
  }
  
  public onClose(): void {
    this.closeModal.emit();
  }
}
