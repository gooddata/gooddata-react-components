import AdvancedUseCases from './AdvancedUseCases';
import AttributeFilter from './AttributeFilter';
import BasicComponents from './BasicComponents';
import GlobalFilters from './GlobalFilters';
import Home from './Home';
import Kpi from './Kpi';
import Visualization from './Visualization';
import Execute from './Execute';
import DatePicker from './DatePicker';
import ResizableChart from './ResizableChart';

export const advancedUseCasesRoutes = [
    { path: '/advanced/date-picker', title: 'Date Picker', Component: DatePicker },
    { path: '/advanced/resizable', title: 'Resizable Chart', Component: ResizableChart },
    { path: '/advanced/global-filters', title: 'Global Filters', Component: GlobalFilters}
];

const AdvancedUseCasesWithProps = props => AdvancedUseCases({ ...props, advancedUseCasesRoutes });

export const mainRoutes = [
    { path: '/', title: 'Examples', Component: Home, exact: true },
    { path: '/basic-components', title: 'Basic Components', Component: BasicComponents },
    { path: '/kpi', title: 'KPIs', Component: Kpi },
    { path: '/visualization', title: 'Visualization', Component: Visualization },
    { path: '/attribute-filter-components', title: 'Attribute Filter Components', Component: AttributeFilter },
    { path: '/execute', title: 'Execute', Component: Execute },
    { path: '/advanced', title: 'Advanced Use Cases', Component: AdvancedUseCasesWithProps }
];

export const routes = [
    ...mainRoutes,
    ...advancedUseCasesRoutes
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
