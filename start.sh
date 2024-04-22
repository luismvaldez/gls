#!/bin/bash

# Start the backend
cd gls-backend
docker compose up -d --build

# Start the frontend
cd ../gls-frontend
npm install
npm run dev