import React from 'react';

import './css/DropdownMenuStyles.css';

class DropdownMenu extends React.Component {
    state = {
        isOpen: false,
        labelItem: null,
        typeDropdown: null,
    }

    componentDidMount() {
        const { label } = this.props.list[0];
        let firstItem = null;
        if (typeof label !== "undefined") {
            this.checkType(false);
            firstItem = label;
        } else {
            this.checkType(true);
            firstItem = this.props.list[0];
        }
        this.setState({
            labelItem: firstItem,
        });
    }

    checkType = (value) => {
        this.setState({
            typeDropdown: value,
        });
    };

    showDropdown = () => {
        this.setState({ isOpen: true });
        document.addEventListener('click', this.hideDropdown);
    };

    hideDropdown = () => {
        this.setState({ isOpen: false });
        document.removeEventListener('click', this.hideDropdown);
    };

    chooseItem = (value, label) => {
        if (this.state.labelItem !== label) {
            this.setState({
                labelItem: label,
            });
        }

        // Set Dropdown Value
        this.props.setDropdownValue(value);
    };

    renderDataDropDown = (item, index) => {
        const { value, label } = this.state.typeDropdown
            ? { value: index, label: item }
            : item;
        return (
            <li key={index} value={value} onClick={() => this.chooseItem(value, label)}>
                <a>{label}</a>
            </li>
        );
    };

    render() {
        let { list } = this.props;

        let { isOpen, labelItem } = this.state;

        return (
            <div className={ `dropdown ${ isOpen ? 'open' : '' }` }>
                <button
                    className='dropdown-toggle'
                    type='button'
                    onClick={ this.showDropdown }
                >
                    { labelItem }
                    <span className='caret'></span>
                </button>
                <ul className='dropdown-menu'>{ list.map(this.renderDataDropDown) }</ul>
            </div>
        );
    }
}

export default DropdownMenu;