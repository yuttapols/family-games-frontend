import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ReservationService } from '../reservation.service';
import { interval } from 'rxjs';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { SharingService } from 'src/app/SharingService';
import { ReservationModule } from '../reservation.module';
import { UpdateReservationComponent } from '../../modal/update-reservation/update-reservation.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [SharedModule,ReservationModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export default class ReservationComponent implements OnInit {

  constructor(
    private callService : ReservationService,
    private sharing : SharingService,

  ) {
    this.sharing.reservation.subscribe(value => {
      if(value){
        this.isReservation = false
        this.getAllRevStatusWaiting();
      }
    });
    this.sharing.intervalRev.subscribe(value => {
      if(!value){
        this.intervalCheckStatus();
      }else{
        this.ngOnDestroy()
      }
    });
  }

  @ViewChild(UpdateReservationComponent) modal?: UpdateReservationComponent;

  seatTypeDefalutValue : any = 1
  revWaiting : any

  MAX_CALL_REV_TIME : any = 10000 // 10 seconds

  seatTypeAll : any = []

  isReservation = false
  seatTypeId = new FormControl(this.seatTypeDefalutValue);
  userId : any
  revData : any
  userRevWaiting : any = 0
  subscription : any
  reasonCancelAll : any = []

  isCancelMaximum : any = false

  ngOnInit() {

    var userDataSession : any = sessionStorage.getItem("tokenData")
    let tokenData = JSON.parse(userDataSession)
    this.userId = tokenData.userId

    this.checkMaximumCancelRev(this.userId)

    this.getRevByUserIdStatusWaiting(this.userId)
    this.getAllRevStatusWaiting();
    this.getSeatTypeAll();
  }



  getRevByUserIdStatusWaiting(userId : any){
    this.callService.getRevByUserIdStatusWaiting(userId).subscribe(res=>{
      if(res.data){
        this.revData = res.data
        this.isReservation = res.data.revStatus == '1' ? true : false
      }
    })
  }

  checkMaximumCancelRev(userId : any){
    this.callService.checkMaximumCancelRev(userId).subscribe(res=>{
      if(res.data == '99'){
        this.isCancelMaximum = true
        this.ngOnDestroy()
      }
    })
  }

  getAllRevStatusWaiting(){
    this.revWaiting = 0;
    this.callService.getAllRevStatusWaiting().subscribe(res=>{
      if(res.data){
        this.revWaiting = res.data.length
        this.getReservationNoByUser(res.data)
      }
    })
  }

  intervalCheckStatus(){
    this.subscription = interval(this.MAX_CALL_REV_TIME).subscribe(x => {
      this.getAllRevStatusWaiting()
    });
  }
  getSeatTypeAll(){
    this.callService.getSeatTypeAll().subscribe(res=>{
      this.seatTypeAll = res.data
    })
  }

  getReservationNoByUser(data : any){
    this.userRevWaiting = data.map((m: any, index : any)=>{
      if(m.userId == this.userId){
        return index;
      }
    }).filter((f : any) => null != f);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initSaveRev(){
    Swal.fire({
      title: "คุณต้องการจองคิว?",
      text: "ยืนยันการจองคิวร้านหมูกระทะ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      heightAuto: false,
      allowOutsideClick: false,
    }).then(res=>{
      if(res.isConfirmed){
        let data = {
          userId : this.userId,
          seatTypeId : this.seatTypeId?.value
        }
        this.callService.saveRev(data).subscribe(res=>{
          if(res.data){
            this.getRevByUserIdStatusWaiting(this.userId)
            this.getAllRevStatusWaiting()
            Swal.fire({
              title: "Successful!",
              text: "ทำการจองคิวเรียบร้อย.",
              icon: "success",
              heightAuto: false,
            });
          }
        })
      }
    })
  }

  openCancelModal(){
    this.modal?.openModal(this.revData.id);
  }

}
