import React from 'react';

class CheckboxMenu extends React.Component {
    render() {
        let { timeFilter, toggleTimeFilter } = this.props;

        return (
            <div className='checkbox-menu' style={{ display: 'block' }}>
                <input
                    type="checkbox"
                    id="time-filter"
                    name="timeFilter"
                    value="time-filter"
                    checked={ timeFilter ? true : false }
                    onChange={ toggleTimeFilter }
                />
                <label htmlFor="time-filter">Time Filter</label>
            </div>
        );
    }
}

export default CheckboxMenu;