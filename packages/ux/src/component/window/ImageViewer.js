Ext.define("Ext.ux.component.window.ImageViewer", {
    extend: 'Ext.window.Window',
    alias: 'widget.cmpimageview',
    requires: [
        'Ext.ux.component.field.ImageField'
    ],
    title: '查看大图',
    width: 560,
    height: 578,
    closable: true,
    modal: true,
    resizable: false,
    constrainHeader: true,
    bodyStyle: 'background-color:#fff',
    layout: {
        type: 'hbox',
        pack: 'center',
        align: 'middle'
    },
    items: [{
        layout: {
            type: 'hbox',
            pack: 'center',
            align: 'middel'
        },
        border: false,
        width: 548,
        height: 548,
        items: [{
            xtype: 'imagefield',
            isClick: false,
            isOpenView: false
        }]
    }],
    constructor: function(config) {
        var me = this;

        Ext.apply(me.items[0].items[0], config);
        
        this.callParent(arguments);
    }
});