import { InstructionsGenerator, LanguageModel, Query } from "./service";
import { ServiceContext } from "./datastructures"

async function main() {

  const INITIAL_INSTRUCTIONS = "Your response should be in Markdown format with each step shown as a new line. Do not wrap your entire answer in a code block. Your response should be well structured with headers and subheaders."

  const context: ServiceContext = {
    id: '1',
    query: `Teach me how to write an arrow function in TypeScript. ${INITIAL_INSTRUCTIONS}`,
  };

  // const generator = new InstructionsGenerator(new LanguageModel('llama3:8b'));
  //
  // const instructions = generator.generateInstructions(context);
  // console.log(instructions);
  const response = await new LanguageModel('llama3:8b').invoke(new Query(context.query));
  console.log(JSON.parse(response).response);

}

main();
