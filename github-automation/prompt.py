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

#load_dotenv()
discord_token = "MTA5MDAyOTI5MzgyNTk3MDE5Ng.Gk5khM.6IYZ9ESYZRC5fgHMRrfWxcoA73Ek56jENMBpgU"
#client = commands.Bot(command_prefix="*", intents=discord.Intents.all())

# Using readlines()


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
        # Start Automation by typing "automation" in the discord channel
        #if msg == None:

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
        
        
        """
        if prompt_counter >= len(prompts): #22, >=
            print("Finished Midjourney!")
            print("All prompts completed. Quitting...")
            #quit()
            await client.close()
        """


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