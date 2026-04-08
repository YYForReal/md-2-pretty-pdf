// PDF 生成器模块 - 基于Vue实现优化
class PDFGenerator {
  constructor(themeManager = null) {
    this.themeManager = themeManager;
    this.jsPDF = window.jspdf?.jsPDF ;
    // this.html2canvas = window.html2canvas;
    this.debugEnabled = true;

    if (!this.jsPDF) {
      console.error("jsPDF 未加载");
    }

    // if (!this.html2canvas) {
    //   console.warn("html2canvas 未加载");
    // }
  }

//   /**
//    * 生成 PDF 文件 - 参考Vue实现优化
//    * @param {HTMLElement} element - 要转换的 HTML 元素
//    * @param {string} pageSize - 页面尺寸 ('a4', 'letter', 'a5')
//    * @param {Object} options - 配置选项
//    * @returns {Promise<void>}
//    */
//   async generatePDF(element, pageSize = "a4", options = {}) {
//     console.log("🚀 PDF生成开始 ====================");
//     console.log("📋 输入参数:", { pageSize, options });
//     console.log("🎯 目标元素:", element);

//     try {
//       const config = {
//         filename: options.filename || `document-${Date.now()}.pdf`,
//         title: options.title || "Markdown Document",
//         author: options.author || "Markdown to PDF Converter",
//         pageSize: pageSize,
//         ...options,
//       };

//       this.showLoadingToast();
//       console.log("⏳ 开始创建PDF文档...");

//       // 1. 准备打印样式 - 隐藏其他页面元素，仅保留预览内容
//       this.prepareElementForPrint(element);

//       // 2. 生成Canvas - 完全参考Vue实现
//       console.log("🎨 开始生成Canvas...");
//       const canvas = await this.html2canvas(element, {
//         scale: 12, // 缩放比例，提高生成图片清晰度
//         useCORS: true, // 允许加载跨域的图片
//         allowTaint: false, // 允许图片跨域，和 useCORS 二者不可共同使用
//         tainttest: true, // 检测每张图片已经加载完成
//         logging: this.debugEnabled, // 日志开关
//         width: element.scrollWidth,
//         height: element.scrollHeight,
//         windowWidth: element.scrollWidth,
//         windowHeight: element.scrollHeight,
//       });

//       // 3. 检查Canvas结果
//       this.debugCanvasResult(canvas);

//       if (!canvas || canvas.width === 0 || canvas.height === 0) {
//         console.error("❌ Canvas生成失败 - 宽度或高度为0");
//         throw new Error("Canvas 生成失败");
//       }

//       // 4. 转换为图片
//       console.log("🖼️ 开始转换Canvas为图片...");
//       const pageData = canvas.toDataURL("image/jpeg", 1.0);
//       console.log("✅ 图片转换成功, 数据长度:", pageData.length);

//       // 5. 创建PDF文档 - 完全参考Vue实现
//       const contentWidth = canvas.width;
//       const contentHeight = canvas.height;

//       // 一页pdf显示html页面生成的canvas高度
//       const pageHeight = (contentWidth / 592.28) * 841.89;
//       // 未生成pdf的html页面高度
//       let leftHeight = contentHeight;
//       // 页面偏移
//       let position = 0;
//       // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
//       const imgWidth = 595.28;
//       const imgHeight = (592.28 / contentWidth) * contentHeight;

//       // a4纸纵向，一般默认使用；new JsPDF('landscape'); 横向页面
//       const PDF = new this.jsPDF("", "pt", "a4");

//       // 6. 设置文档属性
//       PDF.setProperties({
//         title: config.title,
//         subject: "Generated from Markdown",
//         author: config.author,
//         keywords: "markdown, pdf",
//         creator: "Markdown to PDF Converter",
//       });

//       // 7. 添加图片到PDF - 完全参考Vue实现
//       console.log("📄 开始将图片添加到PDF...");
//       console.log("📏 页面尺寸计算:", {
//         contentWidth,
//         contentHeight,
//         imgWidth,
//         imgHeight,
//         pageHeight,
//         leftHeight,
//       });

//       // 当内容未超过pdf一页显示的范围，无需分页
//       if (leftHeight < pageHeight) {
//         console.log("📄 单页内容，直接添加");
//         // addImage(pageData, 'JPEG', 左，上，宽度，高度)设置
//         PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
//       } else {
//         console.log("📄 内容超过一页，启用多页模式");
//         // 超过一页时，分页打印（每页高度841.89）
//         while (leftHeight > 0) {
//           PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
//           leftHeight -= pageHeight;
//           position -= 841.89;
//           if (leftHeight > 0) {
//             PDF.addPage();
//           }
//         }
//       }

//       // 8. 保存PDF
//       console.log("💾 开始保存PDF...");
//       PDF.save(config.filename);
//       console.log("✅ PDF保存完成");

//       this.hideLoadingToast();
//       console.log("🎉 PDF生成流程全部完成 ====================");
//     } catch (error) {
//       console.error("❌ PDF生成失败:", error);
//       this.hideLoadingToast();
//       throw error;
//     }
//   }
  /**
   * 直接打印方法 - 优化实现
   * @param {HTMLElement} element - 要打印的元素
   * @param {Object} options - 配置选项
   * @returns {Promise<void>}
   */
  async directPrint(element, options = {}) {
    console.log("🖨️ 开始直接打印流程...");
    console.log("📋 输入参数:", { element, options });

    let originalBodyHTML = null;
    let originalTitle = null;
    const printStyleId = "pdf-print-styles";

    try {
      // 1. 验证元素存在性
      const preContentElement = document.getElementById("previewContent");
      console.log("🔍 查找preContent元素:", preContentElement);

      if (!preContentElement) {
        throw new Error("未找到ID为preContent的元素");
      }

      console.log(
        "📏 preContent元素内容长度:",
        preContentElement.innerHTML.length
      );
      console.log(
        "👀 preContent元素可见性:",
        this.isElementVisible(preContentElement)
      );

      // 2. 保存原始状态
      originalBodyHTML = document.body.innerHTML;
      originalTitle = document.title;
      console.log("💾 保存原始页面状态完成");
      console.log("📄 原始body内容长度:", originalBodyHTML.length);
      console.log("🏷️ 原始页面标题:", originalTitle);

      // 3. 准备打印内容
      console.log("🔄 开始准备打印内容...");
      const printContent = this.preparePrintContent(preContentElement, options);

      // 4. 替换body内容
      console.log("📝 替换body内容为打印内容...");
      document.body.innerHTML = printContent;
      document.title = options.title || "打印文档";
      console.log("✅ body内容替换完成");
      console.log("📄 新body内容长度:", document.body.innerHTML.length);
    //   console.log("📄 新body内容:", document.documentElement.outerHTML);
      console.log("🏷️ 新页面标题:", document.title);

      // 5. 添加打印样式
      console.log("🎨 添加打印样式...");
    //   this.addPrintStyles();

      // 6. 等待DOM更新
      console.log("⏳ 等待DOM更新...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 7. 验证替换后的内容
      this.validatePrintContent();

      // 8. 调用浏览器打印
      console.log("🚀 调用浏览器打印对话框...");
      await this.executePrintWithFallback();

      console.log("✅ 打印流程完成");
    } catch (error) {
      console.error("❌ 直接打印失败:", error);
      this.showErrorToast("打印失败: " + error.message);
      throw error;
    } finally {
      // 9. 恢复原始内容（无论成功与否都要执行）
      await this.restoreOriginalContent(
        originalBodyHTML,
        originalTitle,
        printStyleId
      );
    }
  }

  /**
   * 准备打印内容
   */
  preparePrintContent(element, options) {
    console.log("🔧 准备打印内容...");

    // 克隆元素以避免修改原始元素
    const clonedElement = element.cloneNode(true);

    // 保持当前主题样式
    this.preserveThemeStyles(clonedElement);

    // 应用打印优化样式
    this.applyPrintOptimizations(clonedElement, options);

    // 创建打印容器
    const printContainer = document.createElement("div");
    printContainer.id = "preview-container";
    printContainer.className = "preview-container" + " " + document.body.className;

    // 应用 customStyles 作为 CSS 变量（优先于主题样式）
    this.applyCustomStylesAsVariables(printContainer, options);

    // 应用背景设置
    this.applyBackgroundSettingsToPrint(printContainer, clonedElement, options);

    printContainer.appendChild(clonedElement);

    console.log("📦 打印内容准备完成");
    return printContainer.outerHTML;
  }

  /**
   * 应用 customStyles 作为 CSS 变量
   */
  applyCustomStylesAsVariables(printContainer, options) {
    console.log("🎨 应用 customStyles 作为 CSS 变量...");

    // 从 options 中获取 customStyles，或者从全局 app 实例获取
    let customStyles = options.customStyles || {};
    
    // 如果 options 中没有 customStyles，尝试从全局 app 实例获取
    if (!customStyles || Object.keys(customStyles).length === 0) {
      if (window.app && window.app.customStyles) {
        customStyles = window.app.customStyles;
        console.log("📋 从全局 app 实例获取 customStyles:", customStyles);
      }
    }

    // 将 customStyles 中的字段转换为 CSS 变量并应用到 printContainer
    if (customStyles && Object.keys(customStyles).length > 0) {
      Object.entries(customStyles).forEach(([property, value]) => {
        if (value && value !== '') {
          // 将驼峰命名转换为 CSS 变量格式
          const cssVariable = this.convertToCSSVariable(property);
          printContainer.style.setProperty(cssVariable, value, 'important');
          console.log(`✅ 设置 CSS 变量: ${cssVariable} = ${value}`);
        }
      });
      console.log("✅ customStyles 作为 CSS 变量应用完成");
    } else {
      console.log("ℹ️ 没有 customStyles 需要应用");
    }
  }

  /**
   * 应用背景设置到打印内容
   */
  applyBackgroundSettingsToPrint(printContainer, contentElement, options = {}) {
    console.log("🖼️ 应用背景设置到打印内容...");

    // 从全局 app 实例或 options 获取背景设置
    let backgroundSettings = null;
    if (options.backgroundSettings) {
      backgroundSettings = options.backgroundSettings;
    } else if (window.app && window.app.backgroundSettings) {
      backgroundSettings = window.app.backgroundSettings;
      console.log("📋 获取到背景设置:", backgroundSettings);
    }

    if (!backgroundSettings) {
      console.log("ℹ️ 没有背景设置需要应用");
    } else {
      if (backgroundSettings.type === 'solid') {
        // 纯色背景
        contentElement.style.setProperty('--bg-color', backgroundSettings.solidColor);
        contentElement.style.setProperty('--bg-size', 'auto');
        contentElement.style.setProperty('--bg-position', 'center center');
        contentElement.style.setProperty('--bg-repeat', 'no-repeat');
        contentElement.style.setProperty('--bg-overlay-color', 'transparent');
        contentElement.style.backgroundColor = backgroundSettings.solidColor;
        if (!window.app || !window.app.aiBackgroundSettings || !window.app.aiBackgroundSettings.enabled) {
          contentElement.style.backgroundImage = '';
        }
      } else if (backgroundSettings.type === 'image' && backgroundSettings.imageUrl) {
        // 图片背景
        contentElement.style.backgroundImage = `url(${backgroundSettings.imageUrl})`;
        contentElement.style.backgroundSize = backgroundSettings.imageSize;
        contentElement.style.backgroundPosition = backgroundSettings.imagePosition;
        contentElement.style.backgroundRepeat = backgroundSettings.imageRepeat;

        // 同时设置CSS变量以保持一致性
        contentElement.style.setProperty('--bg-size', backgroundSettings.imageSize);
        contentElement.style.setProperty('--bg-position', backgroundSettings.imagePosition);
        contentElement.style.setProperty('--bg-repeat', backgroundSettings.imageRepeat);

        // 处理透明度 - 通过CSS变量设置，避免重复应用
        if (backgroundSettings.type === 'image' && backgroundSettings.imageUrl) {
          const opacity = backgroundSettings.opacity / 100;

          if (opacity < 1) {
            console.log('🎨 PDF透明度设置:', { opacity, imageUrl: !!backgroundSettings.imageUrl });

            // 获取当前主题的背景色作为覆盖层的基础颜色
            let themeBgColor = '#ffffff'; // 默认白色背景

            // 尝试从当前主题获取背景色
            if (this.themeManager && this.themeManager.currentTheme) {
              const themeProperties = this.themeManager.getThemeProperties(this.themeManager.currentTheme);
              if (themeProperties && themeProperties['--bg-color']) {
                themeBgColor = themeProperties['--bg-color'];
              }
            }

            // 备用方案：从预览元素获取计算的背景色
            if (themeBgColor === '#ffffff') {
              const originalPreview = document.getElementById('previewContent');
              if (originalPreview) {
                const computedStyle = window.getComputedStyle(originalPreview);
                const bgColorValue = computedStyle.getPropertyValue('--bg-color');
                if (bgColorValue && bgColorValue !== '#ffffff') {
                  themeBgColor = bgColorValue;
                }
              }
            }

            let overlayColor;

            // 使用全局app实例的hexToRgba函数，或者使用简化版本
            if (window.app && typeof window.app.hexToRgba === 'function') {
              overlayColor = window.app.hexToRgba(themeBgColor, 1 - opacity);
            } else {
              // 简化的hexToRgba实现（只处理常见的背景色）
              overlayColor = this.simpleHexToRgba(themeBgColor, 1 - opacity);
            }

            contentElement.style.setProperty('--bg-overlay-color', overlayColor);

            console.log('✅ PDF透明度CSS变量已设置:', { themeBgColor, overlayColor });
          } else {
            contentElement.style.setProperty('--bg-overlay-color', 'transparent');
            console.log('ℹ️ PDF透明度设置为100%，无需覆盖层');
          }
        }
      }
    }

    // 应用 AI 背景设置
    this.applyAIBackgroundSettingsToPrint(contentElement, options);

    console.log("✅ 背景设置应用完成");
  }

  /**
   * 应用 AI 背景设置到打印内容
   */
  applyAIBackgroundSettingsToPrint(contentElement, options = {}) {
    console.log("🤖 应用 AI 背景设置到打印内容...");

    // 从 options 或全局 app 实例获取 AI 背景设置
    let aiBackgroundSettings = null;
    if (options.aiBackgroundSettings) {
      aiBackgroundSettings = options.aiBackgroundSettings;
    } else if (window.app && window.app.aiBackgroundSettings) {
      aiBackgroundSettings = window.app.aiBackgroundSettings;
    }

    if (!aiBackgroundSettings || !aiBackgroundSettings.enabled || !aiBackgroundSettings.generatedCSS) {
      console.log("ℹ️ 没有 AI 背景设置需要应用");
      return;
    }

    const css = aiBackgroundSettings.generatedCSS;

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
    let baseBg = '';
    const backgroundSettings = options.backgroundSettings || (window.app && window.app.backgroundSettings);

    if (backgroundSettings) {
      if (backgroundSettings.type === 'image' && backgroundSettings.imageUrl) {
        baseBg = `url(${backgroundSettings.imageUrl})`;
      } else {
        baseBg = backgroundSettings.solidColor || '#ffffff';
      }
    } else {
      baseBg = contentElement.style.backgroundColor || '#ffffff';
    }

    // 应用 AI 背景（AI 层在上，基础背景在下；CSS 多层背景：先声明=上层）
    const aiLayer = bgValue || bgImageValue;
    if (aiLayer) {
      contentElement.style.setProperty('--ai-bg-layer', aiLayer, 'important');
      // AI 背景在上层，基础背景在下层
      contentElement.style.background = `${aiLayer}, ${baseBg}`;
    }

    // 确保打印时背景颜色被正确应用
    contentElement.style.setProperty('-webkit-print-color-adjust', 'exact');
    contentElement.style.setProperty('print-color-adjust', 'exact');

    console.log("✅ AI 背景设置应用到打印完成");
  }

  /**
   * 将属性名转换为 CSS 变量格式
   */
  convertToCSSVariable(property) {
    // 将驼峰命名转换为 kebab-case 并添加 -- 前缀
    return '--' + property.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  /**
   * 保持主题样式
   */
  preserveThemeStyles(element) {
    console.log("🎨 保持当前主题样式...");

    // 获取当前body的主题类
    const bodyClasses = document.body.className;
    const themeClass = bodyClasses.match(/theme-\w+/);
    
    if (themeClass) {
      element.className = element.className + ' ' + themeClass[0];
      console.log("✅ 应用主题类:", themeClass[0]);
    }

    // 获取当前页面的自定义样式
    const computedStyle = window.getComputedStyle(element);
    const importantStyles = {
      fontFamily: computedStyle.fontFamily,
      fontSize: computedStyle.fontSize,
      lineHeight: computedStyle.lineHeight,
      color: computedStyle.color,
      backgroundColor: computedStyle.backgroundColor
    };

    // 应用重要样式到克隆元素
    Object.keys(importantStyles).forEach(property => {
      if (importantStyles[property] && importantStyles[property] !== 'initial') {
        element.style.setProperty(property, importantStyles[property], 'important');
      }
    });

    console.log("✅ 主题样式保持完成");
  }

  /**
   * 应用打印优化
   */
  applyPrintOptimizations(element, options) {
    console.log("🎨 应用打印优化样式...");

    // 设置基础样式
    // element.style.width = options.pageWidth || "210mm";
    // element.style.margin = "0 auto";
    // element.style.padding = "20mm";
    element.style.boxSizing = "border-box";

    console.log("✅ 打印样式优化完成");
  }

  /**
   * 添加打印样式
   */
  addPrintStyles() {
    console.log("📋 添加打印样式表...");

    const styleId = "pdf-print-styles";
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.textContent = `
            @media print {
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .preview-container {
                    width: 100% !important;
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 20mm !important;
                    box-sizing: border-box !important;
                }
                .no-print {
                    display: none !important;
                }
                h1, h2, h3 {
                    page-break-after: avoid !important;
                }
                table, img, pre, code {
                    page-break-inside: avoid !important;
                }
                /* 保持主题样式 */
                .preview-content {
                    color: inherit !important;
                    font-family: inherit !important;
                    font-size: inherit !important;
                    line-height: inherit !important;
                }
                /* 确保主题样式在打印时生效 */
                .theme-default, .theme-academic, .theme-modern, .theme-elegant, .theme-minimal {
                    background: inherit !important;
                    color: inherit !important;
                }
            }
            @page {
                size: A4;
                margin: 0;
            }
        `;
      document.head.appendChild(styleElement);
      console.log("✅ 打印样式表添加完成");
    }
  }

  /**
   * 验证打印内容
   */
  validatePrintContent() {
    console.log("🔍 验证打印内容...");

    const body = document.body;
    console.log("📏 当前body内容长度:", body.innerHTML.length);
    console.log("👀 body子元素数量:", body.children.length);

    const printContainer = document.getElementById("preview-container");
    if (!printContainer) {
      throw new Error("打印容器未正确创建");
    }

    console.log("✅ 打印内容验证通过");
  }

  /**
   * 执行打印（带回退机制）
   */
  executePrintWithFallback() {
    return new Promise((resolve, reject) => {
      console.log("🖨️ 准备执行打印...");

      // 改进的状态管理
      const state = {
        printExecuted: false,
        isResolved: false,
        printDialogOpened: false
      };

      // 合理设置时间间隔
      const timeouts = {
        printDelay: 100,           // 打印延迟
        autoRecovery: 12000,       // 自动恢复时间（12秒）
        forceTimeout: 20000        // 强制超时时间（20秒）
      };

      // 安全的解析函数，防止重复调用
      let safeResolve = () => {
        if (!state.isResolved) {
          console.log("✅ 打印流程解析完成");
          state.isResolved = true;
          clearTimeouts();
          resolve();
        }
      };

      // 清理所有定时器
      let timeoutIds = [];
      const clearTimeouts = () => {
        timeoutIds.forEach(id => clearTimeout(id));
        timeoutIds = [];
      };

      // 设置强制超时定时器
      const forceTimeoutId = setTimeout(() => {
        if (!state.isResolved) {
          console.warn("⚠️ 打印强制超时，恢复页面");
          safeResolve();
        }
      }, timeouts.forceTimeout);
      timeoutIds.push(forceTimeoutId);

      try {
        // 打印完成处理函数
        const afterPrintHandler = () => {
          if (!state.isResolved) {
            console.log("👂 检测到打印对话框关闭");
            state.printExecuted = true;
            safeResolve();
          }
        };

        // 监听打印状态变化（浏览器兼容方案）
        if (window.matchMedia) {
          const printMediaQuery = window.matchMedia("print");

          const printStateHandler = (e) => {
            if (e.matches) {
              // 打印对话框打开
              if (!state.printDialogOpened) {
                console.log("📄 打印对话框已打开");
                state.printDialogOpened = true;
              }
            } else {
              // 打印对话框关闭
              if (state.printDialogOpened && !state.isResolved) {
                afterPrintHandler();
              }
            }
          };

          // 添加事件监听
          printMediaQuery.addEventListener("change", printStateHandler);

          // 清理函数中移除事件监听
          const originalResolve = safeResolve;
          safeResolve = () => {
            printMediaQuery.removeEventListener("change", printStateHandler);
            originalResolve();
          };
        }

        // 延迟执行打印
        const printDelayId = setTimeout(() => {
          if (!state.isResolved) {
            console.log("🚀 调用 window.print()");
            window.print();
            console.log("✅ window.print() 调用成功");
          }
        }, timeouts.printDelay);
        timeoutIds.push(printDelayId);

        // 自动恢复定时器 - 仅在未检测到打印完成时触发
        const autoRecoveryId = setTimeout(() => {
          if (!state.printExecuted && !state.isResolved) {
            console.log("⏰ 打印后自动恢复定时器触发（未检测到打印对话框关闭）");
            afterPrintHandler();
          }
        }, timeouts.autoRecovery);
        timeoutIds.push(autoRecoveryId);

      } catch (error) {
        console.error("❌ 打印执行过程中发生错误:", error);
        if (!state.isResolved) {
          state.printExecuted = true;
          clearTimeouts();
          reject(error);
        }
      }
    });
  }

  /**
   * 恢复原始内容
   */
  async restoreOriginalContent(originalBodyHTML, originalTitle, styleId) {
    console.log("🔄 开始恢复原始内容...");

    try {
      if (originalBodyHTML) {
        // 恢复body内容
        document.body.innerHTML = originalBodyHTML;
        console.log("✅ body内容恢复完成");
      }

      if (originalTitle) {
        // 恢复页面标题
        document.title = originalTitle;
        console.log("✅ 页面标题恢复完成");
      }

      // 移除打印样式
      const styleElement = document.getElementById(styleId);
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
        console.log("✅ 打印样式移除完成");
      }

      // 等待DOM完全恢复
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // 触发页面恢复完成事件，让应用重新绑定事件
      this.triggerPageRestoredEvent();
      
      console.log("🎉 页面恢复流程全部完成");
    } catch (error) {
      console.error("❌ 恢复原始内容时发生错误:", error);
      // 即使恢复失败，也尝试刷新页面
      this.fallbackPageRecovery();
    }
  }

