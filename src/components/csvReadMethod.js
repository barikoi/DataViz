import newPlacesCSV from '../resources/demo.csv';
import Papa from 'papaparse';
import { processRowObject } from 'kepler.gl/processors';
import { addDataToMap } from 'kepler.gl/actions';

const csvAddData = () => {
    new Promise(resolve => {
        Papa.parse(newPlacesCSV, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: results => {
                resolve(results);
            }
        });
    })
    .then(results => {
        const sampleConfig = {
            visState: {
              filters: [
                {
                  id: 'demo',
                  dataId: 'demo_data',
                  name: 'demo_data',
                  type: 'points',
                  enlarged: true
                }
              ]
            }
        };

        this.props.dispatch(
            addDataToMap({
              datasets: {
                info: {
                  label: 'Demo Data',
                  id: 'demo_data'
                },
                data: processRowObject(results.data)
              },
              option: {
                centerMap: true,
                readOnly: false
              },
              config: sampleConfig
            })
        );
    })
}

export default csvAddData;