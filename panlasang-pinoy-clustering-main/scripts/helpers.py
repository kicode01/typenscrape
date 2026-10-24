import argparse
import logging

from bs4 import BeautifulSoup


def setup_logging():
    """Configure logging for the script."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
    )


async def fetch_and_parse_html(session, url):
    """Fetch a webpage and return a parsed HTML."""
    async with session.get(url) as response:
        return BeautifulSoup(await response.text(), "html.parser")


def extract_elements(container, class_name):
    """Extract and return text from HTML elements based on class name."""
    return [
        element.text.strip()
        for element in container.find_all(class_=class_name)
    ]


def configure_argument_parser(description):
    """Create and return a configured argument parser."""
    parser = argparse.ArgumentParser(
        description=description,
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "-p",
        "--pages",
        help="Number of list pages to scrape",
        type=int,
        metavar="N",
        required=True,
    )
    parser.add_argument(
        "-o",
        "--output",
        help="Output file name",
        metavar="FILE",
        default="scraped_recipes.json",
    )
    return parser
