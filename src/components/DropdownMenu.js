import React from 'react';

import './css/DropdownMenuStyles.css';

class DropdownMenu extends React.Component {
    state = {
        isOpen: false,
        currentItem: {}
    }

    componentDidMount() {
        if(!this.props.list) {
            return;
        } else if(this.props.list.length === 0) {
            return;
        } else {
            const listTop = this.props.list[0];
            this.setState({
                currentItem: listTop,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // If List props is empty
        if(prevProps.list.length !== 0 && this.props.list.length === 0) {
            this.setState({ currentItem: { id: 0, label: 'None' } });
        }

        // If Props list is changed
        if((prevProps.list && prevProps.list.length > 0) && (this.props.list && this.props.list.length > 0) && (prevProps.list[0].label !== this.props.list[0].label)) {
            this.setState({ currentItem: this.props.list[0] });
        }

        // If Current Item is Changed
        if(prevState.currentItem.id !== this.state.currentItem.id) {
            // Handle Dropdown Change
            this.props.handleDropdownChange(this.props.id, this.state.currentItem);
        }
    }

    showDropdown = () => {
        this.setState({ isOpen: true });
        document.addEventListener('click', this.hideDropdown);
    };

    hideDropdown = () => {
        this.setState({ isOpen: false });
        document.removeEventListener('click', this.hideDropdown);
    };

    chooseItem = (item) => {
        if (this.state.currentItem.label !== item.label) {
            this.setState({
                currentItem: item,
            });
        }
    };

    renderDataDropDown = (item, index) => {
        const newItem = item.id
            ?
            item
            : { ...item, id: index };

        return (
            <li key={ index } value={ newItem.id } onClick={ () => this.chooseItem(newItem) }>
                <a>{ newItem.label }</a>
            </li>
        );
    };

    render() {
        let { list } = this.props;

        let { isOpen, currentItem } = this.state;

        return (
            <div className={ `dropdown ${ isOpen ? 'open' : '' }` }>
                <button
                    className='dropdown-toggle'
                    type='button'
                    onClick={ list.length > 0 ? this.showDropdown : undefined }
                >
                    { currentItem.label ? currentItem.label : 'None' }
                    <span className='caret'></span>
                </button>
                <ul className='dropdown-menu'>{ list.map(this.renderDataDropDown) }</ul>
            </div>
        );
    }
}

export default DropdownMenu;