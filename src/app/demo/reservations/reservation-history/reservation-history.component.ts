import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ReservationModule } from '../reservation.module';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [SharedModule,ReservationModule],
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.css']
})
export default class ReservationHistoryComponent implements OnInit {

  constructor(private callService : ReservationService,) { }

  reservationList : any = []
  ngOnInit() {
    this.getAllRevByUserId()
  }

  userDetailSession : any = sessionStorage.getItem("tokenData")
  tokenData = JSON.parse(this.userDetailSession)
  userId : any = this.tokenData.userId

  getAllRevByUserId(){
    this.callService.getAllRevByUserId(this.userId).subscribe(res=>{
      if(res.data){
        this.reservationList = res.data
      }
    })
  }

}
