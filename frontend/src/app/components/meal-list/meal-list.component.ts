import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RangePipe } from '../../range.pipe';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MealDto } from '../../shared/models/meal.dto';
import { environment } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-meal-list',
  imports: [FormsModule, CommonModule, RangePipe],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.scss',
  standalone: true,
})
export class MealListComponent implements OnInit {
  public meals: MealDto[] = [];
  public filteredMeals: MealDto[] = [];
  public displayedMeals: MealDto[] = [];

  public itemsPerPageOptions = [4, 8, 16];
  public itemsPerPage = 8;
  public currentPage = 1;
  public totalPages = 1;
  public searchQuery = '';

  public categories = [
    'DESSERTS_ICECREAM',
    'COLD_DRINKS',
    'HOT_DRINKS',
    'BURGERS',
    'WRAPS_SALADS',
    'FRIES_SIDES',
    'CHICKEN',
  ];
  public selectedCategories: string[] = [];
  public sortOptions = ['Low to High', 'High to Low', 'A to Z', 'Z to A'];
  public selectedSort = 'Low to High';

  public constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.fetchMeals();
  }

  private fetchMeals(): void {
    this.http.get<MealDto[]>(`${environment.apiUrl}/meals`).subscribe((data) => {
      this.meals = data;
      this.applyFilters();
    });
  }

  public applyFilters(): void {
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
    } else if (this.selectedSort === 'High to Low') {
      this.filteredMeals.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (this.selectedSort === 'A to Z') {
      this.filteredMeals.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.selectedSort === 'Z to A') {
      this.filteredMeals.sort((a, b) => b.name.localeCompare(a.name));
    }

    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMeals.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedMeals();
  }

  private updateDisplayedMeals(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedMeals = this.filteredMeals.slice(startIndex, endIndex);
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedMeals();
  }

  public onItemsPerPageChange(): void {
    this.updatePagination();
  }

  public onSearch(): void {
    this.applyFilters();
  }

  public onCategoryChange(category: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter((c) => c !== category);
    }
    this.applyFilters();
  }

  public onSortChange(): void {
    this.applyFilters();
  }

  public viewMealDetails(mealId: number): void {
    this.router.navigate(['/meal-details', mealId]);
  }


  public getMealImage(mealId: number): string {
    const imagePath = `assets/${mealId}.jpg`;
    const backupImagePath = 'assets/backup.png';

    return mealId <= 16 ? imagePath : backupImagePath;
  }
}
