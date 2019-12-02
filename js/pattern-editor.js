import { store } from './store.js';

const styleTextContent = `
pattern-editor {
  width: 100%; height: calc(100vh - 65px);
  display: grid;
  grid-template-columns: 100px repeat(16, 1fr);
  grid-auto-rows: minmax(25px, 35px);
  gap: 1px;
  justify-content: stretch;
  align-items: stretch;
}

.sound-slot {
  color: #fff;
  font-weight: 400;
  font-size: 13px;
  line-height: 25px;
  text-indent: 10px;
  border-left: 4px solid #bf6b23;
  border-bottom: 1px solid #1a1a1a;
  cursor: pointer;
  overflow: hidden;
}

.sound-slot.selected {
  background-color: #333;
}

.sound-slot:hover {
  background-color: #525252;
}

.step {
  background-color: #47464d;
  border-radius: 0;
  transition: none;
}

.step:hover {
  background-color: #676767 !important;
}

.step[active] {
  background-color: #bf6b23 !important;
}

.step[data-semiquaver = "0"],
.step[data-semiquaver = "4"],
.step[data-semiquaver = "8"],
.step[data-semiquaver = "12"] {
  border-left: 2px solid #26262d;
}`;

class PatternEditor extends HTMLElement {
  constructor() {
    super();

    const styleElt = document.createElement('style');
    styleElt.textContent = styleTextContent;
    this.appendChild(styleElt);

    for (let i = 0; i < 14; i++) {
      this.appendChild(this._createPatternEditorRow(i));
    }

    const bar = document.createElement('div');
    bar.id = 'bar';
    this.appendChild(bar);
  }

  connectedCallback() {
    if (!this.isConnected) return;

    // Add listeners.
    this.addEventListener('change', evt => {
      const step = evt.target;
      const semiquaver = step.getAttribute('data-semiquaver');
      const sampleNumber = step.getAttribute('data-sample');

      if (step.hasAttribute('active')) {
        if (!store.samplesToPlayBySemiquaver[semiquaver]) {
          store.samplesToPlayBySemiquaver[semiquaver] = [];
        }
        const sample = store.getSampleById(sampleNumber);
        if (sample) store.samplesToPlayBySemiquaver[semiquaver].push(sample);

      } else {
        const samplesToPlay = store.samplesToPlayBySemiquaver[semiquaver];
        const updatedSamplesToPlay = samplesToPlay.filter(sample => sample.id != sampleNumber);
        store.samplesToPlayBySemiquaver[semiquaver] = updatedSamplesToPlay;
      }
    });
  }

  _createPatternEditorRow(rowNumber) {
    const patternEditorRow = document.createDocumentFragment();
    patternEditorRow.appendChild(this._createSoundSlot(rowNumber));

    // Create steps.
    for (let semiquaver = 0; semiquaver < 16; semiquaver++) {
      patternEditorRow.appendChild(this._createStep(rowNumber, semiquaver));
    }

    return patternEditorRow;
  }

  _createSoundSlot(sampleNumber) {
    const soundSlot = document.createElement('div');
    soundSlot.className = 'sound-slot';
    soundSlot.setAttribute('data-sample', sampleNumber) ;
    soundSlot.innerText = `Sample ${sampleNumber + 1}`;
    return soundSlot;
  }

  _createStep(sampleNumber, semiquaver) {
    const step = document.createElement('keen-button');
    step.className = 'step';
    step.textContent = ' ';
    step.setAttribute('data-sample', sampleNumber);
    step.setAttribute('data-semiquaver', semiquaver);
    step.setAttribute('toggles', '');
    return step;
  }
}

customElements.define('pattern-editor', PatternEditor);
