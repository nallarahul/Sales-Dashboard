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

  // Summary Cards Data
  summaryData: any = {
    totalUsers: 0,
    activeReps: 0,
    totalRevenue: 0,
    latestMonthRevenue: 0
  };

  // --- Line Chart Config (Smooth Tracing) ---
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Revenue ($)',
        fill: true,
        tension: 0.4,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: '#fff',
        pointBorderColor: 'rgb(75, 192, 192)',
        pointHoverBackgroundColor: 'rgb(75, 192, 192)',
        pointHoverBorderColor: '#fff',
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      y: {
        duration: 1000,
        delay: (context) => context.dataIndex * 300 // Smooth delay
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };
  
  // <--- THIS WAS MISSING!
  public lineChartLegend = true; 

  // --- Bar Chart Config (Staggered Rise) ---
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Deals Closed', 
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderRadius: 5
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      y: {
        duration: 1000,
        easing: 'easeOutCubic',
        delay: (context) => context.dataIndex * 150
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  constructor(
    private api: ApiService, 
    private auth: AuthService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe({
      next: (res) => {
        // 1. Set Data
        if (res.cards) this.summaryData = res.cards;

        if (res.charts && res.charts.salesConfig) {
          this.lineChartData.labels = res.charts.salesConfig.labels;
          this.lineChartData.datasets[0].data = res.charts.salesConfig.data;
        }

        if (res.charts && res.charts.dealsConfig) {
          this.barChartData.labels = res.charts.dealsConfig.labels;
          this.barChartData.datasets[0].data = res.charts.dealsConfig.data;
        }

        // 2. Trigger Update
        this.isDataLoaded = true;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('API Error, using fallback:', err);
        
        // Fallback Data
        this.summaryData = { totalUsers: 5, activeReps: 3, totalRevenue: 150000, latestMonthRevenue: 25000 };
        this.lineChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        this.lineChartData.datasets[0].data = [12000, 19000, 15000, 25000, 22000, 30000];
        this.barChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        this.barChartData.datasets[0].data = [5, 10, 8, 15, 12];

        this.isDataLoaded = true;
        this.cd.detectChanges();
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}