
const textAreaEl = document.getElementById('text-area');
const copyEl = document.querySelector('.copy');
const deleteEl = document.querySelector('.delete');
const selectEl = document.getElementById('voices');
const speakEl = document.querySelector('.speak');
const wordCountEl = document.getElementById('word-count');

const speedSliderEl = document.getElementById('speed-slider');
const pitchSliderEl = document.getElementById('pitch-slider');
const volumeSliderEl = document.getElementById('volume-slider');

const speedIndicatorEl = document.querySelector('.speed-indicator');
const pitchIndicatorEl = document.querySelector('.pitch-indicator');
const volumeIndicatorEl = document.querySelector('.volume-indicator');

const stopBtn = document.querySelector('.stop-btn');
const pauseBtn = document.querySelector('.pause-btn');

const text = ''
const synth = window.speechSynthesis;
let voices = [];

function countWord(){
    let wordSum;
    const textInput = textAreaEl.value;

    if (textInput === ''){
        wordSum = 0;
    }
    else {
       let regex = /\s+/gi;
       wordSum = textInput.trim().replace(regex, ' ').split(' ').length
    }
    return wordCountEl.textContent = `${wordSum} Words`
}
setInterval(countWord, 100);

function defaultRange(){
    speedSliderEl.value = 1;
    pitchSliderEl.value = 1;
    volumeSliderEl.value = 1;

    speedIndicatorEl.textContent = '10';
    pitchIndicatorEl.textContent = '10';
    volumeIndicatorEl.textContent = '10';
}
defaultRange();




function speakText(){
    const textValue = textAreaEl.value;
    const utterance = new SpeechSynthesisUtterance(textValue);
    if (textValue !== ''){
        const selectedOption =
      selectEl.selectedOptions[0].getAttribute('data-name');

    for (let voice of voices){
        if (voice.name === selectedOption){
            utterance.voice = voice;
            break;

        }
    }
    const volumeValue = volumeSliderEl.value;
    utterance.volume = volumeValue;

    const pitchValue = pitchSliderEl.value;
    utterance.pitch = pitchValue;

    const speedValue = speedSliderEl.value;
    utterance.rate = speedValue;

        synth.speak(utterance);   
    }
    
}

speakEl.addEventListener('click', ()=>{
    if (synth.paused){
        synth.resume();
    }
    else{
        speakText()
    }
    return;
});

stopBtn.addEventListener('click', ()=>{
    synth.cancel()
});
pauseBtn.addEventListener('click', ()=>{
    synth.pause();
});



function copyToClipboard(){
    const copyText = textAreaEl.value;
    if (copyText !== ''){
        navigator.clipboard.writeText(copyText);

        setTimeout(()=>{
            const copyMsg = document.querySelector('#copy-txt');
            copyMsg.style.display = 'block';
            copyMsg.textContent = 'Copied!'
        }, 100)
    
        setTimeout(()=>{
            const copyMsg = document.querySelector('#copy-txt');
            copyMsg.style.display = 'none';
        }, 900)
    }
   
}

function deleteText(){
    const deleteMsg = textAreaEl.value;
    if (deleteMsg !== ''){
        textAreaEl.value = '';
    }
}
copyEl.addEventListener('click', copyToClipboard);
deleteEl.addEventListener('click', deleteText);

function populateVoices(){
    voices = speechSynthesis.getVoices().sort((a, b) =>{
        const aname = a;
        const bname = b;

        if (aname < bname){
            return -1;
        }else if (aname === bname){
            return 0;
        }else {
            return +1;
        }
        
    });

    const selectedIndex = selectEl.selectedIndex < 0 ? 0 : selectEl.selectedIndex;
    selectEl.innerHTML = '';
    
    for (let voice of voices){
        const optionEl = document.createElement('option');
        optionEl.textContent = `${voice.name} ${voice.lang}`;
        //optionEl.setAttribute('value', voice.name);
        optionEl.setAttribute('data-lang', voice.lang);
        optionEl.setAttribute('data-name', voice.name);

        if (voice.default){
            optionEl.textContent = `${voice.name} ${voice.lang} - DEFAULT`
        }

        selectEl.appendChild(optionEl);
    }
    selectEl.selectedIndex = selectedIndex;
}
populateVoices();

if (typeof speechSynthesis !== 'undefined' 
    && speechSynthesis.onvoiceschanged !== undefined){
        speechSynthesis.onvoiceschanged = populateVoices;
}

function voiceSpeedText(){
    speedSliderEl.addEventListener('input', (e)=>{
        const sliderValue = e.target.value * 10;
        speedIndicatorEl.textContent = sliderValue;
    });
}

function voicePitchText(){
    pitchSliderEl.addEventListener('input', (e)=>{
        const sliderValue = e.target.value * 10;
        pitchIndicatorEl.textContent = sliderValue;
    }); 
}

function voiceVolumeText(){
    volumeSliderEl.addEventListener('input', (e)=>{
        const sliderValue = e.target.value * 10;
        volumeIndicatorEl.textContent = sliderValue;
    });
}
voiceSpeedText();
voicePitchText();
voiceVolumeText();
