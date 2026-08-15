// =====================================================
// COOK IT UP
// js/script.js
// COMPLETE SCRIPT
// =====================================================


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let allRecipes = [];
let currentFilter = "All";


// =====================================================
// DOM READY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // -------------------------------------------------
    // RECIPES PAGE
    // -------------------------------------------------

    const recipeGrid = document.getElementById("recipeGrid");

    if (recipeGrid) {
        loadRecipes();
    }


    // -------------------------------------------------
    // SEARCH
    // -------------------------------------------------

    const recipeSearch =
        document.getElementById("recipeSearch");

    if (recipeSearch) {

        recipeSearch.addEventListener(
            "input",
            function () {
                applyFilters();
            }
        );

    }


    // -------------------------------------------------
    // INDIVIDUAL RECIPE PAGE
    // -------------------------------------------------

    const recipeDetails =
        document.getElementById("recipeDetails");

    if (recipeDetails) {
        loadRecipeDetails();
    }


    // -------------------------------------------------
    // HOMEPAGE POPULAR RECIPES
    // -------------------------------------------------

    const popularRecipes =
        document.getElementById("popularRecipes");

    if (popularRecipes) {
        loadPopularRecipes();
    }

});


// =====================================================
// LOAD ALL RECIPES
// =====================================================

async function loadRecipes() {

    const grid =
        document.getElementById("recipeGrid");

    if (!grid) {
        return;
    }


    try {

        const response =
            await fetch("data/recipes.json");


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "recipes.json must contain an array"
            );

        }


        allRecipes = data;


        console.log(
            "Cook It Up: Recipes loaded:",
            allRecipes.length
        );


        // Display recipes
        displayRecipes(allRecipes);


        // -------------------------------------------------
        // SEARCH FROM URL
        // -------------------------------------------------

        const params =
            new URLSearchParams(
                window.location.search
            );


        const search =
            params.get("search");


        if (search) {

            const searchInput =
                document.getElementById(
                    "recipeSearch"
                );


            if (searchInput) {

                searchInput.value =
                    search;

            }


            applyFilters();

        }

    }


    catch (error) {

        console.error(
            "Error loading recipes:",
            error
        );


        grid.innerHTML = `

            <div class="no-results">

                <h2>
                    Unable to load recipes 😔
                </h2>

                <p>
                    Something went wrong while
                    loading the recipes.
                </p>

                <p>
                    Please check:
                </p>

                <p>
                    <strong>
                        data/recipes.json
                    </strong>
                </p>

                <p>
                    Then refresh the page.
                </p>

            </div>

        `;

    }

}


// =====================================================
// DISPLAY RECIPES
// =====================================================

function displayRecipes(recipes) {

    const grid =
        document.getElementById("recipeGrid");


    if (!grid) {
        return;
    }


    // Clear grid
    grid.innerHTML = "";


    // -------------------------------------------------
    // NO RESULTS
    // -------------------------------------------------

    if (!recipes || recipes.length === 0) {

        grid.innerHTML = `

            <div class="no-results">

                <h2>
                    No recipes found 😔
                </h2>

                <p>
                    Try another recipe,
                    state, category or food type.
                </p>

            </div>

        `;

        return;
    }


    // -------------------------------------------------
    // CREATE CARDS
    // -------------------------------------------------

    recipes.forEach(function (recipe) {

        const card =
            document.createElement("article");


        card.className =
            "recipe-card";


        // Safe values
        const id =
            recipe.id;


        const name =
            recipe.name ||
            "Unnamed Recipe";


        const state =
            recipe.state ||
            "";


        const category =
            recipe.category ||
            "";


        const type =
            recipe.type ||
            "";


        const description =
            recipe.description ||
            "A delicious traditional recipe.";


        const image =
            recipe.image ||
            "";


        const time =
            recipe.totalTime ||
            recipe.cookTime ||
            recipe.prepTime ||
            "—";


        const servings =
            recipe.servings ||
            "—";


        // -------------------------------------------------
        // CARD HTML
        // -------------------------------------------------

        card.innerHTML = `

            <div class="recipe-image">

                ${
                    image
                    ?
                    `
                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(name)}"
                        loading="lazy"
                    >
                    `
                    :
                    `
                    <span class="recipe-placeholder">
                        ${getRecipeEmoji(category)}
                    </span>
                    `
                }

            </div>


            <div class="recipe-info">

                <span class="recipe-state">
                    ${escapeHTML(state)}
                </span>


                <h3>
                    ${escapeHTML(name)}
                </h3>


                <p>
                    ${escapeHTML(description)}
                </p>


                <div class="recipe-meta">

                    ⏱️
                    ${escapeHTML(String(time))}

                    &nbsp; • &nbsp;

                    🍽️
                    ${escapeHTML(String(servings))}

                    servings

                </div>


                <button
                    class="explore-button"
                    type="button"
                    onclick="openRecipe(${Number(id)})"
                >
                    View Recipe →
                </button>

            </div>

        `;


        // -------------------------------------------------
        // IMAGE ERROR FALLBACK
        // -------------------------------------------------

        const imageElement =
            card.querySelector(
                ".recipe-image img"
            );


        if (imageElement) {

            imageElement.addEventListener(
                "error",
                function () {

                    imageElement.parentElement.innerHTML = `

                        <span class="recipe-placeholder">

                            ${getRecipeEmoji(category)}

                        </span>

                    `;

                }
            );

        }


        // Add card
        grid.appendChild(card);

    });

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value === null ||
        value === undefined
            ? ""
            : String(value);


    return div.innerHTML;

}


