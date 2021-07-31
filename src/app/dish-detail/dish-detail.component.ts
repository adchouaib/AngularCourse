import { Component, OnInit, Input , ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment  } from '../shared/comment';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss']
})

export class DishDetailComponent implements OnInit {

  @ViewChild('fform') commentFormDirective;

  commentForm: FormGroup;
  comment: Comment;

  formErrors = {
    'Name':'',
    'Comment':''
  }

  validationMessages = {
    'Name':{
      'required' : 'Name is required',
      'minlength' : 'Name must be at least 2 characters'
    },
    'Comment' : {
      'required' : 'Comment is required'
    }
  }

  dishsIds : string[];
  next : string;
  prev : string;

  @Input()
  dish:Dish;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) {
      this.createForm();
    }

  ngOnInit() {
    this.dishservice.getDishesIds().subscribe( dishsIds => this.dishsIds = dishsIds );
    this.route.params.pipe(switchMap( (params:Params) => this.dishservice.getDish(params['id']) ))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  createForm(){
    this.commentForm = this.fb.group({
      Name : ['',[Validators.required, Validators.minLength(2)]],
      Comment:['',[Validators.required]],
      Rating : [''],
      Date : [new Date().toISOString()]
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any){
    if (!this.commentForm) return;
    for(const field in this.formErrors) {
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field] = '';
        const control = this.commentForm.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }


  setPrevNext(dishId : string){
    const index = this.dishsIds.indexOf(dishId);
    this.next = (index)==this.dishsIds.length-1? this.dishsIds[0]:this.dishsIds[index+1];
    this.prev = (index)==0? this.dishsIds[-1]:this.dishsIds[index-1];
  }

  goBack(): void{
    this.location.back();
  }

  onSubmit(){
    this.comment = {
      rating : this.commentForm.value.Rating,
      comment : this.commentForm.value.Comment,
      author : this.commentForm.value.Name,
      date : this.commentForm.value.Date
    };

    this.dish.comments.push(this.comment);

    this.commentForm.reset({
      Name : '',
      Comment : '',
      Rating : 0
    });

    this.commentFormDirective.resetForm();
  }

}
