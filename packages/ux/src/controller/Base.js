Ext.define('Ext.ux.controller.Base', {
	extend: 'Ext.app.Controller',
	mixins: {
		viewBase: 'Ext.ux.common.class.Base'
	},
	init: function() {
		var me = this;

		if (this.viewportId) {
			me.initEvents();
		}
		me.callParent(arguments);
	},

	initEvents: function() {
		var me = this,
			selectors = me.createControlSelector();

		me.control(selectors);
	},

	createControlSelector: function() {
		var me = this,
			selectors = {},
			viewportId = me.viewportId;

		selectors["#" + viewportId] = {
			afterrender: me.viewportAfterRender
		};

		return selectors;
	},

	viewportAfterRender: function(that) {
		var me = this;

		me.viewport = that;

		if (Ext.isFunction(me.viewportReady)) {
			me.viewportReady.apply(me, [that]);
		}
	},

	createExportForm: function() {
		var me = this;

		me.exportForm = Ext.create("Ext.form.Panel", {
			hidden: true,
			strandardSubmit: true
		});

		me.viewport.add(me.exportForm);
	},

	getViewport: function() {
		return Ext.getCmp(this.viewportId);
	},

	getViewClassPath: function() {
		var me = this,
			className = me.viewport.$className,
			lastIndex = className.lastIndexOf(".");

		return Ext.util.Format.substr(className, 0, lastIndex);
	}
});