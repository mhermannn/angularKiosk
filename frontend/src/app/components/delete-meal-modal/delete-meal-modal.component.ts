import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Meal {
  id: number;
  name: string;
}

@Component({
  selector: 'app-delete-meal-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './delete-meal-modal.component.html',
  styleUrls: ['./delete-meal-modal.component.scss'],
  standalone: true,
})
export class DeleteMealModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() mealsDeleted = new EventEmitter<number[]>();

  deleteMealForm: FormGroup;
  meals: Meal[] = [];
  availableMeals: Meal[] = [];
  validationMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {
    this.deleteMealForm = this.fb.group({
      meals: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.fetchMeals();
  }

  fetchMeals(): void {
    this.http.get<Meal[]>('http://localhost:9393/api/meals').subscribe({
      next: (data) => {
        this.meals = data;
        this.availableMeals = [...this.meals];
      },
      error: (error) => {
        console.error('Failed to fetch meals:', error);
      }
    });
  }

  get mealsFormArray(): FormArray {
    return this.deleteMealForm.get('meals') as FormArray;
  }

  addMealDropdown(): void {
    const mealControl = new FormControl('', Validators.required); 
    this.mealsFormArray.push(mealControl);
    this.updateAvailableMeals();
  }

  removeMealDropdown(index: number): void {
    this.mealsFormArray.removeAt(index);
    this.updateAvailableMeals();
  }

  onMealSelect(index: number): void {
    this.updateAvailableMeals();
    this.validateForm();
  }

  updateAvailableMeals(): void {
    const selectedMealIds = this.mealsFormArray.controls
      .map(control => control.value)
      .filter(value => value !== ''); 

    this.availableMeals = this.meals.filter(meal => !selectedMealIds.includes(meal.id));
  }

  validateForm(): void {
    const selectedMealIds = this.mealsFormArray.controls.map(control => control.value);

    const duplicateMeals = selectedMealIds.filter((mealId, index) => selectedMealIds.indexOf(mealId) !== index && mealId !== '');
    if (duplicateMeals.length > 0) {
      this.validationMessage = 'You have selected the same meal more than once. Please change one of the selections.';
      return;
    }

    const hasDefaultOption = selectedMealIds.includes('');
    if (hasDefaultOption) {
      this.validationMessage = 'Please select a meal for all dropdowns or remove the empty ones.';
      return;
    }

    this.validationMessage = '';
  }

  onSubmit(): void {
    this.validateForm();

    if (this.validationMessage) {
      return; 
    }

    const selectedMealIds = this.mealsFormArray.controls.map(control => control.value);
    if (confirm('Are you sure you want to delete the selected meals?')) {
      this.deleteMealsSequentially(selectedMealIds);
    }
  }

  async deleteMealsSequentially(mealIds: number[]): Promise<void> {
    const deletedMealIds: number[] = [];

    for (const mealId of mealIds) {
      try {
        await this.deleteMeal(mealId);
        deletedMealIds.push(mealId);
      } catch (error) {
        console.error(`Failed to delete meal with ID ${mealId}:`, error);
      }
    }

    if (deletedMealIds.length > 0) {
      this.mealsDeleted.emit(deletedMealIds);
      this.closeModal.emit();
    } else {
      alert('No meals were deleted. Please check your permissions and try again.');
    }
  }

  deleteMeal(mealId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`http://localhost:9393/api/meals/${mealId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).subscribe({
        next: () => resolve(),
        error: (error) => reject(error)
      });
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }
}