// 主要应用逻辑
class MarkdownToPDFApp {
    constructor() {
        this.currentTheme = 'default';
        this.currentPageSize = 'a4';
        this.currentPrintMode = 'smart';
        this.customStyles = {};

        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadSampleContent();
        this.setupThemeManager();
        this.setupPDFGenerator();

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

        // 按钮元素
        this.clearBtn = document.getElementById('clearBtn');
        this.loadSampleBtn = document.getElementById('loadSampleBtn');
        this.printBtn = document.getElementById('printBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        // 打印选项
        this.printModeSelect = document.getElementById('printModeSelect');
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
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', this.handleDownload.bind(this));
        }

        // 打印选项事件
        if (this.printModeSelect) {
            this.printModeSelect.addEventListener('change', this.handlePrintModeChange.bind(this));
        }

        // 键盘快捷键
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // 窗口大小变化时更新预览
        window.addEventListener('resize', this.debounce(this.updatePreview.bind(this), 300));

        // 监听页面恢复事件，重新绑定事件
        document.addEventListener('pageRestored', this.handlePageRestored.bind(this));
    }

    setupThemeManager() {
        this.themeManager = new ThemeManager();
        this.themeManager.applyTheme(this.currentTheme);
    }

    setupPDFGenerator() {
        // PDF生成器已在pdfGenerator.js中自动注册到全局
        console.log('PDF生成器初始化检查:', !!window.pdfGenerator);
    }

    handleInputChange() {
        // 实时更新预览
        this.updatePreview();
    }

    handleThemeChange(event) {
        this.currentTheme = event.target.value;
        this.themeManager.applyTheme(this.currentTheme);
        this.updatePreview();
    }

    handlePageSizeChange(event) {
        this.currentPageSize = event.target.value;
        this.updatePreview();
    }

    handleFontFamilyChange(event) {
        const fontFamily = event.target.value;
        const fontFamilyMap = {
            'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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


    handlePrintModeChange(event) {
        this.currentPrintMode = event.target.value;
        console.log('打印模式切换为:', this.currentPrintMode);
        this.showToast(`打印模式: ${this.getPrintModeLabel(this.currentPrintMode)}`, 'info');
    }

    getPrintModeLabel(mode) {
        const labels = {
            'smart': '智能选择',
            'pdf': '生成PDF',
            'direct': '直接打印'
        };
        return labels[mode] || '未知模式';
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

这是一个 **Markdown to PDF 转换器** 的示例文档，展示了各种 Markdown 元素的渲染效果。

## 文本格式

这是 *斜体文本*，这是 **粗体文本**，这是 ***粗斜体文本***。

也可以使用 HTML 的 <u>下划线</u> 和 <mark>高亮</u> 标记。

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

## 数学公式（如果支持）

$E = mc^2$

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

    closePreview() {
        // 隐藏预览面板
        if (this.previewSection) {
            this.previewSection.classList.add('hidden');
        }
        if (this.togglePreviewBtn) {
            this.togglePreviewBtn.textContent = '👁️';
            this.togglePreviewBtn.title = '显示预览';
        }
    }

    refreshPreview() {
        this.updatePreview();
        this.showToast('预览已刷新', 'info');
    }

    togglePreview() {
        if (this.previewSection && this.previewSection.classList.contains('hidden')) {
            this.previewSection.classList.remove('hidden');
            if (this.togglePreviewBtn) {
                this.togglePreviewBtn.textContent = '👁️‍🗨️';
                this.togglePreviewBtn.title = '隐藏预览';
            }
            this.updatePreview();
        } else {
            this.closePreview();
        }
    }

    updatePreview() {
        const markdownText = this.markdownInput ? this.markdownInput.value.trim() : '';

        // 应用自定义样式
        this.applyCustomStyles();

        // 添加页面类
        document.body.className = document.body.className.replace(/page-\w+/g, '');
        document.body.classList.add(`page-${this.currentPageSize}`);
        document.body.classList.add(`theme-${this.currentTheme}`);

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
            return marked.parse(markdown);
        } else {
            console.warn("备用方案")
            // 简单的 Markdown 解析（备用方案）
            return markdown
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
    }

    applyCustomStyles() {
        if (!this.previewContent) return;

        const previewElement = this.previewContent;

        if (this.customStyles.fontSize) {
            previewElement.style.fontSize = this.customStyles.fontSize;
        }

        if (this.customStyles.fontFamily) {
            previewElement.style.fontFamily = this.customStyles.fontFamily;
        }

        if (this.customStyles.lineHeight) {
            previewElement.style.lineHeight = this.customStyles.lineHeight;
        }

        if (this.customStyles.bgColor) {
            previewElement.style.backgroundColor = this.customStyles.bgColor;
        }

        if (this.customStyles.textColor) {
            previewElement.style.color = this.customStyles.textColor;
        }

        if (this.customStyles.pdfPadding) {
            previewElement.style.setProperty('--pdf-padding', this.customStyles.pdfPadding);
        }
    }

    async handleDownload() {
        try {
            this.downloadBtn.disabled = true;
            this.downloadBtn.innerHTML = '<span class="loading"></span> 生成中...';

            await this.generatePDFDocument();
            this.showToast('PDF 生成成功！', 'success');
        } catch (error) {
            console.error('PDF 生成失败:', error);
            this.showToast('PDF 生成失败：' + error.message, 'error');
        } finally {
            // 使用延迟恢复，确保页面完全恢复后再恢复按钮状态
            setTimeout(() => {
                this.restoreDownloadButtonState();
            }, 500);
        }
    }

    /**
     * 恢复下载按钮状态
     */
    restoreDownloadButtonState() {
        // 重新获取按钮元素，因为页面可能已被替换
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '📥 下载 PDF';
            console.log('✅ 下载按钮状态已恢复');
        } else {
            console.warn('⚠️ 未找到下载按钮元素');
        }
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
        
        console.log('✅ 页面恢复处理完成');
    }

    /**
     * 恢复所有按钮状态
     */
    restoreAllButtonStates() {
        // 恢复打印按钮
        this.restorePrintButtonState();
        
        // 恢复下载按钮
        this.restoreDownloadButtonState();
        
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

    async generatePDFDocument() {
        if (!this.previewContent) {
            throw new Error('预览内容不存在');
        }

        // 使用PDF生成器
        if (window.pdfGenerator) {
            const pdfGen = new window.pdfGenerator();
            await pdfGen.generatePDF(
                this.previewContent,
                this.currentPageSize,
                {
                    filename: `document-${Date.now()}.pdf`,
                    title: 'Markdown Document',
                    author: 'Markdown to PDF Converter'
                }
            );
        } else {
            throw new Error('PDF 生成器未加载');
        }
    }

    async directPrint() {
        if (!this.previewContent) {
            throw new Error('预览内容不存在');
        }

        if (window.pdfGenerator) {
            const pdfGen = new window.pdfGenerator();
            await pdfGen.directPrint(this.previewContent);
        } else {
            throw new Error('PDF 生成器未加载');
        }
    }

    async smartPrint() {
        if (!this.previewContent) {
            throw new Error('预览内容不存在');
        }

        if (window.pdfGenerator) {
            const pdfGen = new window.pdfGenerator();
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

        // Ctrl/Cmd + Shift + P: 切换预览显示
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
            event.preventDefault();
            this.togglePreview();
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
            setTimeout(() => document.body.removeChild(toast), 300);
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