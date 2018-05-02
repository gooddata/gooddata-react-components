// (C) 2007-2018 GoodData Corporation
import AdvancedUseCases from './AdvancedUseCases';
import AttributeFilter from './AttributeFilter';
import BasicComponents from './BasicComponents';
import GlobalFilters from './GlobalFilters';
import Home from './Home';
import Kpi from './Kpi';
import Visualization from './Visualization';
import Execute from './Execute';
import DatePicker from './DatePicker';
import ResponsiveChart from './ResponsiveChart';
import DynamicMeasures from './DynamicMeasures';
import CustomLegend from './CustomLegend';
import ParentFilter from './ParentFilter';
import LoadingAndError from './LoadingAndError';
import MultipleDomains from './MultipleDomains';
import DrillWithExternalData from './DrillWithExternalData';
import Registration from './Registration';
import Login from './Login';

export const advancedUseCasesRoutes = [
    { path: '/advanced/global-filters', title: 'Global Filters', Component: GlobalFilters },
    { path: '/advanced/dynamic-measures', title: 'Dynamic Measures', Component: DynamicMeasures },
    { path: '/advanced/date-picker', title: 'Date Picker', Component: DatePicker },
    { path: '/advanced/responsive', title: 'Responsive Chart', Component: ResponsiveChart },
    { path: '/advanced/custom-legend', title: 'Custom Legend', Component: CustomLegend },
    { path: '/advanced/parent-filter', title: 'Parent Filter', Component: ParentFilter },
    { path: '/advanced/loading-and-error', title: 'Loading and Error Components', Component: LoadingAndError },
    { path: '/advanced/drill-with-external-data', title: 'Drill With External Data', Component: DrillWithExternalData }
];

const AdvancedUseCasesWithProps = props => AdvancedUseCases({ ...props, advancedUseCasesRoutes });

export const mainRoutes = [
    { path: '/', title: 'GoodData.UI Examples', Component: Home, exact: true },
    { path: '/basic-components', title: 'Basic Components', Component: BasicComponents },
    { path: '/kpi', title: 'KPIs', Component: Kpi },
    { path: '/visualization', title: 'Visualization', Component: Visualization },
    { path: '/attribute-filter-components', title: 'Attribute Filter Components', Component: AttributeFilter },
    { path: '/execute', title: 'Execute', Component: Execute },
    { path: '/advanced', pathMatch: 'full', redirectTo: advancedUseCasesRoutes[0].path, title: 'Advanced Use Cases', Component: AdvancedUseCasesWithProps }
];

export const hiddenPaths = [
    { path: '/multiple-domains', title: 'Multiple Domains', Component: MultipleDomains }
];

export const userRoutes = [
    { path: '/login', title: 'Login', Component: Login },
    { path: '/registration', title: 'Registration', Component: Registration }
];

export const routes = [
    ...mainRoutes,
    ...advancedUseCasesRoutes,
    ...hiddenPaths
];

const components = routes.map(r => r.component);

export const navigation = mainRoutes.map(({ path, title }) => ({
    href: path,
    title
}));

export default {
    advancedUseCasesRoutes,
    mainRoutes,
    routes,
    navigation,
    components
};
