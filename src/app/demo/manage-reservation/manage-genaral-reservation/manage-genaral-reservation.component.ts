import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ReservationService } from '../../reservations/reservation.service';
import { interval } from 'rxjs';
import { SharingService } from 'src/app/SharingService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-genaral-reservation',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './manage-genaral-reservation.component.html',
  styleUrls: ['./manage-genaral-reservation.component.css']
})
export default class ManageGenaralReservationComponent implements OnInit {

  constructor(private reservationCallService : ReservationService,
    private sharing : SharingService,
  ) {
    this.sharing.intervalRev.subscribe(value => {
      if(!value){
        this.intervalCheckStatus();
      }else{
        this.ngOnDestroy()
      }
    });
  }

  ngOnInit() {
    this.getAllRevStatusWaiting()
  }

  revDataList : any = []
  MAX_CALL_REV_TIME : any = 10000 // 10 seconds
  subscription : any

  getAllRevStatusWaiting(){
    this.reservationCallService.getAllRevStatusWaiting().subscribe(res=>{
      if(res.data){
        this.revDataList = res.data
      }else{
        this.revDataList = []
      }
    })
  }

  intervalCheckStatus(){
    this.subscription = interval(this.MAX_CALL_REV_TIME).subscribe(x => {
      this.getAllRevStatusWaiting()
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onUpdate(revId : any, status : any){

    const data = {
      revStatus : status
    };
    this.reservationCallService.updateRev(data, revId).subscribe(res=>{
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      if(res.data){

        let loadingPrimary = '<div class="spinner-grow spinner-grow-sm text-primary" role="status"> <span class="visually-hidden">Loading...</span></div>'
        let loadingSuccess = '<div class="spinner-grow spinner-grow-sm text-success" role="status"> <span class="visually-hidden">Loading...</span></div>'
        let loadingDanger = '<div class="spinner-grow spinner-grow-sm text-danger" role="status"> <span class="visually-hidden">Loading...</span></div>'

        Swal.fire({
          title: "สำเร็จ !",
          icon: "success",
          html: "กำลังโหลด " + loadingPrimary + loadingSuccess+ loadingDanger,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton:false,
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            this.getAllRevStatusWaiting()
          }
        });
      }else{
        Toast.fire({
          icon: "error",
          title: "Save is Not successfully"
        })
      }
    })
  }
}
