import tileInfo from './tileInfo';
/**
 *
 * @param {*} GIS
 * @param {anno:标注,dem:地形图,image:影像图,layer:矢量图} type
 */
export const TDTMap = function (GIS,type) {
    let img = require('./images/logo.png');
    dojo.declare('TDT', GIS.TiledMapServiceLayer, {
        constructor(maptype) {
            this._maptype = maptype;
            this.spatialReference = new GIS.SpatialReference({wkid: 4326});
            this.initialExtent = this.fullExtent = new GIS.Extent(-180, -90, 180, 90,
                this.spatialReference);

            this.tileInfo = new GIS.TileInfo(tileInfo);
            this.loaded = true;
            this.onLoad(this);
        },
        getTileUrl(level, row, col) {
            if (this._maptype === 'anno'){//标注
                return 'http://t' + row % 8 + '.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=' + level + '&TILEROW=' + row + '&TILECOL=' + col + '&FORMAT=tiles'+'&tk=accbb5157ae177788ed05efa041014e4';
            } else if (this._maptype === 'dem'){//地形图
                return 'http://t' + col % 8 + '.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX=' + level + '&TILECOL=' + col + '&TILEROW=' + row+'&tk=accbb5157ae177788ed05efa041014e4';
            } else if (this._maptype === 'image'){//影像图
                return 'http://t' + col % 8 + '.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix=' + level + '&TileRow=' + row + '&TileCol=' + col + '&style=default&format=tiles'+'&tk=accbb5157ae177788ed05efa041014e4';
            } else if (this._maptype === 'layer'){//矢量图
                return 'http://t' + col%8 + '.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX='+level+'&TILEROW='+row+'&TILECOL='+col+'&FORMAT=tiles'+'&tk=accbb5157ae177788ed05efa041014e4';
            }
            return img;//'http://www.google.cn/maps/vt?lyrs=s@183&gl=JP&x=103&y=31&z=8';
        }
    });

};