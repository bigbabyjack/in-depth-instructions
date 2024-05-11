import { OllamaService } from "./service";
import { ServiceContext } from "./datastructures"

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
