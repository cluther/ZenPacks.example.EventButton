Ext.onReady(function(){

var gridId = "events_grid";
var exampleDialog;

function getSelectedEvids() {
    var grid = Ext.getCmp(gridId),
        selected = grid.selModel.getSelection();

    return Ext.pluck(
    	Ext.Array.map(selected, function(value, ind, array) {
    		return value.getData()
    	}), 'evid');
}

var showExampleDialog = function() {
	// Create the dialog if it hasn't already been created.
	if (!exampleDialog) {
		exampleDialog = new Ext.Window({
			title: 'Resolution',
			width: 500,
			autoHeight: true,
			closeAction: 'hide',
			plain: true,
			items: [{
				id: 'example-event-resolution',
				xtype: 'textfield',
				width: 480
			}],
			buttons: [{
				text: 'Cancel',
				handler: function() { exampleDialog.hide(); }
			},{
				text: 'OK',
				handler: function() {
					var evids = getSelectedEvids(),
						resolution = Ext.getCmp('example-event-resolution').getValue();

					Zenoss.remote.ExampleEventButtonRouter.setResolution({
						'evids': evids,
						'resolution': resolution
					}, function(result) {
						exampleDialog.hide();

						Ext.MessageBox.show({
							title: result.success ? 'Resolution Set' : 'Error',
							msg: result.msg,
							buttons: Ext.MessageBox.OK
						})
					});
				}
			}]
		});
	}

	// Show the dialog.
	exampleDialog.show();
};

var button = new Ext.Button({
	id: Ext.id('', 'example-event-button'),
	text: 'Resolution',
	handler: showExampleDialog
});

var setupButton = function(events_grid) {
	events_grid.child(0).add(button);

	events_grid.on('selectionchange', function(selectionmodel) {
	    var history_combo = Ext.getCmp('history_combo'),
	        archive = Ext.isDefined(history_combo) ? history_combo.getValue() === 1 : false;

	    if (archive) {
	    	// Disable button if looking at archived events.
	        button.setDisabled(true);
	    
	  	} else {
	  		// Disable button if no events, or all events are selected.
	        button.setDisabled(
	        	!selectionmodel.hasSelection() &&
	        	selectionmodel.selectState !== 'All');
	    }
	});

	events_grid.on('recreateGrid', setupButton)
};

Ext.ComponentMgr.onAvailable(gridId, setupButton);

});
