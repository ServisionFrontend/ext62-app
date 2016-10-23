Ext.define('Ext.ux.proxy.Rest', {
	extend: 'Ext.data.proxy.Rest',

	// overrides base sendRequest method
	sendRequest: function(request) {
		var me = this;

		me.setProxyParams(request);

		request.setRawRequest(Ext.Ajax.request(request.getCurrentConfig()));
		this.lastRequest = request;
		return request;
	},

	setProxyParams: function(request) {
		var me = this;
		var params;
		var operation = request.getOperation();

		if (operation.allowWrite()) {
			request.setJsonData(me.extraJsonData);
			request.setParams(undefined);
		} else {
			params = me.extraFilters ? me.getReadParams(operation) : me.extraParams;
			request.setParams(params);
		}
	},

	getReadParams: function(operation) {
		var me = this;
		var readParams = {
			filters: me.extraFilters || [],
			sorts: me.getSortParams(operation),
			paging: {
				page: operation.getPage(),
				size: operation.getLimit()
			}
		};

		return {
			args: Ext.encode(readParams)
		};
	},

	getSortParams: function(operation) {
		var me = this;
		var sorts = [];
		var items = operation.getSorters();

		Ext.each(items, function(item) {
			sorts.push({
				field: item.config.property,
				asc: item.config.direction === 'ASC' ? true : false
			});
		});

		return sorts;
	}
});