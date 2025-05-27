# conversation ..

addParticipantsToExistingConversation
showParticipantsOfAConversation
removeParticipentsFromAConversation

// chat gpt
npm install langchain openai @langchain/community @langchain/langgraph

// yt vide

npm i langchain dotenv
npm i @langchain/openai @langchain/anthropic @langchain/google-genai
@langchain/groq

/////////////////////////////////////////////////////////////////

load test 
-> npx loadtest -n 200 -c 50 -k http://localhost:6731/api/v1/advance/blocking

-> npx loadtest -n 200 -c 50 -k http://localhost:6731/api/v1/advance/blocking_four_workers

-> npx loadtest -n 200 -c 50 -k http://localhost:6731/api/v1/advance/non-blocking

-> npx loadtest -n 200 -c 50 -k http://localhost:6731/api/v1/advance/eventEmitter


