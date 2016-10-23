/**
 * Plugin (ptype = 'formlabelrequired') that adds "asterisk" to labels
 * for Fields with "allowBlank: false".
 */
Ext.define('Ext.ux.plugin.LabelRequired', {

	extend: 'Ext.AbstractPlugin',

	alias: 'plugin.formlabelrequired',

	asterisk: ' <span style="color:red;font-weight:bold" data-qtip="必填项">*</span>',

	constructor: function() {

		this.callParent(arguments);
	},

	init: function(formPanel) {
		formPanel.on('beforerender', this.onBeforeRender, this);
	},

	onBeforeRender: function(formPanel) {
		var i, len,
			items = formPanel.query('[allowBlank=false]');

		for (i = 0, len = items.length; i < len; i++) {
			items[i].afterLabelTextTpl = this.asterisk;
		}

		return true;
	}

});