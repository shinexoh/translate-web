import { EdgeSpeechTTS } from '@lobehub/tts';

// 文本转语音
async function tts(text: string): Promise<void> {
    // 如果 text 只有空格或空行就不进行 TTS
    if (!text.trim()) return;

    const edgeSpeechTTS = new EdgeSpeechTTS({ locale: 'zh-CN' });
    const tts = await edgeSpeechTTS.createAudio({
        input: text,
        options: {
            voice: EdgeSpeechTTS.voiceList['zh-CN'][7]
        }
    });
    const audioContext = new AudioContext();
    const source = audioContext.createBufferSource();
    source.buffer = tts;
    source.connect(audioContext.destination);
    source.start();
};

export default tts;
