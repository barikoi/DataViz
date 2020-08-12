import React from 'react';

import DropdownMenu from './DropdownMenu';

class SidePanelBody extends React.Component {
    state = {
        isLoading: false,
        dropdownList: [
            { value: 0, label: 'All' },
            { value: 18, label: 'Ward 18' },
            { value: 19, label: 'Ward 19' },
            { value: 20, label: 'Ward 20' },
            { value: 21, label: 'Ward 21' }
        ]
	}

    render() {
        let { isLoading, dropdownList } = this.state;
        let { displayFilteredByWardNo } = this.props;

        return (
            <React.Fragment>
                {
                    isLoading ? 
                    (   <main>
                            <div className='preloader'></div> 
                        </main> 
                    ) :
                    (   <main>
                            <p>Select Wards to view</p>
                            <DropdownMenu list={ dropdownList } displayFilteredByWardNo={ displayFilteredByWardNo } />
                        </main>
                    )
                }
            </React.Fragment>
        );
    }
}

export default SidePanelBody;