const authenticate = async (page, email, password) => {
    try {
        console.log("Authenticating...");
        await page.waitForSelector('input[name="loginfmt"]', { timeout: 2000 });
        await page.type('input[name="loginfmt"]', email);
        await page.click('[id="idSIButton9"]');
        await page.waitForSelector('input[name="passwd"]');
        await page.type('input[name="passwd"]', password);
        //wait 2 seconds for the button to be clickable
        await new Promise((r) => setTimeout(r, 2000));
        await page.click('[id="idSIButton9"]');
        await new Promise((r) => setTimeout(r, 2000));
        await page.click('[id="idSIButton9"]');
        await page.waitForNavigation();
        console.log("Authenticated successfully");
        return true;
    } catch (err) {
        console.log("Error authenticating please check your credentials or try again later");
        return false;
    }
};

module.exports = { authenticate };