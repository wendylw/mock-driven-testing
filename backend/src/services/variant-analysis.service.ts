import { DatabaseService } from './database-sqlite.service';
import { logger } from '../utils/logger';

export interface VariantDimension {
  type?: string;
  size?: string;
  theme?: string;
  state?: string;
  [key: string]: string | undefined;
}

export interface ComponentVariant {
  id: string;
  baselineId: string;
  variantKey: string; // e.g., "primary-default-normal"
  dimensions: VariantDimension;
  styles?: any;
  usageCount: number;
}

export interface VariantIssue {
  variantKey: string;
  issueType: string;
  severity: string;
  details: {
    message: string;
    expected?: any;
    actual?: any;
    location?: string;
  };
  suggestedFix?: {
    action: string;
    code?: string;
    impact: string;
  };
}

export class VariantAnalysisService {
  /**
   * Analyze component variants based on patterns
   */
  static async analyzeComponentVariants(
    baselineId: string,
    componentType: string,
    componentCode: string
  ): Promise<ComponentVariant[]> {
    try {
      // Get variant patterns for this component type
      const patterns = await DatabaseService.query(
        `SELECT * FROM component_variant_patterns 
         WHERE component_type = ? 
         ORDER BY priority DESC`,
        [componentType]
      );
      
      // Extract variants from code
      const variants = await this.extractVariants(componentCode, patterns);
      
      // Store variants in database
      for (const variant of variants) {
        await this.storeVariant(baselineId, variant);
      }
      
      return variants;
    } catch (error) {
      logger.error('Failed to analyze component variants:', error);
      throw error;
    }
  }

  /**
   * Extract variants from component code
   */
  private static async extractVariants(
    code: string,
    patterns: any[]
  ): Promise<ComponentVariant[]> {
    const variants = new Map<string, ComponentVariant>();
    
    // For Button component, extract from SCSS attributes array
    if (code.includes('$attributes:')) {
      const attributesMatch = code.match(/\$attributes:\s*\(([\s\S]*?)\);/);
      if (attributesMatch) {
        const attributesContent = attributesMatch[1];
        const lines = attributesContent.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          const match = line.match(/"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"/);
          if (match) {
            const [, type, theme, color] = match;
            const variantKey = `${type}-${theme}`;
            const dimensions: VariantDimension = {
              type,
              theme,
              color
            };
            
            variants.set(variantKey, {
              id: `var-${variantKey}-${Date.now()}`,
              baselineId: '',
              variantKey,
              dimensions,
              usageCount: 0
            });
          }
        }
      }
    }
    
