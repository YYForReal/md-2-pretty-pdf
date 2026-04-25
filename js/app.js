// 主要应用逻辑
class MarkdownToPDFApp {
    constructor() {
        this.currentTheme = 'default';
        this.currentPageSize = 'a4';
        this.currentPrintMode = 'smart';
        this.customStyles = {};

        // 背景设置相关属性
        this.backgroundSettings = {
            type: 'solid', // 'solid' 或 'image'
            solidColor: '#ffffff',
            imageUrl: '',
            imageSize: 'cover',
            imagePosition: 'center center',
            imageRepeat: 'no-repeat',
            opacity: 100
        };

        // AI 背景设置
        this.aiBackgroundSettings = {
            enabled: false,
            config: { baseURL: '', apiKey: '', model: '', provider: 'custom' },
            generatedCSS: '',
            stylePrompt: '',
            autoStyle: true
        };

        // 主题默认配置
        this.themeDefaults = {
            default: {
                textColor: '#333333',
                fontFamily: 'system',
                backgroundColor: '#ffffff'
            },
            academic: {
                textColor: '#1f2937',
                fontFamily: 'chinese-serif',
                backgroundColor: '#ffffff'
            },
            modern: {
                textColor: '#1e293b',
                fontFamily: 'chinese-hei',
                backgroundColor: '#ffffff'
            },
            elegant: {
                textColor: '#1f2937',
                fontFamily: 'chinese-kai',
                backgroundColor: '#faf5ff'
            },
            minimal: {
                textColor: '#000000',
                fontFamily: 'chinese-hei',
                backgroundColor: '#ffffff'
            },
            'eye-care': {
                textColor: '#2C3E50',
                fontFamily: 'chinese-serif',
                backgroundColor: '#E8EDE4'
            },
            classic: {
                textColor: '#3E2723',
                fontFamily: 'chinese-fang',
                backgroundColor: '#F8F3E9'
            }
        };

        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadSampleContent();
        this.setupThemeManager();
        this.setupPDFGenerator();
        this.setupAIBackgroundService();
        this.loadAIConfig();

        // 初始化主题控件
        this.updateThemeControls(this.currentTheme);

        // 初始化预览
        this.updatePreview();

    }

    bindElements() {
        // 输入元素
        this.markdownInput = document.getElementById('markdownInput');
        this.previewContent = document.getElementById('previewContent');
        this.previewSection = document.getElementById('previewSection');

        // 控制元素
        this.themeSelect = document.getElementById('themeSelect');
        this.pageSizeSelect = document.getElementById('pageSizeSelect');
        this.fontFamilySelect = document.getElementById('fontFamilySelect');
        this.fontSizeSlider = document.getElementById('fontSizeSlider');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.fontColorPicker = document.getElementById('fontColorPicker');
        this.fontColorText = document.getElementById('fontColorText');

        // 按钮元素
        this.clearBtn = document.getElementById('clearBtn');
        this.loadSampleBtn = document.getElementById('loadSampleBtn');
        this.printBtn = document.getElementById('printBtn');

        // 背景设置元素
        this.backgroundTypeRadios = document.querySelectorAll('input[name="backgroundType"]');
        this.solidBackgroundControls = document.getElementById('solidBackgroundControls');
        this.imageBackgroundControls = document.getElementById('imageBackgroundControls');
        this.bgColorPicker = document.getElementById('bgColorPicker');
        this.bgColorText = document.getElementById('bgColorText');
        this.bgImageInput = document.getElementById('bgImageInput');
        this.bgImageClearBtn = document.getElementById('bgImageClearBtn');
        this.bgImagePreview = document.getElementById('bgImagePreview');
        this.bgImagePreviewImg = document.getElementById('bgImagePreviewImg');
        this.bgSizeSelect = document.getElementById('bgSizeSelect');
        this.bgPositionSelect = document.getElementById('bgPositionSelect');
        this.bgRepeatSelect = document.getElementById('bgRepeatSelect');
        this.bgOpacitySlider = document.getElementById('bgOpacitySlider');
        this.bgOpacityValue = document.getElementById('bgOpacityValue');

        // AI 背景设置元素
        this.aiBackgroundToggle = document.getElementById('aiBackgroundToggle');
        this.aiBackgroundContent = document.getElementById('aiBackgroundContent');
        this.aiConfigToggle = document.getElementById('aiConfigToggle');
        this.aiConfigContent = document.getElementById('aiConfigContent');
        this.aiProviderSelect = document.getElementById('aiProviderSelect');
        this.aiBaseURL = document.getElementById('aiBaseURL');
        this.aiAPIKey = document.getElementById('aiAPIKey');
        this.aiAPIKeyLink = document.getElementById('aiAPIKeyLink');
        this.aiModelName = document.getElementById('aiModelName');
        this.aiSaveConfigBtn = document.getElementById('aiSaveConfigBtn');
        this.aiTestConnectionBtn = document.getElementById('aiTestConnectionBtn');
        this.aiConfigStatus = document.getElementById('aiConfigStatus');
        this.aiStylePrompt = document.getElementById('aiStylePrompt');
        this.aiGenerateBtn = document.getElementById('aiGenerateBtn');
        this.aiResultSection = document.getElementById('aiResultSection');
        this.aiResultStatusText = document.getElementById('aiResultStatusText');
        this.aiCssPreviewToggle = document.getElementById('aiCssPreviewToggle');
        this.aiCssPreviewContent = document.getElementById('aiCssPreviewContent');
        this.aiCssCode = document.getElementById('aiCssCode');
        this.aiApplyBtn = document.getElementById('aiApplyBtn');
        this.aiClearBtn = document.getElementById('aiClearBtn');

    }

