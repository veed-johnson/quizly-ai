import { NextResponse } from "next/server";
import { APIError } from "openai/error.mjs";
import OpenAI from "openai/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RESPONSE_FORMAT = {
  verdict: "correct or incorrect",
  notes:
    "Provide a brief explanation that gives details on the correct answer or relevant context. Your note must match your verdict",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", {
        status: 500,
      });
    }

    if (!message) {
      return new NextResponse("Answer is required", { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          As a quiz game judge and topic expert, your primary responsibility is to assess the accuracy of answers based on the latest information available. You must also consider the possibility of incorrect spellings and make allowances accordingly. Along with your verdict, it is essential to provide brief background notes of at least 150 characters, explaining the correct answer and offering additional information on the subject matter.
          
          Your response should be in JSON format, as follows:
          ${JSON.stringify(RESPONSE_FORMAT)}
          
          Set the "verdict" to "correct" only if you are confident that the response is correct; if the response is not correct, set it to "incorrect."
          Don't include "the answer is correct or incorrect" in your notes since the verdict already says that.
          
          Now give your verdict on the provided answer to this question
          Question: "${message.question}"
          Answer: "${message.answer}"
          `,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json(completion.choices[0].message.content);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);

    const errorMessage = error as APIError;
    if (errorMessage.status === 429) {
      return new NextResponse("Something went wrong", { status: 429 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// content: `You are a quiz game judge and topic expert, your role is to fact-check responses to questions using the most recent knowledge on the topic. Analyze the provided answer to this question:

// Question: "${message.question}"
// Answer: "${message.answer}"

// Your task is to determine whether the answer to the question is correct or incorrect, taking into account minor spelling errors. Provide your verdict and you must include short background notes (at least 150 characters) for context on the correct answer to the question.

// Your response should be in JSON format, as follows:
// ${JSON.stringify(RESPONSE_FORMAT)}.

// Also, be tolerant of minor spelling errors and consider them as correct if the meaning is clear.

// Set the "verdict" to "correct" only if you are confident that the response is correct , or if there are minor spelling errors that don't change the meaning; otherwise, set it to "incorrect."
// Do not also talk about how significant the spelling error is in your notes`,