  /**
   * 触发页面恢复完成事件
   */
  triggerPageRestoredEvent() {
    console.log("📡 触发页面恢复完成事件...");
    const event = new CustomEvent('pageRestored', {
      detail: {
        timestamp: Date.now(),
        source: 'pdfGenerator'
      }
    });
    document.dispatchEvent(event);
    console.log("✅ 页面恢复事件已触发");
  }

  /**
   * 备用页面恢复方案
   */
  fallbackPageRecovery() {
    console.warn("⚠️ 使用备用方案恢复页面");
    try {
      window.location.reload();
    } catch (reloadError) {
      console.error("❌ 页面刷新也失败:", reloadError);
    }
  }

  /**
   * 检查元素是否可见
   */
  isElementVisible(element) {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  }

  /**
   * 显示错误提示
   */
  showErrorToast(message) {
    console.error("💥 错误提示:", message);
    // 可以在这里添加UI错误提示
    alert(message); // 简单使用alert，可以根据需要替换为更优雅的提示方式
  }

  /**
   * 准备元素用于打印
   * @param {HTMLElement} element - 要准备的元素
   */
  prepareElementForPrint(element) {
    console.log("🎨 准备元素用于打印...");

    // 确保元素可见
    element.style.display = "block";
    element.style.visibility = "visible";
    element.style.opacity = "1";

    // 设置基础样式
    element.style.cssText += `
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            color: black;
            line-height: 1.6;
            box-sizing: border-box;
            overflow: visible;
            position: relative;
        `;

    // 处理内部元素的样式
    const allElements = element.querySelectorAll("*");
    allElements.forEach((el) => {
      const style = window.getComputedStyle(el);

      // 强制显示隐藏元素
      if (style.display === "none") {
        el.style.display = "block";
      }
      if (style.visibility === "hidden") {
        el.style.visibility = "visible";
      }

      // 确保文本可读性
      el.style.color = "inherit";

      // 处理图片
      if (el.tagName.toLowerCase() === "img") {
        el.style.maxWidth = "100%";
        el.style.height = "auto";
        el.style.display = "block";
      }

      // 处理代码块
      if (
        el.tagName.toLowerCase() === "code" ||
        el.tagName.toLowerCase() === "pre"
      ) {
        el.style.background = "#f5f5f5";
        el.style.border = "1px solid #ddd";
        el.style.padding = "10px";
        el.style.borderRadius = "4px";
        el.style.fontFamily = "Monaco, Menlo, Consolas, monospace";
      }
    });

    console.log("✅ 元素打印准备完成");
  }

