import { ROLES } from './constants';

export function canCreateTransaction(role) {
  return role === ROLES.AGENT;
}

export function canManageAlerts(role) {
  return role === ROLES.OPERATOR || role === ROLES.MANAGEMENT;
}

export function canManageCases(role) {
  return role === ROLES.OPERATOR || role === ROLES.MANAGEMENT;
}

export function canViewAnalytics(role) {
  return role === ROLES.MANAGEMENT || role === ROLES.OPERATOR;
}

export function canViewProviders(role) {
  return true;
}

export function getDashboardWidgets(role) {
  switch (role) {
    case ROLES.AGENT:
      return ['transactionWidget', 'recentActivityWidget'];
    case ROLES.OPERATOR:
      return ['alertWidget', 'caseWidget', 'recentActivityWidget', 'chartWidget'];
    case ROLES.MANAGEMENT:
      return ['kpiWidget', 'chartWidget', 'liquidityWidget', 'providerWidget', 'alertWidget', 'caseWidget'];
    default:
      return [];
  }
}

export function getSidebarMenu(role) {
  const baseItems = [];

  switch (role) {
    case ROLES.AGENT:
      baseItems.push(
        { label: 'Dashboard', path: '/dashboard', icon: 'DashboardIcon' },
        { label: 'Cash In', path: '/transactions', icon: 'TransactionIcon' },
        { label: 'Cash Out', path: '/transactions', icon: 'TransactionIcon' },
        { label: 'Transactions', path: '/transactions', icon: 'TransactionIcon' },
        { label: 'Alerts', path: '/alerts', icon: 'AlertIcon' },
        { label: 'Providers', path: '/providers', icon: 'ProviderIcon' },
        { label: 'Profile', path: '/profile', icon: 'SettingsIcon' },
      );
      break;

    case ROLES.OPERATOR:
      baseItems.push(
        { label: 'Dashboard', path: '/dashboard', icon: 'DashboardIcon' },
        { label: 'Alerts', path: '/alerts', icon: 'AlertIcon' },
        { label: 'Cases', path: '/cases', icon: 'CaseIcon' },
        { label: 'Analytics', path: '/analytics', icon: 'AnalyticsIcon' },
        { label: 'Providers', path: '/providers', icon: 'ProviderIcon' },
      );
      break;

    case ROLES.MANAGEMENT:
      baseItems.push(
        { label: 'Dashboard', path: '/dashboard', icon: 'DashboardIcon' },
        { label: 'Analytics', path: '/analytics', icon: 'AnalyticsIcon' },
        { label: 'Alerts', path: '/alerts', icon: 'AlertIcon' },
        { label: 'Cases', path: '/cases', icon: 'CaseIcon' },
        { label: 'Providers', path: '/providers', icon: 'ProviderIcon' },
        { label: 'Reports', path: '/reports', icon: 'ReportIcon' },
      );
      break;

    default:
      break;
  }

  return baseItems;
}
