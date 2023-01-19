const { readLineAsync } = require("./prompt");
const { viewer } = require("./viewer");

const syllabus = async (page) => {
    const subjects = [
        "1: CA",
        "2: ADBMS",
        "3: FOM",
        "4: C",
        "5: C(Practical)",
        "6: ADBMS(Practical)"
    ];
    let subject;

    async function getPrompt(message) {
        var promptInput = await readLineAsync(message);
        if (!subjects.find(x => x.startsWith(promptInput))) {
            console.log("Invalid input, Please enter a valid subject number");
            return await getPrompt(message);
        }
        return promptInput;
    }

    subject = await getPrompt(`Select a subject:\n${subjects.join("\n")}\n\nEnter:`);

    switch (subject) {
        case "1":
            await page.goto("https://learning.onlinemanipal.com/d2l/lp/customwidgets/7639/frame/533?d2l_body_type=3");
            break;
        case "2":
            await page.goto("https://learning.onlinemanipal.com/d2l/lp/customwidgets/7638/frame/533?d2l_body_type=3");
            break;
        case "3":
            await page.goto("https://learning.onlinemanipal.com/d2l/lp/customwidgets/7637/frame/533?d2l_body_type=3");
            break;
        case "4":
            await page.goto("https://learning.onlinemanipal.com/d2l/lp/customwidgets/7636/frame/533?d2l_body_type=3");
            break;
        case "5":
            await page.goto("https://learning.onlinemanipal.com/d2l/lp/customwidgets/7640/frame/533?d2l_body_type=3");
            break;
        case "6":
            await page.goto("https://learning.onlinemanipal.com/d2l/lp/customwidgets/7641/frame/533?d2l_body_type=3");
            break;
    }
    // await page.goto("https://learning.onlinemanipal.com/d2l/lp/customwidgets/7639/frame/533?d2l_body_type=3", {
    //     waitUntil: "networkidle2",
    // });

    const iframes = await page.$$("iframe");
    let contentFrame;
    for (const iframe of iframes) {
        try {
            const frame = await iframe.contentFrame();
            if (frame.url() === "https://cdn.lcs.brightspace.com/widgets/visual_toc/index.html") {
                contentFrame = frame;
                break;
            }
        } catch (e) {
            console.log("Error: ", e);
        }
    }
    if (contentFrame) {
        await contentFrame.waitForSelector('.quicknav a');
        console.log("Waiting for 5 seconds to let all the milestone tiles load");
        await new Promise((r) => setTimeout(r, 5000));
        let uncompleteUnits = await contentFrame.evaluate(() => {
            const anchors = document.querySelectorAll(".quicknav a.blue");
            return Array.from(anchors, (a) => {
                return a.href;
            });
        });
        console.log(`Total uncomplete units: ${uncompleteUnits.length}`);
        for (const url of uncompleteUnits) {
            try {
                await page.goto(url, { waitUntil: "networkidle2" });

            } catch (e) {
                console.log("Error: ", e);
            }
            let isVimeo = false;
            await new Promise((r) => setTimeout(r, 3000));
            const framess = await page.frames();
            await new Promise((r) => setTimeout(r, 2000));
            for (let i = 0; i < framess.length; i++) {
                //check if the frame url contains vimeo
                if (framess[i].url().includes("https://player.vimeo.com/video/")) {
                    await viewer(framess[i]);
                    isVimeo = true;
                    break;
                }
            }
            if (!isVimeo) {
                console.log("Waiting for 10 seconds");
                await new Promise((r) => setTimeout(r, 10000));
            }
        }
    }
};
module.exports = { syllabus };