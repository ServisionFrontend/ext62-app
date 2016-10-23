Ext.define('App.store.account.UserManage', {
	extend: 'Ext.ux.store.Base',
	model: 'App.model.account.UserManage',
	isUpload: true,
	proxyAPI: {
		read: '/user/list.json',
		create: '/user/add.json',
		update: '/user/update.json'
	}
});