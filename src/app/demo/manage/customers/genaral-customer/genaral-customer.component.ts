import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ManageCustomerService } from '../manage-customer.service';
import { UpdateProfileComponent } from 'src/app/demo/modal/update-profile/update-profile.component';
import { SharingService } from 'src/app/SharingService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-genaral-customer',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './genaral-customer.component.html',
  styleUrls: ['./genaral-customer.component.css']
})
export default class GenaralCustomerComponent implements OnInit {

  constructor(private callService : ManageCustomerService,
    private sharing : SharingService,
  ) {
    this.sharing.profileDetail.subscribe( value => {
      if(value){
        this.loadData();
      }
    });
  }

  customers : any = []
  @ViewChild(UpdateProfileComponent) modal?: UpdateProfileComponent;

  ngOnInit() {
     this.loadData();
  }

  loadData(){
    this.callService.getAllCustomers().subscribe(res=>{
      if(res.data){
        this.customers = res.data
      }
    });
  }

  editCustomerModal(userId : any ){
    this.modal?.openModal(userId);
  }

  deleteCustomer(userId : any ){
    Swal.fire({
      title: "ต้องการลบข้อมูล?",
      text: "คุณต้องการลบลูกค้าใช่หรือไม่!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#339900",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!"
    }).then((result) => {
      if (result.isConfirmed) {

        this.callService.deleteCustomer(userId).subscribe(res=>{
          if(res.code == '200'){
            this.sharing.profileDetail.next(userId)
            this.loadData();
            Swal.fire({
              title: "Deleted!",
              text: "ลบข้อมูลลูกค้าเรียบร้อย.",
              icon: "success",
              // confirmButtonColor: "#33CCFF",
              confirmButtonText: "ตกลง!"
            });
          }else{
            Swal.fire({
              title: "เกิดข้อผิดพลาด!",
              text: "ลบข้อมูลไม่สำเร็จ.",
              icon: "error",
              // confirmButtonColor: "#33CCFF",
              confirmButtonText: "ตกลง!"
            });
          }

        });



      }
    });
  }

}
