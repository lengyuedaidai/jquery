define( [
	"../var/class2type",
	"../var/toString"
], function( class2type, toString ) {

"use strict";
/**
 * 判断数据类型，返回数据类型的string名字
 */
function toType( obj ) {
	if ( obj == null ) {//如果是null或者undefined，直接返回字符串
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?//是否是基本类型，function是为了判断RegExp正则
		class2type[ toString.call( obj ) ] || "object" ://引用类型
		typeof obj;//基本类型
}

return toType;
} );
