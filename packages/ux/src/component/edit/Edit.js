Ext.define("Ext.ux.component.edit.Edit", {
	extend: 'Ext.ux.component.edit.Base',
	alias: 'widget.edit',
	width: 450,
	maxHeight: 500,
	actions: {
		'create': '创建',
		'update': '修改'
	},
	createDisableItems: [],
	updateDisableItems: [],
	defaults: {
		xtype: 'form',
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		autoScroll: true,
		defaults: {
			xtype: "textfield",
			margin: '0 0 10 0',
			labelWidth: 70,
			labelPad: 10,
			allowBlank: false
		},
		border: false
	},

	constructor: function(config) {
		var me = this;

		me.configLabelWidth();
		me.configTitle(config);
		me.configDiabledItems();
		me.callParent(arguments);
	},

	configTitle: function(config) {
		var me = this;

		me.title = me.title + '-' + me.superclass.actions[config.editMode];
	},

	configLabelWidth: function() {
		var me = this,
			maxWidth = 0,
			tm = new Ext.util.TextMetrics();

		Ext.each(me.items[0].items, function(item) {
			var labelWidth = tm.getWidth(item.fieldLabel + ':*');
			if (labelWidth > maxWidth) {
				maxWidth = labelWidth;
			}
		});

		me.superclass.defaults.defaults.labelWidth = maxWidth + 5;
	},

	configDiabledItems: function() {
		var me = this;

		me.createDisableItems = Ext.Array.merge(me.createDisableItems, me.superclass.createDisableItems);
		me.updateDisableItems = Ext.Array.merge(me.updateDisableItems, me.superclass.updateDisableItems);
	},

	initComponent: function() {
		var me = this;

		me.callParent(arguments);

		if (me.editMode === 'create') {
			me.setFieldsDisabled(me.createDisableItems);
		} else if (me.editMode === 'update') {
			me.setFieldsDisabled(me.updateDisableItems);
		}
	},

	setFieldsDisabled: function(items) {
		var me = this,
			form = me.getForm();

		Ext.each(items, function(name) {
			var field = form.findField(name);

			field.readOnly = true;
			field.addCls('x-item-disabled');
		});
	},

	doSave: function() {
		if (!this.getForm().isValid()) {
			return;
		}
		var me = this;
		params = me.getParams();

		me.setLoading(true);
		me.fireEvent('dosave', params);
	},

	getParams: function() {
		var me = this,
			params = {},
			items = me.getFormFields();

		Ext.each(items, function(item) {
			if (!item.isNotSubmit) {
				params[item.name] = item.getValue();
			}
		});

		return params;
	},

	doCancel: function() {
		var me = this;

		me.close();
	},

	setRecord: function(params) {
		var me = this,
			formPanel = me.down("form");

		formPanel.loadRecord(params);
	},

	getForm: function() {
		var me = this,
			form = me.down("form").getForm();

		return form;
	},

	getFormFields: function() {
		var me = this,
			form = me.down("form"),
			formFields = form.query('[name]');

		return formFields;
	}
});