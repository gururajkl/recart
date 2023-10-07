import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('f', { static: true }) shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  onAddItem(form: NgForm) {
    // using service to add the ingredient from the html child using ngForm.
    console.log(form);
    this.shoppingListService.addIngredient(
      new Ingredient(form.value.name, form.value.amount)
    );
  }

  ngOnInit(): void {
    this.shoppingListService.startedEditing.subscribe((indexValue) => {
      this.editMode = true;
      this.editItemIndex = indexValue;
      this.editedItem =
        this.shoppingListService.getIngredientsByIndex(indexValue);
      this.shoppingListForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount,
      });
    });
  }
}
