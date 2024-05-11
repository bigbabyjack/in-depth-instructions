import * as fs from 'fs';
import { ServiceResponse, ServiceContext, Payload } from './datastructures';

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
