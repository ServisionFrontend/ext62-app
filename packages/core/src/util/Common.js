Ext.define('Ext.util.Common', {

	statics: {

		ajax: function(config) {
			var defaultOpts = {
					url: null,
					method: "GET",
					params: null,
					jsonData: null,
					disableCaching: false,
					beforerequest: null,
					requestcomplete: null,
					callback: null,
					headers: null
				},
				opts = Ext.apply(defaultOpts, config);

			Ext.Ajax.request({
				url: opts.url,
				method: opts.method,
				params: opts.params,
				headers: opts.headers,
				jsonData: opts.jsonData,
				disableCaching: opts.disableCaching,
				beforerequest: opts.beforerequest,
				requestcomplete: opts.requestcomplete,
				callback: opts.callback,
				success: function(response) {
					var root;

					if (response.responseText.length > 0) {
						root = Ext.decode(response.responseText);
					}
					if (typeof opts.success == 'function') {
						opts.success.apply(this, [root]);
					}
				},
				failure: function(response) {

					Ext.util.errorHandler(response, opts.failure);
				}
			});
		},

		errorHandler: function(response, callback) {
			var error,
				responseText = response.responseText;

			switch (response.status) {
				case 0:
					Ext.Msg.alert('错误', '通信失败, 请尝试刷新');
					break;
				case 401:
					error = Ext.decode(responseText);

					Ext.Msg.alert('错误', error.message, function() {
						location.href = location.href;
					});
					break;
				case 404:
					Ext.Msg.alert('错误', response.statusText);
					break;
				default:
					error = Ext.util.isJsonString(responseText) ? Ext.decode(responseText) : {
						message: "未知错误"
					};

					if (typeof callback == 'function') {
						callback.apply(this, [response, error]);
					} else {
						Ext.Msg.alert('错误', error.message);
					}
					break;
			}
		},

		isJsonString: function(str) {
			try {
				Ext.decode(str);
			} catch (e) {
				return false;
			}

			return true;
		}
	},

	constructor: function() {

		this.overrides();
		this.extends1();
		this.bindEvents();
	},

	overrides: function() {
		var me = this;

		// 重写ext json encodeDate方法
		Ext.JSON.encodeDate = function(o) {
			return '"' + Ext.Date.format(o, 'c') + '"';
		}
	},

	extends1: function() {
		var me = this;

		// format 扩展一个lcoalDate方法
		Ext.util.Format.localDate = function(val, format) {
			format = format ? format : 'Y-m-d H:i:s';

			return val ? Ext.util.Format.date(new Date(val), format) : '';
		}

		// VTypes 扩展
		Ext.apply(Ext.form.VTypes, {
			daterange: function(val, field) {
				var date = field.parseDate(val),
					form = field.up('form').getForm();

				if (!date) {
					return;
				}
				if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
					var start = form.findField(field.startDateField);
					start.setMaxValue(date);
					start.validate();
					this.dateRangeMax = date;
				} else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
					var end = form.findField(field.endDateField);
					end.setMinValue(date);
					end.validate();
					this.dateRangeMin = date;
				}
				return true;
			}
		});
	},

	bindEvents: function() {
		var me = this;

		// ajax请求服务端之前
		Ext.Ajax.on('beforerequest', function(conn, options) {
			if (typeof options.beforerequest === 'function') {
				return options.beforerequest.apply(this, [options])
			} else {
				return true;
			}
		});

		// ajax请求服务器端完成
		Ext.Ajax.on('requestcomplete', function(conn, response, options) {
			if (typeof options.requestcomplete === 'function') {
				return options.requestcomplete.apply(this, [response])
			}
		});
	}
});

new Ext.util.Common();