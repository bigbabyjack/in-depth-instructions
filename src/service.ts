import * as fs from 'fs';
import { ServiceContext } from './datastructures';

export class Query {
  query: string
  constructor(query: string) {
    this.query = query
  }
}

interface ModelConfig {
  [key: string]: { apiUrl: string }
}

export class LanguageModel {
  private readonly modelName: string
  private readonly modelConfigs: ModelConfig = {
    ['llama3:8b']: { "apiUrl": "http://localhost:11434/api/generate" }
  };
  constructor(modelName: string) {
    if (!this.modelConfigs[modelName]) {
      throw new Error(`Unknown model name ${modelName}`)
    }
    this.modelName = modelName
  }

  async invoke(query: Query): Promise<string> {
    const apiUrl = this.getApiUrl();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.modelName,
        prompt: query.query,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.0
        }

      }),
    })

    const responseData = await response.json()
    return JSON.stringify(responseData)
  }

  getApiUrl = () => { return this.modelConfigs[this.modelName].apiUrl }

}
// The instructions generator starts with a single user query
// the query is then passed to the language model for a response
// the response is parsed into steps
// each step is then passed to the language model to generate an instruction
// the instructions contain:
// - the original query,
// - the original response, 
// - the emphasis on the current step
// the instructions are then returned
export class InstructionsGenerator {
  private readonly languageModel: LanguageModel
  constructor(modelName: string) {
    this.languageModel = new LanguageModel(modelName)
  }
  // TODO: don't hardcode instructions here
  async generateInstructions(serviceContext: ServiceContext): Promise<string[]> {
    const INITIAL_INSTRUCTIONS: string = "Your response should be in Markdown format with each step shown as a new line. Do not wrap your entire answer in a code block. Your response should be well structured with headers and subheaders."
    const initialQuery = new Query(`Instructions: ${INITIAL_INSTRUCTIONS}\n\n Query: ${serviceContext.query}`)
    const response = await this.getInitialResponse(initialQuery)
    const steps = this.responseToSteps(response)
    const instructions = []
    for (const step of steps) {
      const queryContext = `Initial Query: ${initialQuery.query}\n\nResponse: ${response}\n\nStep: ${step}`
      const query = new Query(queryContext)
      const instruction = await this.generateSingleInstruction(query)
      instructions.push(instruction)
    }
    return instructions
  }
  // TODO: need to pass better prompt for standardizing output
  async generateSingleInstruction(query: Query): Promise<string> {
    const response = await this.languageModel.invoke(query)
    const responseJson = JSON.parse(response)
    return responseJson.response
  }

  responseToSteps(response: string): string[] {
    return response.split('\n\n').filter(step => step !== '')
  }

  async getInitialResponse(query: Query): Promise<string> {
    const response = await this.languageModel.invoke(query)
    return response
  }

}

// TODO: implement formatter
