import React from 'react';

class TopLayerSelectMenu extends React.Component {
    handleChange = event => {
        this.props.toggleLayerOrder(parseInt(event.target.value));
    }

    render() {
        let { topLayerIndex } = this.props; 

        return (
            <div className="top-layer-select-menu" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <p>Top Layer: </p>

                <input
                    type="radio"
                    id="birds-eye"
                    name="birds-eye"
                    value={ 0 }
                    checked={ topLayerIndex === 0 }
                    onChange={ this.handleChange }
                />
                <label htmlFor="birds-eye">Bird's Eye</label>

                <input 
                    type="radio"
                    id="vault"
                    name="vault"
                    value={ 1 }
                    checked={ topLayerIndex === 1 }
                    onChange={ this.handleChange }
                />
                <label htmlFor="vault">Vault</label>
            </div>
        );
    }
}

export default TopLayerSelectMenu;