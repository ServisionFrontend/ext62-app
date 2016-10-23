Ext.define('App.view.account.userManage.Edit', {
	extend: 'Ext.ux.component.edit.Edit',
	requires: ['Ext.ux.component.combo.GroupCombo'],
	title: '用户管理',
	ckdlist: [],
	updateDisableItems: ['username'],
	items: [{
		items: [{
			fieldLabel: '用户名',
			name: 'username'
		}, {
			fieldLabel: '用户描述',
			name: 'userDesc',
			allowBlank: true
		}, {
			xtype: 'basecombo',
			fieldLabel: '状态',
			name: 'enable',
			value: true,
			displayFormat: '',
			localData: [{
				name: '启用',
				code: true
			}, {
				name: '禁用',
				code: false
			}]
		}]
	}]
});