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
        if (process.argv.length > 3) {
            console.log("Too many arguments");
            return;
        }
        if (process.argv.length < 3) {
            console.log("Must pass a query");
            return;
        }
        const query = process.argv[2];
        const context = {
            id: '1',
            query: query
        };
        const generator = new service_1.InstructionsGenerator('llama3:8b');
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
