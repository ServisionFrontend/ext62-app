Ext.define('Ext.ux.component.paging.Paging', {
	extend: 'Ext.toolbar.Paging',
	alias: 'widget.paging',
	requires: [
		'Ext.ux.plugin.PagingToolbarResizer'
	],
	initComponent: function() {
		this.overrideInputWidth();
		this.callParent(arguments);
	},
	overrideInputWidth: function() {
		Ext.override(Ext.toolbar.Paging, {
			inputItemWidth: 45
		});
	},
	plugins: [{
		ptype: 'pagingtoolbarresizer',
		options: [10, 20, 30, 50, 100, 200]
	}]
});