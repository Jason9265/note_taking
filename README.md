# note_taking
note taking app. Django + React + OpenAI API

# Demo site
https://jason.college/note

Use existing notes as a knowledge base to generate .md files.
Provide customized instructions and it will give the answer from ChatGPT4.

# Setup environment variables before using OPENAI_API

Please setup your OPENAI_API_KEY into your environment, the format is

```export OPENAI_API_KEY='sk-XXX'```

# Setup environment variables before using React
Please setup environment variables 'REACT_APP_API_URL'

1. Create a file named '.env.developement' under ./frontend folder

2. Copy this line into the file

    ```REACT_APP_API_URL = http://localhost:8000```

3. Run ```npm run start``` again to apply environment variables

For deploying it on production, please 

1. Create a file named '.env.production' under ./frontend folder

2. Use your back-end URL into the file

    ```REACT_APP_API_URL = XXX```

3. Run ```npm run build``` to build js file using environment variables
