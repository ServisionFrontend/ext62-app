Ext.define('Ext.ux.plugin.VerifyCodeField', {
    extend : 'Ext.form.field.Trigger',
    alias : ['widget.verifycodefield', 'widget.verifycode'],
    codeImgUrl : Ext.BLANK_IMAGE_URL,
    imgMargin : 5,
    imgWidth : 75,
    imgHeight : 23,
    clearOnClick : true,
    extraFieldBodyCls : Ext.baseCSSPrefix + 'form-file-wrap',
    componentLayout : 'triggerfield',
    childEls : ['imageWrap'],
    onRender : function() {
        var me = this, id = me.id, inputEl;
        
        me.callParent(arguments);
        inputEl = me.inputEl;
        inputEl.dom.name = '';
        me.image = new Ext.Img(Ext.apply({
            renderTo : id + '-imageWrap',
            ownerCt : me,
            ownerLayout : me.componentLayout,
            id : id + '-img',
            ui : me.ui,
            src : me.codeImgUrl,
            disabled : me.disabled,
            width : me.imgWidth,
            height : me.imgHeight,
            style : me.getImgMarginProp() + me.imgMargin + 'px;cursor:pointer;',
            inputName : me.getName(),
            listeners : {
                scope : me,
                click : {
                    element : 'el',
                    fn : me.onImgClick
                }
            }
        }, me.imgConfig));
 
        me.imageWrap.dom.style.width = (me.imgWidth + me.image.getEl().getMargin('lr')) + 'px';
        
        if (Ext.isIE) {
            me.image.getEl().repaint();
        }
    },
 
    /**
     * Gets the markup to be inserted into the subTplMarkup.
     */
    getTriggerMarkup : function() {
        return '<td id="' + this.id + '-imageWrap"></td>';
    },
 
    onImgClick : function() {
        this.image.setSrc(this.codeImgUrl + '?time=' + new Date().getTime());
        this.reset();
    },
    getImgMarginProp : function() {
        return 'margin-left:';
    },
 
    setValue : Ext.emptyFn,
 
    reset : function() {
        var me = this, 
        	clear = me.clearOnClick;
        	
        if (me.rendered) {
            if (clear) {
                me.inputEl.dom.value = '';
            }
        }
    }
});