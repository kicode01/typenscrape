import aiohttp
import asyncio
import json
from bs4 import BeautifulSoup
from unidecode import unidecode


async def fetch_page(session, url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    async with session.get(url, headers=headers) as response:
        if response.status == 200:
            return await response.text()
        else:
            print(f"Failed to fetch page {url}. Status code: {response.status}")
            return None


async def extract_recipe_details(session, url):
    page_content = await fetch_page(session, url)
    if page_content:
        soup = BeautifulSoup(page_content, "html.parser")

        # Extracting food name from the h1 tag
        food_name_tag = soup.find("h1", class_="article-heading type--lion")
        food_name = (
            food_name_tag.text.strip() if food_name_tag else "Not available"
        )

        # Extracting ingredients from the ingredient list
        ingredients_list = soup.find(
            "ul", class_="mntl-structured-ingredients__list"
        )
        ingredients = (
            [
                unidecode(ingredient.text.strip())
                for ingredient in ingredients_list.find_all("p")
            ]
            if ingredients_list
            else ["Not available"]
        )

        # Extracting instructions from the p tags
        instructions_tags = soup.find_all(
            "p", class_="comp mntl-sc-block mntl-sc-block-html"
        )
        instructions = (
            [
                f"Step {i + 1}: {unidecode(instruction.text.strip())}"
                for i, instruction in enumerate(instructions_tags)
            ]
            if instructions_tags
            else ["Not available"]
        )

        return {
            "name": food_name,
            "ingredients": ingredients,
            "instructions": instructions,
            "url": url,
        }


async def scrape_main_page(session, main_url):
    main_page_content = await fetch_page(session, main_url)
    if main_page_content:
        main_soup = BeautifulSoup(main_page_content, "html.parser")

        # Extracting links from the main page
        links = [
            a["href"]
            for a in main_soup.find_all(
                "a",
                class_="comp mntl-card-list-items mntl-document-card mntl-card card card--no-image",
                href=True,
            )
        ]

        # Process each link individually
        tasks = [extract_recipe_details(session, link) for link in links]
        return await asyncio.gather(*tasks)


async def main():
    # Main URL to scrape
    main_url = "https://www.allrecipes.com/recipes/17494/world-cuisine/asian/filipino/main-dishes/"

    # Run the event loop
    async with aiohttp.ClientSession() as session:
        all_recipes = await scrape_main_page(session, main_url)

        if not all_recipes:
            print("No recipes were scraped.")
        else:
            print(f"Scraped {len(all_recipes)} recipes.")

            # Specify the full path for the JSON file
            json_file_path = r"C:\\Users\\Admin\\OneDrive\\Documents\\WEB SCRAPINGS\\ALL_RECIPES_data.json"

            # Save the data to a JSON file
            with open(json_file_path, "w") as json_file:
                json.dump(all_recipes, json_file, indent=2)


if __name__ == "__main__":
    asyncio.run(main())
