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

  _loadSample( url ) {
    const request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';

    // Event listener - When the response is available.
    request.onload = () => {
      const audioData = request.response;

      store.audioContext.decodeAudioData(audioData)
      .then(decodedData => this.decodedAudioData = decodedData);
    }

    // Event listener - When an errorr occur.
    request.error = () => {
      console.log( 'An error occurred while transferring the file.' );
    }

    request.open('GET', url, true);
    request.send();
  }

  play(executionTime) {
    // Create an AudioBufferSourceNode.
    const source = store.audioContext.createBufferSource();
    source.buffer = this.decodedAudioData;
    source.connect(store.masterVolume);
    source.start(executionTime);
  }
}
