import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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
export class AddMealModalComponent implements OnInit, OnChanges {
  @Input() public isVisible = false;
  @Input() public meal: MealDto | null = null;
  @Output() public closeModal = new EventEmitter<void>();
  @Output() public mealAdded = new EventEmitter<MealDto>();
  @Output() public mealUpdated = new EventEmitter<MealDto>();

  public categories = Object.values(MealCategories);
  public ingredients: IngredientDto[] = [];
  public selectedIngredients: number[] = [];
  public ingredientSelection: Record<number, boolean> = {};

  public isEditMode = false;

  public constructor(private http: HttpClient, private authService: AuthService) {}

  public ngOnInit(): void {
    this.fetchIngredients();
  }

  public ngOnChanges(): void {
    if (this.meal && this.meal.id !== 0) {
      this.isEditMode = true;
      this.selectedIngredients = this.meal.ingredients.map((i) => i.id);
      this.ingredientSelection = {};
      this.selectedIngredients.forEach((id) => (this.ingredientSelection[id] = true));
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  private fetchIngredients(): void {
    this.http.get<IngredientDto[]>(`${environment.apiUrl}/meals/ingredients`).subscribe({
      next: (data) => {
        this.ingredients = data;
        this.ingredients.forEach((ingredient) => {
          this.ingredientSelection[ingredient.id] = this.selectedIngredients.includes(ingredient.id);
        });
      },
      error: (error) => {
        console.error('Failed to fetch ingredients:', error);
      },
    });
  }

  private isMealValid(meal: MealDto | null): boolean {
    if (!meal) {
      alert('Meal data is missing.');

      return false;
    }

    return true;
  }
  
  private isMealNameValid(name: string | undefined): boolean {
    if (!name || name.length < 3 || name.length > 20) {
      alert('Name must be between 3 and 20 characters.');

      return false;
    }

    return true;
  }
  
  private isMealPriceValid(price: string | number): boolean {
    const priceNum = Number(price);
    if (!priceNum || priceNum <= 0 || priceNum >= 100) {
      alert('Price must be greater than 0 and less than 100.');

      return false;
    }

    return true;
  }
  
  private validateMeal(meal: MealDto | null): boolean {
    return this.isMealValid(meal) &&
           this.isMealNameValid(meal?.name) &&
           this.isMealPriceValid(meal?.price ?? '') &&
           this.isIngredientsSelected();
  }
  
  private isIngredientsSelected(): boolean {
    if (this.selectedIngredients.length === 0) {
      alert('Please select at least one ingredient.');

      return false;
    }

    return true;
  }
  
  public onSubmit(): void {
    this.selectedIngredients = this.ingredients
      .filter((ingredient) => this.ingredientSelection[ingredient.id])
      .map((ingredient) => ingredient.id);

    if (!this.validateMeal(this.meal)) {

      return;
    }

    const mealToSubmit: MealDto = {
      ...this.meal!,
      ingredients: this.selectedIngredients.map((id) => this.ingredients.find((ingredient) => ingredient.id === id)!),
    };

    if (this.isEditMode) {
      this.updateMeal(mealToSubmit);
    } else {
      this.addMeal(mealToSubmit);
    }
  }

  private updateMeal(meal: MealDto): void {
    this.http
      .put<MealDto>(`${environment.apiUrl}/meals/${meal.id}`, meal, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .subscribe({
        next: (updatedMeal) => {
          this.mealUpdated.emit(updatedMeal);
          this.closeModal.emit();
        },
        error: (error) => console.error('Failed to update meal:', error),
      });
  }

  private addMeal(meal: MealDto): void {
    this.http.get<MealDto[]>(`${environment.apiUrl}/meals`).subscribe({
      next: (meals) => {
        const maxId: number = meals.length > 0 ? Math.max(...meals.map((meal) => meal.id)) : 100;
        meal.id = maxId + 1;

        this.http
          .post<MealDto>(`${environment.apiUrl}/meals`, meal, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
          .subscribe({
            next: (newMeal) => {
              this.mealAdded.emit(newMeal);
              this.closeModal.emit();
            },
            error: (error) => console.error('Failed to add meal:', error),
          });
      },
      error: (error) => {
        console.error('Failed to fetch meals for ID generation:', error);
      },
    });
  }
  
  public onClose(): void {
    this.closeModal.emit();
  }

  private resetForm(): void {
    this.meal = {
      id: 0,
      name: '',
      category: MealCategories.DESSERTS_ICECREAM,
      price: '',
      ingredients: [],
    };
    this.selectedIngredients = [];
    this.ingredientSelection = {};
  }

  public toNumber(value: string): number {
    return Number(value);
  }
}