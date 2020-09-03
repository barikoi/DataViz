import React from 'react';

import TopLayerSelectMenu from './TopLayerSelectMenu';
import DropdownMenu from './DropdownMenu';
import CheckboxMenu from './CheckboxMenu';
import Spinner from './Spinner';

class SidePanelBody extends React.Component {

    render() {
        let { isDataLoaded, topLayerIndex, timeFilter, toggleTimeFilter, toggleLayerOrder, handleDropdownChange, layerDropdownList, selectedLayer, fieldDropdownList, valueDropdownList, openPolygonModal, editor } = this.props;

        return (
            <React.Fragment>
                {
                    isDataLoaded ?
                    (   <main>
                            { selectedLayer.id === 0 &&
                                <TopLayerSelectMenu topLayerIndex={ topLayerIndex } toggleLayerOrder={ toggleLayerOrder } />
                            }

                            <CheckboxMenu timeFilter={ timeFilter } toggleTimeFilter={ toggleTimeFilter } />
                            
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '15px' }}>
                                <p>Layer</p>
                                <DropdownMenu id={ 0 } key={ 0 } list={ layerDropdownList } handleDropdownChange={ handleDropdownChange }/>
                            </div>
                            
                            <div style={{ display: selectedLayer.id !== 2 ? 'block' : 'none' }}>
                                <p style={{ margin: '0', marginTop: '15px' }}>Bird's Eye Layer</p>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <p>Field</p>
                                    <DropdownMenu id={ 1 } key={ 1 } list={ fieldDropdownList.birdsEye } handleDropdownChange={ handleDropdownChange }/>

                                    <p>Value</p>
                                    <DropdownMenu id={ 2 } key={ 2 } list={ valueDropdownList.birdsEye } handleDropdownChange={ handleDropdownChange }/>
                                </div>
                            </div>
                            
                            <div style={{ display: selectedLayer.id !== 1 ? 'block' : 'none' }}>
                                <p style={{ margin: '0', marginTop: '15px' }}>Vault Layer</p>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <p>Field</p>
                                    <DropdownMenu id={ 3 } key={ 3 } list={ fieldDropdownList.vault } handleDropdownChange={ handleDropdownChange }/>

                                    <p>Value</p>
                                    <DropdownMenu id={ 4 } key={ 4 } list={ valueDropdownList.vault } handleDropdownChange={ handleDropdownChange }/>
                                </div>
                            </div>

                            {
                                editor.selectedFeature && editor.features.length === 0 &&
                                <div>
                                    <button
                                        className='polygon-modal'
                                        type='button'
                                        onClick={ openPolygonModal }
                                    >Points In Polygon</button>
                                </div>
                            }
                            
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