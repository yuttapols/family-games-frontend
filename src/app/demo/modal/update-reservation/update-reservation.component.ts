import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from '../../reservations/reservation.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ReservationModule } from '../../reservations/reservation.module';
import Swal from 'sweetalert2';
import { SharingService } from 'src/app/SharingService';

declare let $: any;

@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.css']
})
export class UpdateReservationComponent implements OnInit {

  constructor(private callService : ReservationService,
    private formBuilder : FormBuilder,
    private sharing : SharingService,
  ) { }

  @ViewChild('updateReservation') modal?: ElementRef;

  ngOnInit() {
  }
  reasonCancelAll : any = []
  reasonCancelId = new FormControl(1);
  revId : any

  openModal(revId : any) {
    this.reasonCancelId = new FormControl(1);
    this.revId = revId;
    this.getReasonCancelAll()
    $(this.modal?.nativeElement).modal({show : true, backdrop: 'static', keyboard: false});
  }

  closeModal() {
    $(this.modal?.nativeElement).modal('hide');
  }

  getReasonCancelAll(){
    this.callService.getReasonCancelAll().subscribe(res=>{
      if(res.data){
        this.reasonCancelAll = res.data
      }
    })
  }

  onUpdate(){
    const data = {
      reasonCancelId : this.reasonCancelId?.value,
      revStatus : '3'
    };
    this.callService.updateRev(data, this.revId).subscribe(res=>{
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
        this.closeModal()
        let loadingPrimary = '<div class="spinner-grow spinner-grow-sm text-primary" role="status"> <span class="visually-hidden">Loading...</span></div>'
        let loadingSuccess = '<div class="spinner-grow spinner-grow-sm text-success" role="status"> <span class="visually-hidden">Loading...</span></div>'
        let loadingDanger = '<div class="spinner-grow spinner-grow-sm text-danger" role="status"> <span class="visually-hidden">Loading...</span></div>'
        Swal.fire({
          title: "ยกเลิกคิวสำเร็จ !",
          icon: "success",
          html: "กำลังพาท่านไปยัง หน้าจองคิว " + loadingPrimary + loadingSuccess+ loadingDanger,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton:false,
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            this.sharing.reservation.next(true)
          }
        });
      }else{
        this.closeModal()
        Toast.fire({
          icon: "error",
          title: "Save is Not successfully"
        })
      }
    })
  }

}
