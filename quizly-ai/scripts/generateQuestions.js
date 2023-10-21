const OpenAI = require("openai");
const fs = require("fs").promises;

require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RESPONSE_FORMAT = [
  {
    category: "category1",
    questions: [
      {
        question: "...",
        clue: "...",
      },
    ],
  },
  {
    category: "category2",
    questions: [
      {
        question: "...",
        clue: "...",
      },
    ],
  },
  {
    category: "category3",
    questions: [
      {
        question: "...",
        clue: "...",
      },
    ],
  },
];

async function generateAndSaveQuestions() {
  try {
    let questionsToSkip = [];
    const filePath = "./src/data/questions.json";

    const data = await fs.readFile(filePath, "utf8");
    if (data) {
      questionsToSkip = JSON.parse(data).flatMap((item) => item.questions);
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Randomly pick 3 categories out of these 6 categories: sports, music, history, geography, movies, and science. Generate 3 very engaging and interesting brain-teasing trivia questions each on the picked categories. Do not include questions you have previously generated and also do not include common easy questions, make them a bit difficult. Format the response as json array in the shape of ${JSON.stringify(
            RESPONSE_FORMAT
          )}. Let your response not include these questions ${JSON.stringify(
            questionsToSkip
          )}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    // console.log(completion.choices[0].message.content);

    const questions = JSON.parse(completion.choices[0].message.content);

    await fs.writeFile(
      `./src/data/questions.json`,
      JSON.stringify(questions, null, 2)
    );
  } catch (error) {
    console.error(`Error generating questions: ${error.message}`);
  }
}

generateAndSaveQuestions();
