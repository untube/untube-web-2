import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { UploadService } from  '../../services/upload.service';
import { Category, Query, ALL_CATEGORIES } from '../../models/category';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import { HttpClient, HttpEventType} from '@angular/common/http';

import { Video, CREATE_VIDEO } from '../../models/video';
import { VideofileComponent } from './videofile/videofile.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  uploadedFiles: Array<File>;
  category = "Other";
  form: FormGroup;
  error: string;
  userId: number = 1;
  uploadResponse = { status: '', message: '', filePath: '' };
  categories$: Observable<Category[]>;
  uploadForm: FormGroup;
  selectedFile: File;
  user_id: number 
  category_id: string;
  description: string;
  destination: string;
  title: string
   
  page = 0;
  size = 4;


  
  foods1 = [];



  foods: Food[] = [
    {name: 'Yogurt', calories: 159, fat: 6, carbs: 24, protein: 4},
    {name: 'Sandwich', calories: 237, fat: 9, carbs: 37, protein: 4},
    {name: 'Eclairs', calories: 262, fat: 16, carbs: 24, protein: 6},
    {name: 'Cupcakes', calories: 305, fat: 4, carbs: 67, protein: 4},
    {name: 'Gingerbreads', calories: 356, fat: 16, carbs: 49, protein: 4},
 ];

  categories = ['Really Smart', 'Super Flexible',
            'Super Hot', 'Weather Changer'];

  constructor(private formBuilder: FormBuilder, private uploadService: UploadService,private fb: FormBuilder, 
    private apollo: Apollo,private http: HttpClient, private dialog: MatDialog) {

  }


  ngOnInit() {
    this.categories$ = this.apollo.watchQuery<Query>({ query: ALL_CATEGORIES}).valueChanges.pipe(map(result => result.data.allCategories));
    this.form = this.formBuilder.group({
      video: ['']
    });
    this.getData({pageIndex: this.page, pageSize: this.size});

  }

  getData(obj) {
    let index=0,
        startingIndex=obj.pageIndex * obj.pageSize,
        endingIndex=startingIndex + obj.pageSize;

    this.foods1 = this.foods.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }


  
  newVideo() {
    this.apollo.mutate({
      mutation: CREATE_VIDEO,
      variables: {
        user_id: this.user_id,
        category_id: this.category_id,
        title: this.title,
        destination: this.destination,
        description: this.description
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  onDelete(){
    console.log("Delete File")
  }

  onCreate(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(VideofileComponent,dialogConfig)
  }

}

class  Food {
   calories: number;
   carbs: number;
   fat: number;
   name: string;
   protein: number;
}













