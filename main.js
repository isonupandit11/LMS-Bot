const puppeteer = require("puppeteer");
const { authenticate } = require("./authenticate");
const { syllabus } = require("./syllabus");
const { prompt } = require("./prompt");
const fs = require("fs");

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
    let headless;
    do {
        headless = prompt("Do you want browser to run in background? (y/n) [y]: ") || "y";
        switch (headless) {
            case "y":
                headless = true;
                break;
            case "n":
                headless = false;
                break;
            default:
                console.log("Invalid input, please enter 'y' or 'n'");
        }
    } while (headless === undefined);
    console.log(`Browser will run in background: ${headless}`);

    const browser = await puppeteer.launch({
        //uncomment this to use chrome from the path
        // executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
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