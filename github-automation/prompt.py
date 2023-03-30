"""
Runs Midjourney Discord bot (automation tools)
"""
import time
import discord
from discord.ext import commands
from dotenv import load_dotenv
import pygetwindow as gw
import pyautogui as pg
import os
import sys
import re


# Read the content of the file
with open('prompt.txt', 'r') as file:
    content = file.read()

# Use regular expression to extract text inside parentheses for all panels
matches = re.findall(r'\((.*?)\)', content)
#matches = re.findall(r'\[(.*?)\]|\((.*?)\)', content)

# Create a new string with the extracted text and "in the style of" at the end of each panel's text
new_content = ''
for i, text in enumerate(matches):
    new_content += f'(Panel {i+1}: {text.strip()} in the style of)\n'

# Overwrite the file with the new string
with open('prompt.txt', 'w') as file:
    file.write(new_content)

#------------------------------------------------------------------------------------------- ###

discord_token = "MTA5MDAyOTI5MzgyNTk3MDE5Ng.Gk5khM.6IYZ9ESYZRC5fgHMRrfWxcoA73Ek56jENMBpgU"

# new start: -------------------------------------------------------------------------------- ###
dirname = os.path.dirname(__file__)
path = os.path.join(dirname, 'prompt.txt')

with open(path, 'r') as prompt_file:
    prompts = prompt_file.readlines()
# new end: ---------------------------------------------------------------------------------- ###


#uncomment: prompt_file = open('prompt.txt', 'r')   
#uncomment: prompts = prompt_file.readlines()

prompt_counter = 0

load_dotenv()
client = commands.Bot(command_prefix="*", intents=discord.Intents.all())

@client.event
async def on_ready():
    print("Bot connected")
    global prompt_counter

#@client.event
#async def on_message(message):

    #uncomment: msg = message.content
    #uncomment: print(message)

    while prompt_counter < len(prompts): #22 while ...

        time.sleep(3)
        pg.press('tab')
        #for i in range(1): #33 deleted
        #for i in range(1):
            #time.sleep(3)
        pg.write('/imagine')
        time.sleep(5)
        pg.press('tab')
        pg.write(prompts[prompt_counter])
        time.sleep(3)
        pg.press('enter')
        time.sleep(5)
        prompt_counter += 1

        if prompt_counter == len(prompts):
            await client.close()
            await client.logout()
            sys.exit()

        # continue Automation as soon Midjourney bot sends a message with attachment.
        """
        for attachment in message.attachments:
            time.sleep(3)
            pg.write('/imagine')
            time.sleep(5)
            pg.press('tab')
            pg.write(prompts[prompt_counter])
            time.sleep(3)
            pg.press('enter')
            time.sleep(5)
            prompt_counter += 1
        # Stop Automation once all prompts are completed
        """
    quit()


client.run(discord_token)