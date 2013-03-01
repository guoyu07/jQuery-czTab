/**
 * $.czTab
 * @extends jquery.1.4.2
 * @fileOverview Tab bar
 * @author Lancer
 * @email lancer.he@gmail.com
 * @site crackedzone.com
 * @version 0.2
 * @date 2012-05-23
 * Copyright (c) 2011-2012 Lancer
 * @example
 *    jQuery("#area").czTab();
 */

(function($) {

    //Name Space
    var czUI = czUI || {}

    $.fn.czTab = function( options ){

        var PNAME = 'czTab';
        var objData = jQuery(this).data(PNAME);

        //Get instance object
        if (typeof options == 'string' && options == 'instance') {
            return objData;
        }

        //Extend options
        var options = $.extend( {}, czUI.czTab.defaults, options || {} );

        //Autoinstantiating object for factory model
        return jQuery(this).each(function (){
            var czTab = new czUI.czTab( options );
            czTab.$element = jQuery(this);
            czTab.init();
            jQuery(this).data( PNAME, czTab );
        });
    }

    czUI.czTab = function( options ) {
        this.NAME    = 'czTab';
        this.VERSION = '0.2';
        this.options = options;
        this.$element= null;
    }

    czUI.czTab.defaults = {
        tabClass   : 'tab',
        panelClass : 'panel',
        activeClass: 'active',
        eventType   : 'click',   //click or hover
        displayType : 'show',    //fade, show, slide
        displaySpeed: '500',     //fade, slide speed
        initCallback : null,     //Call back after initialization
        changeCallback: null,    //Call back when tab has change
        showCallback: null,      //Call back after panel show
        hideCallback: null       //Call back after panel hide
    }

    czUI.czTab.prototype = {

        debug : function( $message ) {

            if ( typeof $message == 'undefined') $message = this;

            if (window.console && window.console.log)
                window.console.log($message);
            else
                alert($message);

        },


        _callback: function(evt) {
            if( typeof this.options[evt + 'Callback'] != 'function')
                return;

            this.options[evt + 'Callback'].call(this);
        },


        _setTab: function() {
            var self = this;
            switch (this.options.eventType) {
                case 'hover':
                    var eventType = 'mouseenter';
                    break;
                case 'click':
                    var eventType = 'click';
                    break;
                default:
            }

            this.$tab.each(function(index) {
                jQuery(this).bind( eventType, function() {
                    if ( jQuery(this).hasClass(self.options.activeClass) )
                        return;

                    self.$element.find('.' + self.options.activeClass ).removeClass( self.options.activeClass );
                    jQuery(this).addClass( self.options.activeClass );
                    self._callback('change');

                    self.showPanel(index);
                });
            });

        },


        showPanel: function(index) {
            if ( this.$panel.eq(index).is(':visible') == true)
                return;

            var self = this;
            var $current = this.$element.find('.' + this.options.panelClass + ':visible');

            switch (this.options.displayType) {
                case 'fade':
                    $current.hide();
                    self._callback('hide');
                    self.$panel.eq(index).stop(true,true).fadeIn(self.options.displaySpeed, function() {
                            self._callback('show');
                        });
                    break;

                case 'slide':
                    $current.slideUp( self.options.displaySpeed, function() {
                        self._callback('hide');
                        self.$panel.eq(index).slideDown(self.options.displaySpeed, function() {
                            self._callback('show');
                        });
                    });
                    break;

                default: //click

                    $current.hide();

                    this._callback('hide');

                    this.$panel.eq(index).show();

                    this._callback('show');
            }

        },


        init: function() {
            this.$tab   = this.$element.find('.' + this.options.tabClass);
            this.$panel = this.$element.find('.' + this.options.panelClass);
            //this.debug(this.$tab);

            if (this.$tab.length == 0 || this.$panel.length == 0)
                return;

            this._setTab();
        }
    }
})(jQuery);