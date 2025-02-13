import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RangePipe } from '../../range.pipe';
import { Router } from '@angular/router';
import { AddMealModalComponent } from '../add-meal-modal/add-meal-modal.component'; 
import { DeleteMealModalComponent } from '../delete-meal-modal/delete-meal-modal.component';

interface Order {
  orderId: number;
  customerId: number;
  orderType: string;
  orderStatus: string;
  orderPaymentType: string;
  shoppingCart: string[];
  createdAt: string;
}

@Component({
  selector: 'app-admin-page',
  imports: [CommonModule, FormsModule, RangePipe, AddMealModalComponent, DeleteMealModalComponent], 
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  standalone: true,
})
export class AdminPageComponent implements OnInit {
  orders: Order[] = [];
  displayedOrders: Order[] = [];

  itemsPerPageOptions = [4, 8, 16];
  itemsPerPage = 8;
  currentPage = 1;
  totalPages = 1;

  sortOptions = ['Newest to Oldest', 'Oldest to Newest'];
  selectedSort = 'Newest to Oldest';

  showOrders: boolean = false;
  isAddMealModalVisible: boolean = false; 
  isDeleteMealModalVisible: boolean = false; 

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.http.get<Order[]>('http://localhost:9393/api/orders').subscribe((data) => {
      this.orders = data;
      this.applySorting();
      this.updatePagination();
    });
  }

  applySorting(): void {
    if (this.selectedSort === 'Newest to Oldest') {
      this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.selectedSort === 'Oldest to Newest') {
      this.orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    this.updateDisplayedOrders();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedOrders();
  }

  updateDisplayedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedOrders = this.orders.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedOrders();
  }

  onItemsPerPageChange(): void {
    this.updatePagination();
  }

  onSortChange(): void {
    this.applySorting();
  }

  goBack(): void {
    this.router.navigate(['/meal-list']);
  }

  openAddMealModal(): void {
    this.isAddMealModalVisible = true;
  }

  openDeleteMealModal(): void {
    this.isDeleteMealModalVisible = true;
  }

  toggleOrders(): void {
    this.showOrders = !this.showOrders;
  }

  closeAddMealModal(): void {
    this.isAddMealModalVisible = false;
  }

  closeDeleteMealModal(): void {
    this.isDeleteMealModalVisible = false;
  }

  onMealDeleted(deletedMealIds: number[]): void {
    console.log('Meals deleted:', deletedMealIds);
    this.closeDeleteMealModal();
  }

  onMealAdded(newMeal: any): void {
    console.log('New meal added:', newMeal);
    this.closeAddMealModal(); 
  }
}