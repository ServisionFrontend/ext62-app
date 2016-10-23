/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('App.view.main.MainController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.main',

	onToggleNavigationSize: function() {
		var me = this,
			refs = me.getReferences(),
			navigationList = refs.navigationTreeList,
			navigationWrap = refs.navigationWrap,
			wrapContainer = refs.mainContainerWrap,
			collapsing = !navigationList.getMicro(),
			new_width = collapsing ? 64 : 250;

		if (!collapsing) {
			navigationList.setMicro(false);
			navigationWrap.setOverflowXY(false, true);
		} else {
			navigationWrap.scrollTo(0, 0);
			navigationWrap.setOverflowXY(false, false);
		}

		// Start this layout first since it does not require a layout
		refs.senchaLogo.animate({
			dynamic: true,
			to: {
				width: new_width
			}
		});

		// navigationWrap.width = new_width;
		navigationWrap.width = new_width;
		// navigationWrap.setWidth(new_width)

		wrapContainer.updateLayout({
			isRoot: true
		});

		if (collapsing) {
			// navigationList.setMicro(true);
			navigationWrap.on({
				afterlayoutanimation: function() {

					navigationList.setMicro(true);
				},
				single: true
			});
		}
	},

	onToggleMicro: function(button, pressed) {
		var treelist = this.lookupReference('treelist'),
			navBtn = this.lookupReference('navBtn'),
			wrapContainer = this.lookupReference('mainContainerWrap'),
			ct = treelist.ownerCt;
		pressed = treelist.getMicro();

		if (!pressed) {
			this.oldWidth = ct.width;
			ct.setWidth(44);
		} else {
			ct.setWidth(this.oldWidth);
		}

		treelist.setMicro(!pressed);
	}
});