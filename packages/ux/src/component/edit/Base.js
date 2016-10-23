Ext.define("Ext.ux.component.edit.Base", {
	extend: 'Ext.window.Window',
	alias: 'widget.editbase',
	requires: ['Ext.ux.plugin.LabelRequired'],
	plugins: ['formlabelrequired'],
	closable: true,
	modal: true,
	resizable: false,
	constrainHeader: true,
	layout: "fit",
	closeAction: 'destroy',
	width: 450,
	maxHeight: 500,
	bodyPadding: '10 10 5 10',
	dockedItems: [{
		xtype: 'toolbar',
		dock: 'bottom',
		margin: "3 0 15 0",
		defaults: {
			width: 80
		},
		layout: {
			align: 'middle',
			pack: 'center',
			type: 'hbox'
		},
		items: [{
			xtype: 'button',
			action: "save",
			text: "保存",
			ui: 'blue'
		}, {
			xtype: 'button',
			action: "cancel",
			text: "取消"
		}]
	}],

	initEvents: function() {
		var me = this,
			btnSave = me.down("toolbar > button[action=save]"),
			btnCancel = me.down("toolbar > button[action=cancel]");

		if (btnSave && btnCancel) {
			btnSave.on("click", Ext.Function.bind(me.doSave, me));
			btnCancel.on("click", Ext.Function.bind(me.doCancel, me));
		}
	},

	doSave: function() {
		var me = this;

		me.fireEvent('dosave', me);
	},

	doCancel: function() {
		var me = this;
		me.close();
	}
});