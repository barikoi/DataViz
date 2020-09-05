import { injectComponents, ModalContainerFactory, SidePanelFactory, LayerHoverInfoFactory } from 'kepler.gl/components';
import CustomLayerHoverInfo from './CustomLayerHoverInfo';

// define null factory to don not render any unneсessary components
const NullComponent = () => null;
const nullComponentFactory = () => NullComponent;

// Custom Layer Hover Info Factory
const CustomLayerHoverInfoFactory = () => CustomLayerHoverInfo;

// Remove default upload modal dialog & side panel 
const KeplerGl = injectComponents([
   [ ModalContainerFactory, nullComponentFactory ],
   [ SidePanelFactory, nullComponentFactory ],
   [ LayerHoverInfoFactory, CustomLayerHoverInfoFactory ]
]);

export default KeplerGl;