import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class SharingService {
    public tokenData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public uploadImage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public profileDetail: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public tokenExpire: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public reservation: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public intervalRev: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
