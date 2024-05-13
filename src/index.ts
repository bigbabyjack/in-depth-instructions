import { InstructionsGenerator, LanguageModel, Query } from "./service";
import { ServiceContext } from "./datastructures"

async function main() {


  const context: ServiceContext = {
    id: '1',
    query: `Teach me how to write an arrow function in TypeScript.`,
  };

  const generator = new InstructionsGenerator('llama3:8b');

  const instructions = await generator.generateInstructions(context);
  console.log(instructions);
  // const response = await new LanguageModel('llama3:8b').invoke(new Query(context.query));
  // const responseJson = JSON.parse(response);
  // // console.log(responseJson);
  // const responseText = JSON.parse(response).response

}

main();
