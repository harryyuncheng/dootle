# dootle

## Installation

### Backend

#### Using `uv`

1. Install uv if you haven't already by running `curl -LsSf https://astral.sh/uv/install.sh | sh` in your terminal if you're on macOS (otherwise, follow the instructions for your OS [here](https://docs.astral.sh/uv/getting-started/installation/#installation-methods)); you will need to restart your terminal after doing this
2. Copy `.env.example` and name the copy `.env`, then fill it in with your environment variables
3. Open the `backend` folder in your terminal
4. Run `uv run main.py` to start the server

### Frontend

1. Open the `frontend` folder in your terminal
2. [Install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you haven't already
2. Run `npm install` to install all packages
3. Run `npm run start` to start the Next.js development server
