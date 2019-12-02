export const store = {
  isPlaying: false,
  bpm: 80,
  lastExecutionTime: 0,
  semiquaverToCheck: 0,
  audioContext: new (window.AudioContext || window.webkitAudioContext)(),
  samples: [],
  samplesToPlayBySemiquaver: [],
  scheduledExecutionsTime: [],

  get nextExecutionTime() {
    return this.lastExecutionTime + this.semiquaverDuration;
  },
  get semiquaverDuration() {
    return 60 / ( this.bpm * 4 );
  },

  getSampleById(id) {
    return this.samples.find(sample => sample.id == id);
  }
};
