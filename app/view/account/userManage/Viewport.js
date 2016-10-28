Ext.define('App.view.account.userManage.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	requires: [
		'App.view.account.userManage.Query',
		'App.view.account.userManage.Grid'
	],
	defaults: {
		border: true,
		margin: '10 10 0 10'
	},
	items: [{
		width: '100%',
		xtype: 'userquery'
	}, {
		xtype: 'usergrid'
	}]

});