// =====================================================
// RECIPE EMOJI
// =====================================================

function getRecipeEmoji(category) {

    const emojis = {

        "Rice Dishes": "🍚",

        "Curries": "🍛",

        "Chutneys": "🌶️",

        "Breakfast": "🥞",

        "Snacks": "🍘",

        "Sweets": "🍬",

        "Non-Veg": "🍗",

        "Bread": "🫓",

        "Pickles": "🥭"

    };


    return emojis[category] || "🍽️";

}


// =====================================================
// FILTER RECIPES
// =====================================================

function filterRecipes(
    filter,
    clickedButton
) {

    currentFilter =
        filter || "All";


    // -------------------------------------------------
    // REMOVE ACTIVE CLASS
    // -------------------------------------------------

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(function (button) {

        button.classList.remove(
            "active-filter"
        );

    });


    // -------------------------------------------------
    // ADD ACTIVE CLASS
    // -------------------------------------------------

    if (clickedButton) {

        clickedButton.classList.add(
            "active-filter"
        );

    }


    applyFilters();

}


// =====================================================
// APPLY FILTERS + SEARCH
// =====================================================

function applyFilters() {

    const searchInput =
        document.getElementById(
            "recipeSearch"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    let filteredRecipes =
        [...allRecipes];


    // -------------------------------------------------
    // FILTER
    // -------------------------------------------------

    if (
        currentFilter &&
        currentFilter !== "All"
    ) {

        filteredRecipes =
            filteredRecipes.filter(
                function (recipe) {

                    const state =
                        String(
                            recipe.state || ""
                        ).toLowerCase();


                    const type =
                        String(
                            recipe.type || ""
                        ).toLowerCase();


                    const category =
                        String(
                            recipe.category || ""
                        ).toLowerCase();


                    const filter =
                        currentFilter
                            .toLowerCase();


                    return (

                        state === filter ||

                        type === filter ||

                        category === filter

                    );

                }
            );

    }


    // -------------------------------------------------
    // SEARCH
    // -------------------------------------------------

    if (search !== "") {

        filteredRecipes =
            filteredRecipes.filter(
                function (recipe) {

                    const name =
                        String(
                            recipe.name || ""
                        ).toLowerCase();


                    const state =
                        String(
                            recipe.state || ""
                        ).toLowerCase();


                    const category =
                        String(
                            recipe.category || ""
                        ).toLowerCase();


                    const description =
                        String(
                            recipe.description || ""
                        ).toLowerCase();


                    const type =
                        String(
                            recipe.type || ""
                        ).toLowerCase();


                    return (

                        name.includes(search) ||

                        state.includes(search) ||

                        category.includes(search) ||

                        description.includes(search) ||

                        type.includes(search)

                    );

                }
            );

    }


    // Display filtered recipes
    displayRecipes(
        filteredRecipes
    );

}


// =====================================================
// SEARCH FROM RECIPE PAGE
// =====================================================

function searchRecipesFromPage(query) {

    const searchInput =
        document.getElementById(
            "recipeSearch"
        );


    if (searchInput) {

        searchInput.value =
            query || "";

    }


    applyFilters();

}


// =====================================================
// HOMEPAGE SEARCH
// =====================================================

function searchRecipes() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) {
        return;
    }


    const query =
        input.value.trim();


    if (query === "") {

        alert(
            "Please enter a recipe name."
        );

        return;

    }


    window.location.href =
        "recipes.html?search=" +
        encodeURIComponent(query);

}


