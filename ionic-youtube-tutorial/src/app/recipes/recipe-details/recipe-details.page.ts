import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit {
  loadedRecipe: Recipe;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipesService: RecipesService,
    private router: Router,
    private alertCtrl: AlertController) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('recipeId')) {
        this.router.navigate(['/recipes']);
        return;
      }
      const recipeId = paramMap.get('recipeId');
      this.loadedRecipe = this.recipesService.getRecipe(recipeId);
    });
  }
  onDeleteRecipe() {
    this.alertCtrl.create({header: 'Are you sure', message: 'Do you really want to delete the recipe?', buttons: [{
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'Delete',
      handler: () => {
        this.recipesService.deleteRecipe(this.loadedRecipe.id);
        this.router.navigate(['/recipes']);
        }
      }
    ]
  })
   .then(alertEl => {
     alertEl.present();
   });
  }
}
