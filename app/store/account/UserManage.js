Ext.define('App.store.account.UserManage', {
	extend: 'Ext.ux.store.Base',
	model: 'App.model.account.UserManage',
	isUpload: true,
	proxyAPI: {
		read: '/user/list.json',
		create: '/user/add.json',
		update: '/user/update.json'
	},
	data: [{
		username: 'Lisa',
		userDesc: 'lisa@simpsons.com',
		createdBy: '555-111-1224'
	}, {
		username: 'Bart',
		userDesc: 'bart@simpsons.com',
		createdBy: '555-222-1234'
	}, {
		username: 'Homer',
		userDesc: 'homer@simpsons.com',
		createdBy: '555-222-1244'
	}, {
		username: 'Marge',
		userDesc: 'marge@simpsons.com',
		createdBy: '555-222-1254'
	}]
});