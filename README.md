# Serenity Journal

## Requirements

- [NodeJS](https://nodejs.org/en/download)
- [Firebase CLI](https://firebase.google.com/docs/cli)

## Get Started (Progressive Web Application)

Run the following terminal commands:

```shell
# install dependencies
yarn
# run web app
yarn dev
```

## Get Started (Server)

Create a ``.env`` file in the function folder with an [OpenAI API key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) specified:

```shell
OPEN_AI_API_KEY="..."
```

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
