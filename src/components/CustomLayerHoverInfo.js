import React from 'react';

import './css/CustomLayerHoverInfoStyles.css';

class CustomLayerHoverInfo extends React.Component {
    state = {
        fields: [],
        values: []
    }

    componentDidMount() {
        let { fields, fieldsToShow, data } = this.props;
        fieldsToShow = fieldsToShow.map(item => item.name);
        const values = data.filter((item, index) => fieldsToShow.includes(fields[index].name));
        this.setState({ fields: fieldsToShow, values });
    }

    render() {
        let { fields, values } = this.state;
        let { layer } = this.props;

        return (
            <div className='layer-info-container'>
                <div className='layer-info-header'><h3>{ layer.config.label }</h3></div>
                
                <div className='layer-info-body'>
                    <table>
                        <tbody>
                            { fields.map((item, index) =>
                                <tr key={ index }>
                                    <td className='row-key'>{ item }</td>
                                    <td className='row-value'>{ values[index] }</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className='button-group'>
                    <button
                        type='button'
                        onClick={ () => window.alert('Re-tool ' + values[0]) }
                    >Re-tool</button>
                    <button
                        type='button'
                        onClick={ () => window.alert('Update ' + values[0]) }
                    >Update</button>
                    <button
                        type='button'
                        onClick={ () => window.alert('Delete ' + values[0]) }
                    >Delete</button>
                    <button
                        type='button'
                        onClick={ () => window.alert('To Vault ' + values[0]) }
                    >To Vault</button>
                </div>
            </div>
        );
    }
}

export default CustomLayerHoverInfo;