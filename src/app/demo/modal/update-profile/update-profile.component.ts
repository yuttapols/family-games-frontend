import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProfileService } from '../../profile/profile.service';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SharingService } from 'src/app/SharingService';
import { ActivatedRoute } from '@angular/router';


declare let $: any;

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  constructor(private callService : ProfileService,
    private formBuilder : FormBuilder,
    private sharing : SharingService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  @ViewChild('updateProfile') modal?: ElementRef;

  submitted = false;
  userId : any

  updateProfileForm = this.formBuilder.group({
    fristName : new FormControl('' , Validators.required),
    lastName : new FormControl('' , Validators.required),
    telephone : new FormControl('' , [
      Validators.required,
      Validators.minLength(10),
    ]),
    email : new FormControl('',[
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
  })

  setDataForm(data : any){
    this.updateProfileForm.patchValue({
      fristName : data.fristName,
      lastName : data.lastName,
      email : data.email,
      telephone : data.telephone,
    })
  }

  onKeyPress(event: KeyboardEvent) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  formValid(){
    if (this.updateProfileForm.valid) {
      return true;
    }
    return false;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.updateProfileForm.controls;
  }

   onUpdate(){
    this.submitted = true;
    if(this.formValid()){
      let data = this.updateProfileForm.value;
      this.callService.updateProfile(data , this.userId).subscribe(res=>{
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
          this.sharing.profileDetail.next(this.userId);
          this.closeModal()
          Toast.fire({
            icon: "success",
            title: "Update is successfully"
          })
        }else{
          Toast.fire({
            icon: "error",
            title: "Update is Not successfully"
          }).then(res=>{
            this.closeModal()
          });
        }
      })

    }
   }

  openModal(userId : any) {
    this.userId = userId
    this.submitted = false
    this.callService.getUserDetailByUserId(userId).subscribe(res=>{
      if(res.data){
        this.setDataForm(res.data);
      }
    })
    $(this.modal?.nativeElement).modal({show : true, backdrop: 'static', keyboard: false});
  }

  closeModal() {
    $(this.modal?.nativeElement).modal('hide');
  }

}
