import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Go to the application's homepage
        page.goto("http://localhost:3000/")

        # Wait for the main heading to be visible to ensure the page has loaded
        # The text is "Quality Neighbor" based on the HeroSection component
        hero_heading = page.get_by_role("heading", name=re.compile("Quality Neighbor", re.IGNORECASE))
        expect(hero_heading).to_be_visible(timeout=10000)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        print("Screenshot taken successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        # Take a screenshot even if it fails to see the state
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