    bindEvents() {
        // 输入事件 - 实时预览
        if (this.markdownInput) {
            this.markdownInput.addEventListener('input', this.debounce(this.handleInputChange.bind(this), 150));
        }

        // 控制事件 - 实时更新
        if (this.themeSelect) {
            this.themeSelect.addEventListener('change', this.handleThemeChange.bind(this));
        }
        if (this.pageSizeSelect) {
            this.pageSizeSelect.addEventListener('change', this.handlePageSizeChange.bind(this));
        }
        if (this.fontFamilySelect) {
            this.fontFamilySelect.addEventListener('change', this.handleFontFamilyChange.bind(this));
        }
        if (this.fontSizeSlider) {
            this.fontSizeSlider.addEventListener('input', this.handleFontSizeChange.bind(this));
        }
        if (this.fontColorPicker) {
            this.fontColorPicker.addEventListener('input', this.handleFontColorChange.bind(this));
        }
        if (this.fontColorText) {
            this.fontColorText.addEventListener('input', this.handleFontColorTextChange.bind(this));
        }

        // 按钮事件 - 添加空值检查
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', this.handleClear.bind(this));
        }
        if (this.loadSampleBtn) {
            this.loadSampleBtn.addEventListener('click', this.loadSampleContent.bind(this));
        }
        if (this.printBtn) {
            this.printBtn.addEventListener('click', this.handlePrint.bind(this));
        }

        // 键盘快捷键
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // 窗口大小变化时更新预览
        window.addEventListener('resize', this.debounce(this.updatePreview.bind(this), 300));

        // 监听页面恢复事件，重新绑定事件
        document.addEventListener('pageRestored', this.handlePageRestored.bind(this));

        // 背景设置事件
        this.bindBackgroundEvents();

