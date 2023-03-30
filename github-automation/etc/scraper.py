from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

# Set up the Chrome web driver
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("user-data-dir=/Users/jyotir/Library/Application\ Support/Google/Chrome/Profile\ 1 ")
# chrome_options.add_argument("profile-directory=Profile 1")
driver = webdriver.Chrome(options=chrome_options)

# Navigate to the chat interface
driver.get('https://chat.openai.com/chat')

# Find the button element by its class name and click on it
button = driver.find_element_by_class_name("btn relative btn-primary")
button.click()

# Find the username and password input fields and enter your credentials
username_field = driver.find_element_by_name('username')
password_field = driver.find_element_by_name('password')
username_field.send_keys('your_username')
password_field.send_keys('your_password')

# Submit the login form
password_field.send_keys(Keys.RETURN)

# Wait for the page to load
time.sleep(5)

# Find the chat input field and send a message
input_field = driver.find_element_by_xpath('//*[@id="__next"]/div[2]/div/main/div[2]/form/div/div[1]/textarea')
input_field.send_keys("Hello, how are you?")
input_field.send_keys(Keys.RETURN)

# Wait for the response to load
time.sleep(3)

# Find the chat response and print it
response = driver.find_element_by_xpath('//*[@id="__next"]/div[2]/div/main/div[1]/div/div/div/div[32]')
print(response.text)

# Send another message and get the response
input_field.send_keys("What's the weather like today?")
input_field.send_keys(Keys.RETURN)
time.sleep(3)
response = driver.find_element_by_xpath('//*[@id="__next"]/div[2]/div/main/div[1]/div/div/div/div[32]')
print(response.text)

# Close the web driver
driver.quit()
