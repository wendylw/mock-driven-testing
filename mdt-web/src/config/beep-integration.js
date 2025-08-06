// BEEP Integration Configuration

export const beepIntegration = {
  // BEEP webapp repository configuration
  repository: {
    name: 'beep-v1-webapp',
    path: '/Users/wendylin/workspace/beep-v1-webapp',
    branch: 'develop'
  },
  
  // Component mappings
  components: {
    Button: {
      baselineId: 'baseline-button-beep-001',
      path: 'src/common/components/Button/index.jsx',
      displayName: 'BEEP Button',
      repository: 'beep-v1-webapp',
      stats: {
        totalUsages: 242,
        totalFiles: 94,
        primaryUsage: '69.4%',
        secondaryUsage: '23.1%',
        textUsage: '7.4%'
      }
    }
  },
  
  // Analysis configuration
  analysis: {
    // Paths to scan for component usage
    scanPaths: [
      'src/ordering',
      'src/user',
      'src/rewards',
      'src/site',
      'src/common/containers'
    ],
    
    // Files to ignore during analysis
    ignorePaths: [
      'node_modules',
      '**/*.test.*',
      '**/*.spec.*',
      '**/*.stories.*'
    ]
  },
  
  // Feature flags
  features: {
    realTimeAnalysis: true,
    codeIntelligence: true,
    visualComparison: true,
    usageTracking: true
  }
};