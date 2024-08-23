import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationModule } from './reservation.module';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reservation',
        loadComponent: () => import('./reservation/reservation.component')
      },
      {
        path: 'reservation-history',
        loadComponent: () => import('./reservation-history/reservation-history.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule{}
