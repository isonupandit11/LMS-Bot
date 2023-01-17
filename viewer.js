const viewer = async (frame) => {
    //wait for the video to load for 5 seconds
    console.log("Video loading");
    await new Promise((r) => setTimeout(r, 5000));
    await playVideo(frame);
}

const playVideo = async (frame) => {
    try {
        await frame.waitForSelector('video', { visible: true });
        await frame.waitForTimeout(Math.floor(Math.random() * (4000 - 2000)) + 2000);
        //play the video
        let duration = await frame.evaluate(async () => {
            const video = document.querySelector('video');
            video.click();
            await new Promise((r) => setTimeout(r, 3000));
            return parseFloat(video.duration);
        });

        //print wait time in minutes
        console.log(`Playing Video, Waiting for ${duration / 60} minutes`);
        await new Promise((r) => setTimeout(r, duration * 1000));
    } catch (e) {
        console.log("Error: Video not loaded or not able to find the duration")
    }
}

module.exports = { viewer };