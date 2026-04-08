// AI 背景图生成服务
class AIBackgroundService {
    constructor() {
        this.PROVIDERS = {
            custom: { label: '自定义', baseURL: '', model: '', keyUrl: '' },
            openai: { label: 'OpenAI', baseURL: 'https://api.openai.com/v1', model: 'gpt-4o', keyUrl: 'https://platform.openai.com/api-keys' },
            anthropic: { label: 'Anthropic (Claude)', baseURL: 'https://api.anthropic.com', model: 'claude-sonnet-4-6', keyUrl: 'https://console.anthropic.com/settings/keys' },
            google: { label: 'Google AI (Gemini)', baseURL: 'https://generativelanguage.googleapis.com/v1beta', model: 'gemini-2.0-flash-exp', keyUrl: 'https://aistudio.google.com/app/apikey' },
            deepseek: { label: 'DeepSeek', baseURL: 'https://api.deepseek.com', model: 'deepseek-chat', keyUrl: 'https://platform.deepseek.com/api_keys' },
            siliconflow: { label: '硅基流动', baseURL: 'https://api.siliconflow.cn/v1', model: 'Qwen/Qwen2.5-72B-Instruct', keyUrl: 'https://siliconflow.cn/account/key' },
            aliyun: { label: '阿里通义', baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus', keyUrl: 'https://dashscope.console.aliyun.com/apiKey' },
            tencent: { label: '腾讯混元', baseURL: 'https://api.hunyuan.cloud.tencent.com/v1', model: 'hunyuan-turbo', keyUrl: 'https://cloud.tencent.com/document/product/1729/97731' },
            baidu: { label: '百度文心', baseURL: 'https://aip.baidubce.com/oauth/2.0/token', model: 'ernie-4.0-turbo', keyUrl: 'https://console.bce.baidu.com/ai/#/ai/wenxinworkshop/workset/api' },
            nvidia: { label: 'NVIDIA', baseURL: 'https://integrate.api.nvidia.com/v1', model: 'minimaxai/minimax-m2.5', keyUrl: 'https://build.nvidia.com/settings/api-keys' }
        };
    }

    /**
     * 调用 LLM API 生成 CSS 背景
     */
    async generateBackground(config, markdownContent, styleDescription) {
        const { baseURL, apiKey, model, provider } = config;

        if (!baseURL || !apiKey || !model) {
            throw new Error('请填写完整的 LLM 配置（Base URL、API Key、Model）');
        }

        const prompt = this.buildPrompt(markdownContent, styleDescription);
        const messages = [{ role: 'user', content: prompt }];

        // 判断是否是 Anthropic 格式
        if (provider === 'anthropic' || baseURL.includes('api.anthropic.com')) {
            return await this.callAnthropic(messages, config);
        }

        // 默认使用 OpenAI 兼容格式
        return await this.callOpenAI(messages, config);
    }

    /**
     * OpenAI 兼容格式 API 调用
     */
    async callOpenAI(messages, config) {
        const { baseURL, apiKey, model } = config;
        const url = baseURL.endsWith('/chat/completions') ? baseURL : `${baseURL.replace(/\/$/, '')}/chat/completions`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.8,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API 调用失败 (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return this.parseCSSResponse(content);
    }

    /**
     * Anthropic Claude API 调用
     */
    async callAnthropic(messages, config) {
        const { baseURL, apiKey, model } = config;
        const url = baseURL.endsWith('/messages') ? baseURL : `${baseURL.replace(/\/$/, '')}/v1/messages`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.8,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API 调用失败 (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const content = data.content?.[0]?.text || '';
        return this.parseCSSResponse(content);
    }

    /**
     * 构建 prompt
     */
    buildPrompt(markdownContent, styleDescription) {
        const contentSummary = this.summarizeContent(markdownContent);

        const styleReq = styleDescription
            ? `风格要求：${styleDescription}`
            : '请分析以下内容并匹配最合适的背景风格';

        return `你是一个 CSS 背景样式设计师。请根据以下要求生成纯 CSS 背景样式代码。

## 任务
生成适用于 PDF 文档页面的 CSS background 相关属性。

## ${styleReq}

## 文档内容摘要
${contentSummary}

## 重要说明
- 生成的背景可能会与现有背景（如纯色底色）叠加使用，AI 背景层在上层
- 如需创建叠加效果，可使用半透明渐变或图案
- 如需完整替换背景，可生成不透明的背景样式

## 输出要求
1. 只返回 CSS 属性声明，每行一个，格式如：
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-image: radial-gradient(...);
2. 使用 CSS 渐变、图案（repeating gradients）等创建视觉效果
3. 配色应与文档风格协调
4. 不要使用外部图片 URL
5. 不要包含选择器或花括号
6. 最多返回 5-8 行 CSS`;
    }

    /**
     * 提取文档内容摘要
     */
    summarizeContent(markdown) {
        if (!markdown) return '空文档';

        // 提取标题和前几段
        const lines = markdown.split('\n').filter(l => l.trim());
        const title = lines.find(l => l.startsWith('# ')) || '';
        const headings = lines.filter(l => l.match(/^#{1,3} /)).slice(0, 5);
        const firstParagraphs = lines.filter(l => !l.startsWith('#') && !l.startsWith('-') && !l.startsWith('>') && !l.startsWith('```') && l.trim()).slice(0, 3);

        let summary = '';
        if (title) summary += `标题: ${title.replace(/^#+\s*/, '')}\n`;
        if (headings.length > 0) {
            summary += '章节: ' + headings.map(h => h.replace(/^#+\s*/, '')).join(', ') + '\n';
        }
        if (firstParagraphs.length > 0) {
            summary += '内容: ' + firstParagraphs.join(' ').substring(0, 200) + '...';
        }

        return summary || markdown.substring(0, 300);
    }

    /**
     * 解析 LLM 返回的 CSS
     */
    parseCSSResponse(response) {
        if (!response) return '';

        // 提取 CSS 属性行
        const lines = response.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('```') && !line.startsWith('//') && !line.startsWith('/*'))
            .filter(line => line.includes(':') && (line.includes('background') || line.includes('bg-') || line.startsWith('--')))
            .map(line => line.endsWith(';') ? line : line + ';');

        // 如果没有找到 background 相关属性，尝试提取所有看起来像 CSS 的行
        if (lines.length === 0) {
            const allLines = response.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('```') && !line.startsWith('//') && !line.startsWith('/*'))
                .filter(line => line.includes(':'))
                .map(line => line.endsWith(';') ? line : line + ';');
            return allLines.join('\n');
        }

        return lines.join('\n');
    }

    /**
     * 测试连接
     */
    async testConnection(config) {
        const testConfig = { ...config, model: config.model || 'gpt-4o' };
        // 使用一个简单 prompt 测试
        const result = await this.generateBackground(testConfig, '# Test\nThis is a test.', '简约风格');
        return result;
    }

    /**
     * 获取提供商配置
     */
    getProvider(providerKey) {
        return this.PROVIDERS[providerKey] || this.PROVIDERS.custom;
    }

    /**
     * 获取所有提供商
     */
    getAllProviders() {
        return this.PROVIDERS;
    }
}
