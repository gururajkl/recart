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

  /**
   * Gives the ingredients.
   * @returns new copy of ingredients.
   */
  getIngredients() {
    return this.ingredients.slice();
  }

  /**
   * Adds new ingredient to the array.
   * @param ingredient Ingredient object.
   */
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    // using subject's next to emmit (saying) the changes.
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  /**
   * Adds ingredient array to the array.
   * @param ingredient Ingredient array.
   */
  addIngredients(ingredient: Ingredient[]) {
    this.ingredients.push(...ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
