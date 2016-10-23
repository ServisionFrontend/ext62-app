Ext.define('App.view.account.userManage.Query', {
	extend: 'Ext.ux.component.filter.Query',
	alias: 'widget.userquery',
	requires: ['Ext.ux.component.combo.BaseCombo'],
	items: [{
		items: [{
			fieldLabel: '用户名',
			name: 'username'
		}, {
			fieldLabel: '用户描述',
			name: 'userDesc'
		}, {
			xtype: 'basecombo',
			fieldLabel: '状态',
			name: 'enable',
			value: '',
			displayFormat: '',
			localData: [{
				name: '全部',
				code: ''
			}, {
				name: '启用',
				code: '1'
			}, {
				name: '禁用',
				code: '0'
			}]
		}]
	}]
});