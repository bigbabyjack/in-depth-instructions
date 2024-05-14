# In Depth Instructions

In Depth Instructions is a tool for getting step-by-step instructions on any topic. Just ask about what you want to learn and you will get a markdown file for instructions.

This project is in the early stages.

## Usage:
This project requires Ollama to be installed. 
```bash
# model is optional. It will default to llama3:8b if not specified
npm run start "<query>" --model <modelname>
```

The output is in `PATH_TO_PROJECT/output.md`

## Examples
```bash
npm run start "Teach me git." --model llama3:8b
```

## Dependencies
- [Ollama](https://ollama.com/)
- Node.js
