import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap } from 'rxjs';
import { Ingredient } from './ingredient.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipe = this.recipeService.getRecipe();
    this.http
      .put(
        'https://recart-1a03a-default-rtdb.firebaseio.com/recipes.json',
        recipe
      )
      .subscribe((data) => console.log(data));
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://recart-1a03a-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((recipe) => {
          return recipe.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipe) => {
          this.recipeService.setRecipes(recipe);
        })
      );
  }
}
