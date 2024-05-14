import { InstructionsGenerator, writeMarkdownToFile } from "./service";
import { ServiceContext } from "./datastructures"

async function main() {

  if (process.argv.length > 3) {
    console.log("Too many arguments")
    return
  }
  if (process.argv.length < 3) {
    console.log("Must pass a query")
    return
  }
  const query = process.argv[2]

  const context: ServiceContext = {
    id: '1',
    query: query
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
