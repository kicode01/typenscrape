import asyncio
import json
import logging
from itertools import chain

import aiohttp
from helpers import (
    configure_argument_parser,
    extract_elements,
    fetch_and_parse_html,
    setup_logging,
)

BASE_URL = "https://panlasangpinoy.com/categories/recipes"
INGREDIENT_CLASS = "wprm-recipe-ingredient"
NAME_CLASS = "wprm-recipe-name"
INSTRUCTION_CLASS = "wprm-recipe-instruction-text"


async def fetch_recipe_links(session, link):
    """Fetch recipe links from a list page."""
    logging.info(f"Scraping: {link}")
    soup = await fetch_and_parse_html(session, link)
    a_tags = soup.find_all("a", class_="entry-title-link", href=True)
    return [a_tag["href"] for a_tag in a_tags]


async def fetch_recipe_details(session, link):
    """Fetch recipe details from a recipe page."""
    data = {
        "link": link,
        "name": None,
        "ingredients": None,
        "instructions": None,
    }

    logging.info(f"Scraping: {link}")
    soup = await fetch_and_parse_html(session, link)
    container = soup.find("div", class_="oc-recipe-container")

    if not container:
        logging.warning(f"Could not find recipe container: {link}")
        return data

    data["name"] = container.find("h2", class_=NAME_CLASS).text.strip()
    data["ingredients"] = extract_elements(container, INGREDIENT_CLASS)
    data["instructions"] = extract_elements(container, INSTRUCTION_CLASS)
    return data


async def main():
    """Main entry point of the script."""
    setup_logging()
    parser = configure_argument_parser("Scrape Panlasang Pinoy recipes")
    args = parser.parse_args()

    async with aiohttp.ClientSession() as session:
        list_pages = [f"{BASE_URL}/page/{i}" for i in range(1, args.pages + 1)]
        recipe_links = await asyncio.gather(
            *[fetch_recipe_links(session, url) for url in list_pages]
        )
        recipe_links = list(chain.from_iterable(recipe_links))

        # Add a semaphore to prevent crashing the OS with 2000 parallel requests
        sem = asyncio.Semaphore(10)
        async def fetch_with_sem(session, url):
            async with sem:
                return await fetch_recipe_details(session, url)

        recipe_data = await asyncio.gather(
            *[fetch_with_sem(session, url) for url in recipe_links]
        )

    with open(args.output, "w") as file:
        json.dump(recipe_data, file, indent=2)


if __name__ == "__main__":
    asyncio.run(main())
