Ext.define('Ext.ux.component.combo.GroupCombo', {
    extend: 'Ext.ux.component.combo.BaseCombo',
    alias: 'widget.groupcombo',
    multiSelect: true,
    groupCode: 'group',
    groupName: 'group',
    codes: [],
    names: [],
    constructor: function(config) {
        var me = this;

        if (config.groupCode) {
            me.groupCode = config.groupCode;
            me.extraFields.push(me.groupCode);
        }
        if (config.groupName) {
            me.groupName = config.groupName;
            me.extraFields.push(me.groupName)
        }

        this.tpl = Ext.create('Ext.XTemplate',
            '<div class="tree-wrapper-box" style="height:280px;overflow-y:auto;">',
            '<tpl exec="values.data = this.formatValues(values)"></tpl>',
            '<tpl for="values.data">',
            '<div class="tree-branch" role="row">',
            '<span class="tree-square tree-square-arrow open" role="expand"></span>',
            '<span class="tree-square tree-square-checkbox" role="checkbox"></span>',
            '<span class="tree-square tree-square-folder open"></span>',
            '<span class="tree-text">{' + me.displayField + '}</span>',
            '</div>',
            '<ul class="tree-leaf-box">',
            '<tpl for="items">',
            '<li role="row" data-code="{' + me.valueField + '}" data-name="{' + me.displayField + '}">',
            '<span class="tree-square"></span>',
            '<span class="tree-square"></span>',
            '<span class="tree-square tree-square-checkbox" role="checkbox" data-code="{' + me.valueField + '}"></span>',
            '<span class="tree-square tree-square-leaf"></span>',
            '<span class="tree-text">{' + me.displayField + '}</span>',
            '</li>',
            '</tpl>',
            '</ul>',
            '</tpl>',
            '</div>', {
                formatValues: function(values) {
                    var temp = [],
                        vals = [];

                    Ext.each(values, function(item) {
                        var group = {
                            items: []
                        };
                        var groupCode = item[me.groupCode] || item[me.groupName];

                        if (temp.indexOf(groupCode) === -1) {
                            group[me.valueField] = groupCode;
                            group[me.displayField] = item[me.groupName] || groupCode;
                            vals.push(group);
                            temp.push(groupCode);
                        }
                        vals[temp.indexOf(groupCode)].items.push({
                            code: item[me.valueField],
                            name: item[me.displayField]
                        });
                    });
                    return vals;
                }
            }
        );

        this.addListConfig();
        this.callParent(arguments);
    },

    initEvents: function() {
        var me = this;

        me.getStore().on('load', function() {
            me.optionChecked();
        });

        me.callParent(arguments);
    },

    addListConfig: function() {
        var me = this;

        me.listConfig = {
            listeners: {
                el: {
                    click: {
                        delegate: '[role=row]',
                        fn: function(ev, anchor) {
                            me.optionClick(anchor, ev.target);
                        }
                    }
                }
            }
        };
    },

    optionClick: function(anchor, target) {
        var me = this,
            role = Ext.fly(target).getAttribute('role');

        switch (role) {
            case 'expand':
                me.expandNode(target);
                break;
            default:
                me.checkNode(anchor);
                break;
        }
        me.setValue(me.codes);
    },

    checkNode: function(anchor) {
        var me = this,
            checked,
            checkbox = Ext.fly(anchor).query('[role=checkbox]'),
            cmpCheckbox = Ext.fly(checkbox[0]);

        if (cmpCheckbox.hasCls('checked')) {
            checked = false;
            cmpCheckbox.removeCls('checked');
        } else {
            checked = true;
            cmpCheckbox.addCls('checked');
        }

        if (Ext.fly(anchor).hasCls('tree-branch')) {
            me.checkChildNodes(checked, anchor);
        } else {
            me.checkParentNode(anchor);
            me.addOrRemoveCodes(Ext.fly(anchor), checked);
        }
    },

    checkChildNodes: function(checked, anchor) {
        var me = this,
            checkboxs = Ext.fly(anchor).next().query('[role=checkbox]');

        Ext.each(checkboxs, function(item) {
            var extItem = Ext.fly(item);
            if (checked) {
                extItem.addCls('checked');
                me.addOrRemoveCodes(extItem.parent(), true);
            } else {
                extItem.removeCls('checked');
                me.addOrRemoveCodes(extItem.parent(), false);
            }
        });
    },

    checkParentNode: function(anchor) {
        var me = this,
            checkbox = Ext.fly(anchor).parent().prev().query('[role=checkbox]');

        if (me.isChildAllChecked(anchor)) {
            Ext.fly(checkbox[0]).addCls('checked');
        } else {
            Ext.fly(checkbox[0]).removeCls('checked');
        }
    },

    isChildAllChecked: function(anchor) {
        var me = this,
            isAllChecked = true,
            checkboxs = Ext.fly(anchor).parent().query('[role=checkbox]');

        Ext.each(checkboxs, function(item) {
            if (!Ext.fly(item).hasCls('checked')) {
                isAllChecked = false;
                return false;
            }
        });

        return isAllChecked;
    },

    expandNode: function(target) {
        var me = this,
            btnExpand = Ext.fly(target),
            leafWrap = btnExpand.parent().next();

        leafWrap.setVisibilityMode(Ext.Element.DISPLAY);

        if (btnExpand.hasCls('open')) {
            leafWrap.hide();
            btnExpand.removeCls('open');
            btnExpand.next().next().removeCls('open');
        } else {
            leafWrap.show();
            btnExpand.addCls('open');
            btnExpand.next().next().addCls('open');
        }
    },

    getItemValues: function(row) {
        var me = this;

        return {
            code: row.getAttribute('data-code'),
            name: row.getAttribute('data-name')
        };
    },

    addOrRemoveCodes: function(anchor, checked) {
        var me = this,
            codeIndex, nameIndex,
            values = me.getItemValues(anchor),
            code = values.code,
            name = values.name;

        if (checked) {
            if (me.codes.indexOf(code) < 0) {
                me.codes.push(code);
            }
            if (me.names.indexOf(name) < 0) {
                me.names.push(name);
            }
        } else {
            codeIndex = me.codes.indexOf(code);
            nameIndex = me.names.indexOf(name);

            if (codeIndex > -1) {
                me.codes.splice(codeIndex, 1);
            }
            if (nameIndex > -1) {
                me.names.splice(nameIndex, 1);
            }
        }
    },

    optionChecked: function() {
        if (!this.picker) return;

        var me = this,
            el = me.picker.getTargetEl(),
            value = me.getValue() || '',
            values = !Ext.isArray(value) ? value.split(',') : value;

        me.codes = values;

        Ext.each(values, function(code) {
            var checkbox = el.query('[role=checkbox][data-code=' + code + ']');

            if (checkbox.length) {
                var anchor = Ext.fly(checkbox[0]).parent();
                Ext.fly(checkbox[0]).addCls('checked');
                me.checkParentNode(anchor);
            }
        });
    }
});