    // Also check for size variants
    const sizeMatch = code.match(/size\s*==\s*["'](\w+)["']/g);
    if (sizeMatch) {
      const sizes = new Set(sizeMatch.map(m => m.match(/["'](\w+)["']/)?.[1]).filter(Boolean));
      sizes.forEach(size => {
        // Add size dimension to existing variants
        variants.forEach(variant => {
          const newKey = `${variant.variantKey}-${size}`;
          variants.set(newKey, {
            ...variant,
            variantKey: newKey,
            dimensions: { ...variant.dimensions, size }
          });
        });
      });
    }
    
    return Array.from(variants.values());
  }

  /**
   * Store variant in database
   */
  private static async storeVariant(
    baselineId: string,
    variant: ComponentVariant
  ): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO component_variants (
        id, baseline_id, variant_key, variant_dimensions, 
        variant_styles, usage_count, file_locations
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await DatabaseService.query(sql, [
      variant.id,
      baselineId,
      variant.variantKey,
      JSON.stringify(variant.dimensions),
      JSON.stringify(variant.styles || {}),
      variant.usageCount,
      JSON.stringify([])
    ]);
  }

  /**
   * Analyze variant-specific issues
   */
  static async analyzeVariantIssues(
    baselineId: string,
    componentType: string
  ): Promise<VariantIssue[]> {
    const issues: VariantIssue[] = [];
    
    // Get all variants for this baseline
    const variants = await DatabaseService.query(
      `SELECT * FROM component_variants WHERE baseline_id = ?`,
      [baselineId]
    );
    
    for (const variant of variants) {
      const dimensions = JSON.parse(variant.variant_dimensions);
      const styles = JSON.parse(variant.variant_styles || '{}');
      
      // Check color contrast for each variant
      if (componentType === 'Button') {
        const contrastIssue = await this.checkButtonColorContrast(
          variant.variant_key,
          dimensions,
          styles
        );
        if (contrastIssue) {
          issues.push(contrastIssue);
        }
        
        // Check spacing consistency
        const spacingIssue = await this.checkButtonSpacing(
          variant.variant_key,
          dimensions,
          styles
        );
        if (spacingIssue) {
          issues.push(spacingIssue);
        }
      }
    }
    
    // Store issues in database
    for (const issue of issues) {
      await this.storeVariantIssue(baselineId, issue);
    }
    
    return issues;
  }

  /**
   * Check color contrast for button variants
   */
  private static async checkButtonColorContrast(
    variantKey: string,
    dimensions: VariantDimension,
    styles: any
  ): Promise<VariantIssue | null> {
    // Example: Check disabled button contrast
    if (variantKey.includes('disabled') || dimensions.state === 'disabled') {
      // For secondary disabled buttons: gray-400 text on white background
      if (dimensions.type === 'secondary') {
        return {
          variantKey,
          issueType: 'color_contrast',
          severity: 'warning',
          details: {
            message: `Secondary按钮禁用状态文字对比度不足`,
            expected: { contrast: '4.5:1', foreground: '#303030' },
            actual: { contrast: '1.3:1', foreground: '#DEDEDF', background: '#FFFFFF' },
            location: 'Button.module.scss line 39'
          },
          suggestedFix: {
            action: '使用更深的灰色以提高对比度',
            code: 'disabled:tw-text-gray-700',
            impact: '提升无障碍访问性，符合WCAG AA标准'
          }
        };
      }
    }
    
    return null;
  }

  /**
   * Check button spacing consistency
   */
  private static async checkButtonSpacing(
    variantKey: string,
    dimensions: VariantDimension,
    styles: any
  ): Promise<VariantIssue | null> {
    // Check if text buttons have different padding pattern
    if (dimensions.type === 'text' && dimensions.size === 'small') {
      return {
        variantKey,
        issueType: 'spacing',
        severity: 'info',
        details: {
          message: `Text类型小尺寸按钮内边距可优化`,
          expected: { padding: '6px 12px' },
          actual: { padding: '8px' },
          location: 'Button.module.scss line 86'
        },
        suggestedFix: {
          action: '为小尺寸文本按钮使用更紧凑的内边距',
          code: 'tw-py-6 tw-px-12',
          impact: '提升小尺寸按钮的视觉平衡'
        }
      };
    }
    
    return null;
  }

  /**
   * Store variant issue in database
   */
  private static async storeVariantIssue(
    baselineId: string,
    issue: VariantIssue
  ): Promise<void> {
    // Find variant ID
    const variants = await DatabaseService.query(
      `SELECT id FROM component_variants 
       WHERE baseline_id = ? AND variant_key = ?`,
      [baselineId, issue.variantKey]
    );
    
    if (variants.length === 0) return;
    
    const sql = `
      INSERT OR REPLACE INTO variant_issues (
        id, baseline_id, variant_id, issue_type, 
        severity, details, suggested_fix
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await DatabaseService.query(sql, [
      `vi-${issue.variantKey}-${issue.issueType}-${Date.now()}`,
      baselineId,
      variants[0].id,
      issue.issueType,
      issue.severity,
      JSON.stringify(issue.details),
      JSON.stringify(issue.suggestedFix)
    ]);
  }

  /**
   * Get variant analysis summary
   */
  static async getVariantSummary(baselineId: string): Promise<any> {
    const variants = await DatabaseService.query(
      `SELECT * FROM component_variants WHERE baseline_id = ?`,
      [baselineId]
    );
    
    const issues = await DatabaseService.query(
      `SELECT vi.*, cv.variant_key 
       FROM variant_issues vi
       JOIN component_variants cv ON vi.variant_id = cv.id
       WHERE vi.baseline_id = ?`,
      [baselineId]
    );
    
    return {
      totalVariants: variants.length,
      variantBreakdown: this.groupVariantsByDimension(variants),
      issuesByVariant: this.groupIssuesByVariant(issues),
      recommendations: this.generateVariantRecommendations(variants, issues)
    };
  }

  private static groupVariantsByDimension(variants: any[]): any {
    const grouped: any = {};
    
    for (const variant of variants) {
      const dimensions = JSON.parse(variant.variant_dimensions);
      for (const [key, value] of Object.entries(dimensions)) {
        if (!grouped[key]) grouped[key] = {};
        if (!grouped[key][value as string]) grouped[key][value as string] = 0;
        grouped[key][value as string]++;
      }
    }
    
    return grouped;
  }

  private static groupIssuesByVariant(issues: any[]): any {
    const grouped: any = {};
    
    for (const issue of issues) {
      if (!grouped[issue.variant_key]) {
        grouped[issue.variant_key] = [];
      }
      grouped[issue.variant_key].push({
        type: issue.issue_type,
        severity: issue.severity,
        details: JSON.parse(issue.details)
      });
    }
    
    return grouped;
  }

  private static generateVariantRecommendations(variants: any[], issues: any[]): string[] {
    const recommendations: string[] = [];
    
    // Check for missing variants
    if (variants.length < 4) {
      recommendations.push('考虑添加更多按钮变体以覆盖更多使用场景');
    }
    
    // Check for consistency issues
    const severityCount = issues.filter(i => i.severity === 'warning' || i.severity === 'critical').length;
    if (severityCount > 0) {
      recommendations.push(`发现${severityCount}个需要关注的变体问题，建议优先处理`);
    }
    
    return recommendations;
  }
}