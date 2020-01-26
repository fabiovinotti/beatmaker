import { store } from './store.js';
import { generateId } from './utils.js';

export default class Sample {
  constructor(url) {
    this.id = generateId();
    this.name = this._extractNameFromURL(url);
    this.decodedAudioData; // Audio data retrieved from the server and decoded.
    this._loadSample(url);
  }

  _extractNameFromURL(url) {
    const nameWithPeriod = url.match( /[^/]{1,}\./ )[0];
    return nameWithPeriod.slice(0, -1);
  }

  _loadSample(url) {
    fetch(url)
    .then(res => {
      try {
        if (!res.ok) throw new Error('Network response');
        return res.arrayBuffer();

      } catch(error) {
        console.log('Fetch error: ' + error.message);
      }
    })
    .then(audioData => store.audioContext.decodeAudioData(audioData, decodedData => this.decodedAudioData = decodedData));
  }

  play(executionTime) {
    // Create an AudioBufferSourceNode.
    const source = store.audioContext.createBufferSource();
    source.buffer = this.decodedAudioData;
    source.connect(store.masterVolume);
    source.start(executionTime);
  }
}
