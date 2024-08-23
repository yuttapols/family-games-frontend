// angular import
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenService } from '../authen.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharingService } from 'src/app/SharingService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export default class SignUpComponent implements OnInit{


  constructor(
    private callService : AuthenService,
    private formBuilider : FormBuilder,
    private sharing : SharingService,
    private router: Router,
  ) { 
  }

  ngOnInit() {

  }

  isShowPassword : any
  submitted = false;

  signUpForm = this.formBuilider.group({
    userName : new FormControl('' , Validators.required),
    password : new FormControl('' , Validators.required),
    fristName : new FormControl('' , Validators.required),
    lastName : new FormControl('' , Validators.required),
    telephone : new FormControl('' , [
      Validators.required,
      Validators.minLength(10),
    ]),
    email : new FormControl('',[
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
  })

  onKeyPress(event: KeyboardEvent) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  showPassword(){
    var x : any = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      this.isShowPassword = true
    } else {
      x.type = "password";
      this.isShowPassword = false
    }
  }

  checkUsreName(){
    let userName = this.signUpForm.value?.userName
    if(null != userName && userName !== ''){

      this.callService.checkUsreName(userName).subscribe(res=>{
        if(res.data  == '00'){
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ!',
            text: 'สามารถใช้ Username นี้ได้',
            confirmButtonText: 'ตกลง',
            heightAuto: false,
          })
        }else if(res.data  == '99'){
          Swal.fire({
            icon: 'error',
            title: 'ไม่สำเร็จ!',
            text: 'ไม่สามารถใช้ Username นี้ได้',
            confirmButtonText: 'ตกลง',
            heightAuto: false,
          })
        }
      })
    }else{
      Swal.fire({
        icon: 'error',
        title: 'ไม่สำเร็จ!',
        text: 'กรุณากรอกข้อมูล',
        confirmButtonText: 'ตกลง',
        heightAuto: false,
      })
    }

  }

  initSaveCustomer(){
    Swal.fire({
      title: "สร้างบัญชีใหม่?",
      text: "คุณต้องการสร้างบัญชีใหม่!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "สร้างบัญชี",
      cancelButtonText: "ยกเลิก",
      heightAuto: false,
      allowOutsideClick: false,
    }).then(res=>{
      if(res.isConfirmed){
        this.submitted = true;
        if(this.formValid()){
          this.callService.saveCustomer(this.signUpForm.value).subscribe(res=>{
            if(res.data){
              let loadingPrimary = '<div class="spinner-grow spinner-grow-sm text-primary" role="status"> <span class="visually-hidden">Loading...</span></div>'
              let loadingSuccess = '<div class="spinner-grow spinner-grow-sm text-success" role="status"> <span class="visually-hidden">Loading...</span></div>'
              let loadingDanger = '<div class="spinner-grow spinner-grow-sm text-danger" role="status"> <span class="visually-hidden">Loading...</span></div>'
              Swal.fire({
                title: "สำเร็จ !",
                icon: "success",
                html: "กำลังพาท่านไปยังหน้า Login! " + loadingPrimary + loadingSuccess+ loadingDanger,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton:false,
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                  this.router.navigate(['/auth/signin']);
                }
              });
            }else{
              Swal.fire({
                icon: 'error',
                title: 'ไม่สำเร็จ!',
                text: 'ไม่สามารถใช้ Username นี้ได้',
                confirmButtonText: 'ตกลง',
                heightAuto: false,
              })
            }
          })
          
        }
      }
    })
  }

  formValid(){
    if (this.signUpForm.valid) {
      return true;
    } 

    return false;
  }
}
