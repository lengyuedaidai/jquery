define( [
	"./core",
	"./core/nodeName",
	"./core/camelCase",
	"./core/toType",
	"./var/isFunction",
	"./var/isWindow",
	"./var/slice",

	"./event/alias"
], function( jQuery, nodeName, camelCase, toType, isFunction, isWindow, slice ) {
/**
 * 已弃用的方法集合
 */
"use strict";

jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
/**
 * 修改函数fn的this指向
 */
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	/**
	 * 如果第二个参数为String时
	 * 则fn实际为一个对象的属性，而绑定this指向当前对象
	 * eg：var obj = {a:function(){console.log(this)}}
	 * 		$("body").on("click",$.proxy(obj,"a"));
	 * $.proxy(obj,"a") => $.proxy(obj.a,obj)
	 */
	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {//如果fn不是函数
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );//截取参数，前两个参数为proxy的参数，后面的参数为函数执行参数
	proxy = function() {
		//执行fn，参数为proxy中扩展的参数和执行所携带的参数集合
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	//返回一个新的代理函数
	return proxy;
};
/**
 * 是否延迟ready执行
 * 当$.holdReady(true)时，$(document).ready会在加载完之后并且$.holdReady(false)后执行
 */
jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
//是否是数组
jQuery.isArray = Array.isArray;
//String转换为JSON对象
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
//是否是方法
jQuery.isFunction = isFunction;//
//是否为window对象
jQuery.isWindow = isWindow;
//转换驼峰命名，a-aa-bb=>aAaBb
jQuery.camelCase = camelCase;
jQuery.type = toType;
//获取当前时间方法
jQuery.now = Date.now;
//是否为数字，其中包括可转换为数字的字符串
jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

} );
