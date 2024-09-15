import axios, { CancelToken } from 'axios';

export type TranslationResponse = {
    code: number;
    data: string;
    id: number;
    method: string;
    source_lang: string;
    target_lang: string;
    alternatives: string[];
}

// 翻译
async function translation(text: string, cancelToken: CancelToken): Promise<string | undefined> {
    try {
        const response = await axios.post<TranslationResponse>(
            'https://deeplx.11444.xyz/translate',
            { text: text, target_lang: 'EN' },
            {
                headers: { 'Content-Type': 'application/json' },
                cancelToken: cancelToken,
            }
        );
        if (response.status === 200) {
            return response.data.data;
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            return undefined;
        } else if (axios.isAxiosError(error)) {
            return '翻译失败: ' + error.message;
        } else {
            return '未知错误: ' + error;
        }
    }
};

export default translation;
