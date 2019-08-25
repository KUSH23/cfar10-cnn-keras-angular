import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {WebcamImage} from '../modules/webcam/domain/webcam-image';
import {WebcamUtil} from '../modules/webcam/util/webcam.util';
import {WebcamInitError} from '../modules/webcam/domain/webcam-init-error';
import * as tf from '@tensorflow/tfjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-cam',
  templateUrl: './cam.component.html',
  styleUrls: ['./cam.component.scss']
})
export class CamComponent implements OnInit {

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public facingMode: string = 'environment';
  public errors: WebcamInitError[] = [];

  public webcamImage: WebcamImage = null;
  public captureImageData : boolean = true;
  private trigger: Subject<void> = new Subject<void>();

  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  imageData: ImageData = null;
  model: tf.LayersModel;
  predictions: any;
  result: any;
  constructor(private idata: DataService) { }

  ngOnInit() {
    this.loadModel();

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  async loadModel() {
    this.model = await tf.loadLayersModel('./assets/model.json');
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.log('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== "") {
      result.facingMode = { ideal: this.facingMode };
    }

    return result;
  }

  triggernewSnapshot(){
    this.webcamImage=null;
    this.result = null;
  }

  async predict() {
    this.result = null;
    this.imageData = this.webcamImage.imageData;
    // console.log(this.imageData)

    await tf.tidy(() => {
  
      // Convert the canvas pixels to a Tensor of the matching shape
      let img = tf.browser.fromPixels(this.imageData).resizeNearestNeighbor([32, 32]);
                  // .resizeNearestNeighbor([32, 32]).mean(2).expandDims(2).expandDims().toFloat();
      let img2 = tf.image.resizeBilinear(img,[32,32]).expandDims();
      // console.log(img2)
      // img = img2.reshape([1,32,32,3]);
      // console.log(img)
      img2 = tf.cast(img2, 'float32');
      // Make and format the predications
      let output = this.model.predict(img2) as any;
  
      // Save predictions on the component
      this.predictions = Array.from(output.dataSync()); 
      console.log(this.predictions)
      
      if(this.predictions[0]){
        this.result='airplane';
      }else if(this.predictions[1]){
        this.result='automobile';
      }else if(this.predictions[2]){
        this.result='bird';
      }else if(this.predictions[3]){
        this.result='cat';
      }else if(this.predictions[4]){
        this.result='deer';
      }else if(this.predictions[5]){
        this.result='dog';
      }else if(this.predictions[6]){
        this.result='frog';
      }else if(this.predictions[7]){
        this.result='horse';
      }else if(this.predictions[8]){
        this.result='ship';
      }else if(this.predictions[9]){
        this.result='truck';
      }
  
    });
  
  }

}