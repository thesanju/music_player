
import axios from 'axios';

// This is a placeholder API key - in a real application you would use an environment variable
const API_KEY = 'a44d3fbe00bd4baea2f5d9ecc4d1de19';
const BASE_URL = 'https://api.spoonacular.com';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
}

export interface RecipeDetail extends Recipe {
  instructions: string;
  extendedIngredients: Ingredient[];
  analyzedInstructions: AnalyzedInstruction[];
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  originalString: string;
}

export interface AnalyzedInstruction {
  name: string;
  steps: InstructionStep[];
}

export interface InstructionStep {
  number: number;
  step: string;
  ingredients: { id: number; name: string; image: string }[];
  equipment: { id: number; name: string; image: string }[];
}

// Dummy data for when API calls fail
const dummyRecipes: Recipe[] = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 30,
    servings: 4,
    summary: "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper."
  },
  {
    id: 2,
    title: "Vegetable Curry",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 45,
    servings: 6,
    summary: "A flavorful vegetable curry with coconut milk and aromatic spices."
  },
  {
    id: 3,
    title: "Chocolate Chip Cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 25,
    servings: 24,
    summary: "Classic homemade chocolate chip cookies, chewy in the middle and crisp on the edges."
  },
  {
    id: 4,
    title: "Chicken Fajitas",
    image: "https://images.unsplash.com/photo-1593030739389-4748c539f216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 35,
    servings: 4,
    summary: "Sizzling chicken fajitas with bell peppers and onions, served with warm tortillas."
  },
  {
    id: 5,
    title: "Greek Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 15,
    servings: 4,
    summary: "Fresh Greek salad with tomatoes, cucumbers, olives, and feta cheese."
  },
  {
    id: 6,
    title: "Beef Stir Fry",
    image: "https://images.unsplash.com/photo-1541766574321-4a6877cd11c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 25,
    servings: 4,
    summary: "Quick and easy beef stir fry with colorful vegetables and savory sauce."
  },
  {
    id: 7,
    title: "Banana Bread",
    image: "https://images.unsplash.com/photo-1604329756680-0b88eea9b3b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 60,
    servings: 10,
    summary: "Moist and delicious banana bread, perfect for using up overripe bananas."
  },
  {
    id: 8,
    title: "Mushroom Risotto",
    image: "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 40,
    servings: 4,
    summary: "Creamy mushroom risotto with Arborio rice and freshly grated Parmesan cheese."
  },
  {
    id: 9,
    title: "Homemade Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 45,
    servings: 4,
    summary: "Delicious homemade pizza with your favorite toppings on a crispy crust."
  },
  {
    id: 10,
    title: "Strawberry Smoothie",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7d3be3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 5,
    servings: 2,
    summary: "Refreshing strawberry smoothie with yogurt and honey."
  },
  {
    id: 11,
    title: "Lasagna",
    image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 90,
    servings: 8,
    summary: "Classic Italian lasagna with layers of pasta, meat sauce, and cheese."
  },
  {
    id: 12,
    title: "Avocado Toast",
    image: "https://images.unsplash.com/photo-1588137378633-dea1288d6dfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    imageType: "jpg",
    readyInMinutes: 10,
    servings: 2,
    summary: "Simple and nutritious avocado toast with various toppings."
  }
];

