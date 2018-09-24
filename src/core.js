/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module
/**
 * 以var开头的引用都是模块相关的全局变量
 */
define( [
	"./var/arr",//空数组
	"./var/document",//window.document对象
	"./var/getProto",//Object.getPrototypeOf方法，获取对象的__proto__方法
	"./var/slice",//数组的[].slice方法,arr.slice(start,end),从已有的数组中返回选定的元素,start可以为负数，不改变原数组
	"./var/concat",//数组的[].concat方法,arr.concat(arrayX,arrayX,......,arrayX),用于连接两个或多个数组，不改变原数组
	"./var/push",//数组的[].push方法,arr.push(newelement1,newelement2,....,newelementX),可向数组的末尾添加一个或多个元素，并返回新的长度。
	"./var/indexOf",//数组的[].indexOf方法，arr.indexOf(item,start),可返回数组中某个指定的元素位置,start为开始寻找下标，只能为整数，返回第一个对应元素所在位置
	"./var/class2type",//用于Object.prototype.toString.call([])的对象类型比较，为'[object Object]':'object';'[object Array]':'array'
	"./var/toString",//对象的{}.toString方法
	"./var/hasOwn",//对象的{}.hasOwnProperty方法,此方法只判断是否自身是否存在有属性名的值，不进行查找原型链，而in会去查找原型链
	"./var/fnToString",//对象的{}.hasOwnProperty.toString的方法，{}.hasOwnProperty.toString.call(fn),可把一个函数fn转为字符串形式
	"./var/ObjectFunctionString",//字符串"function Object() { [native code] }",一个Object构造器的字符串
	"./var/support",
	"./var/isFunction",//判断一个对象是否是function
	"./var/isWindow",//判断一个对象是否是window对象
	"./core/DOMEval",
	"./core/toType"//数据类型判断，返回为"number"|"string"|"boolean"|"function"|"object"|"array"
], function( arr, document, getProto, slice, concat, push, indexOf,
	class2type, toString, hasOwn, fnToString, ObjectFunctionString,
	support, isFunction, isWindow, DOMEval, toType ) {

"use strict";

var
	version = "@VERSION",//定义版本号，在打包时会对@VERSION进行全文替换

	// Define a local copy of jQuery
	/**
	 * 定义jQuery对象，返回值是一个new 的jQuery.fn.init的对象
	 * 在core/init.js中 定义了jQuery.fn.init构造器，并且使得init.prototype = jQuery.fn;
	 * 而下面可以看到jQuery.fn = jQuery.prototype ;
	 * 所以 init.prototype = jQuery.fn = jQuery.prototype；
	 * 所以说 jQuery("#id") = new jQuery("#id") = new jQuery.fn.init("#id");
	 */
	jQuery = function( selector, context ) {
		
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	/**
	 * 定义去除空格正则表达式
		\s：空格，/r/n
		\uFEFF：字节次序标记字符（Byte Order Mark），也就是BOM,它是es5新增的空白符
		\xA0：禁止自动换行空白符，相当于html中的&nbsp;
	 */
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
/**
 * jQuery.fn = jQuery.prototype 
 * 使fn等于jQuery的原型；
 * 这样同样的extend方法中，$.extend就是扩展的$的属性；
 * $.fn.extend扩展的就是jQuery.prototype的属性，这上面的属性就只能jq实例才能使用啦
 */
jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	//版本号
	jquery: version,
	//构造器，对构函指向的修正
	constructor: jQuery,

	// The default length of a jQuery object is 0
	//使得jquery对象为类数组对象
	length: 0,
	//使jquery类数组对象转为数组对象
	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	/**
	 * 如果num为null，返回元素集合；
	 * 如果指定num，则返回第num个元素
	 * num可以为负数，负数则从后取
	 */
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	/**
	 * jq的入栈操作处理，和end方法相配合，进行先进后出的操作顺序
	 */
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	/**
	 * 遍历jq对象
	 */
	each: function( callback ) {
		return jQuery.each( this, callback );
	},
	/**
	 * 遍历jq，操作jq对象后返回一个同长度的数组对象，放入操作栈，包装成jq类数组对象
	 */
	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},
	/**
	 * 将截取后对象放入到栈jq对象中，形成链式结构
	 */
	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},
	/**
	 * 取第一个元素JQ对象
	 */
	first: function() {
		return this.eq( 0 );
	},
	/**
	 * 取最后一个元素JQ对象
	 */
	last: function() {
		return this.eq( -1 );
	},
	/**
	 * 取当前jq对象的第i个元素，并将此结果放入操作栈中(在操作栈中，会将元素数组转换为jq对象)
	 * i可以为负数
	 */
	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},
	/**
	 * 取栈中上一个对象，如果没有，则返回空的jq对象
	 */
	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};
