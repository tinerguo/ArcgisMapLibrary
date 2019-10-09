/**
 * Created by tiner on 2018/10/22.
 */
import AmMap from '@/components/AmMap';
import ArcgisMap from '@/components/ArcgisMap/ArcgisMap';
import mapTooles from '@/components/mapTooles/mapTooles';
import cooding from '@/components/cooding/cooding';
import mapSwitch from '@/components/mapSwitch/mapSwitch';
import mapFont from '@/components/iconfont/mapFont/index.vue';
import mapSearch from '@/components/mapSearch/mapSearch.vue';
import stationLayers from '@/components/stationLayers/stationLayers.vue';
import mapLend from '@/components/mapLend/mapLend.vue';
import mapDrow from '@/components/mapDrow/mapDrow.vue';
import mapWin from '@/components/mapWin/mapWin.vue';

import mapMenuV1 from '@/components/mapMenus/mapMenuV1/mapMenuV1.vue';
import menuItemV1 from '@/components/mapMenus/mapMenuV1/components/menuItem.vue';

import mapMenuV2 from '@/components/mapMenus/mapMenuV2/mapMenuV2.vue';
import menuItemV2 from '@/components/mapMenus/mapMenuV2/components/menuItem.vue';

require('@/assets/map.css');
const components = {
    ArcgisMap:ArcgisMap,
    mapTooles:mapTooles,
    cooding:cooding,
    mapSwitch:mapSwitch,
    mapFont:mapFont,
    mapSearch:mapSearch,
    stationLayers:stationLayers,
    mapLend:mapLend,
    mapDrow:mapDrow,
    mapWin:mapWin,
    mapMenuV1:mapMenuV1,
    menuItemV1:menuItemV1,
    mapMenuV2:mapMenuV2,
    menuItemV2:menuItemV2
};

const install = function(Vue) {
    if (install.installed) {
        return;
    }
    Vue.use(AmMap);
    Object.keys(components).forEach(key => {
        Vue.component(key,components[key]);
    });
};

const API = {
    install,
    ...components
};

//自动安装
/****/
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue,window.opts);
}

export default API;