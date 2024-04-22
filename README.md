# GitHub Repository Analytics

Welcome to the GitHub Repository Analytics project! This project provides a web application that allows you to gain insights and analytics about GitHub repositories. With this application, you can easily search for a GitHub repository by entering its URL and obtain valuable information about it. Additionally, you can discover the top starred repositories on GitHub at the moment.
![Demo](https://github.com/luismvaldez/gls/main/demo.gif)
## Features

- **Repository Analytics**: Enter the URL of a GitHub repository in the search box, and the application will provide you with detailed analytics about that repository. Gain insights into various metrics and statistics to understand the repository's popularity, activity, and contributions.

- **Top Starred Repositories**: Explore the most starred repositories on GitHub right now. The application fetches and displays a list of the top repositories based on their star count, allowing you to discover popular and trending projects.

## Getting Started

To run the GitHub Repository Analytics project locally, follow these steps:

### Prerequisites

- Docker (for running the backend)
- Node.js and npm (for running the frontend)

### Quick Start

For a quick start, you can use the provided `start.sh` script to set up and run both the backend and frontend simultaneously. Simply execute the following command:

```
chmod +x ./start.sh
./start.sh
```

The script will build and start the backend using Docker Compose and then install the frontend dependencies and start the development server.

### Manual Setup

If you prefer to set up the backend and frontend manually, follow these steps:


#### Backend Setup

1. Navigate to the `gls-backend` directory:
```
cd gls-backend
```

2. Build and start the backend using Docker Compose:
```
docker compose up -d --build
```

This command will build the backend Docker image and start the backend service in detached mode.

#### Frontend Setup

1. Navigate to the `gls-frontend` directory:
```
cd gls-frontend
```

2. Install the frontend dependencies:
```
npm install
```
3. Start the frontend development server:
```
npm run dev
```

This command will start the frontend development server and provide you with a local URL to access the application in your web browser.

### Project Structure

The project consists of two main components:

- **Backend**: The backend is located in the `gls-backend` directory. It is built using [NestJS](https://nestjs.com/) and provides the necessary API endpoints for fetching repository analytics and top starred repositories.

- **Frontend**: The frontend is located in the `gls-frontend` directory. It is built using [Next.js](https://nextjs.org/) and provides the user interface for interacting with the GitHub Repository Analytics application.
