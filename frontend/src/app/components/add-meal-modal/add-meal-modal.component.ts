import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MealCategories } from '../../model/enums/meal-categories';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 

interface Ingredient {
  id: number;
  name: string;
}

interface Meal {
  id: number;
  name: string;
  category: MealCategories;
  price: string;
  ingredients: Ingredient[];
}

@Component({
  selector: 'app-add-meal-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-meal-modal.component.html',
  styleUrl: './add-meal-modal.component.scss',
  standalone: true,
})
export class AddMealModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() mealAdded = new EventEmitter<Meal>();

  meal: Meal = {
    id: 0,
    name: '',
    category: MealCategories.DESSERTS_ICECREAM,
    price: '',
    ingredients: []
  };

  categories = Object.values(MealCategories);
  ingredients: Ingredient[] = [];
  selectedIngredients: number[] = [];
  ingredientSelection: { [id: number]: boolean } = {};

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchIngredients();
  }

  fetchIngredients(): void {
    this.http.get<Ingredient[]>('http://localhost:9393/api/meals/ingredients').subscribe({
      next: (data) => {
        this.ingredients = data;
        this.ingredients.forEach(ingredient => {
          this.ingredientSelection[ingredient.id] = false;
        });
      },
      error: (error) => {
        console.error('Failed to fetch ingredients:', error);
      }
    });
  }

  onSubmit(): void {
    this.selectedIngredients = this.ingredients
      .filter(ingredient => this.ingredientSelection[ingredient.id])
      .map(ingredient => ingredient.id);
  
    if (!this.meal.name || !this.meal.price || this.selectedIngredients.length === 0) {
      alert('Please fill out all fields and select at least one ingredient.');
      return;
    }
  
    if (parseFloat(this.meal.price) <= 0) {
      alert('Price must be greater than 0.');
      return;
    }
  
    this.http.get<Meal[]>('http://localhost:9393/api/meals').subscribe({
      next: (meals) => {
        const maxId = meals.length > 0 ? Math.max(...meals.map(meal => meal.id)) : 100;
        this.meal.id = maxId + 1;
  
        this.meal.ingredients = this.selectedIngredients.map(id => {
          return this.ingredients.find(ingredient => ingredient.id === id)!;
        });
  
        this.http.post<Meal>('http://localhost:9393/api/meals', this.meal, {
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
  

  onClose(): void {
    this.closeModal.emit();
  }
}