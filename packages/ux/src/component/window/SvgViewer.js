Ext.define("Ext.ux.component.window.SvgViewer", {
    extend: 'Ext.window.Window',
    alias: 'widget.svgviewer',
    requires: hasSVG() ? [
        'Ext.util.d3'
    ] : [],
    width: 560,
    height: 578,
    title: '查看SVG',
    closable: true,
    modal: true,
    resizable: false,
    constrainHeader: true,
    bodyStyle: 'background-color:#fff',
    layout: 'fit',
    noImgPath: '/styles/images/no-img.png',
    noViewImgPath: '/styles/images/noview-img.png',
    listeners: {
        afterrender: function() {
            var me = this;

            me.init();
        }
    },

    init: function() {
        var me = this;

        me.buildEl();

        if (me.url) {
            if (hasSVG()) {
                me.loadSVG(me.url);
            } else {
                setTimeout(function() {
                    me.loadErrorImg(me.noViewImgPath);
                }, 10)
            }
        } else {
            setTimeout(function() {
                me.loadErrorImg(me.noImgPath);
            }, 10)
        }
    },

    buildEl: function() {
        var me = this;

        me.svgWrap = me.down('[itemId=svgWrap]');
    },

    loadSVG: function(url, fnLoaded) {
        var me = this;

        me.setLoading(true);

        window.setTimeout(function() {
            d3.text(url, function(error, xmlStr) {
                me.setLoading(false);
                if (error === null && me.isSVG(xmlStr)) {
                    me.finishLoad(xmlStr, fnLoaded);
                } else {
                    me.loadErrorImg(me.noImgPath);
                }
            });
        }, 1);
    },

    finishLoad: function(xmlStr, fnLoaded) {
        var me = this;

        me.buildSVG(xmlStr);
    },

    loadErrorImg: function(src) {
        var me = this,
            html = '<div style="width:100%;height:100%;background:url(' + src + ') no-repeat center center"></div>';

        me.setSvgWrapSize();

        me.svgWrap.update(html, null, function() {
            this.setSize(me.body.getSize());
        });
    },

    setSvgWrapSize: function() {
        var me = this,
            size = me.body.getSize();

        me.svgWrap.setSize(size);
    },

    buildSVG: function(xmlStr) {
        var me = this,
            svgTagStr = xmlStr.match(/<svg[^>]*>/i),
            svgTagInnerContent = xmlStr.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i),
            newXmlStr = svgTagStr + '<g>' + svgTagInnerContent[1] + ' </g> </svg>';

        me.setSvgWrapSize();
        me.svgWrap.update(newXmlStr, null, function() {
            this.setStyle('display', 'block');
            this.parent().setStyle('display', 'block');
            Ext.fly(this.query('svg')[0]).setStyle({
                width: '100%',
                height: '100%'
            });
        });
    },

    isSVG: function(xmlStr) {
        var me = this;

        return xmlStr.match(/<svg[^>]*>/i) ? true : false;
    },

    items: [{
        layout: {
            type: 'hbox',
            pack: 'center',
            align: 'middel'
        },
        border: false,
        items: [{
            itemId: 'svgWrap',
            xtype: 'panel',
            border: false
        }]
    }]
});