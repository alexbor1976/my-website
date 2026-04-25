/** @type {Main} */
let main = null;

$(document).ready(function () {
    // Instantiate the ZoomPan class with an initial scale
    const zoomPan = new ZoomPan($('#zoom-pan-container'), $('#zoom-pan-content'), 0.5);

    // this.serviceWindow = new ServiceWindow();
    main = new Main();
});

class Main extends Root {
    /** @type {BlockTOStatePanel} */
    blockTOStatePanel = null;
    /** @type {BlockTOCommunicationDevice} */
    blockTOCommunicationDevice = null;
    /** @type {BlockTOPanel} */
    blockTOPanel = null;

    constructor() {
        super('main_id');
        this.blockTOCommunicationDevice = new BlockTOCommunicationDevice('block_to_communication_device_id', this);
        this.blockTOStatePanel = new BlockTOStatePanel('block_to_state_panel_id', this);
        // this.blockTOPanel = new BlockTOPanel('none');
        this.blockTOPanel = new BlockTOPanel('block_to_panel_id', this);
        this.powerBlock = new PowerBlock('powerBlockId', this);
    }

    switchRange(position) {
        // console.log('Main, switchRange', position);
        this.blockTOPanel.switchRange(position);
    }

}

// const canvas = document.getElementById('ppi_id_canvas');  // Replace with your canvas ID
// const ctx = canvas.getContext('2d');
// ctx.getImageData(0, 0, canvas.width, canvas.height);