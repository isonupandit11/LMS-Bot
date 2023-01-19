// const puppeteer = require("puppeteer");
const { authenticate } = require("./authenticate");
const { syllabus } = require("./syllabus");
const { readLineAsync } = require("./prompt");
const fs = require("fs");
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin({ stealth: true }))

const start = async () => {
    try {
        fs.accessSync("./config.json");
    } catch (err) {
        console.log("config.json not found");
        console.log("Creating config.json");
        const config = {
            email: "",
            password: "",
        };
        fs.writeFileSync("./config.json", JSON.stringify(config));
        console.log("config.json created");
        console.log("Please fill in the details in config.json");
        process.exit(0);
    }
    const config = JSON.parse(fs.readFileSync("./config.json"));

    let headless = async () => {
        let input = await readLineAsync("Do you want to run the browser in background? (y/n) [y]:");
        if (input === "y" || input === "Y" || input === "") {
            return true;
        } else if (input === "n" || input === "N") {
            return false;
        } else {
            console.log("Invalid input, Please enter 'y' or 'n'");
            return await headless();
        }
    }
    headless = await headless();


    console.log(`Browser will run in background: ${headless}`);

    const browser = await puppeteer.launch({
        //uncomment this to use chrome from the path
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        headless: headless, // default is true
        ignoreDefaultArgs: ["--enable-automation"],
        defaultViewport: null, //Defaults to an 800x600 viewport
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--disable-gpu",
            //maximize the window
            "--start-maximized",
        ],
    }).then((browser) => {
        console.log("Browser launched successfully");
        return browser;
    }).catch((err) => {
        console.log("Error launching browser");
        console.log(err);
        process.exit(0);
    });
    const page = await browser.newPage();
    //set viewport to max

    await page.setBypassCSP(true);

    try {
        await page.goto("https://learning.onlinemanipal.com/d2l/lp/auth/saml/login", {
            waitUntil: "networkidle2",
        });
    }
    catch (err) {
        console.log("Error loading page");
        console.log(err);
        process.exit(0);
    }

    const { email, password } = config;

    if (await authenticate(page, email, password)) {
        await syllabus(page);
    } else {
        console.log("exiting program");
        process.exit(0);
    }
};

start();