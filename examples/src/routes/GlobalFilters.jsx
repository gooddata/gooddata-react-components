import * as React from 'react';
import { AttributeElements } from '@gooddata/react-components';
import { EmployeeItem } from '../components/GlobalFiltersComponents/EmployeeItem';
import { employeeNameIdentifier, projectId } from '../utils/fixtures';
import { Layout } from '../components/utils/Layout';
import { Loading } from '../components/utils/Loading';
import { Error } from '../components/utils/Error';

export class GlobalFiltersXXX extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedEmployeeUri: props.validElements.items[0].element.uri
        };

        this.selectEmployee = this.selectEmployee.bind(this);
        this.setDefaultSelection = this.setDefaultSelection.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.validElements !== this.props.validElements) {
            this.setDefaultSelection(nextProps);
        }
    }

    setDefaultSelection(props) {
        this.setState({
            selectedEmployeeUri: props.validElements.items[0].element.uri
        });
    }

    selectEmployee(index) {
        console.log('selected index:', index);

        this.setState({
            selectedEmployeeUri: index
        });
    }

    render() {
        const { selectedEmployeeUri } = this.state;
        const { validElements } = this.props;


        const sidebar = (<div>
            <style jsx>{`
                ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 0 0 20px 0;
                }
            `}</style>
            <ul>
                {validElements ? validElements.items.map(item => (
                    <EmployeeItem
                        key={item.element.uri}
                        label={item.element.title}
                        uri={item.element.uri}
                        isSelected={selectedEmployeeUri === item.element.uri}
                        onClick={this.selectEmployee}
                    />
                )) : null}
            </ul>
        </div>);

        return (<Layout sidebar={sidebar} >
            <h1>Profile of {validElements.items.find(item => item.element.uri === selectedEmployeeUri).element.title}</h1>
        </Layout>);
    }
}

export const GlobalFilters = () => (
    <AttributeElements identifier={employeeNameIdentifier} projectId={projectId} options={{ limit: 20 }}>
        {({ validElements, error, isLoading }) => {
            console.log('AttributeElements');
            console.log('validElements', validElements);
            console.log('error', error);
            console.log('isLoading', isLoading);
            if (error) {
                return <Error error={{ status: '400', message: error }} />;
            }
            if (isLoading) {
                return <Loading />;
            }
            return <GlobalFiltersXXX validElements={validElements} />;
        }}
    </AttributeElements>
);

export default GlobalFilters;
