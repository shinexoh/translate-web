import React, { useEffect, useRef, useState } from 'react';
import styles from './Main.module.css';
import ReactTextareaAutosize from 'react-textarea-autosize';
import axios, { CancelTokenSource } from 'axios';
import { RiFileCopyLine, RiVolumeUpLine } from '../SvgIcons';
import translation from '../../utils/translation';
import tts from '../../utils/tts';

const Main: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [outputValue, setOutputValue] = useState('');

    const timeoutRef = useRef<number | null>(null);
    const cancelTokenRef = useRef<CancelTokenSource | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // 获取 input 焦点
    const focusInput = () => inputRef.current?.focus();

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
        timeoutRef.current = setTimeout(async () => {
            cancelTokenRef.current = axios.CancelToken.source();
            const result = await translation(newInput, cancelTokenRef.current.token);
            if (result) {
                setOutputValue(result);
            }
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
                    <button onClick={() => tts(inputValue)}>
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
                    <button onClick={() => tts(outputValue)}>
                        <RiVolumeUpLine />
                    </button>
                    <button onClick={handleCopy}><RiFileCopyLine /></button>
                </div>
            </div>
        </div>
    );
};

export default Main;
