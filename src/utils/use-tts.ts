import { EdgeSpeechTTS } from '@lobehub/tts';
import { useRef } from 'react';

function useTTS() {
  const audioContext = useRef<AudioContext | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const edgeSpeechTTS = useRef<EdgeSpeechTTS>(new EdgeSpeechTTS({ locale: 'zh-CN' }));

  // 清除当前播放的音频
  const clearCurrentAudio = () => {
    if (source.current) {
      source.current.stop();
      source.current.disconnect();
    }
  };

  // 朗读文本
  const tts = async (text: string) => {
    if (!text.trim()) {
      return;
    }

    source.current?.stop();
    const audioBuffer = await edgeSpeechTTS.current.createAudio({
      input: text,
      options: {
        voice: EdgeSpeechTTS.voiceList['zh-CN'][7],
      },
    });
    clearCurrentAudio();
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }
    source.current = audioContext.current.createBufferSource();
    source.current.buffer = audioBuffer;
    source.current.connect(audioContext.current.destination);
    source.current.start();
  };

  return { tts, clearCurrentAudio };
}

export default useTTS;