// =====================================================
// HOMEPAGE SEARCH ENTER KEY
// =====================================================

function handleHomeSearch(event) {

    if (
        event &&
        event.key === "Enter"
    ) {

        searchRecipes();

    }

}


// =====================================================
// OPEN RECIPE
// =====================================================

function openRecipe(id) {

    if (
        id === undefined ||
        id === null ||
        id === ""
    ) {

        return;

    }


    window.location.href =
        "recipe.html?id=" +
        encodeURIComponent(id);

}


// =====================================================
// LOAD INDIVIDUAL RECIPE
// =====================================================

async function loadRecipeDetails() {

    const recipeDetails =
        document.getElementById(
            "recipeDetails"
        );


    if (!recipeDetails) {
        return;
    }


    try {

        // -------------------------------------------------
        // LOAD JSON
        // -------------------------------------------------

        const response =
            await fetch(
                "data/recipes.json"
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        const recipes =
            await response.json();


        if (!Array.isArray(recipes)) {

            throw new Error(
                "recipes.json must contain an array"
            );

        }


        // -------------------------------------------------
        // GET ID
        // -------------------------------------------------

        const params =
            new URLSearchParams(
                window.location.search
            );


        const recipeId =
            params.get("id");


        // -------------------------------------------------
        // FIND RECIPE
        // -------------------------------------------------

        const recipe =
            recipes.find(
                function (item) {

                    return String(item.id) ===
                        String(recipeId);

                }
            );


        // -------------------------------------------------
        // NOT FOUND
        // -------------------------------------------------

        if (!recipe) {

            recipeDetails.innerHTML = `

                <div class="recipe-not-found">

                    <h1>
                        Recipe Not Found 😔
                    </h1>

                    <p>
                        We couldn't find the recipe
                        you're looking for.
                    </p>

                    <a
                        href="recipes.html"
                        class="explore-button"
                    >
                        ← Back to Recipes
                    </a>

                </div>

            `;

            return;

        }


        // -------------------------------------------------
        // PAGE TITLE
        // -------------------------------------------------

        document.title =
            recipe.name +
            " | Cook It Up";


        // -------------------------------------------------
        // INGREDIENTS
        // -------------------------------------------------

        const ingredients =
            Array.isArray(
                recipe.ingredients
            )
                ? recipe.ingredients
                : [];


        const ingredientsHTML =
            ingredients.map(
                function (ingredient) {

                    return `

                        <li>

                            <span
                                class="ingredient-bullet"
                            >
                                ●
                            </span>

                            ${escapeHTML(
                                ingredient
                            )}

                        </li>

                    `;

                }
            ).join("");


        // -------------------------------------------------
        // STEPS
        // -------------------------------------------------

        const steps =
            Array.isArray(recipe.steps)
                ? recipe.steps
                : [];


        const stepsHTML =
            steps.map(
                function (step) {

                    return `

                        <li>
                            ${escapeHTML(step)}
                        </li>

                    `;

                }
            ).join("");


        // -------------------------------------------------
        // TIME
        // -------------------------------------------------

        const totalTime =
            recipe.totalTime ||
            recipe.cookTime ||
            recipe.prepTime ||
            "—";


        // -------------------------------------------------
        // IMAGE
        // -------------------------------------------------

        const image =
            recipe.image || "";


        // -------------------------------------------------
        // RECIPE DETAILS HTML
        // -------------------------------------------------

        recipeDetails.innerHTML = `

            <div class="recipe-detail">


                <!-- BACK BUTTON -->

                <a
                    href="recipes.html"
                    class="back-button"
                >
                    ← Back to Recipes
                </a>


                <!-- IMAGE -->

                <div class="recipe-detail-image">

                    ${
                        image
                        ?
                        `
                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(
                                recipe.name || "Recipe"
                            )}"
                        >
                        `
                        :
                        `
                        <div class="recipe-placeholder-large">
                            ${getRecipeEmoji(
                                recipe.category
                            )}
                        </div>
                        `
                    }

                </div>


                <!-- HEADER -->

                <header
                    class="recipe-detail-header"
                >

                    <span class="recipe-state">

                        ${escapeHTML(
                            recipe.state || ""
                        )}

                    </span>


                    <h1>

                        ${escapeHTML(
                            recipe.name ||
                            "Recipe"
                        )}

                    </h1>


                    <p
                        class="recipe-description"
                    >

                        ${escapeHTML(
                            recipe.description ||
                            ""
                        )}

                    </p>


                    <span
                        class="recipe-category"
                    >

                        ${escapeHTML(
                            recipe.category ||
                            ""
                        )}

                    </span>


                    <!-- RECIPE INFO -->

                    <div
                        class="recipe-info-bar"
                    >

                        <div class="info-item">

                            ⏱️

                            ${escapeHTML(
                                String(totalTime)
                            )}

                        </div>


                        <div class="info-item">

                            🍽️

                            ${escapeHTML(
                                String(
                                    recipe.servings ||
                                    "—"
                                )
                            )}

                            servings

                        </div>


                        <div class="info-item">

                            🍴

                            ${escapeHTML(
                                recipe.type ||
                                "—"
                            )}

                        </div>

                    </div>

                </header>


                <!-- INGREDIENTS + PREPARATION -->

                <div
                    class="recipe-detail-grid"
                >


                    <!-- INGREDIENTS -->

                    <section
                        class="recipe-detail-section"
                    >

                        <h2>
                            🧂 Ingredients
                        </h2>


                        ${
                            ingredients.length > 0
                            ?
                            `

                            <ul
                                class="ingredients-list"
                            >

                                ${ingredientsHTML}

                            </ul>

                            `
                            :
                            `

                            <p>
                                Ingredients information
                                is not available.
                            </p>

                            `
                        }

                    </section>


                    <!-- PREPARATION -->

                    <section
                        class="recipe-detail-section"
                    >

                        <h2>
                            👨‍🍳 Preparation
                        </h2>


                        ${
                            steps.length > 0
                            ?
                            `

                            <ol
                                class="steps-list"
                            >

                                ${stepsHTML}

                            </ol>

                            `
                            :
                            `

                            <p>
                                Preparation steps
                                are not available.
                            </p>

                            `
                        }

                    </section>


                </div>


                <!-- COOKING MESSAGE -->

                <div
                    class="cooking-message"
                >

                    <h2>
                        🍳 Happy Cooking!
                    </h2>


                    <p>
                        Enjoy the authentic flavours
                        of Telangana & Andhra Pradesh.
                    </p>

                </div>


            </div>

        `;


        // -------------------------------------------------
        // DETAIL IMAGE FALLBACK
        // -------------------------------------------------

        const detailImage =
            recipeDetails.querySelector(
                ".recipe-detail-image img"
            );


        if (detailImage) {

            detailImage.addEventListener(
                "error",
                function () {

                    detailImage.parentElement.innerHTML = `

                        <div
                            class="recipe-placeholder-large"
                        >

                            ${getRecipeEmoji(
                                recipe.category
                            )}

                        </div>

                    `;

                }
            );

        }

    }


    catch (error) {

        console.error(
            "Error loading recipe details:",
            error
        );


        recipeDetails.innerHTML = `

            <div class="recipe-not-found">

                <h1>
                    Something went wrong 😔
                </h1>

                <p>
                    We couldn't load this recipe.
                </p>

                <p>
                    Please check your
                    <strong>
                        data/recipes.json
                    </strong>
                    file.
                </p>

                <a
                    href="recipes.html"
                    class="explore-button"
                >
                    ← Back to Recipes
                </a>

            </div>

        `;

    }

}


