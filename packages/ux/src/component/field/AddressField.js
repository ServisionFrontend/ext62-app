Ext.define('Ext.ux.component.field.AddressField', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.addressfield',
    triggerCls: Ext.baseCSSPrefix + 'form-time-trigger',
    activeTab: 'province',
    emptyText: '请选择省市区',
    editable: false,
    enableKeyEvents: true,
    validator: function() {
        if (this.selectionAddress) {
            if (this.selectionAddress['province'].code !== null &&
                this.selectionAddress['city'].code !== null &&
                this.selectionAddress['area'].code !== null) {
                return true;
            } else {
                return '地址信息不完整';
            }
        }
        if (this.tabPanel) {
            if (this.tabPanel.selectionAddress['province'].code !== null &&
                this.tabPanel.selectionAddress['city'].code !== null &&
                this.tabPanel.selectionAddress['area'].code !== null) {
                return true;
            } else {
                return '地址信息不完整';
            }
        }
    },

    createPicker: function() {
        var me = this;

        me.tabPanel = Ext.create('Ext.tab.Panel', {
            floating: true,
            pickerField: me,
            hidden: true,
            ownerCt: me.ownerCt,
            selectionAddress: me.getSelectionAddress(),
            itemId: 'tab-address',
            defaults: {
                height: 200
            },
            items: [me.getProvinceItem(), me.getCityItem(), me.getAreaItem()],
            listeners: {
                tabchange: function(that, tabTarget) {
                    me.selectionTab(tabTarget);
                }
            }
        });

        return me.tabPanel;
    },

    getSelectionAddress: function() {
        var me = this,
            selectionAddress = {
                province: {
                    name: null,
                    code: null
                },
                city: {
                    name: null,
                    code: null
                },
                area: {
                    name: null,
                    code: null
                }
            };

        if (me.selectionAddress) {
            for (var key in selectionAddress) {
                selectionAddress[key].code = me.selectionAddress[key].code;
                selectionAddress[key].name = me.selectionAddress[key].name;
            }
        }

        me.selectionAddress = null;
        return selectionAddress;
    },

    selectionTab: function(tabTarget) {
        var me = this;

        tabTarget.load();
    },

    getProvinceItem: function() {
        var me = this,
            item = {
                action: 'province',
                title: ' 省 份 ',
                url: EPCM.globalConfig.restpath + '/base-data/country/province',
                listeners: {
                    afterrender: function() {
                        var that = this;
                        that.mon(
                            that.el, 'click',
                            function(event, target) {
                                me.selectionEl(that, target);
                            },
                            that, {
                                delegate: 'a'
                            }
                        );
                        that.load();
                    }
                },

                load: function() {
                    var that = this;

                    Ext.util.ajax({
                        url: that.url,
                        beforerequest: function() {
                            that.setLoading('loading');
                        },
                        callback: function() {
                            that.setLoading(false);
                        },
                        success: function(root) {
                            that.renderHtml(root.result);
                            me.setElActive(that);
                        }
                    });
                },

                renderHtml: function(result) {
                    var that = this,
                        data = that.buildData(result),
                        tpl = that.getHtmlTpl(),
                        html = new Ext.XTemplate(tpl).apply(data);

                    that.el.update(html);
                },

                getHtmlTpl: function() {
                    var tpl = '<div data-flag="parent" class="container">' +
                        '<ul class="group-list">' +
                        '<tpl for="list" >' +
                        '<li class="group">' +
                        '<div class="title">{name}</div>' +
                        '<ul class="cont clearfix">' +
                        '<tpl for="group">' +
                        '<li class="option">' +
                        '<a class="btn" href="javascript:void(0);" data-code="{code}" data-name="{name}" title="{name}">{name}</a>' +
                        '</li>' +
                        '</tpl>' +
                        '</ul>' +
                        '</li>' +
                        '</tpl>' +
                        '</ul>' +
                        '</div>';
                    return tpl;
                },

                buildData: function(result) {
                    var me = this,
                        data = [],
                        area = {
                            a: "A-G",
                            b: 'H-K',
                            c: 'L-S',
                            d: 'T-Z'
                        };

                    for (var key in result) {
                        data.push({
                            name: area[key],
                            group: result[key]
                        });
                    }

                    return {
                        list: data
                    };
                }
            };

        return item;
    },

    getCityItem: function() {
        var me = this,
            item = {
                action: 'city',
                title: ' 城 市 ',
                url: EPCM.globalConfig.restpath + '/base-data/country/province/{0}/city',
                listeners: {
                    afterrender: function() {
                        var that = this;
                        that.mon(
                            that.el, 'click',
                            function(event, target) {
                                me.selectionEl(that, target);
                            },
                            that, {
                                delegate: 'a'
                            }
                        );
                    }
                },

                load: function(code) {
                    var that = this,
                        code = me.tabPanel.selectionAddress['province'].code;

                    if (code === null) {
                        that.el.update('');
                        return;
                    }
                    Ext.util.ajax({
                        url: Ext.String.format(that.url, code),
                        beforerequest: function() {
                            that.setLoading('loading');
                        },
                        callback: function() {
                            that.setLoading(false);
                        },
                        success: function(root) {
                            that.renderHtml(root.result);
                            me.setElActive(that);
                        }
                    });
                },

                renderHtml: function(result) {
                    var that = this,
                        tpl = that.getHtmlTpl(),
                        html = new Ext.XTemplate(tpl).apply({
                            group: result
                        });

                    that.el.update(html);
                },

                setActive: function() {
                    var that = this,
                        code = me.tabPanel.selectionAddress[that.action].code;

                    if (code !== null) {
                        Ext.fly(that.el).select('a').removeCls('area-active');
                        Ext.fly(that.el).select('[data-code="' + code + '"]').addCls('area-active');
                    }
                },

                getHtmlTpl: function() {
                    var tpl = '<ul data-flag="parent" class="cont2 clearfix">' +
                        '<tpl for="group">' +
                        '<li class="option">' +
                        '<a class="btn" href="javascript:void(0);" data-code="{code}" data-name="{name}" title="{name}">{name}</a>' +
                        '</li>' +
                        '</tpl>' +
                        '</ul>';
                    return tpl;
                }
            };

        return item;
    },

    getAreaItem: function() {
        var me = this,
            item = {
                action: 'area',
                title: ' 县 区 ',
                url: EPCM.globalConfig.restpath + '/base-data/country/province/city/{0}/area',
                listeners: {
                    afterrender: function() {
                        var that = this;
                        that.mon(
                            that.el, 'click',
                            function(event, target) {
                                me.selectionEl(that, target);
                            },
                            that, {
                                delegate: 'a'
                            }
                        );
                    }
                },

                load: function(code) {
                    var that = this,
                        code = me.tabPanel.selectionAddress['city'].code;

                    if (code === null) {
                        that.el.update('');
                        return;
                    }
                    Ext.util.ajax({
                        url: Ext.String.format(that.url, code),
                        beforerequest: function() {
                            that.setLoading('loading');
                        },
                        callback: function() {
                            that.setLoading(false);
                        },
                        success: function(root) {
                            that.renderHtml(root.result);
                            me.setElActive(that);
                        }
                    });
                },

                renderHtml: function(result) {
                    var that = this,
                        tpl = that.getHtmlTpl(),
                        html = new Ext.XTemplate(tpl).apply({
                            group: result
                        });

                    that.el.update(html);
                },

                getHtmlTpl: function() {
                    var tpl = '<ul data-flag="parent" class="cont2 clearfix">' +
                        '<tpl for="group">' +
                        '<li class="option">' +
                        '<a class="btn" href="javascript:void(0);" data-code="{code}" data-name="{name}" title="{name}">{name}</a>' +
                        '</li>' +
                        '</tpl>' +
                        '</ul>';
                    return tpl;
                }
            };

        return item;
    },

    selectionEl: function(that, target) {
        var me = this,
            type = that.action,
            code = target.getAttribute('data-code'),
            name = target.getAttribute('data-name');

        me.setSelectionValue(type, code, name);
        me.setElActive(that);
        me.setSelectionName();
        me.activeTab(type);

        me.fireEvent('selectionchange', me);
    },

    setElActive: function(that) {
        var me = this,
            code = me.tabPanel.selectionAddress[that.action].code;

        Ext.fly(that.el).select('a').removeCls('area-active');
        if (code !== null) {
            Ext.fly(that.el).select('[data-code="' + code + '"]').addCls('area-active');
        }
    },

    activeTab: function(type) {
        var me = this,
            tpProvince = me.tabPanel.down('[action=province]'),
            tpCity = me.tabPanel.down('[action=city]'),
            tpArea = me.tabPanel.down('[action=area]');

        switch (type) {
            case "province":
                me.tabPanel.setActiveTab(tpCity);
                break;
            case "city":
                me.tabPanel.setActiveTab(tpArea);
                break;
            case "area":
                me.collapse();
                break;
            default:
                break;
        }
    },

    setSelectionValue: function(type, code, name) {
        var me = this,
            selectionAddress = me.tabPanel.selectionAddress;

        if (type === 'province') {
            selectionAddress['city']['code'] = null;
            selectionAddress['city']['name'] = null;
            selectionAddress['area']['code'] = null;
            selectionAddress['area']['name'] = null;
        }
        if (type === 'city') {
            selectionAddress['area']['code'] = null;
            selectionAddress['area']['name'] = null;
        }
        selectionAddress[type]['code'] = code;
        selectionAddress[type]['name'] = name;
    },

    setSelectionName: function() {
        var me = this,
            name, list = [];

        for (var key in me.tabPanel.selectionAddress) {
            name = me.tabPanel.selectionAddress[key].name;
            if (name !== null) {
                list.push(name);
            }
        }

        me.setValue(list.join('/'));
    },

    reloadAddress: function() {
        var me = this,
            activeTab = me.tabPanel.getActiveTab(),
            code = me.tabPanel.selectionAddress[activeTab.action].code;

        if (code === null) {
            activeTab.load();
        }
    },

    getSelectionValues: function() {
        var me = this,
            values = {};

        if (typeof me.tabPanel == 'undefined') return;

        for (var key in me.tabPanel.selectionAddress) {
            values[key] = me.tabPanel.selectionAddress[key].code;
        }

        return values;
    },

    listeners: {
        expand: function() {
            if (this.tabPanel) {
                //this.reloadAddress();
            }
        }
    }
});