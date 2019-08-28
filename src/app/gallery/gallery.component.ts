import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as tf from '@tensorflow/tfjs';
import { DataService } from '../data.service';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { NgxPicaService, NgxPicaErrorInterface } from 'ngx-pica';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements AfterViewInit {

  images: File[] = [];
  userFile: any;
  imageSelected: any;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  imagedata: ImageData = null;
  model: tf.LayersModel;
  predictions: any;
  result: any;
  
  @ViewChild("mycanvas", {static: true}) mycanvas;

  constructor(
    private _ngxPicaService: NgxPicaService
    ) { }

  ngAfterViewInit() {
    this.loadModel();
    this.canvas = this.mycanvas.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
  }

  async loadModel() {
    this.model = await tf.loadLayersModel('./assets/model.json');
  }

  
  onFileChange(event: any) {
    this.result = null;
    this.userFile = event.target.files[0];
    this.imageSelected = this.userFile.name;

    let ctx = this.canvas.getContext('2d');
    
    
    this._ngxPicaService.resizeImage(this.userFile, 32, 32, {})
      .subscribe((imageResized: File) => { 
        
        var reader = new FileReader();
        reader.onload = (e: any) => {
          
          var img = new Image();
          
          img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
          };
          img.src = e.target.result;
          // this.canvas = canvas;
          var dataURL = this.canvas.toDataURL("image/png");
          let url = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
          // console.log(url)
        };
        reader.readAsDataURL(event.target.files[0]);
        
    }, (err: NgxPicaErrorInterface) => {
        throw err.err;
    });

    
  }
 
  async getImgData() {
    
    console.log(this.canvas.width);
    this.ctx.drawImage(this.canvas, 0, 0, 32, 32);
    this.imagedata = this.ctx.getImageData(0, 0, 32, 32);
    console.log(this.imagedata);
  }


  async predict() {

    this.getImgData();

    await tf.tidy(() => {
  
      // Convert the canvas pixels to a Tensor of the matching shape
      let img = tf.browser.fromPixels(this.imagedata).resizeNearestNeighbor([32, 32]);
                  // .resizeNearestNeighbor([32, 32]).mean(2).expandDims(2).expandDims().toFloat();
      let img2 = tf.image.resizeBilinear(img,[32,32]).expandDims();
      // console.log(img2)
      // img = img2.reshape([1,32,32,3]);
      
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
