import time
import discord
from discord.ext import commands
from dotenv import load_dotenv
import pyautogui as pg
import os



discord_token = "MTA5MDAyOTI5MzgyNTk3MDE5Ng.Gk5khM.6IYZ9ESYZRC5fgHMRrfWxcoA73Ek56jENMBpgU"

# Using readlines()


# new start:
dirname = os.path.dirname(__file__)
path = os.path.join(dirname, '/Users/eemilyparkk/Documents/GitHub/comics/github-automation/chat-gpt-api-main/prompt.txt')

with open(path, 'r') as prompt_file:
    prompts = prompt_file.readlines()
# new end


#uncomment: prompt_file = open('prompt.txt', 'r')   
#uncomment: prompts = prompt_file.readlines()

prompt_counter = 0

load_dotenv()
client = commands.Bot(command_prefix="*", intents=discord.Intents.all())


@client.event
async def on_ready():
    print("Bot connected")

@client.event
async def on_message(message):
    global prompt_counter

    msg = message.content
    print(message)

    while prompt_counter < len(prompts):
        # Start Automation by typing "automation" in the discord channel
        if msg == 'automation':
            time.sleep(3)
            pg.press('tab')
            for i in range(1):
                #time.sleep(3)
                pg.write('/imagine')
                time.sleep(5)
                pg.press('tab')
                pg.write(prompts[prompt_counter])
                time.sleep(3)
                pg.press('enter')
                time.sleep(5)
                prompt_counter += 1

        # continue Automation as soon Midjourney bot sends a message with attachment.
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
    quit()

client.run(discord_token)