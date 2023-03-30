import { config } from "dotenv"
config()

import { Configuration, OpenAIApi } from "openai"
import readline from "readline"
import fs from "fs"
import path from "path"
import.meta.url
import { fileURLToPath } from 'url';


//const __dirname = path.dirname(fileURLToPath(import.meta.url));
//console.log('__dirname:', __dirname);

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
)

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

userInterface.prompt()
userInterface.on("line", async input => {
  const response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  })

  const generatedText = response.data.choices[0].message.content
  console.log(generatedText)

  //new
  //__dirname here: "/Users/eemilyparkk/Documents/GitHub/comics/gpt3.5-testing/chat-gpt-api-main"
  const filePath = path.join("/Users/eemilyparkk/Documents/GitHub/comics/github-automation", 
  "github-automation", "prompt.txt")

  //const __dirname = path.dirname(fileURLToPath(import.meta.url));
  //const outputPath = path.join(__dirname, '../github-automation/prompt.txt');
  //const generatedText = "Your generated text here";

  //await fs.writeFile(outputPath, generatedText);

  // console.log(response.data.choices[0].message.content)

  //move this text prompt to the midjourney discord bot:
  // Write the generatedText to prompt.txt
  fs.appendFile("prompt.txt", "/imagine " + generatedText + "\n", err => {
    if (err) throw err
    console.log("Done storing :)")
  })

  userInterface.prompt()
})
