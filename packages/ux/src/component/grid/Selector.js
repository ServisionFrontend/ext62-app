Ext.define('Ext.ux.component.grid.Selector', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.gridselector',
	requires: ['Ext.ux.component.paging.Paging'],
	multiSelect: true,
	multiSelectCheckbox: true,
	autoDestroy: true,
	width: "100%",
	flex: 1,
	fields: ['code', 'name'],
	searchInputConfig: {
		width: 250,
		labelPad: 10,
		labelWidth: 65,
		fieldLabel: '编码或名称'
	},
	constructor: function(config) {
		var me = this;

		me.setConfig(config);
		me.createStore(config);
		me.callParent(arguments);
	},

	initComponent: function() {
		var me = this;

		me.bbar.store = me.getStore();
		me.callParent(arguments);
	},

	initEvents: function() {
		var me = this,
			store = me.getStore(),
			btnQuery = me.down('[action=query]'),
			tbSearch = me.down('[itemId=search-text]');

		tbSearch.on('keypress', function(that, e) {
			if (e.getKey() === e.ENTER) me.doSearch();
		});
		btnQuery.on('click', function() {
			me.doSearch();
		});
		store.on('beforeload', function() {
			me.addStoreFilters();
		});
	},

	doSearch: function() {
		var me = this;

		me.readRecord();
	},

	readRecord: function() {
		var me = this,
			store = me.getStore();

		store.loadPage(1);
	},

	addStoreFilters: function(store) {
		var me = this,
			store = me.getStore();

		store.proxy.extraFilters = me.getParams();
	},

	getParams: function() {
		var me = this,
			i = 0,
			field, params = {},
			tbSearch = me.down('[itemId=search-text]'),
			keyWord = tbSearch.getValue();

		if (Ext.util.Format.trim(keyWord).length > 0) {
			for (; i < me.paramFields.length; i++) {
				field = me.paramFields[i];
				params[field] = keyWord;
			}
		}

		return params;
	},

	setConfig: function(config) {
		var me = this;

		Ext.apply(me.tbar[0], config.searchInputConfig, me.searchInputConfig);

	},

	createStore: function(config) {
		var me = this,
			store = me.store;

		me.store = Ext.create('Ext.ux.store.Base', {
			fields: config.fields,
			proxyAPI: {
				read: config.readUrl
			}
		});
	},

	tbar: [{
		xtype: 'textfield',
		itemId: 'search-text',
		labelWidth: 65,
		labelPad: 10,
		enableKeyEvents: true,
		width: 250
	}, {
		xtype: 'button',
		action: "query",
		text: "查询",
		iconCls: 'icon-find'
	}, {
		xtype: 'button',
		action: "cancel",
		text: "取消",
		iconCls: 'icon-cancel'
	}],

	bbar: {
		xtype: 'paging',
		dock: 'bottom',
		displayInfo: true
	},

	columns: [{
		text: "序号",
		xtype: 'rownumberer',
		width: 35
	}, {
		text: '编码',
		dataIndex: 'code',
		width: 140
	}, {
		text: '名称',
		dataIndex: 'name',
		flex: 1
	}]
});