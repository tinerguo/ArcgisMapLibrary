/**
 * 解析器
 * 功能：负责vue自定义变量、配置和Arcgis变量之间的解析
 * 解耦arcgis工具类和vue组价配置项，
 *    如果vue组件配置发生变化不会影响到工具类只需要修改这个配置解析器即可
 */

// 深度合并对象
export function deepObjectMerge(FirstOBJ, SecondOBJ) {


    for (let key in SecondOBJ) {
        if (FirstOBJ[key] ){
            if (Object.prototype.toString.call(FirstOBJ[key]) === '[object Array]'){
                if (SecondOBJ[key] && Object.prototype.toString.call(SecondOBJ[key]) === '[object Array]'){
                    FirstOBJ[key] = FirstOBJ[key].concat(SecondOBJ[key]);
                }
            } else if (FirstOBJ[key] &&FirstOBJ[key].toString() === '[object Object]'){
                deepObjectMerge(FirstOBJ[key], SecondOBJ[key]);
            }
        } else {
            FirstOBJ[key] = SecondOBJ[key];
        }
    }

    return FirstOBJ;
}

export default {
    deepObjectMerge
};