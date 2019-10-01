# Stumble

A mobile app that helps people plan their trips in a way that they can experience new places to the fullest.

## Installation

This guide assumes that you already have NodeJS and NPM installed on your machine.

This project is built on & managed by [Expo](https://expo.io/). Install the Expo CLI development tool.

```bash
npm install -g expo-cli
```

You must install project dependencies first before you can run the app.

```bash
expo install
```

Run the development server.

```bash
expo start
```

You will see a QR code displayed on your terminal. You need to download
the Expo client (available on App Store or Google Play) to scan this QR code & run it.

Scan the QR code using the Expo client. App will build & run on your mobile device!

## Project Structure

```
frontend/
├── app/
│   ├── assets/
│   ├── components/
│   └── config/
│       ├── styles.js
│       └── settings.js
│   ├── screens/
└── App.js
```

- `app` is our source directory.
  - `assets` contains various assets such as images or fonts
  - `components` contains functional (stateless) components
  - `config`
    - `styles.js` contains global styles data
    - `settings.js` contains info such as our server URL
  - `screens` contains screens for our app
- `App.js` is the entry point of our app (root of all components)

## Running the Linter

[ESLint](https://eslint.org/) will enforce a consistent style to our project. To run it, run

```bash
./node_modules/.bin/eslint <filename>
```

where `<filename>` is the file you want to run the linter on. Run the linter on files you modified before
making a pull request.