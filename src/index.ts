interface ServiceContext {
  id: string
  query: string
  instructions: string[]
}


async function getInstructions(context: ServiceContext) {
  const instructions = `I have found the following instructions for you: ${context.instructions.join(', ')}`
  const payload = {

  }

  return context
}


function main() {
  // const query = process.argv[2]

  const context: ServiceContext = {
    id: '1',
    query: "Teach me how to use git",
    instructions: []
  }

  console.log(context);
}

main()
