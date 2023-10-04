import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

/**
 * Recipe Service returns the recipes and helps creating recipe.
 */
@Injectable()
export class RecipeService {
  constructor(private shoppingListService: ShoppingListService) {}

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe 1',
      'Simple test description.',
      'https://www.seriouseats.com/thmb/uH_msyHurzKTDRzc4c_goGoLANI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SEA-classic-panzanella-salad-recipe-hero-03-74d7b17dde8f498795387ef0c22d7215.jpg',
      [new Ingredient('Test 1', 2), new Ingredient('Test 2', 4)]
    ),
    new Recipe(
      'A Test Recipe 2',
      'Simple test description.',
      'https://www.seriouseats.com/thmb/uH_msyHurzKTDRzc4c_goGoLANI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SEA-classic-panzanella-salad-recipe-hero-03-74d7b17dde8f498795387ef0c22d7215.jpg',
      [new Ingredient('Test 2', 1), new Ingredient('Test 3', 5)]
    ),
  ];

  /**
   * Gives the list of recipe.
   * @returns new copy (not original) of array.
   */
  getRecipe() {
    return this.recipes.slice();
  }

  /**
   * Gives particular recipe from the array.
   * @param index index to the array.
   * @returns
   */
  getRecipeById(index: number) {
    return this.recipes[index];
  }

  /**
   * Adds the list of ingredient to the ingredient array which is in the shoppingList service.
   * @param ingredients ingredient array.
   */
  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
