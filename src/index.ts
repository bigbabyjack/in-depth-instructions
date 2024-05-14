import { InstructionsGenerator, writeMarkdownToFile } from "./service";
import { ServiceContext } from "./datastructures"

async function main() {


  const context: ServiceContext = {
    id: '1',
    query: `Teach me how to use arrow functions in JavaScript.`,
  };

  const generator = new InstructionsGenerator('llama3:8b');
  const inDepthInstructions = await generator.generateInstructions(context)
  writeMarkdownToFile(inDepthInstructions.join('\n\n'))

  // const responseData = await generator.getInitialResponse(context);
  // const response = JSON.parse(responseData)
  // const responseText = response.response
  // const steps = generator.responseToSteps(responseText)

  // const response = await new LanguageModel('llama3:8b').invoke(new Query(context.query));
  // const responseJson = JSON.parse(response);
  // // console.log(responseJson);
  // const responseText = JSON.parse(response).response

}

main();