// =====================================================
// MOBILE MENU
// =====================================================

function toggleMenu() {

    const nav =
        document.querySelector(
            ".navbar nav"
        );


    if (!nav) {
        return;
    }


    const isOpen =
        nav.classList.contains(
            "mobile-open"
        );


    if (isOpen) {

        nav.classList.remove(
            "mobile-open"
        );


        nav.style.display = "";


    } else {

        nav.classList.add(
            "mobile-open"
        );


        nav.style.display =
            "flex";


        nav.style.flexDirection =
            "column";


        nav.style.position =
            "absolute";


        nav.style.top =
            "75px";


        nav.style.right =
            "5%";


        nav.style.background =
            "white";


        nav.style.padding =
            "20px";


        nav.style.borderRadius =
            "12px";


        nav.style.gap =
            "18px";


        nav.style.boxShadow =
            "0 5px 20px rgba(0,0,0,0.15)";

    }

}


// =====================================================
// LOAD POPULAR RECIPES
// =====================================================

async function loadPopularRecipes() {

    const container =
        document.getElementById(
            "popularRecipes"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(
                "data/recipes.json"
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        const recipes =
            await response.json();


        if (!Array.isArray(recipes)) {

            throw new Error(
                "recipes.json must contain an array"
            );

        }


        // -------------------------------------------------
        // FIRST 3 RECIPES
        // -------------------------------------------------

        const popularRecipes =
            recipes.slice(0, 6);


        container.innerHTML = "";


        popularRecipes.forEach(
            function (recipe) {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "recipe-card";


                const name =
                    recipe.name ||
                    "Unnamed Recipe";


                const state =
                    recipe.state ||
                    "";


                const description =
                    recipe.description ||
                    "A delicious traditional recipe.";


                const category =
                    recipe.category ||
                    "";


                const image =
                    recipe.image ||
                    "";


                const time =
                    recipe.totalTime ||
                    recipe.cookTime ||
                    recipe.prepTime ||
                    "—";


                const servings =
                    recipe.servings ||
                    "—";


                card.innerHTML = `

                    <div class="recipe-image">

                        ${
                            image
                            ?
                            `
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(name)}"
                                loading="lazy"
                            >
                            `
                            :
                            `
                            <span>
                                ${getRecipeEmoji(
                                    category
                                )}
                            </span>
                            `
                        }

                    </div>


                    <div class="recipe-info">

                        <span>
                            ${escapeHTML(state)}
                        </span>


                        <h3>
                            ${escapeHTML(name)}
                        </h3>


                        <p>
                            ${escapeHTML(description)}
                        </p>


                        <div class="recipe-meta">

                            ⏱️
                            ${escapeHTML(
                                String(time)
                            )}

                            &nbsp; • &nbsp;

                            🍽️
                            ${escapeHTML(
                                String(servings)
                            )}

                            servings

                        </div>


                        <button
                            class="explore-button"
                            type="button"
                            onclick="openRecipe(${Number(
                                recipe.id
                            )})"
                        >
                            View Recipe →
                        </button>

                    </div>

                `;


                // Image fallback
                const imageElement =
                    card.querySelector(
                        ".recipe-image img"
                    );


                if (imageElement) {

                    imageElement.addEventListener(
                        "error",
                        function () {

                            imageElement.parentElement.innerHTML = `

                                <span>
                                    ${getRecipeEmoji(
                                        category
                                    )}
                                </span>

                            `;

                        }
                    );

                }


                container.appendChild(card);

            }
        );

    }


    catch (error) {

        console.error(
            "Error loading popular recipes:",
            error
        );


        container.innerHTML = `

            <div class="no-results">

                <h2>
                    Unable to load recipes 😔
                </h2>

                <p>
                    Please check your
                    recipe database.
                </p>

            </div>

        `;

    }

}


// =====================================================
// CLEAR SEARCH
// =====================================================

function clearRecipeSearch() {

    const searchInput =
        document.getElementById(
            "recipeSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.value = "";


    currentFilter =
        "All";


    // Remove active filters
    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(
        function (button) {

            button.classList.remove(
                "active-filter"
            );

        }
    );


    // Activate All
    const allButton =
        document.querySelector(
            '.filter-button[onclick*="All"]'
        );


    if (allButton) {

        allButton.classList.add(
            "active-filter"
        );

    }


    applyFilters();

}


// =====================================================
// CLOSE MOBILE MENU WHEN LINK IS CLICKED
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const nav =
            document.querySelector(
                ".navbar nav"
            );


        if (!nav) {
            return;
        }


        if (
            event.target.tagName === "A" &&
            nav.classList.contains(
                "mobile-open"
            )
        ) {

            nav.classList.remove(
                "mobile-open"
            );


            nav.style.display = "";

        }

    }
);


// =====================================================
// CONSOLE MESSAGE
// =====================================================

console.log(
    "🍳 Cook It Up script.js loaded successfully!"
);