/** @jsxImportSource @emotion/react */

import React, { useEffect, useRef, useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import axios, { CancelTokenSource } from 'axios';
import { RiFileCopyLine, RiVolumeUpLine } from './svg-icons';
import translation from '../utils/translation';
import prefetchRequest from '../utils/prefetch-request';
import useTTS from '../utils/use-tts';
import { type Theme, css } from '@emotion/react';

const styles = {
    wrapper: (theme: Theme) => css({
        display: 'flex',
        width: '95%',
        maxWidth: '1280px',
        margin: '10vh auto',
        borderRadius: '8px',
        border: `1px solid ${theme.colors.borderColor}`,
        overflow: 'hidden',

        '@media (max-width: 768px)': {
            width: '90%',
            flexDirection: 'column',
        },
    }),

    inputWrapper: (theme: Theme) => css({
        flex: 1,
        padding: '1rem 1rem 12rem',
        backgroundColor: theme.colors.inputBackgroundColor,
        position: 'relative',

        '@media (max-width: 768px)': {
            paddingBottom: '5rem',
        },
    }),

    outputWrapper: (theme: Theme) => css({
        flex: 1,
        padding: '1rem 1rem 12rem',
        backgroundColor: theme.colors.outputBackgroundColor,
        position: 'relative',

        '@media (max-width: 768px)': {
            paddingBottom: '5rem',
        },
    }),

    textarea: (theme: Theme) => css({
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none',
        background: 'none',
        color: theme.colors.ioTextColor,
        fontSize: '18px',
        lineHeight: '28px',
        letterSpacing: '0.02em',
        padding: 0,
        overflow: 'hidden',

        '&::placeholder': {
            color: theme.colors.ioPlaceholderColor,
        },
    }),

    hr: (theme: Theme) => css({
        width: '1px',
        border: 'none',
        backgroundColor: theme.colors.borderColor,
        margin: 0,

        '@media (max-width: 768px)': {
            height: '1px',
            width: '100%',
        },
    }),

    iconButtons: (theme: Theme) => css({
        position: 'absolute',
        left: '1rem',
        right: '1rem',
        bottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',

        '& button': {
            display: 'flex',
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
        },

        '& button svg': {
            fontSize: '1.4rem',
            color: theme.colors.ioIconButtonColor,

            '&:hover': {
                color: theme.colors.ioIconButtonHoverColor,
            },

            '@media (max-width: 768px)': {
                fontSize: '1.25rem',
            },
        }
    }),
};

const Body: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [outputValue, setOutputValue] = useState('');

    const timeoutRef = useRef<number | null>(null);
    const cancelTokenRef = useRef<CancelTokenSource | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const { tts } = useTTS();

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
            window.clearTimeout(timeoutRef.current);
        }

        // 在用户停止输入 200ms 后开始翻译
        timeoutRef.current = window.setTimeout(async () => {
            cancelTokenRef.current = axios.CancelToken.source();
            const result = await translation(newInput, cancelTokenRef.current.token);
            if (result) {
                setOutputValue(result);
            }
        }, 200);
    };

    // 复制翻译结果
    const handleCopy = () => navigator.clipboard.writeText(outputValue);

    // 点击 input 区域的朗读文本按钮时取消焦点并朗读
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
        <div css={styles.wrapper}>
            <div css={styles.inputWrapper} onClick={focusInput}>
                <ReactTextareaAutosize
                    css={styles.textarea}
                    ref={inputRef}
                    value={inputValue}
                    onInput={handleInput}
                    onFocus={handleInputFocus}
                    maxLength={2000}
                    placeholder="请输入中文，系统将自动翻译为英文"
                />
                <div css={styles.iconButtons}>
                    <button onClick={handleInputTts}>
                        <RiVolumeUpLine />
                    </button>
                </div>
            </div>
            <hr css={styles.hr} />
            <div css={styles.outputWrapper}>
                <ReactTextareaAutosize
                    css={styles.textarea}
                    value={outputValue}
                    placeholder="翻译结果"
                    readOnly
                />
                <div css={styles.iconButtons}>
                    <button onClick={() => tts(outputValue)}>
                        <RiVolumeUpLine />
                    </button>
                    <button onClick={handleCopy}>
                        <RiFileCopyLine />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Body;
