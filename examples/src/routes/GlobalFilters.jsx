import * as React from 'react';
import { AttributeElements } from '@gooddata/react-components';
import { EmployeeItem } from '../components/GlobalFiltersComponents/EmployeeItem';
import { employeeNameIdentifier, projectId } from '../utils/fixtures';


export default class GlobalFilters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedEmployeeIndex: 0
        }

        this.selectEmployee = this.selectEmployee.bind(this);
    }

    selectEmployee(index) {
        console.log('selected index:', index);

        this.setState({
            selectedEmployeeIndex: index
        });
    }

    render() {
        const { selectedEmployeeIndex } = this.state;

        return (
            <div className="wrapper">
                { /*language=CSS*/ }
                <style jsx>{`
                    .wrapper {
                        display: grid;
                        grid-template-columns: 200px auto;
                        grid-template-rows: auto;
                        justify-content: stretch;
                        justify-items: stretch;
                        flex: 1;
                    }

                    .sidebar {
                        padding: 10px;
                    }

                    .content {
                    }


                    ul {
                        list-style-type: none;
                        padding: 0;
                    }

                    .sidebar :global(.employee-item) {
                        padding: 10px;
                        margin: 0 -10px;
                        border-right-width: 1px;
                        border-right-style: solid;
                        border-right-color: #dde4eb;
                        color: #6d7680;
                        transition: border-right-color 200ms ease-out, color 200ms ease-out;
                        cursor: pointer;
                    }

                    .sidebar :global(.employee-item:hover) {
                        border-right-color: #6d7680;
                        border-right-width: 3px;
                        color: #000000;
                    }

                    .sidebar :global(.employee-item.selected-employee-item) {
                        border-right-color: #14b2e2;
                        border-right-width: 3px;
                        color: #000000;
                    }
                `}</style>
                <div className="sidebar">
                    <AttributeElements identifier={employeeNameIdentifier} projectId={projectId} options={{ limit: 20 }}>
                        {({ validElements, error }) => {
                            if (error) {
                                return <div>{error}</div>;
                            }
                            return (
                                <ul>

                                        {validElements ? validElements.items.map((item, index) => (
                                            <EmployeeItem
                                                key={index}
                                                text={item.element.title}
                                                uri={item.element.uri}
                                                index={index}
                                                isSelected={selectedEmployeeIndex === index}
                                                onClick={this.selectEmployee} />
                                        )) : null}
                                </ul>
                            );
                        }}
                    </AttributeElements>
                </div>
                <div className="content">

                </div>
            </div>
        )
    }
}