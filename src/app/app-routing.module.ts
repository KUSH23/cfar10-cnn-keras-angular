import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CamComponent } from './cam/cam.component';

const routes: Routes = [
  
  {path: 'home', component: HomeComponent},
  {path: 'camera', component: CamComponent},
  {path: 'gallery', component: GalleryComponent},
  { path: '', redirectTo: '/home', pathMatch: 'prefix' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
