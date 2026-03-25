import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import MockList from '../pages/Mocks';
import ScenarioList from '../pages/Scenarios';
import Monitor from '../pages/Monitor';

// Pure Components
import PureComponentsAnalysis from '../pages/ComponentsTesting/PureComponents/Analysis';
import PureComponentsBranchResults from '../pages/ComponentsTesting/PureComponents/BranchResults';
import PureComponentsBranchDetail from '../pages/ComponentsTesting/PureComponents/BranchResults/Detail';
import PureComponentsBaselines from '../pages/ComponentsTesting/PureComponents/Baselines';

// Business Components  
import BusinessComponentsScenarios from '../pages/ComponentsTesting/BusinessComponents/Scenarios';

// Integration Components
import IntegrationComponentsE2E from '../pages/ComponentsTesting/IntegrationComponents/E2E';

// Components Testing
import ComponentsTesting from '../pages/ComponentsTesting';
import ComponentsTestingOverview from '../pages/ComponentsTesting/Overview';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><Dashboard /></AppLayout>,
  },
  {
    path: '/mocks',
    element: <AppLayout><MockList /></AppLayout>,
  },
  {
    path: '/scenarios',
    element: <AppLayout><ScenarioList /></AppLayout>,
  },
  {
    path: '/monitor',
    element: <AppLayout><Monitor /></AppLayout>,
  },
  
  // Components Testing
  {
    path: '/components-testing',
    element: <AppLayout><ComponentsTesting /></AppLayout>,
  },
  {
    path: '/components-testing/overview',
    element: <AppLayout><ComponentsTestingOverview /></AppLayout>,
  },
  
  // Pure Components Routes
  {
    path: '/pure-components/analysis',
    element: <AppLayout><PureComponentsAnalysis /></AppLayout>,
  },
  {
    path: '/pure-components/branch-results',
    element: <AppLayout><PureComponentsBranchResults /></AppLayout>,
  },
  {
    path: '/pure-components/branch-results/:id',
    element: <AppLayout><PureComponentsBranchDetail /></AppLayout>,
  },
  {
    path: '/pure-components/baselines',
    element: <AppLayout><PureComponentsBaselines /></AppLayout>,
  },
  
  // Business Components Routes
  {
    path: '/business-components/scenarios',
    element: <AppLayout><BusinessComponentsScenarios /></AppLayout>,
  },
  
  // Integration Components Routes
  {
    path: '/integration-components/e2e',
    element: <AppLayout><IntegrationComponentsE2E /></AppLayout>,
  },
  
  // Backward Compatibility (redirect old routes)
  {
    path: '/analysis',
    element: <AppLayout><PureComponentsAnalysis /></AppLayout>,
  },
  {
    path: '/branch-analysis',
    element: <AppLayout><PureComponentsBranchResults /></AppLayout>,
  },
  {
    path: '/branch-analysis/:id',
    element: <AppLayout><PureComponentsBranchDetail /></AppLayout>,
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;