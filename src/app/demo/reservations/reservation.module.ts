import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationRoutingModule } from './reservation.routing.module';
import { UpdateReservationComponent } from '../modal/update-reservation/update-reservation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, ReservationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[UpdateReservationComponent],
  declarations: [UpdateReservationComponent]
})
export class ReservationModule { }
