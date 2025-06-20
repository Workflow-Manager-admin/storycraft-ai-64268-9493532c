#!/bin/bash
cd /home/kavia/workspace/code-generation/storycraft-ai-64268-9493532c/storycraft_ai_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

