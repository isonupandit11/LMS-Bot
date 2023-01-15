const viewer = async (frame) => {
    //wait for the video to load for 5 seconds
    console.log("video loading");
    await new Promise((r) => setTimeout(r, 5000));
    await playVideo(frame);
}

const playVideo = async (frame) => {
    await frame.waitForSelector('video');
    //play the video
    let duration = await frame.evaluate(async () => {
        const video = document.querySelector('video');
        video.click();

        await new Promise((r) => setTimeout(r, 5000));
        return parseFloat(video.duration);
    });

    //print wait time in minutes
    console.log(`Playing Video, Waiting for ${duration / 60} minutes`);
    await new Promise((r) => setTimeout(r, duration * 1000));
}

module.exports = { viewer };