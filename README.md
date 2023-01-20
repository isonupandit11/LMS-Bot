# LMS-Bot

LMS-Bot is a project that automates Learning Management Systems (LMS) for professionals who do not have time to complete video progressions. This project uses Node.js and requires user to provide email and password credentials in a config.json file before running the program. 


## Features

* Automates Learning Management Systems (LMS)
* Ability to select for which subject you want to increase watch time
* Option to run the browser in headless mode 

## Prerequisites

* [Node](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/get-npm)


## Getting Started

Using npm and Node, you can install and run LMS-Bot:

1. Install the dependencies:

`npm install`

2. Add email and password credentials to the config.json file:

```
{
  "email": "<ENTER EMAIL ADDRESS HERE>",
  "password": "<ENTER PASSWORD HERE>"
}
```

3. Run the program:

`node main.js`


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
