// Angular Import
import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

// bootstrap
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharingService } from 'src/app/SharingService';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/demo/profile/profile.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements OnInit{
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
  tokenData : any
  isAdmin : any

  custNo : string = ''
  userDetail : any

  // constructor
  constructor(
    private sharing : SharingService,
    private router: Router,
    private callService : ProfileService,
    private sanitizer: DomSanitizer,
  ) {
    this.visibleUserList = false;
    this.chatMessage = false;

    this.sharing.uploadImage.subscribe( value => {
      var userDataSession : any = sessionStorage.getItem("tokenData")
      this.tokenData = JSON.parse(userDataSession)
      if(null != this.tokenData){
        this.callService.getUserDetailByUserId(this.tokenData.userId).subscribe(res=>{
          if(res.data){
            this.userDetail = res.data
            this.getImageV2(this.userDetail.id)
          }
        })

      }
    });
  }

  imageBlobUrl : any

  // public method
  onChatToggle(friendID: number) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }

  ngOnInit() {
    var userDetailSession : any = sessionStorage.getItem("tokenData")
    this.tokenData = JSON.parse(userDetailSession)
    if(null != this.tokenData){
      this.callService.getUserDetailByUserId(this.tokenData.userId).subscribe(res=>{
        if(res.data){
          this.userDetail = res.data
          this.getImageV2(this.userDetail.id)
          this.custNo = this.userDetail.customerNo
        }
      })
    }
  }

  logout(){
    sessionStorage.removeItem("tokenData")
    this.sharing.tokenData.next(true);
    this.router.navigate(['/auth/signin']);
  }

  getImageV2(data : any){
    this.callService.getImageByteProfile(data).subscribe(res=>{
      if(res.size > 0){
        let objectURL = URL.createObjectURL(res);
        this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }

    })
  }
}
