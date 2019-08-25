import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import * as tf from '@tensorflow/tfjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  userFile: any;
  imageSelected: any;
  imageSrc: any;

  imageData: ImageData = null;
  model: tf.LayersModel;
  predictions: any;
  result: any;

  constructor(private idata: DataService) { }

  ngOnInit() {
    this.loadModel();
  }

  async loadModel() {
    this.model = await tf.loadLayersModel('./assets/model.json');
  }

  onFileChange(event: any) {
    this.userFile = event.target.files[0];
    this.imageSelected = this.userFile.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      console.log(event.target.result)
    }}

    async predict() {

      // this.imageData = this.imageSrc.imageData;
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
