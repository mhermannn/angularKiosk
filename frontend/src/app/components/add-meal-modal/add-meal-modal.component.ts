import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MealCategories } from '../../shared/enums/meal-categories';
import { CommonModule } from '@angular/common';
import { IngredientDto } from '../../shared/models/ingredient.dto';
import { MealDto } from '../../shared/models/meal.dto';
import { environment } from '../../../enviroments/enviroments';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ValidationErrorComponent } from '../validation-error/validation-error.component';

@Component({
  selector: 'app-add-meal-modal',
  imports: [ReactiveFormsModule, CommonModule, ValidationErrorComponent],
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
  public mealForm: FormGroup;
  public isEditMode = false;

  public constructor(private http: HttpClient, private fb: FormBuilder) {
    this.mealForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      category: [MealCategories.DESSERTS_ICECREAM, Validators.required],
      price: ['', [Validators.required, Validators.min(0.01), Validators.max(99.99)]],
      ingredients: this.fb.array([]),
    });
  }

  public ngOnInit(): void {
    this.fetchIngredients();
  }

  public ngOnChanges(): void {
    if (this.meal) {
      this.isEditMode = true;
      this.mealForm.patchValue({
        name: this.meal.name,
        category: this.meal.category,
        price: this.meal.price,
      });
      this.setIngredients(this.meal.ingredients.map((i) => i.id));
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  private fetchIngredients(): void {
    this.http.get<IngredientDto[]>(`${environment.apiUrl}/meals/ingredients`).subscribe({
      next: (data) => {
        this.ingredients = data;
        this.initializeIngredientsFormArray();
      },
      error: (error) => console.error('Failed to fetch ingredients:', error),
    });
  }

  private initializeIngredientsFormArray(): void {
    const ingredientsArray = this.mealForm.get('ingredients') as FormArray;
    this.ingredients.forEach(() => {
      ingredientsArray.push(new FormControl(false));
    });
  }

  private setIngredients(ingredientIds: number[]): void {
    const ingredientsArray = this.mealForm.get('ingredients') as FormArray;
    this.ingredients.forEach((ingredient, index) => {
      const isSelected = ingredientIds.includes(ingredient.id);
      ingredientsArray.at(index).setValue(isSelected);
    });
  }

  public onSubmit(): void {
    if (this.mealForm.invalid) {
      return;
    }

    const formValue = this.mealForm.value;
    const selectedIngredients = this.ingredients
      .filter((_, index) => formValue.ingredients[index])
      .map((ingredient) => ingredient.id);

    const mealToSubmit: MealDto = {
      ...this.meal!,
      name: formValue.name,
      category: formValue.category,
      price: formValue.price,
      ingredients: selectedIngredients.map((id) => this.ingredients.find((ingredient) => ingredient.id === id)!),
    };

    if (this.isEditMode) {
      this.updateMeal(mealToSubmit);
    } else {
      this.addMeal(mealToSubmit);
    }
  }

  private resetForm(): void {
    this.mealForm.reset({
      name: '',
      category: MealCategories.DESSERTS_ICECREAM,
      price: '',
      ingredients: [],
    });
  }

  public onClose(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  private addMeal(meal: MealDto): void {
    console.log('Adding meal:', meal);
    this.mealAdded.emit(meal);
    this.onClose();
  }

  private updateMeal(meal: MealDto): void {
    console.log('Updating meal:', meal);
    this.mealUpdated.emit(meal);
    this.onClose();
  }
}
