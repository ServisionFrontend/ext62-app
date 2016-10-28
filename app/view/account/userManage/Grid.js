Ext.define('App.view.account.userManage.Grid', {
	extend: 'Ext.ux.component.grid.Grid',
	alias: 'widget.usergrid',
	store: 'App.store.account.UserManage',
	rownumberer: true,
	controlButtons: ["update", "resetpwd"],
	columns: [{
		text: '用户名',
		dataIndex: 'username',
		locked: true,
		width: 260
	}, {
		text: '用户描述',
		dataIndex: 'userDesc',
		width: 120
	}, {
		text: '状态',
		dataIndex: 'enable',
		width: 120,
		renderer: function(v) {
			return v ? "启用" : "禁用";
		}

	}, {
		text: '创建人',
		dataIndex: 'createdBy',
		width: 120
	}, {
		text: '创建时间',
		dataIndex: 'createdDate',
		width: 120
	}, {
		text: '修改人',
		dataIndex: 'modifiedBy',
		width: 120
	}, {
		text: '修改时间',
		dataIndex: 'modifiedDate',
		flex: 1,
		width: 120
	}]
});