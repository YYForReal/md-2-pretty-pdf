# 📄 Markdown to PDF 转换器

一个功能强大的在线 Markdown 转 PDF 工具，支持丰富的样式自定义和多种预设主题。

**仓库地址**: [https://github.com/YYForReal/md-2-pretty-pdf](https://github.com/YYForReal/md-2-pretty-pdf)

## 效果

|界面预览1|界面预览2|
|---|---|
|![界面预览1](https://github.com/YYForReal/md-2-pretty-pdf/blob/main/assets/preview.png?raw=true)|![效果图2](https://github.com/YYForReal/md-2-pretty-pdf/blob/main/assets/preview2.png?raw=true)|

实际导出PDF细节效果如下（具体内容可看example）：

![效果图3](https://github.com/YYForReal/md-2-pretty-pdf/blob/main/assets/result.png?raw=true)


## ✨ 主要功能

### 🎨 样式自定义
- **7种预设主题**：默认、学术、现代、优雅、极简、古典、护眼风格
- **标题居中**：可控制标题是否居中显示
- **字体选择**：系统默认、中文衬线、中文楷体、中文黑体、中文仿宋、中文宋体、英文衬线、英文无衬线、等宽字体
- **字体大小**：可调节基础字体大小（10px-20px）
- **行间距**：自定义行间距（1.2-2.0）
- **颜色自定义**：背景颜色和文字颜色
- **页面边距**：可调节页面边距大小

### 📄 页面设置
- **多种页面尺寸**：A4、Letter、A5
- **实时预览**：即时查看样式效果
- **高质量导出**：生成高分辨率 PDF 文件

### 🚀 使用体验
- **响应式设计**：支持桌面和移动设备
- **实时预览**：编辑时即时更新预览
- **键盘快捷键**：
  - `Ctrl/Cmd + Enter`：预览
  - `Ctrl/Cmd + S`：下载 PDF
  - `Esc`：关闭预览

## 🚀 快速开始

### 在线使用
**无需本地开启端口，直接打开 `index.html` 文件即可在浏览器中使用！**

### 本地部署（可选）
```bash
# 克隆或下载项目
git clone https://github.com/YYForReal/md-2-pretty-pdf.git
cd md-2-pretty-pdf

# 直接打开 index.html 文件即可使用
# 或者使用任意 HTTP 服务器运行（可选）
npx serve .
# 或者
python -m http.server 8000
# 或者
php -S localhost:8000
```

**推荐直接打开 `index.html` 文件使用，无需任何服务器配置！**

## 🎯 主题样式

### 1. 默认主题
- 现代简洁的设计风格
- 适合一般文档和报告
- 蓝色主色调，清晰的层次结构

### 2. 学术风格
- 衬线字体，正式的学术风格
- 适合论文、学术报告
- 经典的黑白配色

### 3. 现代风格
- 现代 Inter 字体
- 清新的蓝色调
- 适合技术文档和现代内容

### 4. 优雅风格
- 优雅的紫色主题
- Georgia 衬线字体
- 适合文学作品和正式文档

### 5. 极简风格
- 纯黑白设计
- 简洁的无衬线字体
- 适合极简主义设计

### 6. 古典风格
- 温柔黄古典色调
- 优雅的装饰元素
- 适合文学作品和古典内容
- 具有传统书卷气息

### 7. 护眼风格
- 柔和的绿色调
- 护眼的背景色设计
- 适合长时间阅读
- 减少眼部疲劳

## 📋 支持的 Markdown 语法

- **标题**：# H1, ## H2, ### H3...
- **文本格式**：**粗体**、*斜体*、***粗斜体***
- **列表**：有序列表和无序列表
- **链接**：[链接文本](URL)
- **图片**：![alt text](image.png)
- **代码**：`行内代码`和```代码块```
- **表格**：支持 GitHub 风格表格
- **引用**：> 引用文本
- **分隔线**：---
- **任务列表**：- [x] 完成的任务

## 🛠️ 技术栈

### 前端技术
- **HTML5**：语义化标签
- **CSS3**：CSS 变量、Grid、Flexbox
- **JavaScript ES6+**：模块化开发

### 第三方库
- **marked.js**：Markdown 解析器
- **jsPDF**：PDF 生成库
- **html2canvas**：HTML 转 Canvas

### 项目结构
```
md-2-pretty-pdf/
├── index.html              # 主页面
├── styles/                 # 样式文件
│   ├── main.css           # 主样式
│   ├── themes.css         # 主题样式
│   └── print.css          # 打印样式
├── js/                    # JavaScript 文件
│   ├── app.js             # 主应用逻辑
│   ├── pdfGenerator.js    # PDF 生成器
│   ├── themeManager.js    # 主题管理器
│   └── marked@11.1.1.js   # Markdown 解析器
├── sample.md              # 示例文档
└── README.md              # 说明文档
```

## 🎮 使用说明

1. **打开应用**：直接双击 `index.html` 文件在浏览器中打开
2. **输入 Markdown**：在左侧编辑器中输入或粘贴 Markdown 内容
3. **选择主题**：从右侧控制面板选择预设主题（7种主题可选）
4. **自定义样式**：调整字体、颜色、边距等参数
5. **实时预览**：右侧预览区域会实时显示效果
6. **打印/导出**：点击"打印"按钮进行打印或导出 PDF

## 🔧 自定义主题

系统支持创建自定义主题：

```javascript
// 创建自定义主题
window.themeManager.createCustomTheme('my-theme', {
    '--primary-color': '#ff6b6b',
    '--bg-color': '#f8f9fa',
    '--text-color': '#2d3436',
    // ... 更多属性
});

// 应用自定义主题
window.themeManager.applyTheme('my-theme');
```

## 📱 移动端支持

- 响应式布局，适配各种屏幕尺寸
- 触摸友好的界面设计
- 移动端优化的编辑器

## 🐛 常见问题

### Q: PDF 生成的字体不正确怎么办？
A: 确保 CSS 中正确设置了字体族，PDF 生成器会自动优化字体渲染。

### Q: 为什么有些样式在 PDF 中不显示？
A: PDF 生成使用 html2canvas，某些高级 CSS 特性可能不支持。建议使用基础的 CSS 属性。

### Q: 如何处理中文内容？
A: 应用提供了丰富的中文字体支持，包括：
- 中文衬线（宋体）
- 中文楷体
- 中文黑体
- 中文仿宋
- 中文宋体
- 系统默认字体

选择相应的中文字体即可获得最佳的中文显示效果。

### Q: 生成的 PDF 文件太大怎么办？
A: 可以尝试：
1. 减少图片数量和尺寸
2. 使用更简单的样式
3. 调整页面尺寸

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发环境
1. Fork 项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交 Pull Request

## 📄 许可证

Apache-2.0 License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [marked.js](https://marked.js.org/) - 优秀的 Markdown 解析器
- [jsPDF](https://github.com/parallax/jsPDF) - 强大的 PDF 生成库
- [html2canvas](https://html2canvas.hertzen.com/) - HTML 转图片工具

---

**享受使用这个工具，让你的 Markdown 文档变得更加精美！** 🎉