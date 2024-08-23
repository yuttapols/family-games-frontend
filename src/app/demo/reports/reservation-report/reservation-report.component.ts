import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ReservationReportService } from '../reservation-report.service';

@Component({
  selector: 'app-reservation-report',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './reservation-report.component.html',
  styleUrls: ['./reservation-report.component.css']
})
export default class ReservationReportComponent implements OnInit {

  constructor(private callService : ReservationReportService) { }

  ngOnInit() {
  }


  downloadExcel(){
    this.callService.downloadExceReservation('ALL').subscribe(data=>{

      // let blob = new Blob([data], {type: 'application/pdf'});

      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "reservation-report.xlsx";
      link.click();
    })
  }
}