        // AI 背景设置事件
        this.bindAIBackgroundEvents();
    }

    bindBackgroundEvents() {
        // 背景类型切换
        this.backgroundTypeRadios.forEach(radio => {
            radio.addEventListener('change', this.handleBackgroundTypeChange.bind(this));
        });

        // 纯色背景设置
        if (this.bgColorPicker) {
            this.bgColorPicker.addEventListener('input', this.handleBgColorChange.bind(this));
        }
        if (this.bgColorText) {
            this.bgColorText.addEventListener('input', this.handleBgColorTextChange.bind(this));
        }

        // 图片背景设置
        if (this.bgImageInput) {
            this.bgImageInput.addEventListener('change', this.handleBgImageUpload.bind(this));
        }
        if (this.bgImageClearBtn) {
            this.bgImageClearBtn.addEventListener('click', this.handleBgImageClear.bind(this));
        }

        // 图片背景选项
        if (this.bgSizeSelect) {
            this.bgSizeSelect.addEventListener('change', this.handleBgImageSizeChange.bind(this));
        }
        if (this.bgPositionSelect) {
            this.bgPositionSelect.addEventListener('change', this.handleBgImagePositionChange.bind(this));
        }
        if (this.bgRepeatSelect) {
            this.bgRepeatSelect.addEventListener('change', this.handleBgImageRepeatChange.bind(this));
        }
        if (this.bgOpacitySlider) {
            this.bgOpacitySlider.addEventListener('input', this.handleBgOpacityChange.bind(this));
        }
    }

    // =================== AI 背景设置事件绑定 ===================

    bindAIBackgroundEvents() {
        // AI 背景区域折叠/展开
        if (this.aiBackgroundToggle) {
            this.aiBackgroundToggle.addEventListener('click', this.toggleAIBackgroundContent.bind(this));
        }

        // LLM 配置区域折叠/展开
        if (this.aiConfigToggle) {
            this.aiConfigToggle.addEventListener('click', this.toggleAIConfigContent.bind(this));
        }

        // 模型提供商选择
        if (this.aiProviderSelect) {
            this.aiProviderSelect.addEventListener('change', this.handleAIProviderChange.bind(this));
        }

        // 保存配置
        if (this.aiSaveConfigBtn) {
            this.aiSaveConfigBtn.addEventListener('click', this.saveAIConfig.bind(this));
        }

        // 测试连接
        if (this.aiTestConnectionBtn) {
            this.aiTestConnectionBtn.addEventListener('click', this.testAIConnection.bind(this));
        }

        // 生成 AI 背景
        if (this.aiGenerateBtn) {
            this.aiGenerateBtn.addEventListener('click', this.generateAIBackground.bind(this));
        }

        // CSS 代码预览折叠
        if (this.aiCssPreviewToggle) {
            this.aiCssPreviewToggle.addEventListener('click', this.toggleAICssPreview.bind(this));
        }

        // 应用背景
        if (this.aiApplyBtn) {
            this.aiApplyBtn.addEventListener('click', this.applyAIBackground.bind(this));
        }

        // 清除 AI 背景
        if (this.aiClearBtn) {
            this.aiClearBtn.addEventListener('click', this.clearAIBackground.bind(this));
        }
    }

    toggleAIBackgroundContent() {
        const isVisible = this.aiBackgroundContent.style.display !== 'none';
        this.aiBackgroundContent.style.display = isVisible ? 'none' : 'block';
        const arrow = this.aiBackgroundToggle.querySelector('.ai-background-arrow');
        if (arrow) arrow.textContent = isVisible ? '▸' : '▾';
    }

    toggleAIConfigContent() {
        const isVisible = this.aiConfigContent.style.display !== 'none';
        this.aiConfigContent.style.display = isVisible ? 'none' : 'block';
        const arrow = this.aiConfigToggle.querySelector('.ai-config-arrow');
        if (arrow) arrow.textContent = isVisible ? '▸' : '▾';
    }

    toggleAICssPreview() {
        const isVisible = this.aiCssPreviewContent.style.display !== 'none';
        this.aiCssPreviewContent.style.display = isVisible ? 'none' : 'block';
        const arrow = this.aiCssPreviewToggle.querySelector('.ai-css-preview-arrow');
        if (arrow) arrow.textContent = isVisible ? '▸' : '▾';
    }

    handleAIProviderChange(event) {
        const provider = event.target.value;
        this.aiBackgroundSettings.config.provider = provider;

        const providerConfig = this.aiBackgroundService.getProvider(provider);
        if (providerConfig) {
            if (providerConfig.baseURL) {
                this.aiBaseURL.value = providerConfig.baseURL;
                this.aiBackgroundSettings.config.baseURL = providerConfig.baseURL;
            }
            if (providerConfig.model) {
                this.aiModelName.value = providerConfig.model;
                this.aiBackgroundSettings.config.model = providerConfig.model;
            }
            // 更新 API Key 链接
            if (providerConfig.keyUrl && this.aiAPIKeyLink) {
                this.aiAPIKeyLink.href = providerConfig.keyUrl;
                this.aiAPIKeyLink.style.display = 'inline-block';
                this.aiAPIKeyLink.textContent = `获取 ${providerConfig.label} API Key`;
            } else if (this.aiAPIKeyLink) {
                this.aiAPIKeyLink.style.display = 'none';
            }
        }
    }

    saveAIConfig() {
        const baseURL = this.aiBaseURL.value.trim();
        const apiKey = this.aiAPIKey.value.trim();
        const model = this.aiModelName.value.trim();
        const provider = this.aiProviderSelect.value;

        this.aiBackgroundSettings.config = { baseURL, apiKey, model, provider };

        try {
            localStorage.setItem('aiBackgroundConfig', JSON.stringify(this.aiBackgroundSettings.config));
            this.showAIConfigStatus('配置已保存到本地', 'success');
            this.showToast('AI 配置已保存', 'success');
        } catch (e) {
            this.showAIConfigStatus('保存失败', 'error');
        }
    }

    loadAIConfig() {
        try {
            const saved = localStorage.getItem('aiBackgroundConfig');
            if (saved) {
                const config = JSON.parse(saved);
                this.aiBackgroundSettings.config = { ...this.aiBackgroundSettings.config, ...config };

                if (this.aiBaseURL && config.baseURL) this.aiBaseURL.value = config.baseURL;
                if (this.aiAPIKey && config.apiKey) this.aiAPIKey.value = config.apiKey;
                if (this.aiModelName && config.model) this.aiModelName.value = config.model;
                if (this.aiProviderSelect && config.provider) this.aiProviderSelect.value = config.provider;
            }
        } catch (e) {
            console.warn('加载 AI 配置失败:', e);
        }
    }

    showAIConfigStatus(message, type = 'info') {
        if (this.aiConfigStatus) {
            this.aiConfigStatus.textContent = message;
            this.aiConfigStatus.className = `ai-config-status ai-config-status-${type}`;
        }
    }

    async testAIConnection() {
        this.showAIConfigStatus('正在测试连接...', 'info');
        this.aiTestConnectionBtn.disabled = true;

        try {
            const result = await this.aiBackgroundService.testConnection(this.aiBackgroundSettings.config);
            this.showAIConfigStatus('连接成功！', 'success');
            this.showToast('API 连接测试成功', 'success');
        } catch (error) {
            this.showAIConfigStatus(`连接失败: ${error.message}`, 'error');
            this.showToast('API 连接测试失败', 'error');
        } finally {
            this.aiTestConnectionBtn.disabled = false;
        }
    }

    async generateAIBackground() {
        const stylePrompt = this.aiStylePrompt ? this.aiStylePrompt.value.trim() : '';
        this.aiBackgroundSettings.stylePrompt = stylePrompt;

        // 验证配置
        const { baseURL, apiKey, model } = this.aiBackgroundSettings.config;
        if (!baseURL || !apiKey || !model) {
            this.showToast('请先填写完整的 LLM 配置并保存', 'warning');
            // 自动展开配置区域
            if (this.aiConfigContent) this.aiConfigContent.style.display = 'block';
            if (this.aiConfigToggle) {
                const arrow = this.aiConfigToggle.querySelector('.ai-config-arrow');
                if (arrow) arrow.textContent = '▾';
            }
            return;
        }

        // 获取 markdown 内容
        const markdownText = this.markdownInput ? this.markdownInput.value.trim() : '';

        // 设置生成中状态
        this.aiGenerateBtn.disabled = true;
        this.aiGenerateBtn.innerHTML = '<span class="loading"></span> AI 生成中...';
        this.aiResultStatusText.textContent = '生成中...';
        this.aiResultSection.style.display = 'block';

        try {
            const css = await this.aiBackgroundService.generateBackground(
                this.aiBackgroundSettings.config,
                markdownText,
                stylePrompt
            );

            this.aiBackgroundSettings.generatedCSS = css;
            this.aiResultStatusText.textContent = '已生成';
            this.aiCssCode.textContent = css;

            this.showToast('AI 背景生成成功', 'success');
        } catch (error) {
            console.error('AI 背景生成失败:', error);
            this.aiResultStatusText.textContent = '生成失败';
            this.showToast(`生成失败: ${error.message}`, 'error');
        } finally {
            this.aiGenerateBtn.disabled = false;
            this.aiGenerateBtn.innerHTML = '<span class="ai-generate-icon">✨</span> 生成 AI 背景';
        }
    }

    applyAIBackground() {
        if (!this.aiBackgroundSettings.generatedCSS) {
            this.showToast('请先生成 AI 背景', 'warning');
            return;
        }

        this.aiBackgroundSettings.enabled = true;
        this.applyAIBackgroundStyles();
        this.showToast('AI 背景已应用', 'success');
    }

    clearAIBackground() {
        this.aiBackgroundSettings.enabled = false;
        this.aiBackgroundSettings.generatedCSS = '';
        this.aiResultStatusText.textContent = '未生成';
        this.aiCssCode.textContent = '';
        this.aiResultSection.style.display = 'none';

        // 清除 AI 背景 CSS 变量和重置背景
        if (this.previewContent) {
            this.previewContent.style.removeProperty('--ai-bg-value');
            this.previewContent.style.removeProperty('--ai-bg-image');
            this.previewContent.style.removeProperty('--ai-bg-layer');
        }

        // 重新应用背景（会自动清除 AI 叠加）
        this.applyBackgroundStyles();

        this.showToast('AI 背景已清除', 'info');
    }

    applyAIBackgroundStyles() {
        if (!this.previewContent) return;

        if (!this.aiBackgroundSettings.enabled || !this.aiBackgroundSettings.generatedCSS) {
            // AI 背景未启用，清除 AI 相关属性并恢复基础背景
            this.previewContent.style.removeProperty('--ai-bg-value');
            this.previewContent.style.removeProperty('--ai-bg-image');
            this.previewContent.style.removeProperty('--ai-bg-layer');
            // 重新应用基础背景（不含 AI）
            this.applyBaseBackgroundOnly();
            return;
        }

        const css = this.aiBackgroundSettings.generatedCSS;

        // 解析 CSS 属性
        const lines = css.split('\n').filter(l => l.trim());
        let bgValue = '';
        let bgImageValue = '';

        lines.forEach(line => {
            const cleanLine = line.trim().replace(/;$/, '');
            if (cleanLine.startsWith('background:') || cleanLine.startsWith('background ')) {
                const value = cleanLine.replace(/^background\s*:\s*/, '');
                bgValue = value;
            } else if (cleanLine.startsWith('background-image:') || cleanLine.startsWith('background-image ')) {
                const value = cleanLine.replace(/^background-image\s*:\s*/, '');
                bgImageValue = value;
            }
        });

        // 获取当前基础背景
        const baseBg = this.previewContent.style.getPropertyValue('--bg-base') || '';
        const settings = this.backgroundSettings;

        // 应用 AI 背景（作为最上层，CSS 中先声明的在最上层）
        const aiLayer = bgValue || bgImageValue;
        if (aiLayer) {
            this.previewContent.style.setProperty('--ai-bg-layer', aiLayer, 'important');
            // AI 层在上，基础背景在下（CSS 多层背景：先声明=上层）
            if (baseBg && baseBg !== 'none') {
                this.previewContent.style.background = `${aiLayer}, ${baseBg}`;
            } else if (settings.type === 'image' && settings.imageUrl) {
                // 图片背景在下，AI 在上
                this.previewContent.style.background = `${aiLayer}, url(${settings.imageUrl})`;
            } else {
                // 纯色背景在下，AI 渐变在上
                this.previewContent.style.background = `${aiLayer}, ${settings.solidColor}`;
            }
        }

        console.log('🤖 AI 背景样式已应用');
    }

    applyBaseBackgroundOnly() {
        if (!this.previewContent) return;
        const settings = this.backgroundSettings;
        if (settings.type === 'solid') {
            this.previewContent.style.background = settings.solidColor;
        } else if (settings.imageUrl) {
            this.previewContent.style.background = `url(${settings.imageUrl})`;
        }
    }

    setupAIBackgroundService() {
        this.aiBackgroundService = new AIBackgroundService();
        console.log('✅ AI 背景生成服务已初始化');
    }

    setupThemeManager() {
        this.themeManager = new ThemeManager();
        this.themeManager.applyTheme(this.currentTheme);
    }

    setupPDFGenerator() {
        // 初始化 PDF 生成器
        window.PDFGenerator = PDFGenerator;
        this.pdfGenerator = new PDFGenerator(this.themeManager);
        console.log('PDF生成器初始化检查:', !!window.pdfGenerator);
        console.log("✅ PDF生成器类已注册到全局");

    }

    handleInputChange() {
        // 实时更新预览
        this.updatePreview();
    }

    // =================== 背景设置处理函数 ===================

    handleBackgroundTypeChange(event) {
        const selectedType = event.target.value;
        this.backgroundSettings.type = selectedType;

        // 切换控件显示
        if (selectedType === 'solid') {
            this.solidBackgroundControls.style.display = 'block';
            this.imageBackgroundControls.style.display = 'none';
        } else {
            this.solidBackgroundControls.style.display = 'none';
            this.imageBackgroundControls.style.display = 'block';
        }

        this.updatePreview();
    }

    handleBgColorChange(event) {
        const color = event.target.value;
        this.backgroundSettings.solidColor = color;

        // 同步更新文本框
        if (this.bgColorText) {
            this.bgColorText.value = color;
        }

        this.updatePreview();
    }

    handleBgColorTextChange(event) {
        const color = event.target.value;

        // 验证颜色格式
        if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
            this.backgroundSettings.solidColor = color;

            // 同步更新颜色选择器
            if (this.bgColorPicker) {
                this.bgColorPicker.value = color;
            }

            this.updatePreview();
        }
    }

    handleBgImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            this.showToast('请选择图片文件', 'error');
            return;
        }

        // 验证文件大小 (5MB限制)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('图片文件不能超过5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            this.backgroundSettings.imageUrl = imageUrl;

            // 显示预览
            this.showBgImagePreview(imageUrl);
            this.updatePreview();

            this.showToast('背景图片上传成功', 'success');
        };

        reader.onerror = () => {
            this.showToast('图片读取失败', 'error');
        };

        reader.readAsDataURL(file);
    }

    handleBgImageClear() {
        this.backgroundSettings.imageUrl = '';

        // 清除文件输入
        if (this.bgImageInput) {
            this.bgImageInput.value = '';
        }

        // 隐藏预览
        if (this.bgImagePreview) {
            this.bgImagePreview.style.display = 'none';
        }

        this.updatePreview();
        this.showToast('背景图片已清除', 'info');
    }

    showBgImagePreview(imageUrl) {
        if (this.bgImagePreview && this.bgImagePreviewImg) {
            this.bgImagePreviewImg.src = imageUrl;
            this.bgImagePreview.style.display = 'block';
        }
    }

    handleBgImageSizeChange(event) {
        this.backgroundSettings.imageSize = event.target.value;
        this.updatePreview();
    }

    handleBgImagePositionChange(event) {
        this.backgroundSettings.imagePosition = event.target.value;
        this.updatePreview();
    }

    handleBgImageRepeatChange(event) {
        this.backgroundSettings.imageRepeat = event.target.value;
        console.log('🔄 背景重复设置变更为:', event.target.value);
        this.updatePreview();
    }

    handleBgOpacityChange(event) {
        const opacity = event.target.value;
        this.backgroundSettings.opacity = opacity;

        // 更新显示值
        if (this.bgOpacityValue) {
            this.bgOpacityValue.textContent = `${opacity}%`;
        }

        this.updatePreview();
    }

    applyBackgroundStyles() {
        if (!this.previewContent) return;

        const settings = this.backgroundSettings;

        // Clear previous base background
        this.previewContent.style.removeProperty('--bg-base');

        if (settings.type === 'solid') {
            // 纯色背景
            this.previewContent.style.setProperty('--bg-color', settings.solidColor);
            this.previewContent.style.setProperty('--bg-size', 'auto');
            this.previewContent.style.setProperty('--bg-position', 'center center');
            this.previewContent.style.setProperty('--bg-repeat', 'no-repeat');
            this.previewContent.style.setProperty('--bg-overlay-color', 'transparent');
            this.previewContent.style.backgroundColor = settings.solidColor;
            this.previewContent.style.backgroundImage = '';
            this.previewContent.style.background = settings.solidColor;
        } else {
            // 图片背景
            if (settings.imageUrl) {
                const bgValue = `url(${settings.imageUrl})`;
                this.previewContent.style.setProperty('--bg-base', bgValue);
                this.previewContent.style.backgroundImage = bgValue;
                this.previewContent.style.backgroundSize = settings.imageSize;
                this.previewContent.style.backgroundPosition = settings.imagePosition;
                this.previewContent.style.backgroundRepeat = settings.imageRepeat;

                // 同时设置CSS变量以保持一致性
                this.previewContent.style.setProperty('--bg-size', settings.imageSize);
                this.previewContent.style.setProperty('--bg-position', settings.imagePosition);
                this.previewContent.style.setProperty('--bg-repeat', settings.imageRepeat);

                // 计算透明度覆盖层
                const opacity = settings.opacity / 100;
                if (opacity < 1) {
                    const computedStyle = window.getComputedStyle(this.previewContent);
                    const themeBgColor = computedStyle.getPropertyValue('--bg-color') || '#ffffff';
                    this.previewContent.style.setProperty('--bg-overlay-color', this.hexToRgba(themeBgColor, 1 - opacity));
                } else {
                    this.previewContent.style.setProperty('--bg-overlay-color', 'transparent');
                }
            } else {
                // 没有图片时使用纯色
                this.previewContent.style.setProperty('--bg-color', settings.solidColor);
                this.previewContent.style.backgroundColor = settings.solidColor;
                this.previewContent.style.backgroundImage = '';
                this.previewContent.style.background = settings.solidColor;
                this.previewContent.style.setProperty('--bg-overlay-color', 'transparent');
            }
        }

        // 应用 AI 背景（叠加在现有背景之上）
        this.applyAIBackgroundStyles();
    }

    hexToRgba(hex, alpha) {
        // 移除 # 号
        hex = hex.replace('#', '');

        // 解析RGB
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // =================== 原有的处理函数 ===================

    handleThemeChange(event) {
        this.currentTheme = event.target.value;
        this.themeManager.applyTheme(this.currentTheme);

        // 同步更新主题相关选择器的值
        this.updateThemeControls(this.currentTheme);

        this.updatePreview();
    }

    /**
     * 根据主题更新相关控件的值
     */
    updateThemeControls(theme) {
        const defaults = this.themeDefaults[theme];
        if (!defaults) {
            console.warn(`⚠️ 未找到主题 ${theme} 的默认配置`);
            return;
        }

        console.log(`🎨 更新主题 ${theme} 的控件:`, defaults);

        // 更新字体颜色选择器
        if (defaults.textColor && this.fontColorPicker && this.fontColorText) {
            this.fontColorPicker.value = defaults.textColor;
            this.fontColorText.value = defaults.textColor;
            this.customStyles.textColor = defaults.textColor;
            console.log(`✅ 更新字体颜色为: ${defaults.textColor}`);
        }

        // 更新字体选择器
        if (defaults.fontFamily && this.fontFamilySelect) {
            this.fontFamilySelect.value = defaults.fontFamily;

            // 触发字体变更事件以更新样式
            const fontFamilyMap = {
                'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                'chinese-serif': '"SimSun", "宋体", "STSong", "华文宋体", "NSimSun", serif',
                'chinese-kai': '"KaiTi", "楷体", "STKaiti", "华文楷体", "楷体_GB2312", serif',
                'chinese-hei': '"SimHei", "黑体", "STHeiti", "华文黑体", "Microsoft YaHei", "微软雅黑", sans-serif',
                'chinese-fang': '"FangSong", "仿宋", "STFangsong", "华文仿宋", serif',
                'chinese-song': '"SimSun", "宋体", "STSong", "华文宋体", "NSimSun", serif',
                'serif': 'Times New Roman, Times, serif',
                'sans-serif': 'Arial, Helvetica, sans-serif',
                'mono': '"Courier New", Courier, monospace'
            };

            this.customStyles.fontFamily = fontFamilyMap[defaults.fontFamily];
            console.log(`✅ 更新字体为: ${defaults.fontFamily} (${fontFamilyMap[defaults.fontFamily]})`);
        }

        // 更新背景色
        if (defaults.backgroundColor) {
            // 设置背景类型为纯色
            this.backgroundSettings.type = 'solid';
            this.backgroundSettings.solidColor = defaults.backgroundColor;

            // 更新背景颜色选择器
            if (this.bgColorPicker && this.bgColorText) {
                this.bgColorPicker.value = defaults.backgroundColor;
                this.bgColorText.value = defaults.backgroundColor;

                // 确保纯色背景控件被选中
                const solidRadio = document.querySelector('input[name="backgroundType"][value="solid"]');
                if (solidRadio) {
                    solidRadio.checked = true;
                    // 触发背景类型变更事件
                    this.handleBackgroundTypeChange({ target: solidRadio });
                }
            }

            console.log(`✅ 更新背景色为: ${defaults.backgroundColor}`);
        }
    }

    handlePageSizeChange(event) {
        this.currentPageSize = event.target.value;
        this.updatePreview();
    }

    handleFontFamilyChange(event) {
        const fontFamily = event.target.value;
        const fontFamilyMap = {
            'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'chinese-serif': '"SimSun", "宋体", "STSong", "华文宋体", "NSimSun", serif',
            'chinese-kai': '"KaiTi", "楷体", "STKaiti", "华文楷体", "楷体_GB2312", serif',
            'chinese-hei': '"SimHei", "黑体", "STHeiti", "华文黑体", "Microsoft YaHei", "微软雅黑", sans-serif',
            'chinese-fang': '"FangSong", "仿宋", "STFangsong", "华文仿宋", serif',
            'chinese-song': '"SimSun", "宋体", "STSong", "华文宋体", "NSimSun", serif',
            'serif': '"Times New Roman", Times, serif',
            'sans-serif': 'Arial, Helvetica, sans-serif',
            'mono': '"Courier New", Courier, monospace'
        };

        this.customStyles.fontFamily = fontFamilyMap[fontFamily];
        this.updatePreview();
    }

    handleFontSizeChange(event) {
        const fontSize = event.target.value;
        if (this.fontSizeValue) {
            this.fontSizeValue.textContent = `${fontSize}px`;
        }
        this.customStyles.fontSize = `${fontSize}px`;
        this.updatePreview();
    }

    handleFontColorChange(event) {
        const color = event.target.value;
        console.log('🎨 字体颜色改变:', color);

        // 同步更新文本框
        if (this.fontColorText) {
            this.fontColorText.value = color;
        }

        this.customStyles.textColor = color;
        console.log('📋 当前自定义样式:', this.customStyles);
        this.updatePreview();
    }

    handleFontColorTextChange(event) {
        const color = event.target.value;

        // 验证颜色格式
        if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
            // 同步更新颜色选择器
            if (this.fontColorPicker) {
                this.fontColorPicker.value = color;
            }

            this.customStyles.textColor = color;
            this.updatePreview();
        }
    }




    handleClear() {
        if (confirm('确定要清空所有内容吗？')) {
            if (this.markdownInput) {
                this.markdownInput.value = '';
            }
            this.updatePreview();
            this.showToast('内容已清空', 'info');
        }
    }

    loadSampleContent() {
        const sampleContent = `# 示例文档

这是一个 **Markdown to PDF 转换器** 的示例文档，展示了各种 Markdown 元素的渲染效果，包括数学公式支持。

## 文本格式

这是 *斜体文本*，这是 **粗体文本**，这是 ***粗斜体文本***。

也可以使用 HTML 的 <u>下划线</u> 和 <mark>高亮</u> 标记。

## 数学公式支持

### 行内数学公式

爱因斯坦质能方程：$E = mc^2$

二次方程的解：$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$

### 块级数学公式

薛定谔方程：

$$i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\hat{H}\\Psi(\\mathbf{r},t)$$

麦克斯韦方程组：

$$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}$$

$$\\nabla \\cdot \\mathbf{B} = 0$$

$$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$$

$$\\nabla \\times \\mathbf{B} = \\mu_0\\mathbf{J} + \\mu_0\\epsilon_0\\frac{\\partial \\mathbf{E}}{\\partial t}$$

### 复杂数学公式

傅里叶变换：

$$\\mathcal{F}\\{f(t)\\} = \\int_{-\\infty}^{\\infty} f(t) e^{-2\\pi i \\xi t} dt$$

矩阵运算：

$$\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix}
=
\\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}$$

## 列表

### 无序列表

- 第一项
- 第二项
  - 嵌套项目 1
  - 嵌套项目 2
- 第三项

### 有序列表

1. 第一步
2. 第二步
3. 第三步

## 引用

> 这是一个引用块。可以用来强调重要的内容或者引用他人的话。
>
> 引用可以包含多个段落。

## 代码

行内代码：\`console.log('Hello, World!')\`

代码块：

\`\`\`javascript
function greet(name) {
    console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

## 表格

| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |
| 王五 | 28   | 广州 |

## 链接和图片

[访问 GitHub](https://github.com)

## 分隔线

---

## 任务列表

- [x] 完成的任务
- [ ] 未完成的任务
- [ ] 另一个待办事项

---

*文档生成时间：${new Date().toLocaleString()}*`;

        if (this.markdownInput) {
            this.markdownInput.value = sampleContent;
        }
        this.updatePreview();
        this.showToast('已加载示例内容', 'success');
    }

    handlePreview() {
        // 这个方法现在主要用于兼容性，实际预览是默认显示的
        this.updatePreview();
        this.showToast('预览已更新', 'success');
    }

    refreshPreview() {
        this.updatePreview();
        this.showToast('预览已刷新', 'info');
    }


    updatePreview() {
        const markdownText = this.markdownInput ? this.markdownInput.value.trim() : '';

        // 添加页面类
        document.body.className = document.body.className.replace(/page-\w+/g, '');
        document.body.classList.add(`page-${this.currentPageSize}`);
        document.body.classList.add(`theme-${this.currentTheme}`);

        // 应用自定义样式到预览容器
        this.applyCustomStylesToPreview();

        // 应用背景样式
        this.applyBackgroundStyles();

        // 检查是否为空内容
        if (!markdownText) {
            this.showEmptyPreview();
            return;
        }

        // 显示加载状态
        this.showLoadingPreview();

        // 延迟处理以显示加载效果
        setTimeout(() => {
            const htmlContent = this.parseMarkdown(markdownText);
            this.previewContent.innerHTML = htmlContent;
            this.hideLoadingPreview();
            
            // 在内容更新后触发 MathJax 渲染
            this.triggerMathJaxRender();
        }, 100);
    }

    showEmptyPreview() {
        if (this.previewContent) {
            this.previewContent.innerHTML = `
                <div class="preview-empty">
                    <div class="preview-empty-icon">📄</div>
                    <div class="preview-empty-text">开始输入 Markdown 内容</div>
                    <div class="preview-empty-hint">在左侧编辑器中输入内容，这里会实时显示预览效果</div>
                </div>
            `;
        }
        this.hideLoadingPreview();
    }

    showLoadingPreview() {
        if (this.previewContent && !this.previewContent.querySelector('.preview-loading')) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'preview-loading';
            loadingDiv.innerHTML = '<div class="loading"></div>';
            this.previewContent.appendChild(loadingDiv);
        }
    }

    hideLoadingPreview() {
        if (this.previewContent) {
            const loadingElement = this.previewContent.querySelector('.preview-loading');
            if (loadingElement) {
                loadingElement.remove();
            }
        }
    }

    parseMarkdown(markdown) {
        const mathBlocks = [];

        // 保护块级数学公式，防止 marked 解析破坏 LaTeX 语法（如换行转 <br>、& 转 &amp;）
        let md = markdown.replace(/(^|[^\\])\$\$([\s\S]*?)\$\$/gm, (match, prefix, formula) => {
            const idx = mathBlocks.length;
            mathBlocks.push(formula.trim());
            return prefix + `@@MATH_BLOCK_${idx}@@`;
        });

        let htmlContent;
        if (typeof marked !== 'undefined') {
            // 配置 marked 选项
            marked.setOptions({
                breaks: true,
                gfm: true,
                tables: true,
                sanitize: false,
                smartLists: true,
                smartypants: true
            });
            htmlContent = marked.parse(md);
        } else {
            console.warn("备用方案")
            // 简单的 Markdown 解析（备用方案）
            htmlContent = md
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^\* (.*$)/gim, '<li>$1</li>')
                .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/^/, '<p>')
                .replace(/$/, '</p>');
        }

        // 恢复块级公式，并去除 marked 自动包裹的 <p> 标签
        htmlContent = htmlContent.replace(/<p>\s*@@MATH_BLOCK_(\d+)@@\s*<\/p>/g, (match, index) => {
            const formula = mathBlocks[parseInt(index)];
            return `<div class="math-block">$$${formula}$$</div>`;
        });

        htmlContent = htmlContent.replace(/@@MATH_BLOCK_(\d+)@@/g, (match, index) => {
            const formula = mathBlocks[parseInt(index)];
            return `<div class="math-block">$$${formula}$$</div>`;
        });

        // 处理数学公式渲染
        this.renderMathFormulas(htmlContent);

        return htmlContent;
    }

    /**
     * 渲染数学公式
     */
    renderMathFormulas(htmlContent) {
        // 如果 MathJax 已加载，则处理数学公式
        if (typeof MathJax !== 'undefined' && MathJax.startup && MathJax.startup.document) {
            // 使用 MathJax 处理数学公式
            MathJax.typesetPromise([htmlContent]).then(() => {
                console.log('MathJax 数学公式渲染完成');
            }).catch((err) => {
                console.error('MathJax 渲染错误:', err);
            });
        } else {
            console.log('MathJax 尚未加载，数学公式将在加载后自动渲染');
        }
    }

    /**
     * 触发 MathJax 渲染
     */
    triggerMathJaxRender() {
        if (typeof MathJax !== 'undefined' && MathJax.startup && MathJax.startup.document) {
            // 使用 MathJax 处理预览内容中的数学公式
            MathJax.typesetPromise([this.previewContent]).then(() => {
                console.log('✅ MathJax 数学公式渲染完成');
            }).catch((err) => {
                console.error('❌ MathJax 渲染错误:', err);
            });
        } else {
            console.log('⏳ MathJax 尚未完全加载，等待加载完成...');
            // 如果 MathJax 还未加载完成，等待一段时间后重试
            setTimeout(() => {
                this.triggerMathJaxRender();
            }, 500);
        }
    }

    /**
     * 应用自定义样式到预览容器
     */
    applyCustomStylesToPreview() {
        console.log("🎨 应用自定义样式到预览容器...");

        // 获取预览容器元素
        // const previewContainer = document.getElementById('preview-container');
        const previewContainer = document.documentElement;
        if (!previewContainer) {
            console.warn("⚠️ 未找到预览容器元素");
            return;
        }


        console.log("📋 当前customStyles内容:", this.customStyles);

        // 应用当前的 customStyles
        if (this.customStyles && Object.keys(this.customStyles).length > 0) {
            Object.entries(this.customStyles).forEach(([property, value]) => {
                if (value && value !== '') {
                    // 将驼峰命名转换为 CSS 变量格式
                    const cssVariable = this.convertToCSSVariable(property);
                    previewContainer.style.setProperty(cssVariable, value, 'important');
                    console.log(`✅ 预览容器设置 CSS 变量: ${cssVariable} = ${value}`);

                    // 验证设置是否成功
                    const computedValue = getComputedStyle(previewContainer).getPropertyValue(cssVariable);
                    console.log(`🔍 实际CSS变量值: ${cssVariable} = ${computedValue}`);
                }
            });
            console.log("✅ 预览容器自定义样式应用完成");
        } else {
            console.log("ℹ️ 没有自定义样式需要应用到预览容器");
        }
    }

    /**
     * 将属性名转换为 CSS 变量格式
     */
    convertToCSSVariable(property) {
        // 将驼峰命名转换为 kebab-case 并添加 -- 前缀
        return '--' + property.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    /**
     * 处理页面恢复事件
     */
    handlePageRestored(event) {
        console.log('🔄 页面恢复事件触发，重新绑定元素和事件...');

        // 重新绑定元素引用
        this.bindElements();

        // 重新绑定事件
        this.bindEvents();

        // 恢复按钮状态
        this.restoreAllButtonStates();

        // 重新应用预览（包括 AI 背景）
        this.updatePreview();

        console.log('✅ 页面恢复处理完成');
    }

    /**
     * 恢复所有按钮状态
     */
    restoreAllButtonStates() {
        // 恢复打印按钮
        this.restorePrintButtonState();
        
        // 恢复下载按钮
        // this.restoreDownloadButtonState();
        
        console.log('✅ 所有按钮状态已恢复');
    }

    async handlePrint() {
        try {
            this.printBtn.disabled = true;
            this.printBtn.innerHTML = '<span class="loading"></span> 打印中...';

            // 直接使用直接打印功能
            await this.directPrint();

            this.showToast('打印处理完成！', 'success');
        } catch (error) {
            console.error('打印处理失败:', error);
            this.showToast('打印处理失败：' + error.message, 'error');
        } finally {
            // 使用延迟恢复，确保页面完全恢复后再恢复按钮状态
            setTimeout(() => {
                this.restorePrintButtonState();
            }, 500);
        }
    }

    /**
     * 恢复打印按钮状态
     */
    restorePrintButtonState() {
        // 重新获取按钮元素，因为页面可能已被替换
        const printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.disabled = false;
            printBtn.innerHTML = '🖨️ 打印';
            console.log('✅ 打印按钮状态已恢复');
        } else {
            console.warn('⚠️ 未找到打印按钮元素');
        }
    }


    async directPrint() {
        if (!this.previewContent) {
            throw new Error('预览内容不存在');
        }

        if (window.PDFGenerator) {
            const pdfGen = this.pdfGenerator;
            // 传递 customStyles、backgroundSettings 和 aiBackgroundSettings 到打印选项
            const printOptions = {
                customStyles: this.customStyles,
                backgroundSettings: this.backgroundSettings,
                aiBackgroundSettings: this.aiBackgroundSettings,
                title: 'Markdown 文档',
                pageWidth: '210mm'
            };
            await pdfGen.directPrint(this.previewContent, printOptions);
        } else {
            throw new Error('PDF 生成器未加载');
        }
    }

    async smartPrint() {
        if (!this.previewContent) {
            throw new Error('预览内容不存在');
        }

        if (window.PDFGenerator) {
            const pdfGen = this.pdfGenerator;
            await pdfGen.smartPrint(this.previewContent);
        } else {
            throw new Error('PDF 生成器未加载');
        }
    }

    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + R: 刷新预览
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault();
            this.refreshPreview();
        }

        // Ctrl/Cmd + P: 打印（而不是切换预览显示）
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            event.preventDefault();
            this.handlePrint();
        }

        // Ctrl/Cmd + S: 下载 PDF
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            this.handleDownload();
        }

        // F5: 刷新预览（避免页面刷新）
        if (event.key === 'F5') {
            event.preventDefault();
            this.refreshPreview();
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // 触发显示动画
        setTimeout(() => toast.classList.add('show'), 10);

        // 3秒后移除
        setTimeout(() => {
            toast.classList.remove('show');
            if (document.body && document.body.contains(toast)){
                setTimeout(() => document.body.removeChild(toast), 300);
            }
        }, 3000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MarkdownToPDFApp();
});