import React from 'react';
import { connect } from 'react-redux';

// Import Components
import KeplerGl from './KeplerGl';
import KeplerSidePanel from './KeplerSidePanel';
import PointsInPolygonModal from './PointsInPolygonModal';
import Draggable from 'react-draggable';
import UpdateModal from './modal/UpdateModal';

// Import Actions
import * as ActionTypes from '../store/actions/actionTypes';
import { loadDataToMap } from '../store/actions/dataActions';
import { toggleTopLayer, setCurrentLayerVisibleOnly, handleColorFieldByChange, upadatePointRadiusWithMapZoom } from '../store/actions/layerActions';
import { setCurrentTimeFilterEnlarged, toggleAllTimeFilterView, handleBirdsEyeFilterFieldSelect, handleVaultFilterFieldSelect, handleBirdsEyeFilterValueSelect, handleVaultFilterValueSelect } from '../store/actions/filterActions';
import { dispatchSetTopLayer, dispatchSetCurrentLayer, dispatchSetCurrentTimeFilter, dispatchToggleTimeFilterView, dispatchBirdsEyeSelectedField, dispatchVaultSelectedField, dispatchBirdsEyeSelectedFilterValue, dispatchVaultSelectedFilterValue, dispatchSetPolygonModal } from '../store/actions/dispatchActions';

const MAPBOX_API_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;

class KeplerGlMap extends React.Component {
    componentDidMount() {
        // Load Data To Map
        this.props.dispatch( loadDataToMap() );
    }

    componentDidUpdate(prevProps) {
        let prevSidePanel = prevProps.app.sidePanel;
        let currentSidePanel = this.props.app.sidePanel;

        // If Map zoom changed Set Dynamic Point Radius
        if(prevProps.keplerGl.map && prevProps.keplerGl.map.mapState.zoom !== this.props.keplerGl.map.mapState.zoom) {
            this.props.dispatch( upadatePointRadiusWithMapZoom(this.props.keplerGl.map.mapState.zoom) );
        }

        // If Top Layer Changed
        if(prevSidePanel.topLayerIndex !== currentSidePanel.topLayerIndex) {
            // Toggle Top layer
            this.props.dispatch( toggleTopLayer() );

            // Set Current Time Filter
            this.props.dispatch( dispatchSetCurrentTimeFilter(currentSidePanel.topLayerIndex) );
        }

        // If Selected Layer Change
        if(prevSidePanel.selectedLayer.id !== currentSidePanel.selectedLayer.id) {
            // Set Current Layer Visible
            this.props.dispatch( setCurrentLayerVisibleOnly(currentSidePanel.selectedLayer) );

            // If Layer 'All' not selected
            if(currentSidePanel.selectedLayer.id !== 0) {
                // Set Current Time Filter
                this.props.dispatch( dispatchSetCurrentTimeFilter(currentSidePanel.selectedLayer.layerIndex) );

            } else {
                // Set Current Time Filter
                this.props.dispatch( dispatchSetCurrentTimeFilter(currentSidePanel.topLayerIndex) );
            }
        }

        // If Current Time Filter Index Changed
        if(prevSidePanel.currentTimeFilterIndex !== currentSidePanel.currentTimeFilterIndex) {
            // If Time Filter Visibility is set to true
            if(currentSidePanel.timeFilter) {
                this.props.dispatch( setCurrentTimeFilterEnlarged(currentSidePanel.currentTimeFilterIndex) );
            }
        }

        // If Time Filter View is changed
        if(prevSidePanel.timeFilter !== currentSidePanel.timeFilter) {
            this.props.dispatch( toggleAllTimeFilterView(currentSidePanel.timeFilter) );
        }

        // If Birds Eye Field Dropdown Changed
        if(prevSidePanel.selectedField.birdsEye.id !== currentSidePanel.selectedField.birdsEye.id) {
            this.props.dispatch( handleBirdsEyeFilterFieldSelect(currentSidePanel.selectedField.birdsEye) );
        }

        // If Vault Field Dropdown Changed
        if(prevSidePanel.selectedField.vault.id !== currentSidePanel.selectedField.vault.id) {
            this.props.dispatch( handleVaultFilterFieldSelect(currentSidePanel.selectedField.vault) );
        }

        // If Birds Eye Filter Value Dropdown Changed
        if(prevSidePanel.selectedValue.birdsEye.id !== currentSidePanel.selectedValue.birdsEye.id) {
            this.props.dispatch( handleBirdsEyeFilterValueSelect(currentSidePanel.selectedValue.birdsEye) );
        }

        // If Vault Filter Value Dropdown Changed
        if(prevSidePanel.selectedValue.vault.id !== currentSidePanel.selectedValue.vault.id) {
            this.props.dispatch( handleVaultFilterValueSelect(currentSidePanel.selectedValue.vault) );
        }

        // If Color Field By Changed
        if(prevSidePanel.colorFieldBy.tableField !== currentSidePanel.colorFieldBy.tableField) {
            this.props.dispatch( handleColorFieldByChange(currentSidePanel.colorFieldBy) );
        }
    }

