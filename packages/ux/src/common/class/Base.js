Ext.define('Ext.ux.common.class.Base', {
	getUrlParams: function() {
		var me = this,
			urlParams = Ext.Object.fromQueryString(window.location.search);

		return urlParams;
	},

	getMainController: function() {

		if (APP.app.controllers.items.length > 0) {
			return APP.app.controllers.items[0];
		};
	},

	getController: function(controllerPath) {
		return APP.app.getController(controllerPath);
	}
});