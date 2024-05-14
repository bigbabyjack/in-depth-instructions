import * as fs from 'fs';
import { ServiceContext } from './datastructures';
import { Prompts } from './prompts';

export class Query {
  query: string
  system?: string
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
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.modelName,
          prompt: `${query.query}`,
          stream: false,
          seed: 47
        }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status ${response.status}`)
      }
      const responseData = await response.json()
      return JSON.stringify(responseData)
    } catch (err) {
      console.log(`Error during fetch operation: ${err}`)
      throw new Error('Failed to fetch data from API.')
    }
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

  async generateInstructions(serviceContext: ServiceContext): Promise<string[]> {
    const initialQuery = new Query(`${Prompts.INITIAL_RESPONSE}\n\nQuery: ${serviceContext.query}`,)
    const responseData = await this.getInitialResponse(initialQuery)
    const response = JSON.parse(responseData).response
    const steps = this.responseToSteps(response)
    console.log(`Number of steps: ${steps.length}`)
    // Map each step to an indexed promise to preserve order
    const instructionPromises = steps.map(async (step, index) => {
      const queryContext = `${Prompts.SINGLE_INSTRUCTION}\nInitial Query: ${serviceContext.query}\nStep: ${step}`
      const query = new Query(queryContext)
      return this.generateSingleInstruction(query).then(instruction => ({ index, instruction }))
    })

    const instructionsWithIndex = await Promise.all(instructionPromises)

    // Sort by the original indices to ensure the order
    instructionsWithIndex.sort((a, b) => a.index - b.index)

    // Extract the instructions in the correct order
    const instructions = instructionsWithIndex.map(item => item.instruction)

    return instructions
  }
  async generateSingleInstruction(query: Query): Promise<string> {
    // console.log(`Generating instructions for ${JSON.stringify(query)}`)
    const response = await this.languageModel.invoke(query)
    const responseJson = JSON.parse(response)
    const parsedResponse = responseJson.response
    console.log(`Parsed Response for step: ${parsedResponse}`)
    console.log(`============================================`)
    return parsedResponse
  }

  responseToSteps(response: string): string[] {
    return response.split(/Step [0-9]+/).filter(step => step.trim() !== '')
  }

  async getInitialResponse(query: Query): Promise<string> {
    const response = await this.languageModel.invoke(query)
    return response
  }

}

export function writeMarkdownToFile(markdown: string): void {
  fs.writeFile('./output.md', markdown, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Success!');
    }
  });
}