// Dummy recipe detail
const dummyRecipeDetail: RecipeDetail = {
  id: 1,
  title: "Spaghetti Carbonara",
  image: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  imageType: "jpg",
  readyInMinutes: 30,
  servings: 4,
  summary: "Spaghetti Carbonara is a classic Italian pasta dish from Rome made with eggs, hard cheese, cured pork, and black pepper. It's simple to make with just a few ingredients yet full of flavor.",
  instructions: "Bring a large pot of salted water to boil and cook spaghetti according to package directions until al dente. Meanwhile, heat olive oil in a large skillet over medium heat. Add pancetta and cook until crispy. In a bowl, whisk together eggs, cheese, and pepper. Drain pasta, reserving 1/2 cup of pasta water. Immediately add hot pasta to the skillet with pancetta. Remove from heat and quickly pour in egg mixture, stirring constantly. Add pasta water as needed to create a creamy sauce. Serve immediately with extra cheese and freshly ground black pepper.",
  extendedIngredients: [
    { id: 1, name: "spaghetti", amount: 1, unit: "pound", originalString: "1 pound spaghetti" },
    { id: 2, name: "pancetta", amount: 8, unit: "ounces", originalString: "8 ounces diced pancetta" },
    { id: 3, name: "eggs", amount: 4, unit: "", originalString: "4 large eggs" },
    { id: 4, name: "Parmesan cheese", amount: 1, unit: "cup", originalString: "1 cup grated Parmesan cheese" },
    { id: 5, name: "black pepper", amount: 1, unit: "teaspoon", originalString: "1 teaspoon freshly ground black pepper" },
    { id: 6, name: "olive oil", amount: 2, unit: "tablespoons", originalString: "2 tablespoons olive oil" }
  ],
  analyzedInstructions: [
    {
      name: "",
      steps: [
        {
          number: 1,
          step: "Bring a large pot of salted water to boil.",
          ingredients: [{ id: 101, name: "water", image: "" }],
          equipment: [{ id: 201, name: "pot", image: "" }]
        },
        {
          number: 2,
          step: "Cook spaghetti according to package directions until al dente.",
          ingredients: [{ id: 1, name: "spaghetti", image: "" }],
          equipment: []
        },
        {
          number: 3,
          step: "Meanwhile, heat olive oil in a large skillet over medium heat.",
          ingredients: [{ id: 6, name: "olive oil", image: "" }],
          equipment: [{ id: 202, name: "skillet", image: "" }]
        },
        {
          number: 4,
          step: "Add pancetta and cook until crispy.",
          ingredients: [{ id: 2, name: "pancetta", image: "" }],
          equipment: []
        },
        {
          number: 5,
          step: "In a bowl, whisk together eggs, cheese, and pepper.",
          ingredients: [
            { id: 3, name: "eggs", image: "" },
            { id: 4, name: "Parmesan cheese", image: "" },
            { id: 5, name: "black pepper", image: "" }
          ],
          equipment: [{ id: 203, name: "bowl", image: "" }]
        },
        {
          number: 6,
          step: "Drain pasta, reserving 1/2 cup of pasta water.",
          ingredients: [],
          equipment: []
        },
        {
          number: 7,
          step: "Immediately add hot pasta to the skillet with pancetta.",
          ingredients: [],
          equipment: [{ id: 202, name: "skillet", image: "" }]
        },
        {
          number: 8,
          step: "Remove from heat and quickly pour in egg mixture, stirring constantly.",
          ingredients: [],
          equipment: []
        },
        {
          number: 9,
          step: "Add pasta water as needed to create a creamy sauce.",
          ingredients: [{ id: 101, name: "water", image: "" }],
          equipment: []
        },
        {
          number: 10,
          step: "Serve immediately with extra cheese and freshly ground black pepper.",
          ingredients: [
            { id: 4, name: "Parmesan cheese", image: "" },
            { id: 5, name: "black pepper", image: "" }
          ],
          equipment: []
        }
      ]
    }
  ]
};

export const getRandomRecipes = async (number = 12): Promise<Recipe[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/random`, {
      params: {
        apiKey: API_KEY,
        number,
      },
    });
    return response.data.recipes;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    console.log('Returning dummy recipes instead');
    // Return a slice of dummy recipes based on the requested number
    return dummyRecipes.slice(0, number);
  }
};

export const getRecipeById = async (id: number): Promise<RecipeDetail | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe with id ${id}:`, error);
    console.log('Returning dummy recipe detail instead');
    // Return a customized dummy recipe detail with the requested ID
    return {...dummyRecipeDetail, id};
  }
};

export const searchRecipes = async (query: string, number = 10): Promise<Recipe[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query,
        number,
        addRecipeInformation: true,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching recipes:', error);
    console.log('Returning filtered dummy recipes instead');
    // Return filtered dummy recipes that match the query
    const filteredRecipes = dummyRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query.toLowerCase()) || 
      recipe.summary.toLowerCase().includes(query.toLowerCase())
    );
    return filteredRecipes.slice(0, number);
  }
};
