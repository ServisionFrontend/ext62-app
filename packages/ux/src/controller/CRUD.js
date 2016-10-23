Ext.define('Ext.ux.controller.CRUD', {
	extend: 'Ext.ux.controller.Base',
	editMode: ["create", "update"],
	editView: null,
	actions: {
		'read': '读取',
		'create': '创建',
		'update': '更新',
		'destroy': '删除'
	},
	advancedQueryParams: [],

	viewportReady: function() {
		var me = this;

		me.createControl();
		me.initStoreEvent();
		me.createExportForm();

		if (Ext.isFunction(me.controllerReady)) {
			me.controllerReady.apply(me, []);
		}
	},

	createControl: function() {
		var me = this,
			selectors = {},
			viewportId = me.viewport.id;

		selectors["#" + viewportId + " > form[itemId=query-form]"] = {
			queryRecord: function() {
				me.readRecord();
			},
			advancedQuery: function() {
				me.openAdvancedQueryWindow();
			}
		};

		selectors["#" + viewportId + " > grid[itemId=grid-list]"] = {
			createRecord: function() {
				me.onCreateRecord();
			},
			updateRecord: function() {
				me.onUpdateRecord();
			},
			destroyRecord: function(params) {
				me.destroyRecord(params);
			},
			exportRecord: function(that) {
				me.exportRecord(that);
			}
		};

		me.control(selectors);
	},

	initStoreEvent: function() {
		var me = this,
			store = me.getGrid().getStore();

		store.on("beforeload", function(that, operation, eOpts) {
			me.addStoreFilters(that);

			store.fireEvent('beforerequest', that, operation, eOpts);
		});

		store.on("aftersuccess", function(operation) {
			me.handlerSuccess(operation);
		});

		store.on("aftererror", function(operation, response) {
			me.handlerError(operation, response);
		});
	},

	addStoreFilters: function(store) {
		var me = this,
			queryForm = me.getQuery(),
			params = queryForm.getFilters();

		store.proxy.extraFilters = params;
	},

	onCreateRecord: function() {
		var me = this;

		me.openEditWindow(me.editMode[0]);
	},

	onUpdateRecord: function() {
		var me = this;

		me.openEditWindow(me.editMode[1]);
	},

	openEditWindow: function(editMode) {
		var me = this,
			selection = me.getGridSelection(),
			record = selection.length > 0 ? selection[0] : {};

		me.createEditWindow(editMode);
		me.setEditFormRecord(editMode);
		me.initEditWindowEvent();
		me.editWindow.show();
	},

	createEditWindow: function(editMode) {
		var me = this,
			className;

		if (Ext.isString(me.editView)) {
			className = me.editView;
		} else {
			className = me.getViewClassPath() + ".Edit";
		}

		me.editWindow = Ext.create(className, {
			editMode: editMode
		});
	},

	setEditFormRecord: function(editMode) {
		var me = this,
			selection = me.getGridSelection(),
			record = selection.length > 0 ? selection[0] : {};

		if (editMode === "update") {
			if (me.editWindow.setRecord) {
				me.editWindow.setRecord(record);
			}
		}
	},

	initEditWindowEvent: function() {
		var me = this;

		me.editWindow.on("dosave", function(params) {

			if (this.formSubmit) {
				me.formSubmit();
			} else {
				me.ajaxSubmit(params);
			}
		});
	},

	openAdvancedQueryWindow: function() {
		var me = this,
			config = me.config.advancedSearch,
			advancedQuery = Ext.create("Ext.ux.component.filter.AdvancedQuery", {
				propertyUrl: config.propertyUrl,
				operatorUrl: config.operatorUrl,
				advancedQueryParams: me.advancedQueryParams,
				listeners: {
					doQuery: function(params) {
						me.doAdvancedQuery(params);
					}
				}
			});

		advancedQuery.show();
	},

	doAdvancedQuery: function(params) {
		var me = this;

		me.advancedQueryParams = params;
		me.readRecord(params);
	},

	formSubmit: function() {
		var me = this,
			store = me.getGrid().getStore(),
			editMode = me.editWindow.editMode,
			form = me.editWindow.down('form').getForm(),
			items = form.getFields().items;

		if (!form.isValid()) return;

		if (editMode === me.editMode[0]) {
			form.submit({
				url: store.proxyAPI.create + '?append=true',
				method: 'POST',
				success: function(that, action) {
					var root = Ext.decode(action.response.responseText);
					me.createUpdateSuccess();
				},
				failure: function(that, action) {
					me.editWindow.setLoading(false);
					Ext.util.errorHandler(action.response);
				}
			});
		} else if (editMode === me.editMode[1]) {
			// update
			form.submit({
				url: store.proxyAPI.update + '?append=false',
				method: 'POST',
				success: function(that, action) {
					var root = Ext.decode(action.response.responseText);
					me.createUpdateSuccess();
				},
				failure: function(that, action) {
					me.editWindow.setLoading(false);
					Ext.util.errorHandler(action.response);
				}
			});
		}
	},

	ajaxSubmit: function(params) {
		var me = this,
			editMode = me.editWindow.editMode;

		switch (editMode) {
			case me.editMode[0]:
				me.createRecord(params);
				break;
			case me.editMode[1]:
				me.updateRecord(params);
				break;
			default:
				break;
		}
	},

	readRecord: function() {
		var me = this,
			grid = me.getGrid(),
			store = grid.getStore();

		me.clearGridSelection(grid);
		store.loadPage(1);
	},

	createRecord: function(params) {
		var me = this,
			value,
			store = me.getGrid().getStore(),
			form = me.editWindow.down("form"),
			values = form.getValues();

		store.proxy.extraJsonData = params;
		store.add(values);
	},

	updateRecord: function(params) {
		var me = this,
			store = me.getGrid().getStore(),
			form = me.editWindow.down("form"),
			record = form.getRecord();

		store.proxy.extraJsonData = params;
		record.set(params);

		if (!record.dirty) {
			Ext.Msg.alert('提示', '您没有对表单做任何修改, 无需保存');
			me.editWindow.setLoading(false);
		}
	},

	destroyRecord: function(params) {
		var me = this,
			grid = me.getGrid(),
			store = grid.getStore(),
			selection = me.getGridSelection();

		store.proxy.extraJsonData = params;
		store.remove(selection[0]);
		me.deselectAll();
	},

	exportRecord: function(that) {
		var me = this,
			grid = me.getGrid(),
			url = that.exportUrl,
			exportParams = me.getExportParams();

		me.exportForm.submit({
			url: url,
			method: 'GET',
			params: {
				"args": Ext.encode(exportParams)
			},
			standardSubmit: true
		});
	},

	handlerSuccess: function(operation) {
		var me = this,

			action = operation.action;

		switch (action) {
			case "create":
			case "update":
				me.createUpdateSuccess();
				break;
			case "destroy":
				me.destorySuccess();
				break;
			default:
				break;
		}
	},

	createUpdateSuccess: function() {
		var me = this,
			grid = me.getGrid(),
			queryForm = me.getQuery();

		me.editWindow.setLoading(false);
		me.editWindow.close();
		me.clearGridSelection(grid);
		queryForm.doQuery();
		Ext.Msg.alert("提示", "保存成功");
	},

	destorySuccess: function() {
		var me = this,
			grid = me.getGrid(),
			queryForm = me.getQuery();

		queryForm.doQuery();
		Ext.Msg.alert("提示", "删除成功");
		grid.setLoading(false);
	},

	clearGridSelection: function(that) {
		var me = this;

		that.getSelectionModel().clearSelections();
		that.controlToolbarStatus(that, []);
	},

	handlerError: function(operation, response) {
		var me = this,
			grid = me.getGrid(),
			store = grid.getStore();

		if (Ext.Array.contains(me.editMode, operation.action)) {
			me.editWindow.setLoading(false);
		} else {
			grid.setLoading(false);
		}
		Ext.util.Common.errorHandler(response);
		store.rejectChanges();
	},

	deselectAll: function() {

		this.getGrid().getSelectionModel().deselectAll();
	},

	getGrid: function() {

		return this.viewport.down("grid");
	},

	getQuery: function() {

		return this.viewport.down("[itemId=query-form]");
	},

	getGridSelection: function() {

		return this.getGrid().getSelectionModel().getSelection();
	},

	getExportParams: function() {
		var me = this,
			queryForm = me.getQuery(),
			filters = queryForm.getFilters();

		return {
			filters: filters,
			sorts: me.getStores(),
			paging: {
				page: 1,
				size: 100000
			}
		}
	},

	getStores: function() {
		var me = this,
			sorts = [],
			sorters = me.getGrid().getStore().sorters.items;

		Ext.each(sorters, function(item) {
			sorts.push({
				field: item.property,
				asc: item.direction === 'ASC' ? true : false
			});
		});

		return sorts;
	}

});