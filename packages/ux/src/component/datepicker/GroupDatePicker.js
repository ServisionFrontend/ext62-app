Ext.define('Ext.ux.component.datepicker.GroupDatePicker', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.groupdatepicker',
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
            endBoxWidth = (me.fieldWidth || fieldWidth) - (me.labelWidth || labelWidth);

        me.items[0].name = me.startName;
        me.items[0].endDateField = me.endName;
        me.items[0].width = me.fieldWidth || fieldWidth;
        me.items[0].labelWidth = me.labelWidth || labelWidth;
        me.items[0].allowBlank = me.allowBlank;
        me.items[0].fieldLabel = me.fieldLabel;

        me.items[2].name = me.endName;
        me.items[2].width = endBoxWidth;
        me.items[2].allowBlank = me.allowBlank;
        me.items[2].startDateField = me.startName;
    },

    defaults: {
        enableKeyEvents: true
    },
    items: [{
        vtype: 'daterange',
        xtype: 'datefield',
        format: 'Y-m-d',
        range: 'start'
    }, {
        xtype: 'label',
        text: '-',
        width: 5
    }, {
        vtype: 'daterange',
        xtype: 'datefield',
        format: 'Y-m-d',
        labelWidth: 0,
        range: 'end',
        getValue: function() {
            if (this.value) {
                return Ext.Date.add(this.value, Ext.Date.DAY, 1);
            }
        }
    }]
});