/**
 * 当只有一个参数对象时
 * jQuery.extend用于扩展工具方法，如：$.extend({a:function(){alert(1)}});$.a();
 * jQuery.fn.extend用于扩展JQ实例方法 ，如：$.fn.extend({a:function(){alert(1)}});$().a();
 * 当有多个参数对象时
 * 把后面的对象的属性扩展到第一个对象上面
 * 可以用做深拷贝或者浅拷贝
 * 默认为浅拷贝，如果第一参数为true，则为深拷贝 如$.extend(true,{},{a:{a:"A"}})
 */
jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},//目标对象
		i = 1,//拷贝起始参数下标
		length = arguments.length,//参数长度
		deep = false;//是否是深拷贝

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {//如果第一个参数为boolean，则第一个参数为是否为深拷贝，第二个参数才开始为目标对象
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;//下标后移
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {//如果目标参数不是对象或者函数，则变为对象
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {//是否是插件扩展，即只传了一个目标对象，则应将目标对象转换为this对象
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {//是否为null判断

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {//防止循环引用，出现死循环
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {//如果是深拷贝，并且是对象或者数组

					if ( copyIsArray ) {//如果是数组对象，如果目标对象不存在此属性，或者目标对象的此属性不为数组，则新建数组赋予目标对象
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {//如果是对象，如果目标对象不存在此属性，或者目标对象的此属性不为对象，则新建对象赋予目标对象
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					//递归拷贝对象
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {//如果是不为undefined的简单数据对象，则直接拷贝
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	//返回修改后的目标对象
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	//生成jq唯一字符串（内部）
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,
	//抛出错误
	error: function( msg ) {
		throw new Error( msg );
	},
	//空函数，用于填充默认参数，减少定义来减少内存占用
	noop: function() {},
	/**
	 * 判断对象自变量，判断是否为Object的直系对象，如{},new Object()
	 */
	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {//如果不是Object对象，返回false
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {//如果没有原型链，返回true
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		//如果这个对象的原型的构造器不是Object的构造器，则返回false，否则为true
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},
	/**
	 * 判断是否为空对象可以判断是否为{}|[]等
	 */
	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	//全局执行代码块字符串
	globalEval: function( code ) {
		DOMEval( code );
	},
	/**
	 * 循环遍历集合或者对象，类似于array的forEach方法，他返回false可以终止循环，forEach不会
	 */
	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {//如果是数组或类数组
			length = obj.length;
			for ( ; i < length; i++ ) {//for循环遍历数组
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {//如果回调返回false，停止遍历
					break;
				}
			}
		} else {
			for ( i in obj ) {//foreach循环遍历对象
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {//如果回调返回false，停止遍历
					break;
				}
			}
		}

		return obj;//返回原对象
	},

	// Support: Android <=4.0 only
	/**
	 * 去除前后空格
	 */
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	/**
	 * 将对象，类数组转为数组，
	 * results参数只是内部使用，其实你如果是想转一个自己定义的类数组，就可以用results
	 */
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			//如果arr为类数组
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?//因为string对象也有length，但并非类数组
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},
	/**
	 * 从第i个元素开始，elem是否存在于arr中
	 * elem 判断的元素
	 * arr 所在数组
	 * i 第i个元素开始判断
	 * eg: $.inArray("a",["b","a","a","d"],2)
	 */
	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	/**
	 * 合并两个类数组或数组
	 */
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {//可分解为first[i] =  second[ j ];i++;j++;
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},
	/**
	 * 过滤得到新数组 类似于array的filter方法
	 * elems 过滤的目标数组对象
	 * callback 过滤方法，收集返回值为true的对象 参数为 item index
	 * invert 是否为反向过滤 即如果设为true，则收集返回值不为true的对象，默认false
	 */
	grep: function( elems, callback, invert ) {
		var callbackInverse,//每个回调的返回
			matches = [],//匹配结果
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {//如果返回结果等于过滤需要结果，把对象放入匹配池中
				matches.push( elems[ i ] );
			}
		}
		//返回匹配结果
		return matches;
	},
	
	// arg is for internal usage only
	/**
	 * 映射一个新数组，类似于array中的map方法，不同的是null对象他不放入新数组中，下标可能会和原数组不一致
	 * elems 目标数组对象，也可以直接是一个对象
	 * callback 映射方法，返回一个新值或者新对象，将此值放入收集器中，参数为 item index arg
	 * arg 映射方法中的额外公共参数 内部使用
	 * 
	 */
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {//如果是数组或类数组
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {//如果返回值不为空，放入收集器中
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {//遍历对象
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {//如果返回值不为空，放入收集器中
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		//压平嵌套数组
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	//唯一标识符，内部使用
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
/**
 * 将对象类型的toString返回值放入到class2type中，用于后续$.tpye的使用
 */
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

return jQuery;
} );
