import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

/**
 * ShoppingList Service resturns the list of ingredients and helps creating it.
 */
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Panner Biriyayi', 10),
    new Ingredient('Tomato', 2),
  ];

  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  /**
   * Gives the ingredients.
   * @returns new copy of ingredients.
   */
  getIngredients() {
    return this.ingredients.slice();
  }

  /**
   * Gives back the ingredient object as per the index.
   * @param index position of the element.
   * @returns Ingredient
   */
  getIngredientsByIndex(index: number): Ingredient {
    return this.ingredients[index];
  }

  /**
   * Adds new ingredient to the array.
   * @param ingredient Ingredient object.
   */
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    // using subject's next to emmit (saying) the changes.
    this.notifyIngredientChanged();
  }

  /**
   * Adds ingredient array to the array.
   * @param ingredient Ingredient array.
   */
  addIngredients(ingredient: Ingredient[]) {
    this.ingredients.push(...ingredient);
    this.notifyIngredientChanged();
  }

  /**
   * Updates the item in the ingredient array.
   * @param index position need to update.
   * @param newIngredient Ingredient object.
   */
  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.notifyIngredientChanged();
  }

  /**
   * Deletes the respected ingredient.
   * @param index position need to delete.
   */
  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.notifyIngredientChanged();
  }

  private notifyIngredientChanged() {
    // using subject's next to emmit (saying) the changes.
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
