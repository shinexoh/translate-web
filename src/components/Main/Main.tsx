import React, { useEffect, useRef, useState } from 'react';
import styles from './Main.module.css';
import ReactTextareaAutosize from 'react-textarea-autosize';
import axios, { CancelTokenSource } from 'axios';
import { RiFileCopyLine, RiVolumeUpLine } from '../SvgIcons';
import translation from '../../utils/translation';
import tts from '../../utils/tts';
import prefetchRequest from '../../utils/prefetch-request';

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

    // 点击 input 区域的朗读文本按钮时取消焦点
    const handleInputTts = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        inputRef.current?.blur();
        tts(inputValue);
    };

    // 页面加载完成时获取焦点
    useEffect(() => {
        focusInput();
        prefetchRequest();
    }, []);

    // 当 input 获取焦点时，将光标移动到文本末尾（仅在不手动指定光标位置时生效）
    const handleInputFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        const startAndEnd = event.target.value.length;
        event.target.setSelectionRange(startAndEnd, startAndEnd);
    };

    return (
        <div className={styles.main}>
            <div className={styles.inputWrapper} onClick={focusInput}>
                <ReactTextareaAutosize
                    className={styles.input}
                    ref={inputRef}
                    value={inputValue}
                    onInput={handleInput}
                    onFocus={handleInputFocus}
                    maxLength={2000}
                    placeholder="请输入中文，系统将自动翻译为英文"
                />
                <div className={styles.iconButtons}>
                    <button onClick={handleInputTts}>
                        <RiVolumeUpLine />
                    </button>
                </div>
            </div>
            <hr />
            <div className={styles.outputWrapper}>
                <ReactTextareaAutosize
                    className={styles.output}
                    value={outputValue}
                    placeholder="翻译结果"
                    readOnly
                />
                <div className={styles.iconButtons}>
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
