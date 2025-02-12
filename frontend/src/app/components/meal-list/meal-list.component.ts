// meal-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RangePipe } from '../../range.pipe';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

interface Meal {
  id: number;
  name: string;
  category: string;
  price: string;
  ingredients: { id: number; name: string }[];
}

@Component({
  selector: 'app-meal-list',
  imports: [FormsModule, CommonModule, RangePipe],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.scss',
  standalone: true,
})
export class MealListComponent implements OnInit {
  meals: Meal[] = [];
  filteredMeals: Meal[] = [];
  displayedMeals: Meal[] = [];

  // Pagination
  itemsPerPageOptions = [4, 8, 16];
  itemsPerPage = 8;
  currentPage = 1;
  totalPages = 1;
  searchQuery = '';

  categories = [
    'DESSERTS_ICECREAM',
    'COLD_DRINKS',
    'HOT_DRINKS',
    'BURGERS',
    'WRAPS_SALADS',
    'FRIES_SIDES',
    'CHICKEN',
  ];
  selectedCategories: string[] = [];
  sortOptions = ['Low to High', 'High to Low'];
  selectedSort = 'Low to High';

  constructor(
    private http: HttpClient,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.fetchMeals();
  }

  fetchMeals(): void {
    this.http.get<Meal[]>('http://localhost:9393/api/meals').subscribe((data) => {
      this.meals = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredMeals = this.meals.filter((meal) =>
      meal.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (this.selectedCategories.length > 0) {
      this.filteredMeals = this.filteredMeals.filter((meal) =>
        this.selectedCategories.includes(meal.category)
      );
    }

    if (this.selectedSort === 'Low to High') {
      this.filteredMeals.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else {
      this.filteredMeals.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMeals.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedMeals();
  }

  updateDisplayedMeals(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedMeals = this.filteredMeals.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedMeals();
  }

  onItemsPerPageChange(): void {
    this.updatePagination();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(category: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter((c) => c !== category);
    }
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  viewMealDetails(mealId: number): void {
    this.router.navigate(['/meal-details', mealId]);
  }

  addToCart(mealName: string): void {
    this.orderService.addToCart(mealName);
  }
}