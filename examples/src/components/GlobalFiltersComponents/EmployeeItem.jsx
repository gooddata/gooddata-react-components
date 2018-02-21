import * as React from 'react';
import PropTypes from 'prop-types';


export class EmployeeItem extends React.Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired,
        isSelected: PropTypes.bool,
        onClick: PropTypes.func.isRequired
    };

    static defaultProps = {
        isSelected: false
    };

    constructor(props) {
        super(props);

        this.onItemClick = this.onItemClick.bind(this);
    }

    onItemClick() {
        this.props.onClick(this.props.uri, this.props.index);
    }

    render() {
        const { label, isSelected } = this.props;

        return (
            <li className="employee-item-wrap" >
                <style jsx>{`
                    .employee-item-wrap {
                        margin: 0 -20px 0 -10px;
                        position: relative;
                    }
                    .employee-item {
                        display: block;
                        text-align: left;
                        width: 100%;
                        background: transparent none;
                        padding: 10px 20px 10px 10px;
                        border: 0;
                        border-right-width: 1px;
                        border-right-style: solid;
                        border-right-color: #dde4eb;
                        color: #6d7680;
                        transition: border-right-color 200ms ease-out, color 200ms ease-out;
                        cursor: pointer;
                    }

                    .employee-item:hover {
                        border-right-color: #6d7680;
                        border-right-width: 3px;
                        color: #000000;
                    }

                    .employee-item.selected-employee-item {
                        border-right-color: #14b2e2;
                        border-right-width: 3px;
                        color: #000000;
                    }
                `}</style>
                <button onClick={this.onItemClick} className={`employee-item ${isSelected ? 'selected-employee-item' : ''}`}>
                    {label}
                </button>
            </li>
        );
    }
}
