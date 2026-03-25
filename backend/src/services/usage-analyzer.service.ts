import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
import { logger } from '../utils/logger';

export interface ComponentUsage {
  componentName: string;
  componentPath: string;
  usageCount: number;
  usageLocations: Array<{
    file: string;
    line: number;
    type: 'import' | 'jsx' | 'reference';
  }>;
  lastChecked: Date;
}

export class UsageAnalyzerService {
  /**
   * 分析组件在项目中的使用情况
   */
  async analyzeComponentUsage(
    componentName: string,
    componentPath: string,
    projectPath: string
  ): Promise<ComponentUsage> {
    const usage: ComponentUsage = {
      componentName,
      componentPath,
      usageCount: 0,
      usageLocations: [],
      lastChecked: new Date()
    };

    try {
      // 获取所有需要扫描的文件
      const files = await this.getSourceFiles(projectPath);
      
      for (const file of files) {
        // 跳过组件自身的文件
        if (file === componentPath) continue;
        
        const fileUsage = await this.analyzeFileForUsage(file, componentName);
        if (fileUsage.length > 0) {
          usage.usageLocations.push(...fileUsage);
          usage.usageCount += fileUsage.length;
        }
      }
      
      logger.info(`Component usage analysis completed for ${componentName}: ${usage.usageCount} usages found`);
    } catch (error) {
      logger.error('Error analyzing component usage:', error);
    }
    
    return usage;
  }

  /**
   * 获取项目中的所有源文件
   */
  private async getSourceFiles(projectPath: string): Promise<string[]> {
    const patterns = [
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx'
    ];
    
    const ignorePatterns = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.test.*',
      '**/*.spec.*',
      '**/*.stories.*'
    ];
    
    const files: string[] = [];
    
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: projectPath,
        absolute: true,
        ignore: ignorePatterns
      });
      files.push(...matches);
    }
    
    return files;
  }

  /**
   * 分析单个文件中的组件使用情况
   */
  private async analyzeFileForUsage(
    filePath: string,
    componentName: string
  ): Promise<Array<{ file: string; line: number; type: 'import' | 'jsx' | 'reference' }>> {
    const usages: Array<{ file: string; line: number; type: 'import' | 'jsx' | 'reference' }> = [];
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // 检查 import 语句
        if (this.isImportStatement(line, componentName)) {
          usages.push({
            file: filePath,
            line: index + 1,
            type: 'import'
          });
        }
        
        // 检查 JSX 使用
        if (this.isJSXUsage(line, componentName)) {
          usages.push({
            file: filePath,
            line: index + 1,
            type: 'jsx'
          });
        }
        
        // 检查其他引用（如传递给其他函数）
        if (this.isReference(line, componentName)) {
          usages.push({
            file: filePath,
            line: index + 1,
            type: 'reference'
          });
        }
      });
    } catch (error) {
      logger.error(`Error analyzing file ${filePath}:`, error);
    }
    
    return usages;
  }

  /**
   * 检查是否是 import 语句
   */
  private isImportStatement(line: string, componentName: string): boolean {
    // 匹配各种 import 格式
    const importPatterns = [
      // import Component from './Component'
      new RegExp(`import\\s+${componentName}\\s+from`),
      // import { Component } from './Component'
      new RegExp(`import\\s*{[^}]*\\b${componentName}\\b[^}]*}\\s*from`),
      // import { Something as Component } from './Something'
      new RegExp(`import\\s*{[^}]*\\bas\\s+${componentName}\\b[^}]*}\\s*from`),
      // const Component = require('./Component')
      new RegExp(`const\\s+${componentName}\\s*=\\s*require\\s*\\(`),
      // const { Component } = require('./Component')
      new RegExp(`const\\s*{[^}]*\\b${componentName}\\b[^}]*}\\s*=\\s*require\\s*\\(`)
    ];
    
    return importPatterns.some(pattern => pattern.test(line));
  }

  /**
   * 检查是否是 JSX 使用
   */
  private isJSXUsage(line: string, componentName: string): boolean {
    // 匹配 JSX 标签
    const jsxPatterns = [
      // <Component />
      new RegExp(`<${componentName}\\s*[^>]*/?>`),
      // <Component>
      new RegExp(`<${componentName}\\s*[^>]*>`),
      // </Component>
      new RegExp(`</${componentName}>`),
    ];
    
    return jsxPatterns.some(pattern => pattern.test(line));
  }

  /**
   * 检查是否是其他形式的引用
   */
  private isReference(line: string, componentName: string): boolean {
    // 排除 import 和 JSX 使用
    if (this.isImportStatement(line, componentName) || this.isJSXUsage(line, componentName)) {
      return false;
    }
    
    // 检查是否作为变量、函数参数等使用
    const referencePattern = new RegExp(`\\b${componentName}\\b`);
    return referencePattern.test(line);
  }

  /**
   * 批量分析多个组件的使用情况
   */
  async analyzeMultipleComponents(
    components: Array<{ name: string; path: string }>,
    projectPath: string
  ): Promise<Map<string, ComponentUsage>> {
    const usageMap = new Map<string, ComponentUsage>();
    
    for (const component of components) {
      const usage = await this.analyzeComponentUsage(
        component.name,
        component.path,
        projectPath
      );
      usageMap.set(component.name, usage);
    }
    
    return usageMap;
  }

  /**
   * 获取未使用的组件列表
   */
  async findUnusedComponents(
    components: Array<{ name: string; path: string }>,
    projectPath: string
  ): Promise<Array<{ name: string; path: string }>> {
    const usageMap = await this.analyzeMultipleComponents(components, projectPath);
    
    return components.filter(component => {
      const usage = usageMap.get(component.name);
      return usage && usage.usageCount === 0;
    });
  }
}

export const usageAnalyzerService = new UsageAnalyzerService();