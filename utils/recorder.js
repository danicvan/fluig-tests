const Recorder = require('node-screen-recorder').default;
const path = require('path');

function startRecording(name) {
    const output = path.resolve(__dirname, `../results/videos/${name}.mp4`);
    const recorder = new Recorder({
        fps: 15,
        videoFrame: { width: 1280, height: 720 },
        input: 'desktop',
        output
    });
    return { recorder, output };
}

module.exports = { startRecording };