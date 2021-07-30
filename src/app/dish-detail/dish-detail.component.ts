import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss']
})

export class DishDetailComponent implements OnInit {

  dishsIds : string[];
  next : string;
  prev : string;

  @Input()
  dish:Dish;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    this.dishservice.getDishesIds().subscribe( dishsIds => this.dishsIds = dishsIds );
    this.route.params.pipe(switchMap( (params:Params) => this.dishservice.getDish(params['id']) ))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId : string){
    const index = this.dishsIds.indexOf(dishId);
    this.next = (index)==this.dishsIds.length-1? this.dishsIds[0]:this.dishsIds[index+1];
    this.prev = (index)==0? this.dishsIds[-1]:this.dishsIds[index-1];
  }

  goBack(): void{
    this.location.back();
  }

}
