import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {GoogleTextService} from '../../services/google-text.service';
import {BusinessProfileService} from '../../services/business-profile/business-profile.service';

@Component({
  selector: 'app-is-this-black-owned',
  templateUrl: './is-this-black-owned.component.html',
  styleUrls: ['./is-this-black-owned.component.css']
})
export class IsThisBlackOwnedComponent implements OnInit {
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public loading = false;
  public businessFound = false;
  public businessNotFound = false;
  public business: any; // business object returned from google api/geolocation
  public showBusinessSummary = false; // decidual factor for whether or not businessSummary view opens
  constructor(private googleTextService: GoogleTextService, private businessProfileService: BusinessProfileService) { }



  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;
public webcamImageInfo: any;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public ngOnInit(): void {
    this.loading = true; // loading camera
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      })
      .then(() => {
        this.loading = false;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.businessNotFound = false;
    this.loading = true;
    this.showWebcam = false;
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.webcamImageInfo = this.webcamImage.imageAsBase64;
    this.googleTextService.isBusinessVerified({img: webcamImage.imageAsBase64}).subscribe((businesses) => {
      // run an each loop over businesses lats/longs, returning the business with the
      // lowest distance from current user's location
         if (businesses !== 'Business Not Found, Please Try Again' && businesses.length !== 0) {
        const closestBusiness: any = businesses.reduce((closestBiz: any, business: any) => {
        if (this.getClosestBusiness(business.latitude, business.longitude)
        < this.getClosestBusiness(closestBiz.latitude, closestBiz.longitude)) {
          return business;
        }
        return closestBiz;
      });
        this.loading = false;
        this.business = closestBusiness;
        // this.showWebcam = false;
        this.allowCameraSwitch = false;
        this.businessNotFound = false;
        this.showBusiness();
      } else {
        this.businessNotFound = true;
        setTimeout(() => {
          this.businessNotFound = false;
        }, 3000);
        setTimeout(() => {
           this.loading = false;
           this.showWebcam = true;
        }, 500);
       }
    });
  }
    // getClosestBusiness takes in a businesses lat and long,
  public getClosestBusiness(businessLat: any, businessLong: any) {
    let userCurrentLat: number;
    let userCurrentLong: number;
    let distance: number;
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      userCurrentLat = position.coords.latitude * Math.PI / 180;
      userCurrentLong = position.coords.longitude * Math.PI / 180;
      businessLat = businessLat * Math.PI / 180;
      businessLong = businessLong * Math.PI / 180;
      const x: number = (businessLong - userCurrentLong) * Math.cos((userCurrentLat + businessLat) / 2);
      const y: number = (businessLat - userCurrentLat);
      distance = Math.sqrt(x * x + y * y) * 6371;
    });
  }
    return distance;
  }
public changeBusinessProfile(biz) {
this.businessProfileService.changeProfile(biz);
}
  // function that reopens camera instantly when user clicks 'take another picture'
  // this will allow user to re-take picture if they didn't get the results they were expecting
  public returnToCameraView() {
    this.showWebcam = true;
    this.allowCameraSwitch = true;
    this.showBusinessSummary = false;
  }
  // funciton that sets this.showWebcam and this.show{ webcam's button } to false and sets
  // showBusiness to render the searched for business's summary

  public showBusiness() {
    if (this.business) {
      this.businessFound = true;
      this.showBusinessSummary = true;
    }
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
}
