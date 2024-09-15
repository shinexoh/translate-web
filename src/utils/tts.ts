import axios from 'axios';

// 文本转语音
async function tts(text: string): Promise<void> {
    // 如果 text 只有空格或空行，就不进行 TTS
    if (!text.trim()) return;

    try {
        const response = await axios.post(
            'https://oopstts.vercel.app/azure/tts',
            {
                text: text,
                voice: 'zh-CN-YunyangNeural'
            },
            { responseType: 'arraybuffer' }
        );
        if (response.status === 200) {
            // 解析语音数据并播放
            const audioContext = new AudioContext();
            audioContext.decodeAudioData(response.data as ArrayBuffer, (buffer) => {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start();
            }
            );
        }
    } catch (error) {
        console.error(error);
    }
};

export default tts;
