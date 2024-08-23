import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { CompressImageService } from 'src/app/service/compress-image.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { APP } from 'src/app/util/Constants';
import Swal from 'sweetalert2';
import { ProfileService } from './profile.service';
import { SharingService } from 'src/app/SharingService';
import { UpdateProfileComponent } from '../modal/update-profile/update-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [SharedModule, RouterModule],
  styleUrls: ['./profile.component.css']
})
export default class ProfileComponent implements OnInit {

  constructor(private compressImage: CompressImageService,
    private sanitizer: DomSanitizer,
    private callService : ProfileService,
    private sharing : SharingService,
  ) {
    this.sharing.profileDetail.subscribe( value => {
      if(null != value){
        this.getUserDetail(value);
      }else{
        var userDataSession : any = sessionStorage.getItem("tokenData")
        this.tokenData = JSON.parse(userDataSession)
        this.getUserDetail(this.tokenData.userId);
      }
    });
  }

  tokenData : any
  userDtData : any
  fullName : any
  roleName : any

  selectedFiles : any = []
  updateFlag : any = true
  imageBlobUrl : any
  userProfile : any

  userId : any

  @ViewChild('fileInput')
  fileInput: any = ElementRef;

  @ViewChild(UpdateProfileComponent) modal?: UpdateProfileComponent;

  ngOnInit() {
    var userDetailSession : any = sessionStorage.getItem("tokenData")
    this.tokenData = JSON.parse(userDetailSession)
    if(null != this.tokenData){
      this.userId = this.tokenData.userId
      this.getUser(this.userId);
      this.getUserDetail(this.userId);
    }
  }

  getUserDetail(userId : any){
    this.callService.getUserDetailByUserId(userId).subscribe(res=>{
      if(res.data){
        this.userDtData = res.data
        this.fullName = this.userDtData.fristName + ' ' + this.userDtData.lastName
        this.getImageV2(this.userDtData.id)
      }
    })
  }

  getUser(userId : any){
    this.callService.getUserByUserId(userId).subscribe(res=>{
        if(res.data){
          this.roleName = res.data.role.roleNameEng
        }
    });
  }

  uploadImageProfile(){
    if(null == this.selectedFiles[0]){
      let loadingPrimary = '<div class="spinner-grow spinner-grow-sm text-primary" role="status"> <span class="visually-hidden">Loading...</span></div>'
      let loadingSuccess = '<div class="spinner-grow spinner-grow-sm text-success" role="status"> <span class="visually-hidden">Loading...</span></div>'
      let loadingDanger = '<div class="spinner-grow spinner-grow-sm text-danger" role="status"> <span class="visually-hidden">Loading...</span></div>'
      Swal.fire({
        title: "ไม่สำเร็จ !",
        icon: "error",
        html: "กรุณาเลือกภาพของท่าน! " + loadingPrimary + loadingSuccess+ loadingDanger,
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton:false,
      })
    }else{
      Swal.fire({
        title: "อัปโหลดภาพ!",
        text: "ยืนยันการอัปโหลดภาพ!",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Upload !",
        heightAuto: false,
      }).then((result) => {
        if(result.isConfirmed){
          for(const file of this.selectedFiles[0]){
            const formData = new FormData();
            formData.append('file', file);
            this.callService.updateImageProfile(formData, this.tokenData.userId).subscribe(res=>{
              if(res.data){
                let loadingPrimary = '<div class="spinner-grow spinner-grow-sm text-primary" role="status"> <span class="visually-hidden">Loading...</span></div>'
                let loadingSuccess = '<div class="spinner-grow spinner-grow-sm text-success" role="status"> <span class="visually-hidden">Loading...</span></div>'
                let loadingDanger = '<div class="spinner-grow spinner-grow-sm text-danger" role="status"> <span class="visually-hidden">Loading...</span></div>'
                Swal.fire({
                  title: "สำเร็จ !",
                  icon: "success",
                  html: "กรุณารอสักครู่! " + loadingPrimary + loadingSuccess+ loadingDanger,
                  timer: 1500,
                  timerProgressBar: true,
                  showConfirmButton:false,
                }).then((result) => {
                  if (result.dismiss === Swal.DismissReason.timer) {
                    this.getImageV2(res.data);
                    this.updateFlag = true;
                    this.fileInput.nativeElement.value = "";
                    this.sharing.uploadImage.next(true);
                  }
                });
              }
            })
          }
        }
      })
    }

  }

  getImageV2(data : any){
    this.callService.getImageByteProfile(data).subscribe(res=>{
      if(res.size > 0){
        let objectURL = URL.createObjectURL(res);
        this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }

    })
  }

  onFileChanged(event: any) {
    this.updateFlag = true;
    this.selectedFiles = []
    this.selectedFiles.push(event.target.files);
    this.fileMaxSize(event.target.files);
    if(null != this.selectedFiles[0] && this.selectedFiles[0].length > 0){
      this.updateFlag = false;
    }
  }

  fileMaxSize(fileImageList : any){
    for(let img of fileImageList){
      if(this.validateFileType(img)){
        this.compressImage.compress(img)
        .pipe(take(1))
        .subscribe((compressedImage : any) => {
          if(APP.MAX_SIZE_IMAGE < compressedImage.size){
            Swal.fire({
              icon: 'warning',
              title: 'ตรวจสอบข้อมูล!',
              text: 'รูปภาพมีขนาดใหญ่กว่ากำหนด 1MB',
              confirmButtonText: 'ตกลง',
              heightAuto: false,
            }).then(res=>{
              if(res.isConfirmed){
                this.selectedFiles = []
                this.fileInput.nativeElement.value = "";
                this.updateFlag = true;
              }
            });
          }
        })
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'ตรวจสอบข้อมูล!',
          text: 'กรุณาเลือกไฟล์รูปภาพที่เป็น ' + APP.FILE_TYPE,
          confirmButtonText: 'ตกลง',
          heightAuto: false,
        }).then(res=>{
          if(res.isConfirmed){
            this.selectedFiles = []
            this.fileInput.nativeElement.value = "";
            this.updateFlag = true;
          }
        });
      }
    }
  }

  validateFileType(img : any){
    var fileName = img.name;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (APP.FILE_TYPE.includes(extFile)) {
      return true
    } else {
      return false;
    }
  }

  openModal(){
    this.modal?.openModal(this.userId);
  }

}
