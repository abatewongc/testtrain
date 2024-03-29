# TestTrain
## An Integration Testing Test Suite Application
<br/>

[![React](/internals/img/react-padded-90.png)](https://facebook.github.io/react/)
[![Webpack](/internals/img/webpack-padded-90.png)](https://webpack.github.io/)
[![Redux](/internals/img/redux-padded-90.png)](http://redux.js.org/)
[![React Router](/internals/img/react-router-padded-90.png)](https://github.com/ReactTraining/react-router)
[![ESLint](/internals/img/eslint-padded-90.png)](http://eslint.org/)
[![Yarn](/internals/img/yarn-padded-90.png)](https://yarnpkg.com/)
[![Ant Design](/internals/img/antd-padded-90.png)](https://ant.design/)
[![Mocha](/internals/img/mocha-padded-90.png)](https://mochajs.org/)
[![Chai](/internals/img/chai-padded-90.png)](http://www.chaijs.com/)

## About TestTrain

TestTrain is an [Electron](http://electron.atom.io/) application using  [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), [React Router](https://github.com/reactjs/react-router), [Webpack](http://webpack.github.io/docs/), [React Transform HMR](https://github.com/gaearon/react-transform-hmr), and [Ant Design](https://ant.design/) for rapid development of both the front end and the back end of the application. This application was created using the [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate).

TestTrain is designed to look and feel like an IDE but without the need for actual coding. TestTrain's UI is split between two panels, the left side panel for projects along with their endpoints, and a right side panel which shows endpoint information and allows users to interact with the endpoint.

TestTrain builds automated test code based on user input, then runs the tests using the mocha testing framework along with the Chai/Chai-HTTP assertion libraries. HTML test reports are built via mochawesome and are viewable in any web browser.

## Requirements

To use or develop TestTrain, you must have [node.js](https://nodejs.org/en/) along with its package manager npm.

## For Use

### Installation

Visit the GitHub release page of TestTrain to get the installers for Windows, Mac, and Linux.

## For developing

### Installation

Clone the repository and then go to the directory with your terminal and use the command:

```bash
$ npm install
```

### Run with Hot Rendering

In the repository directory using your terminal, use the command:

```bash
$ npm run dev
```

### Creating Install Packages

In the repository directory using your terminal, use the command:

```bash
$ npm run package-all
```

For individual packaging

```bash
$ npm run package-win
```

```bash
$ npm run package-linux
```

Unfortunately, a Mac installation package must be made on a Mac OS using `$ npm run package-all`

## Developers

- Harrison Jue
- Christian Abate-Wong
