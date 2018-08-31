/**
 * This view is an example list of people.
 */
Ext.define('CpsiMapview.view.main.Map', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainlist',

    requires: [
        'GeoExt.component.Map',

        'BasiGX.view.button.ZoomToExtent'
    ],

    layout: 'fit',

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'basigx-button-zoomtoextent',
            extent: [-1210762, 6688545, -600489, 7490828]
        }]
    }, {
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
            text: 'Docked to the bottom'
        }]
    }],

    items: [{
        xtype: 'gx_map',
        map: new ol.Map({
            // layers will be created from config in initComponent
            layers: [],
            view: new ol.View({
                center: ol.proj.fromLonLat( [-8, 53.5] ),
                zoom: 8
            })
        })
    }],

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        // Load layer JSON configuration
        Ext.Ajax.request({
            url: 'resources/data/layers/default.json',
            success: function (response) {
                var layerJson = Ext.decode(response.responseText);

                Ext.each(layerJson.layers, function (layerConf) {
                    var layer = LayerFactory.createLayer(layerConf);
                    if (layer) {
                        me.olMap.addLayer(layer);
                    }
                });
            }
        });

        me.callParent(arguments);

        // make sub components accessible as members
        me.mapCmp = me.down('gx_map');
        me.olMap = me.mapCmp.map;

        CpsiMapview.getApplication().fireEvent('mapready', me);
    }
});