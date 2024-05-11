import * as fs from 'fs';

interface ServiceContext {
  id: string;
  query: string;
  instructions: string[];
}

interface Payload {
  method: string;
  headers: {
    "Content-Type": string;
  };
  body: string;
}


interface ServiceResponse {
  response: Promise<Response>;
  error?: string;
  buildPayload: (context: ServiceContext) => Payload;
  report?: () => void;
}



class OllamaService implements ServiceResponse {
  response: Promise<any>;
  payload: Payload;
  error?: string;

  url = "http://localhost:11434/api/generate";

  constructor(context: ServiceContext) {
    this.payload = this.buildPayload(context);
    this.response = this.postResponse();
    this.error = undefined;
  }

  buildPayload(context: ServiceContext): Payload {
    const payload = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "phi3",
        prompt: context.query,
        stream: false,
        temperature: 0.0,
        max_tokens: 50,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["\n"],
      }),
    };
    return payload;
  }

  async postResponse(): Promise<any> {
    const response = await fetch(this.url, this.payload);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    try {
      const responseData = await response.json();
      return responseData;
    } catch (e) {
      console.log(e);
    }
  }

  async getInstructions(): Promise<string[]> {
    const instructions: string[] = [];
    const response = await this.response;
    for (const line of response.response.split("\n\n")) {
      // regex search for numbers like 1., 2., etc...
      console.log(`Processing line: ${line}`)
      instructions.push(line);

    }

    return instructions;

  }
  logResults = (context: ServiceContext) => {
    fs.writeFile('application.log', `Query: ${context.query},\nResponse: ${JSON.stringify(this.response)}`, (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('The file has been written successfully.');
    });
  }

  saveResponse = () => {

    fs.writeFile('response.md', JSON.stringify(this.response), (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('The file has been written successfully.');
    });


  }

}


async function main() {

  const INITIAL_INSTRUCTIONS = "Your response should be in Markdown format with each step shown as a new line. Do not wrap your entire answer in a code block. Your response should be well structured with headers and subheaders."

  const context: ServiceContext = {
    id: '1',
    query: `Teach me how to write an arrow function in TypeScript. ${INITIAL_INSTRUCTIONS}`,
    instructions: []
  };

  const ollamaService = new OllamaService(context);
  const response = await ollamaService.response;
  // console.log(`Response: ${JSON.stringify(response)}`);

  const responseDuration = response.total_duration / 1e+9;
  console.log(`Response Duration: ${(responseDuration).toFixed(2)} seconds`);


  ollamaService.logResults(context);

  ollamaService.saveResponse();

  const instructions = await ollamaService.getInstructions();

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    console.log(`Step ${i + 1}: ${instruction}`);
    console.log("\n\n")
  }
}

main();
