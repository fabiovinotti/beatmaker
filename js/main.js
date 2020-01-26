import { store } from './store.js';
import Sample from './sample.js';
import './pattern-editor.js';

// Import Keen Components
import '../dependencies/keen-components/components/keen-button.js';
import '../dependencies/keen-components/components/number-field.js';
import '../dependencies/keen-components/components/keen-slider.js';

// Cached Elements.
const playButton = document.querySelector('#play-button');
const bpmInput = document.querySelector('#bpm-input');
const masterVolumeSlider = document.querySelector('keen-slider');

// Event Listeners.
window.addEventListener('keydown', evt => {
  if (evt.keyCode ==  32) {
    if (store.isPlaying) {
      stopBeatMaker();
      playButton.removeAttribute('active');
    } else {
      playButton.setAttribute('active', '');
      startBeatMaker();
    }
  }
});

playButton.addEventListener('change', playButtonReact);
function playButtonReact() {
  if (store.isPlaying) stopBeatMaker();
  else startBeatMaker();
}

bpmInput.addEventListener('change', () => {
  store.bpm = bpmInput.value;
});

/*masterVolumeSlider.addEventListener('input', () => {
  store.masterVolume.gain.value = masterVolumeSlider.value / 100;
});*/

bpmInput.value = store.bpm;

// Create the master volume audioNode and connect it to destination.
store.masterVolume = store.audioContext.createGain();
store.masterVolume.gain.value = 0.75;
store.masterVolume.connect(store.audioContext.destination);
/*masterVolumeSlider.value = 75;*/

// Create samples.
store.samples[0] = new Sample('./kit-electro/Kick 1.wav');
store.samples[1] = new Sample('./kit-electro/Kick 2.wav');
store.samples[2] = new Sample('./kit-electro/Snare 1.wav');
store.samples[3] = new Sample('./kit-electro/Snare 2.wav');
store.samples[4] = new Sample('./kit-electro/Snare 3.wav');
store.samples[5] = new Sample('./kit-electro/Closed HH 1.wav');
store.samples[6] = new Sample('./kit-electro/Closed HH 2.wav');
store.samples[7] = new Sample('./kit-electro/Closed HH 3.wav');
store.samples[8] = new Sample('./kit-electro/Open HH 1.wav');
store.samples[9] = new Sample('./kit-electro/Open HH 2.wav');
store.samples[10] = new Sample('./kit-electro/Cymbal.wav');
store.samples[11] = new Sample('./kit-electro/Tom 1.wav');
store.samples[12] = new Sample('./kit-electro/Tom 2.wav');
store.samples[13] = new Sample('./kit-electro/Tom 3.wav');
store.samples[14] = new Sample('./kit-electro/Tom 4.wav');

const soundSlots = document.querySelectorAll('.sound-slot');
for (let i = 0; i < 15; i++) {
  soundSlots[i].innerText = store.samples[i].name;
}

function startBeatMaker() {
  store.isPlaying = true;
  store.lastExecutionTime = store.audioContext.currentTime - store.semiquaverDuration;
  scheduleNextExecutions();
  requestAnimationFrame(updateUI);
}

function stopBeatMaker() {
  store.isPlaying = false;
}

function scheduleNextExecutions() {
  const nextExecutionTime = store.nextExecutionTime;

  if (nextExecutionTime <= store.audioContext.currentTime + 0.100) {
    const semiquaverToCheck = store.semiquaverToCheck;
    const samplesToPlay = store.samplesToPlayBySemiquaver[semiquaverToCheck];

    if (samplesToPlay && samplesToPlay.length) {
      samplesToPlay.forEach(sample => sample.play(nextExecutionTime));
    }

    store.scheduledExecutionsTime.push({ time: nextExecutionTime, semiquaver: semiquaverToCheck});
    store.lastExecutionTime = nextExecutionTime;
    setNextSemiquaverToCheck();
  }

  if (store.isPlaying) {
    setTimeout(scheduleNextExecutions, 25);
  } else {
    store.semiquaverToCheck = 0;
  }
}

function setNextSemiquaverToCheck() {
  if (store.semiquaverToCheck + 1 < 16) {
    store.semiquaverToCheck++;
  } else {
    store.semiquaverToCheck = 0;
  }
}

function updateUI() {
  while (store.scheduledExecutionsTime.length && store.scheduledExecutionsTime[0].time < store.audioContext.currentTime) {
    const styleSheet = document.querySelector('pattern-editor style').sheet;

    if (styleSheet.cssRules[0].selectorText !== 'pattern-editor') {
      styleSheet.deleteRule(0);
    }

    styleSheet.insertRule(`.step[data-semiquaver="${store.scheduledExecutionsTime[0].semiquaver}"] { background-color: #504e58; }`);
    store.scheduledExecutionsTime.shift();
  }

  if (store.isPlaying) requestAnimationFrame(updateUI);
}
