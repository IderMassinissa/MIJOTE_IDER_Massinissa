import type { NewRecipe, Recipe, RecipeSearchResponse } from "../types/recipe";
import type { LoginCredentials, LoginResponse } from "../types/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const JSON_HEADERS = { "Content-Type": "application/json" };

/** Erreur HTTP qui conserve le code*/
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, init);
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new ApiError(0, "Impossible de joindre le serveur.");
  }

  if (!response.ok) {
    throw new ApiError(response.status, `Erreur HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export function searchRecipes(
  query: string,
  signal?: AbortSignal,
): Promise<RecipeSearchResponse> {
  const params = new URLSearchParams({ q: query.trim(), limit: "0" });
  return request<RecipeSearchResponse>(`/recipes/search?${params.toString()}`, {
    signal,
  });
}

export function getRecipeById(
  id: number,
  signal?: AbortSignal,
): Promise<Recipe> {
  return request<Recipe>(`/recipes/${id}`, { signal });
}

export function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  });
}

export function createRecipe(
  payload: NewRecipe,
): Promise<NewRecipe & { id: number }> {
  return request<NewRecipe & { id: number }>("/recipes/add", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}
