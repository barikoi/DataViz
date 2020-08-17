import React from 'react';

import DropdownMenu from './DropdownMenu';
import CheckboxMenu from './CheckboxMenu';
import Spinner from './Spinner';

class SidePanelBody extends React.Component {
    state = {
        dropdownList: [
            { value: 0, label: 'All' },
            { value: 18, label: 'Ward 18' },
            { value: 19, label: 'Ward 19' },
            { value: 20, label: 'Ward 20' },
            { value: 21, label: 'Ward 21' }
        ]
	}

    render() {
        let { dropdownList } = this.state;
        let { isDataLoaded, setWardNo, handleCheckboxChange, pointChecked, polygonChecked } = this.props;

        return (
            <React.Fragment>
                {
                    isDataLoaded ?
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
                        ) :
                        (   <main>
                                <Spinner />
                            </main> 
                        )
                }
            </React.Fragment>
        );
    }
}

export default SidePanelBody;