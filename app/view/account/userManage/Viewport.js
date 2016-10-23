Ext.define('App.view.account.userManage.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	requires: [
		'App.view.account.userManage.Query',
		'App.view.account.userManage.Grid'
	],
	defaults: {
		border: true,
		margin: '10 10 5 10'
	},
	items: [{
		title: '查询区域',
		width: '100%',
		xtype: 'userquery'
	}, {
		title: '列表区域',
		xtype: 'usergrid'
	}]

});