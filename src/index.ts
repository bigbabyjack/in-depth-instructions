import { InstructionsGenerator, writeMarkdownToFile } from "./service";
import { ServiceContext } from "./datastructures"

async function main() {

  const minimist = require('minimist');

  // Parse the arguments with a default value for model
  const args = minimist(process.argv.slice(2), {
    default: { model: 'llama3:8b' }
  });

  // The first argument (after the script name) is the query
  const query = args._[0];
  // Get the model name from the --model flag
  const modelName = args.model;

  if (query) {
    console.log(`Query: ${query}`);
  } else {
    console.log('No query specified.');
    return
  }

  console.log(`Model selected: ${modelName}`);

  const context: ServiceContext = {
    id: '1',
    query: query
  };

  const generator = new InstructionsGenerator(modelName);
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
