Ext.define('Ext.ux.component.combo.BaseCombo', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.basecombo',
	displayField: 'name',
	valueField: 'id',
	allText: '全部',
	allValue: '',
	withAll: false,
	storeAutoLoad: true,
	queryParam: '',
	extraFields: [],
	editable: false,
	dependField: null,
	clearFields: null,
	noCache: true,
	proxyType: 'ajax',
	queryCaching: false,
	displayFormat: null,
	initComponent: function() {
		var me = this;

		if (Ext.isString(me.url)) {
			me.loadRemoteData();
		}
		if (Ext.isArray(me.localData)) {
			me.loadLocalData();
		}

		me.callParent(arguments);
	},

	initEvents: function() {
		var me = this;

		this.callParent(arguments);

		if (me.clearFields !== null) {
			me.on('select', function() {
				me.clearTargetFields();
			});
		}
	},

	clearTargetFields: function() {
		var me = this,
			form = me.up("form").getForm();

		Ext.each(me.clearFields, function(name) {
			var field = form.findField(name),
				store = field.getStore();

			field.clearValue();
			field.clearInvalid();
			me.removeAllOption(store);
			field.setValue('');
		});
	},

	loadLocalData: function() {
		var me = this;
		if (me.localData.length) {
			Ext.each(me.localData[0], function(key, idx) {
				if ('code' in key) {
					me.valueField = 'code';
					return false;
				}
			});
		}

		var fields = me.getFields();

		Ext.apply(me, {
			store: {
				fields: fields,
				data: me.localData
			}
		});
	},

	loadRemoteData: function() {
		var me = this,
			fields = me.getFields(),
			proxy = {},
			emptyOption = me.getEmptyOption();


		proxy = {
			noCache: me.noCache,
			pageParam: false,
			startParam: false,
			limitParam: false,
			url: me.url,
			type: 'ajax',
			reader: {
				type: 'json',
				root: 'list'
			},
			listeners: {
				exception: function(that, response, operation, eOpts) {
					Ext.util.errorHandler(response);
				}
			}
		};
		if (me.proxyType == 'jsonp') {
			Ext.apply(proxy, {
				type: 'jsonp',
				callbackKey: "callback",
				reader: {
					type: 'json',
					root: ''
				}
			});
		}

		Ext.apply(me, {
			store: {
				data: me.withAll ? [emptyOption] : null,
				isLoad: true,
				autoLoad: me.storeAutoLoad,
				fields: fields,
				proxy: proxy,
				listeners: {
					beforeload: function() {
						if (me.dependField !== null) {
							return me.buildUrl();
						}
						return true;
					},
					load: function(store, records, successful, eOpts) {
						if (successful) {
							me.insertEmptyOption(store);
						}
					}
				}
			}
		});
	},

	getFields: function() {
		var me = this,
			fields;

		if (me.displayFormat) {
			fields = [{
				name: me.valueField
			}, {
				name: me.displayField,
				convert: function(val, rec) {
					var code = rec.get(me.valueField);

					return (code || typeof code === 'boolean' || typeof code === 'number') ? me.getFormatText(code, val) : val;
				}
			}]
		} else {
			fields = [me.valueField, {
				name: me.displayField,
				convert: function(val, rec) {
					if (!val) {
						return rec.get(me.valueField);
					}
					return val;
				}
			}];
		}

		return Ext.Array.merge(fields, me.extraFields);
	},

	buildUrl: function() {
		var me = this,
			store = me.getStore(),
			form = me.up("form").getForm(),
			id = form.findField(me.dependField).getValue();

		if (id === null || id === '') {
			me.removeAllOption(store);
			return false;
		}

		store.proxy.url = me.url.replace(/{id}/, id);
		return true;
	},

	removeAllOption: function(store) {
		var me = this,
			option = me.getEmptyOption();

		store.removeAll();

		if (me.withAll) {
			store.add(option);
		}
	},

	insertEmptyOption: function(store) {
		if (!this.withAll) return;

		var me = this,
			option = me.getEmptyOption();

		store.insert(0, [option]);
	},

	getEmptyOption: function() {
		if (!this.withAll) return {};

		var me = this,
			option = {};

		option[me.displayField] = me.allText;
		option[me.valueField] = me.allValue;

		return option;
	},

	getFormatText: function(code, name) {
		var me = this;

		return me.displayFormat
			.replace('{' + me.valueField + '}', code)
			.replace('{' + me.displayField + '}', name);
	}
});