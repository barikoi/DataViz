import React from 'react';

import DropdownMenu from './DropdownMenu';
import CheckboxMenu from './CheckboxMenu';

class SidePanelBody extends React.Component {
    state = {
        isLoading: false,
        dropdownList: [
            { value: 0, label: 'All' },
            { value: 6, label: 'Ward 6' },
            { value: 7, label: 'Ward 7' },
            { value: 8, label: 'Ward 8' }
        ]
	}

    render() {
        let { isLoading, dropdownList } = this.state;
        let { setWardNo, handleCheckboxChange, pointChecked, polygonChecked } = this.props;

        return (
            <React.Fragment>
                {
                    isLoading ? 
                    (   <main>
                            <div className='preloader'></div> 
                        </main> 
                    ) :
                    (   <main>
                            <p>Select Layers to view</p>
                            <CheckboxMenu
                                pointChecked={ pointChecked }
                                polygonChecked={ polygonChecked }
                                handleCheckboxChange={ handleCheckboxChange }
                            />
                            
                            <p>Select Wards to view</p>
                            <DropdownMenu list={ dropdownList } setWardNo={ setWardNo } />
                        </main>
                    )
                }
            </React.Fragment>
        );
    }
}

export default SidePanelBody;