    // Toggle Top Layer on the Map when both layer selected
    toggleLayerOrder = topLayerIndex => {
        if(this.props.app.sidePanel.selectedLayer.id === 0) {
            // Toggle Top Layer
            this.props.dispatch( dispatchSetTopLayer(topLayerIndex) );
        }
    }

    // Select Current Layer
    handleLayerChange = selectedLayer => {
        // Dispactch Set Current layer to props
        this.props.dispatch( dispatchSetCurrentLayer(selectedLayer) );
    }

    // Toggle Time Filter View
    toggleTimeFilter = () => {
        // Dispatch Toggle Time Filter View
        this.props.dispatch( dispatchToggleTimeFilterView() );
    }

    // For Birds Eye Field Dropdown change
    handleBirdsEyeFieldChange = selectedField => {
        // Dispatch Set Birds Eye Filter Field
        this.props.dispatch( dispatchBirdsEyeSelectedField(selectedField) );
    }

    // For Birds Eye Filter Value Dropdown Change
    handleBirdsEyeFilterValueChange = selectedValue => {
        // Dispatch Set Birds Eye Filter Value
        this.props.dispatch( dispatchBirdsEyeSelectedFilterValue(selectedValue) );
    }

    // For Vault Field Dropdown change
    handleVaultFieldChange = selectedField => {
        // Dispatch Set Birds Eye Filter Field
        this.props.dispatch( dispatchVaultSelectedField(selectedField) );
    }

    // For Vault Filter Value Dropdown Change
    handleVaultFilterValueChange = selectedValue => {
        // Dispatch Set Vault Filter Value
        this.props.dispatch( dispatchVaultSelectedFilterValue(selectedValue) );
    }

    // Handle all Dropdown Change
    handleDropdownChange = (id, currentItem) => {
        // For Layer Select
        if(id === 0) {
            this.handleLayerChange(currentItem);
        }

        // For Birds Eye Field Select
        if(id === 1) {
            this.handleBirdsEyeFieldChange(currentItem);
        }

        // For Birds Eye Filter Value Select
        if(id === 2) {
            this.handleBirdsEyeFilterValueChange(currentItem);
        }

        // For Vault Field Select
        if(id === 3) {
            this.handleVaultFieldChange(currentItem);
        }

        // For Vault Filter Value Select
        if(id === 4) {
            this.handleVaultFilterValueChange(currentItem);
        }
    }

    // Open Polygon Modal
    openPolygonModal = () => {
        this.props.dispatch( dispatchSetPolygonModal(true) );
    }

    // Close Polygon Modal
    closePolygonModal = () => {
        this.props.dispatch( dispatchSetPolygonModal(false) );
    }

    // Update Modal
    closeModal = () => {
        this.props.dispatch({ type: ActionTypes.SET_IS_UPDATE_MODAL_OPEN, payload: { isUpdateModalOpen: false } });
    }

    handleModalDataSubmit = data => {
        console.log('Update Modal Submitted Data', data);
    }

    render() {
        let { width, height } = this.props;
        let { isDataLoaded, topLayerIndex, timeFilter, layerDropdownList, selectedLayer, fieldDropdownList, valueDropdownList , polygonModal, isUpdateModalOpen, updateModalInputData} = this.props.app.sidePanel;
        
        // Get Layer Data
        let { editor, layerData } = this.props.keplerGl.map ? this.props.keplerGl.map.visState : { editor: {}, layerData: {} };

        return (
            <div className='map-container' style={{ overflow: 'hidden' }}>
                <KeplerSidePanel
                    isDataLoaded={ isDataLoaded }
                    topLayerIndex={ topLayerIndex }
                    timeFilter={ timeFilter }
                    toggleTimeFilter={ this.toggleTimeFilter }
                    toggleLayerOrder={ this.toggleLayerOrder }
                    handleDropdownChange={ this.handleDropdownChange }
                    layerDropdownList={ layerDropdownList }
                    selectedLayer={ selectedLayer }
                    fieldDropdownList={ fieldDropdownList }
                    valueDropdownList={ valueDropdownList }
                    openPolygonModal={ this.openPolygonModal }
                    editor={ editor }
                />

                <KeplerGl
                    id='map'
                    mapboxApiAccessToken={ MAPBOX_API_ACCESS_TOKEN }
                    width={ width }
                    height={ height }
                />

                {
                    isUpdateModalOpen &&
                    <UpdateModal
                        closeModal={ this.closeModal }
                        handleModalData={ this.handleModalDataSubmit }
                        updateModalInputData={ updateModalInputData }
                    />
                }

                {
                    polygonModal &&
                    <Draggable>
                        <div>
                            <PointsInPolygonModal
                                polygonModal={ polygonModal }
                                closePolygonModal={ this.closePolygonModal }
                                selectedLayer={ selectedLayer }
                                layerData={ layerData }
                            />
                        </div>
                    </Draggable>
                }
            </div>
        );
    }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(KeplerGlMap);