import React from 'react';
import { connect } from 'react-redux';

import './css/CustomLayerHoverInfoStyles.css';

import * as ActionTypes from '../store/actions/actionTypes';

class CustomLayerHoverInfo extends React.Component {
    state = {
        placeId: '',
        fieldsToShow: [],
        valuesToShow: []
    }

    componentDidMount() {
        let { fields, fieldsToShow, data } = this.props;
        fieldsToShow = fieldsToShow.map(item => item.name);
        const valuesToShow = data.filter((item, index) => fieldsToShow.includes(fields[index].name));
        this.setState({ placeId: data[0], fieldsToShow, valuesToShow });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.placeId !== this.state.placeId) {
            return true;

        } else {
            if(nextProps.data[0] !== this.props.data[0]) {
                let { fields, fieldsToShow, data } = nextProps;
                fieldsToShow = fieldsToShow.map(item => item.name);
                const valuesToShow = data.filter((item, index) => fieldsToShow.includes(fields[index].name));
                this.setState({ placeId: data[0], fieldsToShow, valuesToShow });

                return true;
                
            } else {
                return false;
            }
        }
    }

    buttonOnClickHandler = event => {
        // Display Update Modal and pass point data to autofill
        const { data, fields } = this.props;
        const modalInputData = {};
        fields.forEach((item, index) => {
            modalInputData[item.name] = data[index];
        });

        switch(event.target.name) {
            case 'reTool':
                this.props.dispatch({ type: ActionTypes.SET_IS_RETOOL_MODAL_OPEN, payload: { isReToolModalOpen: true } });
                this.props.dispatch({ type: ActionTypes.SET_MODAL_INPUT_DATA, payload: { modalInputData } });
                break
            case 'update':
                this.props.dispatch({ type: ActionTypes.SET_IS_UPDATE_MODAL_OPEN, payload: { isUpdateModalOpen: true } });
                this.props.dispatch({ type: ActionTypes.SET_MODAL_INPUT_DATA, payload: { modalInputData } });
                break
            case 'delete':
                break
            case 'toVault':
                break
            default:
                break
        }
    }

    render() {
        let { fieldsToShow, valuesToShow } = this.state;
        let { layer } = this.props;

        return (
            <div className='layer-info-container'>
                <div className='layer-info-header'><h3>{ layer.config.label }</h3></div>
                
                <div className='layer-info-body'>
                    <table>
                        <tbody>
                            { fieldsToShow.map((item, index) =>
                                <tr key={ index }>
                                    <td className='row-key'>{ item }</td>
                                    <td className='row-value'>{ valuesToShow[index] }</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className='button-group'>
                    <button
                        type='button'
                        name='reTool'
                        onClick={ this.buttonOnClickHandler }
                    >Re-tool</button>
                    <button
                        type='button'
                        name='update'
                        onClick={ this.buttonOnClickHandler }
                    >Update</button>
                    <button
                        type='button'
                        name='delete'
                        onClick={ this.buttonOnClickHandler }
                    >Delete</button>
                    <button
                        type='button'
                        name='toVault'
                        onClick={ this.buttonOnClickHandler }
                    >To Vault</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isUpdateModalOpen: state.app.sidePanel.isUpdateModalOpen,
    modalInputData: state.app.sidePanel.modalInputData
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(CustomLayerHoverInfo);