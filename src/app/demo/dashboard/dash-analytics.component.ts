// angular import
import { Component, OnInit, ViewChild } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApexTheme, NgApexchartsModule } from 'ng-apexcharts';
import { ProductSaleComponent } from './product-sale/product-sale.component';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
  ApexTooltip,
  ApexMarkers
} from 'ng-apexcharts';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../reservations/reservation.service';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from '../profile/profile.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  markers: ApexMarkers;
  theme: ApexTheme;
};

@Component({
  selector: 'app-dash-analytics',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule, ProductSaleComponent, RouterModule],
  templateUrl: './dash-analytics.component.html',
  styleUrls: ['./dash-analytics.component.scss']
})
export default class DashAnalyticsComponent  implements OnInit{
  // public props
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('customerChart') customerChart!: ChartComponent;
  chartOptions!: Partial<ChartOptions>;
  chartOptions_1!: Partial<ChartOptions>;
  chartOptions_2!: Partial<ChartOptions>;
  chartOptions_3!: Partial<ChartOptions>;

  userDetailSession : any = sessionStorage.getItem("tokenData")
  tokenData = JSON.parse(this.userDetailSession)
  userId : any = this.tokenData.userId
  ngOnInit() {

    this.getUserDetail(this.userId)
  }

  reservationList : any = []


  successNumber : number = 0
  unSuccessNumber : number = 0
  cards : any = []
  userDtData : any
  isAdmin : any

  getAllRevByUserId(){
    this.callService.getAllRevByUserId(this.userId).subscribe(res=>{
      if(res.data){
        this.reservationList = res.data

        let successCase =  this.reservationList.filter((x: any) => x.revStatus == '2');
        let unSuccessCase = this.reservationList.filter((x: any) => x.revStatus == '3' || x.revStatus == '4');

        this.pacthDataListCards(successCase.length, unSuccessCase.length);

      }else{
        this.pacthDataListCards(0, 0);
      }
    })
  }

  getAllRev(){

    this.callService.getRevAll().subscribe(res=>{
      if(res.data){

        this.reservationList = res.data

        let successCase =  this.reservationList.filter((x: any) => x.revStatus == '2');
        let unSuccessCase = this.reservationList.filter((x: any) => x.revStatus == '3' || x.revStatus == '4');

        this.pacthDataListCards(successCase.length, unSuccessCase.length);

      }else{
        this.pacthDataListCards(0, 0);
      }
    })
  }

  getUserDetail(userId : any){
    this.callServiceUser.getUserByUserId(userId).subscribe(res=>{
      if(res.data){
        this.userDtData = res.data
        this.isAdmin = this.userDtData.role.id == 1 ? true : false

        if(this.isAdmin){
          this.getAllRev()
        }else{
          this.getAllRevByUserId()
        }
      }
    })
  }

  pacthDataListCards(success : any, unSuccess : any){
    this.cards = [
      {
        background: 'bg-c-green',
        title: 'รายการที่จองสำเร็จ (ทั้งหมด)',
        icon: 'icon-check-circle',
        text: 'Completed Reservation (All)',
        number: success,
        no: ''
      },
      {
        background: 'bg-c-red',
        title: 'รายการที่จองไม่สำเร็จ (ทั้งหมด)',
        icon: 'icon-x-circle',
        text: 'UnCompleted Reservation (All)',
        number: unSuccess,
        no: ''
      },
    ];
  }

