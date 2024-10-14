import axios from 'axios';

// 预加载请求，预先请求翻译和TTS Api，提高后续请求响应速度
async function prefetchRequest(): Promise<void> {
    try {
        axios.all([
            axios.post(
                'https://d.11444.xyz/translate',
                { text: 'Hello World!', target_lang: 'ZH' }
            ),
        ]);
    } catch (error) {
        console.error(error);
    }
}

export default prefetchRequest;
