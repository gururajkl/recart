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

  onSubmit(form: NgForm) {
    const newIngredient: Ingredient = new Ingredient(
      form.value.name,
      form.value.amount
    );

    // Using service to add or update the ingredient from the html child using ngForm.
    if (this.editMode) {
      this.shoppingListService.updateIngredient(
        this.editItemIndex,
        newIngredient
      );
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.onClear();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editItemIndex);
    this.onClear();
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
