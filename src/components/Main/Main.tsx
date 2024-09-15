import React, { useEffect, useRef, useState } from 'react';
import styles from './Main.module.css';
import ReactTextareaAutosize from 'react-textarea-autosize';
import axios, { CancelTokenSource } from 'axios';
import { RiFileCopyLine, RiVolumeUpLine } from '../SvgIcons';

type TranslationResponse = {
    code: number;
    data: string;
    id: number;
    method: string;
    source_lang: string;
    target_lang: string;
    alternatives: string[];
}

const Main: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [outputValue, setOutputValue] = useState('');

    const timeoutRef = useRef<number | null>(null);
    const cancelTokenRef = useRef<CancelTokenSource | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // 获取 input 焦点
    const focusInput = () => inputRef.current?.focus();

    // 翻译
    const translation = async (text: string) => {
        cancelTokenRef.current = axios.CancelToken.source();

        try {
            const response = await axios.post<TranslationResponse>(
                'https://deeplx.11444.xyz/translate',
                { text: text, target_lang: 'EN' },
                {
                    headers: { 'Content-Type': 'application/json' },
                    cancelToken: cancelTokenRef.current.token,
                }
            );
            if (response.status === 200) {
                setOutputValue(response.data.data);
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                return;
            } else if (axios.isAxiosError(error)) {
                setOutputValue('翻译失败: ' + error.message);
            } else {
                setOutputValue('未知错误: ' + error);
            }
        }
    };

    // 处理文本转语音
    const handleTTS = async (text: string) => {
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
                audioContext.decodeAudioData(response.data, (buffer) => {
                    const source = audioContext.createBufferSource();
                    source.buffer = buffer;
                    source.connect(audioContext.destination);
                    source.start();
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 处理输入
    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newInput = event.target.value;
        setInputValue(newInput);

        // 如果 newInput 所有内容只有空格或空行，就取消翻译和清空输出
        if (!newInput.trim()) {
            setOutputValue('');
            cancelTokenRef.current?.cancel('翻译因重新输入而取消');
            return;
        }

        // 如果有新的输入，就取消之前的翻译和定时器避免频繁请求
        if (timeoutRef.current) {
            cancelTokenRef.current?.cancel('翻译因重新输入而取消');
            clearTimeout(timeoutRef.current);
        }

        // 在用户停止输入 200ms 后开始翻译
        timeoutRef.current = setTimeout(() => {
            translation(newInput);
        }, 200);
    };

    // 复制翻译结果
    const handleCopy = () => navigator.clipboard.writeText(outputValue);

    // 页面加载完成时获取焦点
    useEffect(() => {
        focusInput();
    }, []);

    return (
        <div className={styles.main}>
            <div className={styles.inputWrapper} onClick={focusInput}>
                <ReactTextareaAutosize
                    className={styles.input}
                    ref={inputRef}
                    value={inputValue}
                    onInput={handleInput}
                    maxLength={2000}
                    placeholder="请输入中文，系统将自动翻译为英文"
                />
                <div className={styles.inputButtons}>
                    <button onClick={() => handleTTS(inputValue)}>
                        <RiVolumeUpLine />
                    </button>
                </div>
            </div>
            <hr />
            <div className={styles.outputWrapper}>
                {outputValue
                    ? <span className={styles.output}>{outputValue}</span>
                    : <span className={styles.placeholder}>翻译结果</span>}
                <div className={styles.outputButtons}>
                    <button onClick={() => handleTTS(outputValue)}>
                        <RiVolumeUpLine />
                    </button>
                    <button onClick={handleCopy}><RiFileCopyLine /></button>
                </div>
            </div>
        </div>
    );
};

export default Main;
