import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RangePipe } from '../../range.pipe';
import { Router } from '@angular/router';
import { AddMealModalComponent } from '../add-meal-modal/add-meal-modal.component'; 
import { DeleteMealModalComponent } from '../delete-meal-modal/delete-meal-modal.component';
import { OrderDto } from '../../shared/models/order.dto';
import { environment } from '../../../enviroments/enviroments';
import { MealDto } from '../../shared/models/meal.dto';

@Component({
  selector: 'app-admin-page',
  imports: [CommonModule, FormsModule, RangePipe, AddMealModalComponent, DeleteMealModalComponent], 
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  standalone: true,
})
export class AdminPageComponent implements OnInit {
  public orders: OrderDto[] = [];
  public displayedOrders: OrderDto[] = [];

  public itemsPerPageOptions = [4, 8, 16];
  public itemsPerPage = 8;
  public currentPage = 1;
  public totalPages = 1;

  public sortOptions = ['Newest to Oldest', 'Oldest to Newest'];
  public selectedSort = 'Newest to Oldest';

  public showOrders = false;
  public isAddMealModalVisible = false; 
  public isDeleteMealModalVisible = false; 

  public constructor(private http: HttpClient, private router: Router) {}

  public ngOnInit(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    this.http.get<OrderDto[]>(`${environment.apiUrl}/orders`).subscribe((data) => {
      this.orders = data;
      this.applySorting();
      this.updatePagination();
    });
  }

  private applySorting(): void {
    if (this.selectedSort === 'Newest to Oldest') {
      this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.selectedSort === 'Oldest to Newest') {
      this.orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    this.updateDisplayedOrders();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedOrders();
  }

  public updateDisplayedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedOrders = this.orders.slice(startIndex, endIndex);
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedOrders();
  }

  public onItemsPerPageChange(): void {
    this.updatePagination();
  }

  public onSortChange(): void {
    this.applySorting();
  }

  public goBack(): void {
    this.router.navigate(['/meal-list']);
  }

  public openAddMealModal(): void {
    this.isAddMealModalVisible = true;
  }

  public openDeleteMealModal(): void {
    this.isDeleteMealModalVisible = true;
  }

  public toggleOrders(): void {
    this.showOrders = !this.showOrders;
  }

  public closeAddMealModal(): void {
    this.isAddMealModalVisible = false;
  }

  public closeDeleteMealModal(): void {
    this.isDeleteMealModalVisible = false;
  }

  public onMealDeleted(deletedMealIds: number[]): void {
    console.log('Meals deleted:', deletedMealIds);
    this.closeDeleteMealModal();
  }

  public onMealAdded(newMeal: MealDto): void {
    console.log('New meal added:', newMeal);
    this.closeAddMealModal(); 
  }
}
