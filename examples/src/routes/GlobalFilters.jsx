import * as React from 'react';
import { AttributeElements } from '@gooddata/react-components';
import { employeeNameIdentifier, projectId } from '../utils/fixtures';


export default class GlobalFilters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedEmployeeIndex: 0
        }
    }

    selectEmployee() {
        
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
                        min-width: 200px;
                        padding: 5px;
                        background: #000;
                    }

                    .content {
                        width: 100%;
                        background: gray;
                    }

                    .selected {
                        background: white;
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
                                            <li
                                                key={item.element.uri}
                                                uri={item.element.uri}
                                                className={selectedEmployeeIndex === index ? 'selected' : ''}
                                                onClick={this.selectEmployee}
                                            >{item.element.title}</li>
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