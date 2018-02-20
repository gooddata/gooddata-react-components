import * as React from 'react';

export class EmployeeItem extends React.Component {
    constructor(props) {
        super(props);

        this.onItemClick = this.onItemClick.bind(this);
    }

    onItemClick() {
        this.props.onClick(this.props.index);
    }

    render() {
        const {text, index, isSelected} = this.props;

        return (
            <li onClick={this.onItemClick} className={`employee-item ${isSelected ? 'selected-employee-item' : ''}`}>{text}</li>
        )
    }
}