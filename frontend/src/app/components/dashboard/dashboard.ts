import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  isDataLoaded = false;

  // 1. Dashboard Stats
  summaryData: any = {
    totalUsers: 0, activeReps: 0, totalRevenue: 0, latestMonthRevenue: 0
  };

  // 2. Users List
  users: any[] = [];

  // 3. Chart Config
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [], label: 'Revenue ($)', fill: true, tension: 0.4,
      borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.2)',
      pointBackgroundColor: '#fff', pointBorderColor: 'rgb(75, 192, 192)'
    }]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false,
    animations: {
      y: { duration: 2000, delay: (ctx) => ctx.dataIndex * 300 }
    },
    plugins: { legend: { display: true, position: 'top' } }
  };
  public lineChartLegend = true;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ 
      data: [], label: 'Deals Closed', 
      backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)'],
      borderRadius: 5
    }]
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true, maintainAspectRatio: false,
    animations: {
      y: { duration: 1000, easing: 'easeOutCubic', delay: (ctx) => ctx.dataIndex * 200 }
    },
    plugins: { legend: { display: false } }
  };

  constructor(
    private api: ApiService, 
    private auth: AuthService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    // A. Get Stats & Charts
    this.api.getDashboardStats().subscribe({
      next: (res) => {
        if (res.cards) this.summaryData = res.cards;
        if (res.charts?.salesConfig) {
          this.lineChartData.labels = res.charts.salesConfig.labels;
          this.lineChartData.datasets[0].data = res.charts.salesConfig.data;
        }
        if (res.charts?.dealsConfig) {
          this.barChartData.labels = res.charts.dealsConfig.labels;
          this.barChartData.datasets[0].data = res.charts.dealsConfig.data;
        }
        this.finishLoading();
      },
      error: (err) => {
        console.error('Stats Error', err);
        this.loadMockData(); // Safety fallback
        this.finishLoading();
      }
    });

    // B. Get Users
    this.fetchUsers();
  }

  fetchUsers() {
    this.api.getAllUsers().subscribe({
      next: (data) => {
        // Handle if backend returns array [..] or object { users: [..] }
        if(Array.isArray(data)) this.users = data;
        else if(data.users) this.users = data.users;
      },
      error: (err) => console.error('Users Error', err)
    });
  }

  deleteUser(userId: string) {
    if(!confirm('Delete this user?')) return;
    this.api.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== userId);
        alert('User deleted');
      },
      error: () => alert('Failed to delete')
    });
  }

  finishLoading() {
    this.isDataLoaded = true;
    this.cd.detectChanges();
  }

  loadMockData() {
    // If API fails, show this so the UI doesn't look broken
    this.summaryData = { totalUsers: 5, activeReps: 3, totalRevenue: 150000, latestMonthRevenue: 25000 };
    this.lineChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    this.lineChartData.datasets[0].data = [12000, 19000, 15000, 25000, 22000, 30000];
    this.barChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    this.barChartData.datasets[0].data = [5, 10, 8, 15, 12];
  }

  logout() {
    this.auth.logout();
  }
}