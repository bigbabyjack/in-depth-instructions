"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
        }
        else {
            console.log('No query specified.');
            return;
        }
        console.log(`Model selected: ${modelName}`);
        const context = {
            id: '1',
            query: query
        };
        const generator = new service_1.InstructionsGenerator(modelName);
        const inDepthInstructions = yield generator.generateInstructions(context);
        (0, service_1.writeMarkdownToFile)(inDepthInstructions.join('\n\n'));
        // const responseData = await generator.getInitialResponse(context);
        // const response = JSON.parse(responseData)
        // const responseText = response.response
        // const steps = generator.responseToSteps(responseText)
        // const response = await new LanguageModel('llama3:8b').invoke(new Query(context.query));
        // const responseJson = JSON.parse(response);
        // // console.log(responseJson);
        // const responseText = JSON.parse(response).response
    });
}
main();
