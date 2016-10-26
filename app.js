var extjsConfig = App.extjsConfig;
var bootPage = extjsConfig.pages[extjsConfig.pageCode];

Ext.application({
	name: 'App',

	extend: 'App.Application',

	requires: [
		'App.*',
		'Ext.util.Common',
		'Ext.ux.proxy.Rest'
	],

	controllers: [bootPage.controller],

	mainView: bootPage.viewport

});