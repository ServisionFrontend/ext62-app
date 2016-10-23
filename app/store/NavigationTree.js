Ext.define('App.store.NavigationTree', {
	extend: 'Ext.data.TreeStore',

	storeId: 'NavigationTree',

	fields: [{
		name: 'text'
	}],
	type: 'tree',
	root: {
		expanded: true,
		children: [{
			text: '供应商管理',
			iconCls: 'x-fa fa-user',
			leaf: false,
			expanded: false,
			selectable: false,
			children: [{
				text: '供应商信息',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '供应商配件',
				iconCls: 'x-fa fa-info-circle',
				viewType: 'pageblank',
				leaf: true
			}]
		}, {
			text: '配件管理',
			iconCls: 'x-fa fa-send',
			leaf: false,
			children: [{
				text: '配件总表',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}]
		}, {
			text: 'OEM用法',
			iconCls: 'x-fa fa-user',
			leaf: false,
			children: [{
				text: '用法维护',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '用户统计',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}]
		}, {
			text: '基础数据',
			iconCls: 'x-fa fa-search',
			leaf: false,
			children: [{
				text: '汽车品牌',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '主机厂品牌',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '车系',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '子车系',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '车型',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '发动机',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '电动机',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '变速箱',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '配件品牌',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}, {
				text: '配件分类',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}]
		}, {
			text: '用户管理',
			iconCls: 'x-fa fa-leanpub',
			expanded: false,
			selectable: false,
			children: [{
				text: '用户管理',
				iconCls: 'x-fa fa-gavel',
				viewType: 'pageblank',
				leaf: true
			}]
		}]
	}
});