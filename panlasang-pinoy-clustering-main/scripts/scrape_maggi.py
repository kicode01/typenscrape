import requests
from bs4 import BeautifulSoup
import json

# Base URL of the website
base_url = "https://www.maggi.ph"

# Initialize the recipes list
recipes = []


def get_recipe_links(page_url, recipes):
    # Send a GET request to the page
    response = requests.get(page_url)

    # Parse the HTML content
    soup = BeautifulSoup(response.content, "html.parser")

    # Find all the <a> tags with a href attribute that starts with "/recipes/" and extract the href attribute
    links = set(
        a["href"]
        for a in soup.find_all(
            "a", href=lambda href: href and href.startswith("/recipes/")
        )
    )

    # For each URL, fetch the recipe details
    for link in links:
        recipe_url = base_url + link
        response = requests.get(recipe_url)
        soup = BeautifulSoup(response.content, "html.parser")

        # Fetch the recipe name
        recipe_name = (
            soup.find("h1")
            .text.encode("cp1252", errors="replace")
            .decode("cp1252")
        )
        print(f"Scraping: {recipe_name}")  # Print a message to show progress

        # Fetch the ingredients
        ingredients = []
        ingredient_divs = soup.find_all("div", class_="recipe-ingredient-unit")
        ingredient_names = soup.find_all("div", class_="recipe-ingredient-name")

        for div, name in zip(ingredient_divs, ingredient_names):
            quantity_tag = div.find("em", class_="mg-ingredient-quantity")
            unit_tag = div.find("em", class_="mg-ingredient-unit")
            ingredient_name_tag = name.find("em")

            if quantity_tag and unit_tag and ingredient_name_tag:
                quantity = quantity_tag.text.strip()
                unit = unit_tag.text.strip()
                ingredient_name = ingredient_name_tag.text.strip()
                ingredients.append(
                    f"{quantity} {unit} of {ingredient_name}".encode(
                        "cp1252", errors="replace"
                    ).decode("cp1252")
                )

        # Fetch the instructions
        instructions = []
        instruction_steps = soup.find_all(
            "h3", {"data-animation": "mg-recipeInstruction_slideInFromLeft"}
        )
        instruction_texts = soup.find_all(
            "div", class_="mg-recipe-instructions__steps-instructions"
        )

        for step, text in zip(instruction_steps, instruction_texts):
            step_number = step.text.strip()
            instruction_text = text.find("span").text.strip()
            instructions.append(
                f"{step_number}: {instruction_text}".encode(
                    "cp1252", errors="replace"
                ).decode("cp1252")
            )

        # Add the recipe to the list
        recipes.append(
            {
                "link": recipe_url,  # Add the recipe URL
                "name": recipe_name,
                "ingredients": ingredients,
                "instructions": instructions,
            }
        )

    return recipes


# For each page from 0 to 49, get the recipe links
for i in range(50):  # Pages 1 to 50
    print(f"Scraping page {i+1}")  # Print the number of the page
    page_url = f"{base_url}/recipes-delicious-easy-cook-recipes/?content_type=recipe&page={i}&range=12&searchpage=false"
    recipes = get_recipe_links(page_url, recipes)

    # Save the recipes to a JSON file
    with open("recipesMAGGI-2.json", "w") as f:
        json.dump(recipes, f, indent=4)
