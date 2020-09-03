import React from 'react';

import './css/PointsInPolygonModalStyles.css';

// Import Components
import Table from './Table';

class PointsInPolygonModal extends React.Component {
    state = {
        radioChecked: 'birds-eye-table',
        birdsEyeTable: true,
        vaultTable: false,
        birdsEyeTableHeaders: [ 'id', 'Address', 'area', 'pType', 'subType', 'longitude', 'latitude', 'uCode', 'user_id', 'created_at', 'image' ],
        birdsEyeTableRows: [],
        vaultTableHeaders: [ 'id', 'longitude', 'latitude', 'Address', 'city', 'area', 'postCode', 'subType', 'pType', 'uCode', 'user_id', 'created_at', 'updated_at', 'task_id' ],
        vaultTableRows: []
    }

    componentDidMount() {
        // Build rows from layerData
        let { layerData, selectedLayer } = this.props;
        let birdsEyeTableRows = [];
        let vaultTableRows = [];

        // Check for selected layer
        if(selectedLayer.id === 1) {
            // Build Birds Eye Table Rows
            if(layerData[0].data.length > 0) {
                birdsEyeTableRows = layerData[0].data.map(item => item.data);
            }

        } else if(selectedLayer.id === 2) {
            // Build Vault Table Rows
            if(layerData[1].data.length > 0) {
                vaultTableRows = layerData[1].data.map(item => item.data);
            }

        } else {
            // Build Birds Eye Table Rows
            if(layerData[0].data.length > 0) {
                birdsEyeTableRows = layerData[0].data.map(item => item.data);
            }

            // Build Vault Table Rows
            if(layerData[1].data.length > 0) {
                vaultTableRows = layerData[1].data.map(item => item.data);
            }
        }

        // Set State table rows
        this.setState({ birdsEyeTableRows, vaultTableRows });
    }

    radioChangeHandler = event => {
        this.setState({
            radioChecked: event.target.id,
            birdsEyeTable: event.target.id === 'birds-eye-table' ? true : false,
            vaultTable: event.target.id === 'vault-table' ? true : false
        });
    }

    render() {
        let { polygonModal, closePolygonModal } = this.props;
        let { radioChecked, birdsEyeTable, vaultTable, birdsEyeTableHeaders, birdsEyeTableRows, vaultTableHeaders, vaultTableRows } = this.state;

        return (
            <div className={ polygonModal ? "modal-overlay active" : "modal-overlay" }>
                <div className={ polygonModal ? "modal active" : "modal" }>
                    <span className="close-modal" onClick={ closePolygonModal }>
                        <svg viewBox="0 0 20 20">
                            <path fill="#000000" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                        </svg>
                    </span>
                    <div className="modal-content">
                        <div className="button-group">
                            <input
                                type="radio"
                                id="birds-eye-table"
                                name="birds-eye-table"
                                checked={ radioChecked === 'birds-eye-table' ? true : false }
                                onChange={ this.radioChangeHandler }
                            />
                            <label htmlFor="birds-eye-table">Bird's Eye</label>

                            <input 
                                type="radio"
                                id="vault-table"
                                name="vault-table"
                                checked={ radioChecked === 'vault-table' ? true : false }
                                onChange={ this.radioChangeHandler }
                            />
                            <label htmlFor="vault-table">Vault</label>
                        </div>
                        
                        { birdsEyeTable &&
                            <Table
                                caption='Birds Eye Polygon Points'
                                headers={ birdsEyeTableHeaders }
                                rows={ birdsEyeTableRows }
                            />
                        }

                        { vaultTable &&
                            <Table
                                caption='Vault Polygon Points'
                                headers={ vaultTableHeaders }
                                rows={ vaultTableRows }
                            />
                        }
                
                    </div>
                </div>
            </div>
        );
    }
}

export default PointsInPolygonModal;