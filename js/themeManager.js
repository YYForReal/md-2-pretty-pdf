// 主题管理器
class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.customProperties = new Map();
        this.themePresets = this.initializeThemePresets();
    }

    /**
     * 初始化主题预设
     * @returns {Map} 主题预设映射
     */
    initializeThemePresets() {
        const presets = new Map();

        // 默认主题
        presets.set('default', {
            '--primary-color': '#2563eb',
            '--secondary-color': '#64748b',
            '--success-color': '#16a34a',
            '--danger-color': '#dc2626',
            '--warning-color': '#f59e0b',
            '--bg-color': '#ffffff',
            '--text-color': '#333333',
            '--border-color': '#e2e8f0',
            '--hover-bg': '#f8fafc',
            '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '--heading-color': '#1f2937',
            '--heading-font': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '--code-bg': '#f3f4f6',
            '--code-color': '#e11d48',
            '--link-color': '#2563eb',
            '--blockquote-bg': '#f8fafc',
            '--blockquote-border': '#3b82f6'
        });

        // 学术风格
        presets.set('academic', {
            '--primary-color': '#1f2937',
            '--secondary-color': '#4b5563',
            '--success-color': '#059669',
            '--bg-color': '#ffffff',
            '--text-color': '#1f2937',
            '--border-color': '#d1d5db',
            '--hover-bg': '#f9fafb',
            '--font-family': '"Times New Roman", Times, serif',
            '--heading-color': '#111827',
            '--heading-font': '"Times New Roman", Times, serif',
            '--code-bg': '#f3f4f6',
            '--code-color': '#7c3aed',
            '--link-color': '#1e40af',
            '--blockquote-bg': '#f9fafb',
            '--blockquote-border': '#9ca3af'
        });

        // 现代风格
        presets.set('modern', {
            '--primary-color': '#3b82f6',
            '--secondary-color': '#6366f1',
            '--success-color': '#10b981',
            '--bg-color': '#ffffff',
            '--text-color': '#1e293b',
            '--border-color': '#e2e8f0',
            '--hover-bg': '#f0f9ff',
            '--font-family': '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            '--heading-color': '#0f172a',
            '--heading-font': '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            '--code-bg': '#f1f5f9',
            '--code-color': '#0f766e',
            '--link-color': '#3b82f6',
            '--blockquote-bg': '#f0f9ff',
            '--blockquote-border': '#0ea5e9'
        });

        // 优雅风格
        presets.set('elegant', {
            '--primary-color': '#7c3aed',
            '--secondary-color': '#a78bfa',
            '--success-color': '#10b981',
            '--bg-color': '#faf5ff',
            '--text-color': '#1f2937',
            '--border-color': '#e9d5ff',
            '--hover-bg': '#f3e8ff',
            '--font-family': '"Georgia", "Times New Roman", serif',
            '--heading-color': '#4c1d95',
            '--heading-font': '"Playfair Display", "Georgia", serif',
            '--code-bg': '#ede9fe',
            '--code-color': '#7c3aed',
            '--link-color': '#7c3aed',
            '--blockquote-bg': '#f3e8ff',
            '--blockquote-border': '#a78bfa'
        });

        // 极简风格
        presets.set('minimal', {
            '--primary-color': '#000000',
            '--secondary-color': '#666666',
            '--success-color': '#333333',
            '--bg-color': '#ffffff',
            '--text-color': '#000000',
            '--border-color': '#e5e5e5',
            '--hover-bg': '#fafafa',
            '--font-family': '"Helvetica Neue", Arial, sans-serif',
            '--heading-color': '#000000',
            '--heading-font': '"Helvetica Neue", Arial, sans-serif',
            '--code-bg': '#f5f5f5',
            '--code-color': '#000000',
            '--link-color': '#000000',
            '--blockquote-bg': '#fafafa',
            '--blockquote-border': '#cccccc'
        });

        // 护眼模式主题 - 豆沙绿护眼
        presets.set('eye-care', {
            '--primary-color': '#2C7A2C',
            '--secondary-color': '#5A865A',
            '--success-color': '#1B5E1B',
            '--bg-color': '#E8EDE4',
            '--text-color': '#2C3E50',
            '--border-color': '#C8D1C3',
            '--hover-bg': '#DDE4D8',
            '--font-family': '"Georgia", "Times New Roman", serif',
            '--heading-color': '#1B2A1B',
            '--heading-font': '"Georgia", "Times New Roman", serif',
            '--code-bg': '#DDE4D8',
            '--code-color': '#2C7A2C',
            '--link-color': '#2C7A2C',
            '--blockquote-bg': '#DDE4D8',
            '--blockquote-border': '#8FBC8F',
            '--line-height': '1.8'
        });

        // 古典文学主题 - 温柔黄古典
        presets.set('classic', {
            '--primary-color': '#8B4513',
            '--secondary-color': '#A0522D',
            '--success-color': '#654321',
            '--bg-color': '#F8F3E9',
            '--text-color': '#3E2723',
            '--border-color': '#D4AF37',
            '--hover-bg': '#F5E6D3',
            '--font-family': '"Palatino", "Georgia", "Times New Roman", serif',
            '--heading-color': '#5D4037',
            '--heading-font': '"Playfair Display", "Georgia", serif',
            '--code-bg': '#F5E6D3',
            '--code-color': '#8B4513',
            '--link-color': '#8B4513',
            '--blockquote-bg': '#F5E6D3',
            '--blockquote-border': '#D4AF37',
            '--line-height': '1.7'
        });

        return presets;
    }

    /**
     * 应用主题
     * @param {string} themeName - 主题名称
     * @param {Object} customOverrides - 自定义覆盖
     */
    applyTheme(themeName = "", customOverrides = {}) {
        if (themeName == ""){
            themeName = this.currentTheme;
        }
        const preset = this.themePresets.get(themeName);
        if (!preset) {
            console.warn(`主题 "${themeName}" 不存在`);
            return;
        }

        this.currentTheme = themeName;

        // 清除之前的主题类
        document.body.className = document.body.className.replace(/theme-\w+/g, '');

        // 添加当前主题类
        document.body.classList.add(`theme-${themeName}`);

        // 应用主题变量
        const root = document.documentElement;
        const allProperties = { ...preset, ...customOverrides };

        Object.entries(allProperties).forEach(([property, value]) => {
            root.style.setProperty(property, value);
            this.customProperties.set(property, value);
        });

        // 保存主题偏好
        this.saveThemePreference(themeName, customOverrides);

        // 触发主题变更事件
        this.dispatchThemeChangeEvent(themeName, allProperties);
    }

    /**
     * 获取当前主题名称
     * @returns {string} 当前主题名称
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * 获取主题列表
     * @returns {Array<string>} 主题名称列表
     */
    getAvailableThemes() {
        return Array.from(this.themePresets.keys());
    }

    /**
     * 获取主题属性
     * @param {string} themeName - 主题名称
     * @returns {Object|null} 主题属性
     */
    getThemeProperties(themeName) {
        return this.themePresets.get(themeName) || null;
    }

    /**
     * 创建自定义主题
     * @param {string} themeName - 主题名称
     * @param {Object} properties - 主题属性
     */
    createCustomTheme(themeName, properties) {
        this.themePresets.set(themeName, { ...properties });
        this.saveCustomThemes();
    }

    /**
     * 删除自定义主题
     * @param {string} themeName - 主题名称
     */
    deleteCustomTheme(themeName) {
        if (this.isDefaultTheme(themeName)) {
            console.warn('不能删除默认主题');
            return false;
        }

        const deleted = this.themePresets.delete(themeName);
        if (deleted) {
            this.saveCustomThemes();
            if (this.currentTheme === themeName) {
                this.applyTheme('default');
            }
        }
        return deleted;
    }

    /**
     * 检查是否为默认主题
     * @param {string} themeName - 主题名称
     * @returns {boolean} 是否为默认主题
     */
    isDefaultTheme(themeName) {
        const defaultThemes = ['default', 'academic', 'modern', 'elegant', 'minimal', 'eye-care', 'classic'];
        return defaultThemes.includes(themeName);
    }

    /**
     * 更新主题属性
     * @param {string} property - CSS 属性名
     * @param {string} value - 属性值
     */
    updateProperty(property, value) {
        const root = document.documentElement;
        root.style.setProperty(property, value);
        this.customProperties.set(property, value);

        // 如果是当前主题的属性，更新主题预设
        const currentPreset = this.themePresets.get(this.currentTheme);
        if (currentPreset) {
            currentPreset[property] = value;
        }

        // 触发属性变更事件
        this.dispatchPropertyChangeEvent(property, value);
    }

    /**
     * 重置到默认主题
     */
    resetToDefault() {
        this.applyTheme('default');
    }

    /**
     * 导出主题配置
     * @param {string} themeName - 主题名称（可选）
     * @returns {Object} 主题配置
     */
    exportTheme(themeName = null) {
        if (themeName) {
            return {
                name: themeName,
                properties: this.getThemeProperties(themeName)
            };
        } else {
            // 导出所有主题
            const allThemes = {};
            this.themePresets.forEach((properties, name) => {
                allThemes[name] = properties;
            });
            return {
                themes: allThemes,
                current: this.currentTheme,
                custom: this.customProperties
            };
        }
    }

    /**
     * 导入主题配置
     * @param {Object} config - 主题配置
     */
    importTheme(config) {
        try {
            if (config.themes) {
                // 导入所有主题
                Object.entries(config.themes).forEach(([name, properties]) => {
                    this.createCustomTheme(name, properties);
                });
            } else if (config.name && config.properties) {
                // 导入单个主题
                this.createCustomTheme(config.name, config.properties);
            }

            if (config.current) {
                this.applyTheme(config.current);
            }

            return true;
        } catch (error) {
            console.error('导入主题失败:', error);
            return false;
        }
    }

    /**
     * 保存主题偏好到本地存储
     * @param {string} themeName - 主题名称
     * @param {Object} customOverrides - 自定义覆盖
     */
    saveThemePreference(themeName, customOverrides) {
        try {
            const preference = {
                theme: themeName,
                custom: customOverrides,
                timestamp: Date.now()
            };
            localStorage.setItem('md2pdf-theme-preference', JSON.stringify(preference));
        } catch (error) {
            console.warn('无法保存主题偏好:', error);
        }
    }

    /**
     * 从本地存储加载主题偏好
     */
    loadThemePreference() {
        try {
            const saved = localStorage.getItem('md2pdf-theme-preference');
            if (saved) {
                const preference = JSON.parse(saved);
                if (preference.theme) {
                    this.applyTheme(preference.theme, preference.custom || {});
                }
            }
        } catch (error) {
            console.warn('无法加载主题偏好:', error);
        }
    }

    /**
     * 保存自定义主题到本地存储
     */
    saveCustomThemes() {
        try {
            const customThemes = {};
            this.themePresets.forEach((properties, name) => {
                if (!this.isDefaultTheme(name)) {
                    customThemes[name] = properties;
                }
            });
            localStorage.setItem('md2pdf-custom-themes', JSON.stringify(customThemes));
        } catch (error) {
            console.warn('无法保存自定义主题:', error);
        }
    }

    /**
     * 从本地存储加载自定义主题
     */
    loadCustomThemes() {
        try {
            const saved = localStorage.getItem('md2pdf-custom-themes');
            if (saved) {
                const customThemes = JSON.parse(saved);
                Object.entries(customThemes).forEach(([name, properties]) => {
                    this.createCustomTheme(name, properties);
                });
            }
        } catch (error) {
            console.warn('无法加载自定义主题:', error);
        }
    }

    /**
     * 触发主题变更事件
     * @param {string} themeName - 主题名称
     * @param {Object} properties - 主题属性
     */
    dispatchThemeChangeEvent(themeName, properties) {
        const event = new CustomEvent('themechange', {
            detail: {
                themeName,
                properties
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * 触发属性变更事件
     * @param {string} property - CSS 属性名
     * @param {string} value - 属性值
     */
    dispatchPropertyChangeEvent(property, value) {
        const event = new CustomEvent('themepropertychange', {
            detail: {
                property,
                value
            }
        });
        document.dispatchEvent(event);
    }
}

// 初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.themeManager.loadCustomThemes();
    window.themeManager.loadThemePreference();
});