  // constructor
  constructor(private callService : ReservationService,
    private callServiceUser : ProfileService,
  ) {

    // this.chartOptions = {
    //   chart: {
    //     height: 205,
    //     type: 'line',
    //     toolbar: {
    //       show: false
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   stroke: {
    //     width: 2,
    //     curve: 'smooth'
    //   },
    //   series: [
    //     {
    //       name: 'Arts',
    //       data: [20, 50, 30, 60, 30, 50]
    //     },
    //     {
    //       name: 'Commerce',
    //       data: [60, 30, 65, 45, 67, 35]
    //     }
    //   ],
    //   legend: {
    //     position: 'top'
    //   },
    //   xaxis: {
    //     type: 'datetime',
    //     categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000'],
    //     axisBorder: {
    //       show: false
    //     }
    //   },
    //   yaxis: {
    //     show: true,
    //     min: 10,
    //     max: 70
    //   },
    //   colors: ['#73b4ff', '#59e0c5'],
    //   fill: {
    //     type: 'gradient',
    //     gradient: {
    //       shade: 'light',
    //       gradientToColors: ['#4099ff', '#2ed8b6'],
    //       shadeIntensity: 0.5,
    //       type: 'horizontal',
    //       opacityFrom: 1,
    //       opacityTo: 1,
    //       stops: [0, 100]
    //     }
    //   },
    //   grid: {
    //     borderColor: '#cccccc3b'
    //   }
    // };
    // this.chartOptions_1 = {
    //   chart: {
    //     height: 150,
    //     type: 'donut'
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   plotOptions: {
    //     pie: {
    //       donut: {
    //         size: '75%'
    //       }
    //     }
    //   },
    //   labels: ['New', 'Return'],
    //   series: [39, 10],
    //   legend: {
    //     show: false
    //   },
    //   tooltip: {
    //     theme: 'dark'
    //   },
    //   grid: {
    //     padding: {
    //       top: 20,
    //       right: 0,
    //       bottom: 0,
    //       left: 0
    //     }
    //   },
    //   colors: ['#4680ff', '#2ed8b6'],
    //   fill: {
    //     opacity: [1, 1]
    //   },
    //   stroke: {
    //     width: 0
    //   }
    // };
    // this.chartOptions_2 = {
    //   chart: {
    //     height: 150,
    //     type: 'donut'
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   plotOptions: {
    //     pie: {
    //       donut: {
    //         size: '75%'
    //       }
    //     }
    //   },
    //   labels: ['New', 'Return'],
    //   series: [20, 15],
    //   legend: {
    //     show: false
    //   },
    //   tooltip: {
    //     theme: 'dark'
    //   },
    //   grid: {
    //     padding: {
    //       top: 20,
    //       right: 0,
    //       bottom: 0,
    //       left: 0
    //     }
    //   },
    //   colors: ['#fff', '#2ed8b6'],
    //   fill: {
    //     opacity: [1, 1]
    //   },
    //   stroke: {
    //     width: 0
    //   }
    // };
    // this.chartOptions_3 = {
    //   chart: {
    //     type: 'area',
    //     height: 145,
    //     sparkline: {
    //       enabled: true
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   colors: ['#ff5370'],
    //   fill: {
    //     type: 'gradient',
    //     gradient: {
    //       shade: 'dark',
    //       gradientToColors: ['#ff869a'],
    //       shadeIntensity: 1,
    //       type: 'horizontal',
    //       opacityFrom: 1,
    //       opacityTo: 0.8,
    //       stops: [0, 100, 100, 100]
    //     }
    //   },
    //   stroke: {
    //     curve: 'smooth',
    //     width: 2
    //   },
    //   series: [
    //     {
    //       data: [45, 35, 60, 50, 85, 70]
    //     }
    //   ],
    //   yaxis: {
    //     min: 5,
    //     max: 90
    //   },
    //   tooltip: {
    //     fixed: {
    //       enabled: false
    //     },
    //     x: {
    //       show: false
    //     },
    //     marker: {
    //       show: false
    //     }
    //   }
    // };
  }
  // cards = [
  //   {
  //     background: 'bg-c-green',
  //     title: 'รายการที่จองสำเร็จ (ทั้งหมด)',
  //     icon: 'icon-check-circle',
  //     text: 'Completed Reservation (All)',
  //     number: this.successNumber,
  //     no: ''
  //   },
  //   {
  //     background: 'bg-c-red',
  //     title: 'รายการที่จองไม่สำเร็จ (ทั้งหมด)',
  //     icon: 'icon-x-circle',
  //     text: 'UnCompleted Reservation (All)',
  //     number: this.unSuccessNumber,
  //     no: ''
  //   },
  //   {
  //     background: 'bg-c-yellow',
  //     title: 'รายการที่กำลังดำเนินการจอง',
  //     icon: 'icon-repeat',
  //     text: 'This Month',
  //     number: '$42,56',
  //     no: '$5,032'
  //   },
  //   {
  //     background: 'bg-c-red',
  //     title: 'Total Profit',
  //     icon: 'icon-shopping-cart',
  //     text: 'This Month',
  //     number: '$9,562',
  //     no: '$542'
  //   }
  // ];

  pages = [
    {
      background: 'bg-info',
      title: 'ดูประวัติการจองคิว',
      icon: 'icon-list',
      text: 'History Reservation Pages',
      number: '',
      no: '',
      link : '/reservations/reservation-history'
    },
    {
      background: 'bg-info',
      title: 'หน้าจองคิว',
      icon: 'icon-package',
      text: 'Reservation Pages',
      number: '',
      no: '',
      link : '/reservations/reservation'
    },
  ];

  pages_admin = [
    {
      background: 'bg-info',
      title: 'จัดการ การจองคิว',
      icon: 'icon-list',
      text: 'Manage Reservation Pages',
      number: '',
      no: '',
      link : '/manage-genaral-reservation'
    },
    {
      background: 'bg-info',
      title: 'จัดการ ลูกค้า',
      icon: 'icon-list',
      text: 'Manage Customers Pages',
      number: '',
      no: '',
      link : '/genaral-customer'
    },
  ];

  images = [
    {
      src: 'assets/images/gallery-grid/img-grd-gal-1.jpg',
      title: 'Old Scooter',
      size: 'PNG-100KB'
    },
    {
      src: 'assets/images/gallery-grid/img-grd-gal-2.jpg',
      title: 'Wall Art',
      size: 'PNG-150KB'
    },
    {
      src: 'assets/images/gallery-grid/img-grd-gal-3.jpg',
      title: 'Microphone',
      size: 'PNG-150KB'
    }
  ];
}
