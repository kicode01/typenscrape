import requests
from bs4 import BeautifulSoup
import json


def scrape_recipe_details(recipe_urls):
    response = requests.get(recipe_urls)
    soup = BeautifulSoup(response.text, "html.parser")
    container = soup.find_all("div", class_="paragraph")
    ingredients = []
    instructions = []
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        for i in range(len(container)):
            ul_elements = container[i].find_all("ul")
            if ul_elements == []:
                continue
            else:
                t_ingredients = (
                    [li.text.strip() for li in ul_elements[0].find_all("li")]
                    if len(ul_elements) > 0
                    else []
                )
                if t_ingredients != []:
                    if ingredients != []:
                        print("\n")
                        # messy af but it works hehehe
                    else:
                        ingredients = t_ingredients
                        continue
                t_instructions = (
                    [li.text.strip() for li in ul_elements[0].find_all("li")]
                    if len(ul_elements) > 0
                    else []
                )
                if t_instructions != []:
                    instructions = t_instructions
                    continue
        return {"ingredients": ingredients, "instructions": instructions}
    else:
        print(
            f"Failed to retrieve recipe details, Status code: {response.status_code}"
        )
        return None


def scrape_recipes(url):

    recipes_data = []
    links = []
    """
    ctr = 0
    MAX = 500
    """

    try:
        response = requests.get(url)
        print(response.status_code)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            paragraphs = soup.find_all("div", class_="paragraph")
            for p in paragraphs:
                a_tags = p.find_all("a")
                links = a_tags
                for i in range(len(links)):
                    link = links[i]
                    if link and link.get("href"):
                        recipe_name = link.text
                        recipe_url = link.get("href")
                        # Check if URL is absolute or needs to be concatenated
                        if not recipe_url.startswith("http"):
                            recipe_url = f"https://www.pinoycookingrecipes.com{recipe_url}"

                        print(f"Processing: {recipe_name}, URL: {recipe_url}")
                        """
                        ctr = ctr + 1
                        if ctr == MAX:
                            break
                        """
                        # Scrape the details of each recipe
                        details = scrape_recipe_details(recipe_url)
                        if details:
                            recipes_data.append(
                                {
                                    "link": recipe_url,
                                    "name": recipe_name,
                                    "ingredients": details["ingredients"],
                                    "instructions": details["instructions"],
                                }
                            )
                """
                if ctr == MAX:
                    break
                """
        else:
            print(
                f"Failed to retrieve the webpage, Status code: {response.status_code}"
            )

    except Exception as e:
        print(f"An error occurred: {e}")

    # Save the data to a JSON file
    with open("recipes_data.json", "w", encoding="utf-8") as f:
        json.dump(recipes_data, f, ensure_ascii=False, indent=4)


# The URL of the page you want to scrape
url = "https://www.pinoycookingrecipes.com/recipe-index.html"
scrape_recipes(url)
