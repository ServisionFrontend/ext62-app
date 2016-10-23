Ext.define('Ext.ux.component.field.NumberRangeField', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.numberrangefield',
    layout: 'hbox',
    border: 0,
    allowBlank: true,
    initComponent: function() {
        var me = this;
        
        me.setConfig();
        me.callParent(arguments);
    },
    setConfig: function() {
        var me = this,
            fieldWidth = 190,
            labelWidth = 60,
            autoId = me.getAutoId(),
            startNumberId = me.name + "_start_" + autoId,
            endNumberId = me.name + "_end_" + autoId,
            endBoxWidth = (me.fieldWidth || fieldWidth) - (me.labelWidth || labelWidth);

        me.items[0].id = startNumberId;
        me.items[0].name = me.startName;
        me.items[0].width = me.fieldWidth || fieldWidth;
        me.items[0].labelWidth = me.labelWidth || labelWidth;
        me.items[0].allowBlank = me.allowBlank;
        me.items[0].fieldLabel = me.fieldLabel;
        me.items[0].minValue = me.startNumMinValue;
        me.items[0].maxValue = me.startNumMaxValue;

        me.items[2].id = endNumberId;
        me.items[2].name = me.endName;
        me.items[2].width = endBoxWidth;
        me.items[2].allowBlank = me.allowBlank;
        me.items[2].minValue = me.endNumMinValue;
        me.items[2].maxValue = me.endNumMaxValue;
    },
    defaults: {
        enableKeyEvents: true
    },
    items: [{
        xtype: 'numberfield'
    }, {
        xtype: 'label',
        value: '-',
        width: 5
    }, {
        range:'end',
        xtype: 'numberfield'
    }]
});