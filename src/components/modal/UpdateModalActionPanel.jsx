import React from 'react'

import './css/UpdateModalActionPanelStyles.css'

class UpdateModalActionPanel extends React.PureComponent {
    render() {
        return (
            <div className='action-panel'>
                { this.props.children }
            </div>
        )
    }
}

export default UpdateModalActionPanel