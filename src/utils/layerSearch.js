/* eslint-disable no-invalid-this */
/**
 * 查询组件
 * @param {vue对象} page
 * @param {图层列表} _layerSearchball
 * @param {*} ARCGISServer
 */
export function LayerSearch(page,settting){

    this.map = page.map;
    this.GIS = page.GIS;
    this.page = page;
    this.mapLayers = page.mapLayers;
    let layers = [];
    let settingObj = {};
    for (let i =0;i<settting.length;i++){
        let tempObj = settting[i];
        if (tempObj.search){
            let tempObjTemp = Object.assign(tempObj.search,{layer:this.mapLayers[tempObj.id].layer});
            layers.push(tempObjTemp);
            settingObj[tempObj.id] = tempObjTemp;
        } else {
            let tempObjTemp = {
                layerids:tempObj.show,
                ParamsDes:{},
                textSearchParams:['NAME','Shape','GB','ANGLE','ORIG_FID'],
                layer:this.mapLayers[tempObj.id].layer
            };
            layers.push(tempObjTemp);
            settingObj[tempObj.id] = tempObjTemp;
        }


    }


    this.setting = settingObj;
    this.layers = layers;
}


LayerSearch.prototype = {
    /**
     *  空间查询 点击地图查询
     **/
    pointSearch(item,fun){
        this.callBackFun = fun;
        if (item.graphic!=undefined) {
            return;
        }
        //todo:检查是否获取到效图层
        // if (this.getValid(this.layerSearchball.visibleLayers).length==0) {
        //     return;
        // }
        this.x1 = item.layerX;
        this.y1 = item.layerY;
        this.map.graphics.clear();
        this.map.infoWindow.hide();
        this.identifyexe(item.mapPoint,this.GIS.IdentifyTask,this.GIS.IdentifyParameters);

    },
    textSearch(text,callBackFun){
        this.page.mapLayers['tempLayer'].layer.clear();
        this.text = text;
        this.callBackFun = callBackFun;
        let promiseArray = [];

        for (let i = 0; i < this.layers.length; i++) {
            let layerObj = this.layers[i].layer;
            let layerid = layerObj.id;
            promiseArray.push(
                this.identifyText(
                    text,
                    layerObj,
                    this.setting[layerid]['textSearchParams'],
                    this.layers[i]
                )
            );

        }

        let that = this;
        Promise.all(promiseArray).then(function(results) {
            callBackFun(results,that.layers);
            for (let i =0;i<results.length;i++){
                let arrLayer = results[i];
                that.identifyResult(arrLayer);
            }
        });
    },
    /**
     *  空间查询 框选地图查询
     **/
    extendSearch(extend,callBackFun){
        this.page.mapLayers['tempLayer'].layer.clear();
        let promiseArray = [];
        for (let i = 0; i < this.layers.length; i++) {
            let layerObj = this.layers[i].layer;
            let serverURL = layerObj.url;
            promiseArray.push(
                this.identifyexe(
                    extend,
                    this.GIS.IdentifyTask,
                    this.GIS.IdentifyParameters,
                    layerObj,
                    serverURL,
                    this.layers[i]
                )
            );
        }


        let that = this;
        Promise.all(promiseArray).then(function(results) {
            callBackFun(results,that.layers);
            for (let i =0;i<results.length;i++){
                let arrLayer = results[i];
                that.identifyResult(arrLayer);
            }
        });
    },
    /**
     * 编辑查询参数
     * @param {*} mapPoint
     * @param {*} IdentifyTask
     * @param {*} IdentifyParameters
     */
    identifyText(text,layerObj,params,configObj){
        let finTask = new this.GIS.FindTask(layerObj.url);
        let allLayerIds = layerObj.visibleLayers;
        let findParameters = new this.GIS.FindParameters();
        findParameters.returnGeometry = true;
        findParameters.layerIds = this.getValid(allLayerIds,configObj.layerids);//allLayerIds;
        findParameters.searchFields = params;
        findParameters.searchText = text;

        let that = this;
        return new Promise(function(resolve, reject){
            finTask.execute(findParameters,function(result){
                for (let i =0;i<result.length;i++){
                    result[i].feature.attributes.paramsSetting = Object.assign({id:layerObj.id},that.setting[layerObj.id]);
                }
                resolve(result);
            },function(error){
                reject(error);
            });
        });
    },
    /**
     * 编辑查询参数
     * @param {*} mapPoint
     * @param {*} IdentifyTask
     * @param {*} IdentifyParameters
     */
    identifyexe(mapPoint,IdentifyTask,IdentifyParameters,layerObj,layerURL,configObj){

        let identifyTask = new IdentifyTask(layerURL);
        let identifyParams = new IdentifyParameters();
        identifyParams.tolerance = 3;//3;
        identifyParams.returnGeometry = true;
        let arr = layerObj.visibleLayers;
        //这里需要一个过滤器 当前显示的图层中去掉不需要查询的
        identifyParams.layerIds = this.getValid(arr,configObj.layerids);
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
        identifyParams.width = this.map.width;
        identifyParams.height = this.map.height;
        identifyParams.geometry = mapPoint.geometry;
        identifyParams.mapExtent = this.map.extent;
        let that = this;
        return new Promise(function(resolve, reject){
            identifyTask.execute(identifyParams,function(result){
                for (let i =0;i<result.length;i++){
                    result[i].feature.attributes.paramsSetting =
                    Object.assign(
                        {id:layerObj.id},
                        that.setting[layerObj.id]
                    );
                }
                resolve(result);
            },function(error){
                reject(error);
            });
        });
    },
    /**
   * 查询结果
   * @param {*} identifyresults
   */
    identifyResult(identifyresults){
        if (identifyresults.length === 0) {
            return;
        }
        for (let x = 0; x < identifyresults.length; x++) {

            let symbol;
            let linesymbol = new this.GIS.SimpleLineSymbol(this.GIS.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2.5);

            let synfilsymbol = new this.GIS.SimpleFillSymbol(
                this.GIS.SimpleFillSymbol.STYLE_SOLID,
                new this.GIS.SimpleLineSymbol(
                    this.GIS.SimpleLineSymbol.STYLE_SOLID,
                    new dojo.Color([255,0,0,0.4]),
                    1),
                new dojo.Color([255,255,0,0])
            );

            let feature = identifyresults[x].feature;
            if (!feature.geometry){
                continue;
            }
            switch (feature.geometry.type){
            case 'point':
                symbol = new this.GIS.SimpleMarkerSymbol(
                    esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    12,
                    new this.GIS.SimpleLineSymbol(
                        esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new dojo.Color([247, 34, 101]),
                        1),
                    new dojo.Color([207, 34, 171]));
                break;

            case 'polyline':
                symbol = linesymbol;
                break;
            default:
                symbol = synfilsymbol;
                break;
            }
            let locationGraphic = new this.GIS.graphic(feature.geometry, symbol);
            this.page.mapLayers['tempLayer'].layer.add(locationGraphic);
            // this.callBackFun();
        }
    },
    /**
   * 过滤不需要查询的图层
   * @param {*} arr
   */
    getValid(arr,layerids){
        let tempArr = [];
        for (let i =0;i<arr.length;i++){
            for (let j =0;j<layerids.length;j++){
                if (arr[i] === layerids[j]){
                    tempArr.push(arr[i]);
                    break;
                }
            }
        }
        return tempArr;
    },
    /**
   *
   * @param {图层排序} arr
   */
    sort(arr){
        for (let j=0;j<arr.length-1;j++){
            //两两比较，如果前一个比后一个大，则交换位置。
            for (let i=0;i<arr.length-1-j;i++){
                if (arr[i]>arr[i+1]){
                    let temp = arr[i];
                    arr[i] = arr[i+1];
                    arr[i+1] = temp;
                }
            }
        }
        return arr;
    }
};
