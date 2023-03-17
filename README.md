# Serenity Journal

## Requirements

- [NodeJS 16](https://nodejs.org/en/blog/release/v16.16.0)
- [Firebase CLI](https://firebase.google.com/docs/cli)

## Environment
Create a ``.env`` file in the function folder with an [OpenAI API key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) specified:

```shell
OPEN_AI_API_KEY="..."
```

## Get Started (Speedrun)
Simply run `dev.sh` to install all dependencies, open PWA, and run Server all in one command.

```bash
sh dev.sh
```

## Get Started (Progressive Web Application)

Run the following terminal commands:

```shell
# install dependencies
yarn
# run web app
yarn dev
```

## Get Started (Server)

Run the following terminal commands:

```shell
# go into server folder
cd functions
# install dependencies
yarn
# run server
yarn serve
```

## Deploy Website and Server

Run the following terminal commands:

```shell
# deploy website
yarn deploy
# deploy server
cd functions
yarn deploy
```
