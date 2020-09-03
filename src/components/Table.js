import React from 'react';
import PropTypes from 'prop-types';

import './css/TableStyles.css';

class Table extends React.Component {
    state = {
        isEmpty: false
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.rows.length !== this.props.rows.length && this.props.length === 0) {
            this.setState({ isEmpty: true });
        }
    }

    render() {
        let { caption, headers, rows } = this.props;
        let { isEmpty } = this.state;

        return (
            <div className='table-container'>
                {
                    isEmpty ?
                    (
                        <p>No data to show :-(</p>
                    ) :
                    (
                        <table>
                            <caption className='table-caption'>{ caption }</caption>

                            <thead className='table-header'>
                                <tr>
                                    { headers.map((item, index) => <th key={ index }>{ item }</th>) }
                                </tr>
                            </thead>

                            <tbody className='table-body'>
                                { rows.map((row, index) => <tr key={ index }>{ row.map((data, indexD) => <td key={ indexD }>{ data }</td>) }</tr>) }
                            </tbody>
                        </table>
                    )
                }
            </div>
        );
    }
}

Table.propTypes = {
    caption: PropTypes.string,
    headers: PropTypes.array,
    rows: PropTypes.array
};

Table.defaultProps = {
    caption: 'Table',
    headers: [],
    rows: []
};

export default Table;