document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the search button click
    const searchBtn = document.getElementById('search-btn');
    searchBtn.addEventListener('click', getMealList);

    // Event listener for the recipe close button click
    const recipeCloseBtn = document.getElementById('recipe-close-btn');
    recipeCloseBtn.addEventListener('click', () => {
        mealDetailsContent.parentElement.classList.remove('showRecipe');
    });

    // Function to get the meal list that matches the ingredients
    function getMealList() {
        const searchInputTxt = document.getElementById('search-input').value.trim();

            // Fetch the data from the API based on the search input
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
                .then((response) => response.json())
                .then((data) => {
                    let html = '';
    
                    if (data.meals) {
                        data.meals.forEach((meal) => {
                            html += `
                                <div class="meal-item" data-id="${meal.idMeal}">
                                    <div class="meal-img">
                                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                    </div>
                                    <div class="meal-name">
                                        <h3>${meal.strMeal}</h3>
                                        <a href="#" class="recipe-btn">Get Recipe</a>
                                    </div>
                                </div>
                            `;
                        });
                        mealList.classList.remove('notFound');
                    } else {
                        html = "Sorry, we didn't find any meal!";
                        mealList.classList.add('notFound');
                    }
    
                    mealList.innerHTML = html;
                });
        }
    
        // Event listener for the meal list click
        const mealList = document.getElementById('meal');
        mealList.addEventListener('click', getMealRecipe);
    
        // Function to get the recipe of the selected meal
        function getMealRecipe(e) {
            e.preventDefault();
    
            if (e.target.classList.contains('recipe-btn')) {
                const mealItem = e.target.parentElement.parentElement;
                fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
                    .then((response) => response.json())
                    .then((data) => mealRecipeModal(data.meals));
            }
        }
    
        // Function to create the modal with the meal recipe details
        const mealDetailsContent = document.querySelector('.meal-details-content');
    
        function mealRecipeModal(meal) {
            meal = meal[0];
            const html = `
                <h2 class="recipe-title">${meal.strMeal}</h2>
                <p class="recipe-category">${meal.strCategory}</p>
                <div class="recipe-instruct">
                    <h3>Instructions:</h3>
                    <p>${meal.strInstructions}</p>
                </div>
                <div class="recipe-meal-img">
                    <img src="${meal.strMealThumb}" alt="">
                </div>
            `;
            mealDetailsContent.innerHTML = html;
            mealDetailsContent.parentElement.classList.add('showRecipe');
        }
    
        // Event listener for the recipe form submit
        const recipeForm = document.getElementById('recipe-form');
        recipeForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const ingredients = document.getElementById('ingredients').value;
            const instructions = document.getElementById('instructions').value;
    
            const newRecipe = {
                title: title,
                ingredients: ingredients,
                instructions: instructions,
            };
    
            addFeaturedRecipe(newRecipe);
            recipeForm.reset();
        });
    
        // Function to add a new recipe to the featured recipes
        function addFeaturedRecipe(recipe) {
            const featuredRecipeCards = document.getElementById('featured-recipe-cards');
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.innerHTML = `
                <img src="URL to recipe image" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
            `;
            featuredRecipeCards.appendChild(card);
        }
    
        // Display any existing saved recipes on the page
        displayRecipes();
    });
    
    // Function to display saved recipes
    function displayRecipes() {
        const recipesContainer = document.getElementById('recipes-container');
        recipesContainer.innerHTML = ''; // Clear existing recipes
    
        // Retrieve the list of saved recipes from localStorage
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    
        if (recipes.length > 0) {
            recipes.forEach((recipe, index) => {
                const recipeCard = document.createElement('div');
                recipeCard.className = 'recipe-card';
                recipeCard.innerHTML = `
                    <h3>${recipe.title}</h3>
                    <p><strong>Ingredients:</strong><br>${recipe.ingredients}</p>
                    <p><strong>Instructions:</strong><br>${recipe.instructions}</p>
                `;
                recipesContainer.appendChild(recipeCard);
            });
        } else {
            recipesContainer.innerHTML = 'No saved recipes yet.';
        }
    }
    