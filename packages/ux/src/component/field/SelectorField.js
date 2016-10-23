Ext.define('Ext.ux.component.field.SelectorField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.selectorfield',
    requires: ['Ext.ux.component.grid.Selector'],
    triggerCls: 'x-form-browse-trigger',
    allowBlank: true,
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    },
    onTriggerClick: function(argument) {
        var me = this;

        me.openSelectorDialog();
    },

    openSelectorDialog: function() {
        var me = this,
            dialog = Ext.create('Ext.window.Window', {
                width: 535,
                height: 350,
                modal: true,
                resizable: false,
                layout: 'fit',
                title: me.windowTitle,
                items: [{
                    xtype: 'gridselector',
                    readUrl: me.readUrl,
                    fields: me.getStoreFields(),
                    columns: me.columns,
                    paramFields: me.paramFields,
                    searchInputConfig: me.searchInputConfig
                }]
            });

        dialog.show();
        me.initSelectorDialogEvents(dialog);
        me.loadSelectorDialogData(dialog);
    },

    getStoreFields: function() {
        var me = this,
            fields = [],
            i = 0;

        for (; i < me.fields.length; i++) {
            fields.push(me.fields[i].name);
        }

        return fields;
    },

    initSelectorDialogEvents: function(dialog) {
        var me = this,
            grid = dialog.down('grid'),
            btnCancel = dialog.down("toolbar > button[action=cancel]");

        grid.on('selectionchange', function(that, selected, eOpts) {
            me.fireEvent("selectionchange", me);
            me.selectionDialogData(selected, dialog);
        });
        btnCancel.on('click', function() {
            dialog.close();
        });
    },

    selectionDialogData: function(selected, dialog) {
        var me = this,
            record, data,
            form = me.up('form').getForm();

        if (selected.length > 0) {
            record = selected[0];
            data = me.getMappingData(record.data);
            form.setValues(data);
        }

        dialog.close();
    },

    getMappingData: function(data) {
        var me = this,
            i = 0,
            name, mapping, newData = {};

        for (; i < me.fields.length; i++) {
            name = me.fields[i].name;
            mapping = me.fields[i].mapping;
            newData[mapping] = data[name];
        }

        return newData;
    },

    loadSelectorDialogData: function(dialog) {
        var me = this,
            grid = dialog.down('grid');

        grid.getStore().loadPage(1);
    }
});