import * as fs from 'fs';

interface ServiceContext {
  id: string;
  query: string;
  instructions: string[];
}

interface ServiceResponse {
  response: Promise<Response>;
  error?: string;
  buildPayload: (context: ServiceContext) => Payload;
}

interface Response {
  text: string;
  error?: string;
  report?: () => void;
}

interface Payload {
  method: string;
  headers: {
    "Content-Type": string;
  };
  body: string;
}

class OllamaService implements ServiceResponse {
  response: Promise<Response>;
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
    console.log(`Sending request to ${this.url}`);
    // console.log(`Payload: ${JSON.stringify(this.payload)}`);

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

  // async getInstructions(context: ServiceContext): Promise<string[]> {
  //   const instructions: string[] = [];
  //   for (const line of this.response.text.split("\n")) {
  //     // regex search for numbers like 1., 2., etc...
  //     if (/\d+\./.test(line)) {
  //       instructions.push(line);
  //     }
  //
  //   }
  //
  //   return instructions;
  //
  // }
}



async function main() {

  const context: ServiceContext = {
    id: '1',
    query: "Hey there.",
    instructions: []
  };

  const ollamaService = new OllamaService(context);
  console.log(context);

  const response = await ollamaService.postResponse();

  console.log(response);
  const responseDuration = response.total_duration / 1e+9;
  console.log(`Response Duration: ${(responseDuration).toFixed(2)} seconds`);
  fs.writeFile('application.log', `Query: ${context.query},\nResponse: ${JSON.stringify(response)}`, (err: any) => {
    if (err) {
      console.error(err);
      return;
    }


    console.log('The file has been written successfully.');
  });

  // console.log(ollamaService.getInstructions(context));
}

main();
