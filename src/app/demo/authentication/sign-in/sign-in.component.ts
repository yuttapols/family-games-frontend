// angular import
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenService } from '../authen.service';
import { FormBuilder, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { SharingService } from 'src/app/SharingService';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent implements OnInit{

  constructor(
    private callService : AuthenService,
    private formBuilider : FormBuilder,
    private sharing : SharingService,
    private router: Router,
  ) {
    this.sharing.tokenExpire.subscribe(value => {
      if(value){
        this.errorSwalLogout()
      }
    });
  }



  ngOnInit() {
    sessionStorage.removeItem("tokenData")
    this.sharing.tokenData.next(true);
  }

  loginForm = this.formBuilider.group({
    username : new FormControl(),
    password : new FormControl(),
    remember : false
  })

  onSubmit(){
    // this.callService.login()
    if(this.validForm()){

      this.callService.login(this.loginForm.value?.username, this.loginForm.value?.password).subscribe(resp=>{
        if(resp.data){

          let loadingPrimary = '<div class="spinner-grow spinner-grow-sm text-primary" role="status"> <span class="visually-hidden">Loading...</span></div>'
          let loadingSuccess = '<div class="spinner-grow spinner-grow-sm text-success" role="status"> <span class="visually-hidden">Loading...</span></div>'
          let loadingDanger = '<div class="spinner-grow spinner-grow-sm text-danger" role="status"> <span class="visually-hidden">Loading...</span></div>'
          Swal.fire({
            title: "เข้าสู่ระบบสำเร็จ !",
            icon: "success",
            html: "กำลังพาท่านไปยัง หน้าหลัก " + loadingPrimary + loadingSuccess+ loadingDanger,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton:false,
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
              sessionStorage.setItem("tokenData", JSON.stringify(resp.data))
              this.sharing.tokenData.next(true);
              this.router.navigate(['/analytics']);
            }
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'เข้าสู่ระบบไม่สำเร็จ!',
            text: 'กรุณาตรวจสอบข้อมูล',
            confirmButtonText: 'ตกลง',
            heightAuto: false,
          });
        }
      })

    }
  }

  validForm(){
    let title = 'กรุณาตรวจสอบข้อมูล!';
    let text = 'กรุณากรอก : ';
    if(!this.loginForm.value?.username){
      Swal.fire({
        icon: 'warning',
        title: title,
        text: text + 'Username',
        confirmButtonText: 'ตกลง',
        heightAuto: false,
      })
      return false;
    }else
    if(!this.loginForm.value?.password){
      Swal.fire({
        icon: 'warning',
        title: title,
        text: text + 'Password',
        confirmButtonText: 'ตกลง',
        heightAuto: false,
      })
      return false;
    }else
    if (this.loginForm.valid) {
      return true;
    }
    return false;
  }

  errorSwalLogout(){
    let head = 'TokenExpire กรุณาเข้าสู่ระบบใหม่อีกครั้ง!';
    // let detail = 'Token คุณหมดอายุ';

    let textHtml = '<b>' + head + '</b>'
    this.sharing.tokenExpire.next(false)
    Swal.fire({
      title: "<strong>เกิดข้อผิดพลาด!</strong>",
      icon: "error",
      html: textHtml,
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: true,
      allowOutsideClick: false,
      confirmButtonText: 'ตกลง',
      heightAuto: false,
    })
  }



}
