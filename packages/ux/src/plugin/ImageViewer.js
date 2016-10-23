Ext.define('Ext.ux.plugin.ImageViewer', {
	extend: 'Ext.AbstractPlugin',
	requires: [
		'Ext.ux.component.window.ImageViewer'
	],
	alias: 'plugin.imageviewer',

	init: function(cmp) {
		var me = this;

		cmp.on('click', function() {
			if (!cmp.error) {
				me.openImageView();
			}
		});
	},

	openImageView: function() {
		var me = this,
			cmp = me.cmp,
			config = {
				cdnPath: cmp.cdnPath,
				cdnFolder: cmp.cdnFolder,
				nopicPath: cmp.nopicPath,
				noImgFile: cmp.nopicName,
				value: cmp.lastValue
			};
		Ext.create('Ext.ux.component.window.ImageViewer', config).show();
	}

});