Ext.define('App.model.account.UserManage', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'username'
	}, {
		name: 'userDesc'
	}, {
		name: 'modifiedDate'
	}, {
		name: 'modifiedBy'
	}, {
		name: 'enable'
	}, {
		name: 'createdDate'
	}, {
		name: 'createdBy'
	}, {
		name: 'permissionIds'
	}, {
		name: 'changeDirty'
	}]
});