import React from 'react';

class CheckboxMenu extends React.Component {
    render() {
        const { pointChecked, polygonChecked } = this.props;

        return (
            <div className='checkbox-menu' style={{ display: 'block' }}>
                <input
                    type="checkbox"
                    id="point-layer"
                    name="pointChecked"
                    value="point"
                    checked={ pointChecked ? true : false }
                    onChange={ e => this.props.handleCheckboxChange(e.target.name) }
                />
                <label htmlFor="point-layer">Point</label>

                <input
                    type="checkbox"
                    id="polygon-layer"
                    name="polygonChecked"
                    value="polygon"
                    checked={ polygonChecked ? true : false }
                    onChange={ e => this.props.handleCheckboxChange(e.target.name) }
                    style={{ marginLeft: '10px' }}
                />
                <label htmlFor="polygon-layer">Polygon</label>
            </div>
        );
    }
}

export default CheckboxMenu;