  /**
   * 添加打印专用CSS
   */
  addPrintStyles() {
    const printCSS = `
            <style data-print-styles>
                @media print {
                    body {
                        margin: 0;
                        padding: 15px;
                        font-size: 12pt;
                        line-height: 1.4;
                    }
                    * {
                        color: black !important;
                    }
                    a {
                        text-decoration: none;
                        color: black !important;
                    }
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                        page-break-inside: avoid;
                    }
                    table {
                        page-break-inside: auto;
                    }
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    pre, code {
                        font-family: 'Courier New', monospace !important;
                        background: #f5f5f5 !important;
                        border: 1px solid #ddd !important;
                        padding: 8px !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }

                @media screen {
                    body {
                        background: white;
                        margin: 20px auto;
                        max-width: 800px;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                }
            </style>
        `;

    document.head.insertAdjacentHTML("beforeend", printCSS);
  }

  /**
   * 移除打印专用CSS
   */
  removePrintStyles() {
    const printStyles = document.querySelectorAll("style[data-print-styles]");
    printStyles.forEach((style) => style.remove());
  }

  /**
   * 调试Canvas生成结果
   * @param {HTMLCanvasElement} canvas - Canvas元素
   */
  debugCanvasResult(canvas) {
    if (!canvas) {
      console.error("❌ Canvas对象为null或undefined");
      return;
    }

    console.log("🎨 Canvas生成结果:");
    console.log("📏 尺寸:", { width: canvas.width, height: canvas.height });
    console.log("🔧 数据类型:", typeof canvas);

    // 检查Canvas是否有内容
    if (canvas.width > 0 && canvas.height > 0) {
      const context = canvas.getContext("2d");
      const imageData = context.getImageData(0, 0, 1, 1).data;
      console.log("🎯 左上角像素RGBA:", Array.from(imageData));

      // 采样检查几个点
      const samplePoints = [
        { x: 10, y: 10 },
        { x: canvas.width - 10, y: 10 },
        { x: 10, y: canvas.height - 10 },
      ];

      samplePoints.forEach((point) => {
        if (point.x < canvas.width && point.y < canvas.height) {
          const pixel = context.getImageData(point.x, point.y, 1, 1).data;
          console.log(
            `📊 采样点(${point.x},${point.y}) RGBA:`,
            Array.from(pixel)
          );
        }
      });
    }
  }

  /**
   * 显示加载提示
   */
  showLoadingToast() {
    const existingToast = document.querySelector(".toast.loading-pdf");
    if (existingToast) {
      return;
    }

    const toast = document.createElement("div");
    toast.className = "toast loading-pdf";
    toast.innerHTML = '<span class="loading"></span> 正在生成 PDF...';
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
  }

  /**
   * 隐藏加载提示
   */
  hideLoadingToast() {
    const toast = document.querySelector(".toast.loading-pdf");
    if (toast) {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }
  }

  /**
   * 简化的十六进制颜色转换为RGBA函数
   * @param {string} hex - 十六进制颜色值
   * @param {number} alpha - 透明度 (0-1)
   * @returns {string} RGBA颜色值
   */
  simpleHexToRgba(hex, alpha) {
    // 移除 # 号
    hex = hex.replace('#', '');

    // 解析RGB
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      // 如果不是有效的十六进制颜色，默认使用白色
      r = g = b = 255;
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
