Ext.define('App.controller.account.UserManage', {
	extend: 'Ext.ux.controller.CRUD',
	init: function() {
		var me = this;

		me.callParent(arguments);
	},
	controllerReady: function() {
		var me = this,
			grid = me.getGrid();

		grid.on({
			'toolbarclick': function(that) {
				if (that.action == "resetpwd") {
					me.resetPwd();
				}
			}
		});
	},

	resetPwd: function() {
		var me = this,
			selection = me.getGridSelection(),
			ids = [];

		Ext.each(selection, function(v, i) {
			ids.push(v.get("id"));
		});

		Ext.util.ajax({
			url: App.globalConfig.path + '/user/reset-password.json',
			jsonData: ids,
			method: 'PUT',
			success: function(res) {
				Ext.Msg.alert('提示', '重置成功', function() {
					me.getGrid().getStore().reload();
				});
			},
			failure: function(res) {
				Ext.Msg.alert('提示', res.message);
			}
		});
	}
});