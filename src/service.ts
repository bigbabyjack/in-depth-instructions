import * as fs from 'fs';
import { ServiceContext, Payload } from './datastructures';

class Query {
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
        temperature: 0.0,
        max_tokens: 50,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["\n"],
      }),
    })

    const responseData = await response.json()
    return JSON.stringify(responseData)
  }

  getApiUrl = () => { return this.modelConfigs[this.modelName].apiUrl }

}
