Ext.define('App.controller.main.Main', {
	extend: 'Ext.app.Controller',

	views: ['main.Viewport'],

	init: function() {
		var me = this;

		me.control({
			"[itemId=navigationTreeList]": {
				selectionchange: function(that, record) {
					me.loadPage(record);
				}
			}
		});

		this.callParent(arguments);
	},

	loadPage: function(record, params, callback) {
		if (!record.get('leaf')) return;

		var me = this,
			id = record.get('id'),
			text = record.get('text'),
			url = record.get('url');

		if (Ext.isString(url) && url.length > 0) {
			me.openWindow(url);
			return;
		}

		if (me.getTabPage(record)) {
			me.addTab(id, text, true, record, params, callback);
		} else {
			if (console && console.log) {
				console.log("未配置page 信息, 请到extjsConfig 配置controller view, id:" + id);
			}
		}
	},

	addTab: function(id, title, closable, record, params, callback) {
		var me = this,
			tabs = Ext.getCmp('tabs'),
			tab = Ext.getCmp("tab_" + id);

		// 当前模块已经打开, 则激活
		if (tab) {
			tabs.setActiveTab(tab);
			if (typeof callback === 'function') {
				callback();
			}
			return;
		}

		// 快速打开菜单操作，闭包保留着用域
		(function(tabs, id, title, closable, record, params, callback) {

			window.setTimeout(function() {
				me.showTab(tabs, id, title, closable, record, params, callback);
			}, 5);

		})(tabs, id, title, closable, record, params, callback);
	},

	showTab: function(tabs, id, title, closable, record, params, callback) {
		var me = this;

		tabs.add({
			title: title,
			id: "tab_" + id,
			items: [],
			layout: "fit",
			closable: closable,
			closeAction: "destroy",
			listeners: {
				afterrender: function() {
					var tab = this;

					tabs.setActiveTab(tab);
					me.finishTabRender(id, tab, record, params, callback);
				}
			}
		}).show();
	},

	finishTabRender: function(id, tab, record, params, callback) {
		var me = this,
			pageConfig = me.getTabPage(record || id);

		tab.setLoading(tab.title + ', 加载中...');

		setTimeout(function() {
			me.loadController(pageConfig, tab, record, params, callback);
		}, 10);
	},

	loadController: function(pageConfig, tab, record, params, callback) {
		var me = this,
			controllerName = pageConfig.controller,
			viewport = me.createViewport(pageConfig),
			controllerClassName = App.app.getModuleClassName(controllerName, "controller");

		Ext.require(controllerClassName, function() {
			var controller = me.createController(controllerName);

			viewport.params = params;

			controller.viewportId = viewport.id;
			controller.functionCode = record ? record.get('functionCode') : null;
			controller.initEvents && controller.initEvents();

			tab.controllerId = controller.id;
			tab.add(viewport);
			tab.setLoading(false);

			if (typeof callback === 'function') {
				callback();
			}
		});
	},

	createViewport: function(pageConfig) {
		var me = this,
			className = App.app.getModuleClassName(pageConfig.viewport, "view"),
			viewport = Ext.create(className, {
				id: Ext.id()
			});

		return viewport;
	},

	createController: function(controllerName) {
		var me = this;

		return App.app.getController(controllerName);
	},

	destroyController: function(controllerId) {
		var me = this;

		App.app.eventbus.unlisten(controllerId);
		App.app.controllers.remove({
			id: controllerId
		});
	},

	openWindow: function(url) {
		var me = this;

		window.open(url, "_blank");
	},

	closeTab: function(tab) {
		var me = this;

		me.destroyController(tab.controllerId);
	},

	getTabPage: function(record) {
		var id = Ext.isString(record) ? record : record.get('id');

		return App.extjsConfig.pages[id];
	}
});