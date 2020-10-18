import React from 'react';
import { connect } from 'react-redux';

// Import Components
import KeplerGl from './KeplerGl';
import KeplerSidePanel from './KeplerSidePanel';
import PointsInPolygonModal from './PointsInPolygonModal';
import Draggable from 'react-draggable';
import Modal from './modal/Modal';
import ConfirmModal from './modal/ConfirmModal';
import SearchBar from './SearchBar';

// Import Actions
import * as ActionTypes from '../store/actions/actionTypes';
import { loadDataToMap, updateBirdsEyePlace, updateVaultPlace, deleteBirdsEyePlace, deleteVaultPlace, moveToPlaces, movePlaceToVault, reToolToPlaces, reToolToVault } from '../store/actions/dataActions';
import { toggleTopLayer, setCurrentLayerVisibleOnly, handleColorFieldByChange, upadatePointRadiusWithMapZoom } from '../store/actions/layerActions';
import { setCurrentTimeFilterEnlarged, toggleAllTimeFilterView, handleBirdsEyeFilterFieldSelect, handleVaultFilterFieldSelect, handleBirdsEyeFilterValueSelect, handleVaultFilterValueSelect } from '../store/actions/filterActions';
import { dispatchSetTopLayer, dispatchSetCurrentLayer, dispatchSetCurrentTimeFilter, dispatchToggleTimeFilterView, dispatchBirdsEyeSelectedField, dispatchVaultSelectedField, dispatchBirdsEyeSelectedFilterValue, dispatchVaultSelectedFilterValue, dispatchSetPolygonModal } from '../store/actions/dispatchActions';
import { highlightPlaceOnSearch } from '../store/actions/mapActions';

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

    //////////////////////////
    // Modal Funtionalities //
    //////////////////////////
    
    // Hide Update Modal
    hideUpdateModal = () => {
        this.props.dispatch({ type: ActionTypes.SET_IS_UPDATE_MODAL_OPEN, payload: { isUpdateModalOpen: false } });
        this.props.dispatch({ type: ActionTypes.SET_LAYER_DATA_ID, payload: { layerDataId: '' } });
        this.props.dispatch({ type: ActionTypes.SET_MODAL_INPUT_DATA, payload: { modalInputData: null } });
    }

    // Hide ReTool Modal
    hideReToolModal = () => {
        this.props.dispatch({ type: ActionTypes.SET_IS_RETOOL_MODAL_OPEN, payload: { isReToolModalOpen: false } });
        this.props.dispatch({ type: ActionTypes.SET_LAYER_DATA_ID, payload: { layerDataId: '' } });
        this.props.dispatch({ type: ActionTypes.SET_MODAL_INPUT_DATA, payload: { modalInputData: null } });
    }

    // Hide Delete Modal
    hideDeleteModal = () => {
        this.props.dispatch({ type: ActionTypes.SET_IS_DELETE_MODAL_OPEN, payload: { isDeleteModalOpen: false } });
        this.props.dispatch({ type: ActionTypes.SET_LAYER_DATA_ID, payload: { layerDataId: '' } });
        this.props.dispatch({ type: ActionTypes.SET_MODAL_INPUT_DATA, payload: { modalInputData: null } });
    }

    // Hide To Vault Modal
    hideToVaultModal = () => {
        this.props.dispatch({ type: ActionTypes.SET_IS_TO_VAULT_MODAL_OPEN, payload: { isToVaultModalOpen: false } });
        this.props.dispatch({ type: ActionTypes.SET_LAYER_DATA_ID, payload: { layerDataId: '' } });
        this.props.dispatch({ type: ActionTypes.SET_MODAL_INPUT_DATA, payload: { modalInputData: null } });
    }

    // Hide To Place Modal
    hideToPlaceModal = () => {
        this.props.dispatch({ type: ActionTypes.SET_IS_TO_PLACE_MODAL_OPEN, payload: { isToPlaceModalOpen: false } });
        this.props.dispatch({ type: ActionTypes.SET_LAYER_DATA_ID, payload: { layerDataId: '' } });
        this.props.dispatch({ type: ActionTypes.SET_MODAL_INPUT_DATA, payload: { modalInputData: null } });
    }

    // Update Modal Confirm Function
    onConfirmUpdateModal = place => {
        const { layerDataId } = this.props.app.sidePanel
        
        // If confirmed from Birds-eye point layer
        if(layerDataId === 'birds_eye_point_data') {
            this.props.dispatch( updateBirdsEyePlace(place) )
            this.hideUpdateModal()

        } else if(layerDataId === 'vault_point_data') {
            // If confirmed from Vault point layer
            this.props.dispatch( updateVaultPlace(place) )
            this.hideUpdateModal()
        }
    }

    // Re-Tool Modal Confirm Function
    onConfirmReToolModal = place => {
        const { layerDataId } = this.props.app.sidePanel

        // Check for invalid values
        Object.keys(place).forEach(key => {
            if(!place[key]) {
                delete place[key]
            }
        })
        
        // If confirmed from Birds-eye point layer
        if(layerDataId === 'birds_eye_point_data') {
            this.props.dispatch( reToolToPlaces(place) )
            this.hideReToolModal()

        } else if(layerDataId === 'vault_point_data') {
            // If confirmed from Vault point layer
            this.props.dispatch( reToolToVault(place) )
            this.hideReToolModal()
        }
    }

    // Delete Modal Confirm Function
    onConfirmDeleteModal = () => {
        const { layerDataId, modalInputData } = this.props.app.sidePanel
        
        // If confirmed from Birds-eye point layer
        if(layerDataId === 'birds_eye_point_data') {
            this.props.dispatch( deleteBirdsEyePlace(modalInputData.uCode) )
            this.hideDeleteModal()

        } else if(layerDataId === 'vault_point_data') {
            // If confirmed from Vault point layer
            this.props.dispatch( deleteVaultPlace(modalInputData.uCode) )
            this.hideDeleteModal()
        }
    }

    // To Vault Modal Confirm Function
    onConfirmToVaultModal = () => {
        const { modalInputData } = this.props.app.sidePanel

        this.props.dispatch( movePlaceToVault(modalInputData.uCode, modalInputData.task_id) )
        this.hideToVaultModal()
    }

    // To Place Modal Confirm Function
    onConfirmToPlaceModal = () => {
        const { modalInputData } = this.props.app.sidePanel

        this.props.dispatch( moveToPlaces(modalInputData.uCode) )
        this.hideToPlaceModal()
    }

    // Handle Submission from Map Search
    handleMapSearchSubmission = selectedPlace => {
        this.props.dispatch( highlightPlaceOnSearch(selectedPlace) )
    }

    render() {
        let { width, height } = this.props;
        let { isDataLoaded, topLayerIndex, timeFilter, layerDropdownList, selectedLayer, fieldDropdownList, valueDropdownList , polygonModal, isUpdateModalOpen, isReToolModalOpen, isDeleteModalOpen, isToVaultModalOpen, isToPlaceModalOpen, modalInputData } = this.props.app.sidePanel;
        
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

                { isDataLoaded &&
                    <SearchBar handleMapSearchSubmission={ this.handleMapSearchSubmission } />
                }

                { isUpdateModalOpen &&
                    <Modal
                        isModalShown={ isUpdateModalOpen }
                        onCloseComplete={ this.hideUpdateModal }
                        title='Update Place'
                        confirmLabel='Update'
                        onConfirm={ this.onConfirmUpdateModal }
                        place={ modalInputData }
                    />
                }

                { isReToolModalOpen &&
                    <Modal
                        isModalShown={ isReToolModalOpen }
                        onCloseComplete={ this.hideReToolModal }
                        title='Re-Tool Place'
                        confirmLabel='Re-Tool'
                        onConfirm={ this.onConfirmReToolModal }
                        place={ modalInputData }
                    />
                }

                { isDeleteModalOpen &&
                    <ConfirmModal
                        isModalShown={ isDeleteModalOpen }
                        onCloseComplete={ this.hideDeleteModal }
                        title='Delete Place'
                        confirmLabel='Delete'
                        onConfirm={ this.onConfirmDeleteModal }
                        place={ modalInputData }
                        modalContent='Are you sure you want to Delete this place?'
                    />
                }

                { isToVaultModalOpen &&
                    <ConfirmModal
                        isModalShown={ isToVaultModalOpen }
                        onCloseComplete={ this.hideToVaultModal }
                        title='To Vault Action'
                        confirmLabel='To Vault'
                        onConfirm={ this.onConfirmToVaultModal }
                        place={ modalInputData }
                        modalContent='Are you sure you want to Vault this place?'
                    />
                }

                { isToPlaceModalOpen &&
                    <ConfirmModal
                        isModalShown={ isToPlaceModalOpen }
                        onCloseComplete={ this.hideToPlaceModal }
                        title='To Place Action'
                        confirmLabel='To Place'
                        onConfirm={ this.onConfirmToPlaceModal }
                        place={ modalInputData }
                        modalContent='Are you sure you want to Add this place?'
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