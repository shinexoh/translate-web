import React, { useEffect, useRef, useState } from 'react';
import styles from './Main.module.css';
import ReactTextareaAutosize from 'react-textarea-autosize';
import axios, { CancelTokenSource } from 'axios';

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

    // 页面加载完成时获取焦点
    useEffect(() => {
        focusInput();
    }, []);

    // 处理翻译
    const handleTranslation = async (text: string) => {
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
            if (response.data.code === 200) {
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
            handleTranslation(newInput);
        }, 200);
    };

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
            </div>
            <hr />
            <div className={styles.outputWrapper}>
                {outputValue
                    ? <span className={styles.output}>{outputValue}</span>
                    : <span className={styles.placeholder}>翻译结果</span>}
            </div>
        </div>
    );
};

export default Main;
