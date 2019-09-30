
export let defaultSetting = {
    debugger:true,
    x:117.38984,
    y:39.14688,
    level:9,
    baseMap:{
        visibility:true,
        type:'tdt',//谷歌地图:google,天地图:tdt
        defaultshow:'terrains',//影像图:images,地形图:terrains,矢量图:layers
        labelLayerVisibility:true,//地图标注
        shadeLayer:{
            visibility:true,
            opacity:0.5
        }

    },
    lend:{
        shadeLayerVisibility:false,
        labelsLayerVisibility:false
    },
    type:{
        dynamicLayers:{
        }
    }
};
