export type Difficulty = "Easy" | "Medium" | "Hard";

// Valeurs du filtre.
export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "appetizer"
  | "dessert"
  | "beverage";

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

export interface RecipeSearchResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export interface NewRecipe {
  name: string;
  cuisine: string;
  difficulty: Difficulty;
  prepTimeMinutes: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  userId: number;
}
