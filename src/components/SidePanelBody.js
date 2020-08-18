import React from 'react';

import DropdownMenu from './DropdownMenu';
import Spinner from './Spinner';

class SidePanelBody extends React.Component {
    state = {
        dropdownList: [
            { value: 0, label: 'All' },
            { value: 1, label: 'Chittagong' },
            { value: 2, label: 'Sylhet' }
        ]
	}

	handleLayerSelect = e => {
		e.preventDefault();
    }

    render() {
        let { dropdownList } = this.state;
        let { isDataLoaded, setDropdownValue } = this.props;

        return (
            <React.Fragment>
                {
                    isDataLoaded ?
                    (   <main>
                            <p>Select Wards to view</p>
                            <DropdownMenu list={ dropdownList } setDropdownValue={ setDropdownValue } />
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