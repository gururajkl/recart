import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';

/**
 * Recipe Service returns the recipes and helps creating recipe.
 */
@Injectable()
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService) {}

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A Test Recipe 1',
  //     'Simple test description.',
  //     'https://www.seriouseats.com/thmb/uH_msyHurzKTDRzc4c_goGoLANI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SEA-classic-panzanella-salad-recipe-hero-03-74d7b17dde8f498795387ef0c22d7215.jpg',
  //     [new Ingredient('Test 1', 2), new Ingredient('Test 2', 4)]
  //   ),
  //   new Recipe(
  //     'A Test Recipe 2',
  //     'Simple test description.',
  //     'https://www.seriouseats.com/thmb/uH_msyHurzKTDRzc4c_goGoLANI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SEA-classic-panzanella-salad-recipe-hero-03-74d7b17dde8f498795387ef0c22d7215.jpg',
  //     [new Ingredient('Tomatos', 1), new Ingredient('Chilli', 5)]
  //   ),
  // ];

  private recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.notifyChangeToTheUI();
  }

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

  /**
   * Adds the recipe to the array.
   * @param recipe Recipe object.
   */
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  /**
   * Updates the recipe item.
   * @param index Position of the recipe need to update.
   * @param newRecipe Updated recipe.
   */
  updatedRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.notifyChangeToTheUI();
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.notifyChangeToTheUI();
  }

  notifyChangeToTheUI() {
    this.recipeChanged.next(this.recipes.slice());
  }
}
