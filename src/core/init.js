// Initialize a jQuery object
define( [
	"../core",
	"../var/document",
	"../var/isFunction",
	"./var/rsingleTag",

	"../traversing/findFilter"
], function( jQuery, document, isFunction, rsingleTag ) {

"use strict";

// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
	/**
	 * 初始化和参数管理
	 */
	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		//对 $(""), $(null), $(undefined), $(false)的元素进行处理
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		/**
		 * 如果是字符串，如$("#id"),$(".class"),$("div"),$("<div>")
		 */
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {//如果是标签形式，如$("<div>")|$("<div><span>test</span></div>");

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				//匹配 $("<li>test")或者$("#id")的选择器
				/**
				 * rquickExpr.exec("#div") => ["#div", undefined, "div"];
				 * rquickExpr.exec("<li>test") => ["<li>test", "<li>", undefined]
				 */
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {//进入的为$(html)||$(#id)，只要没有context，上面的匹配都能进入

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					 /**
					  * 处理执行上下文，一般为document对象，只有少量在iframe中创建元素时，需要指定上下文
					  */
					//支持$对象写法
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					/**
					 * 将parseHTML生成的element数组合并到当前对象中
					 */
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );
					
					// HANDLE: $(html, props)
					/**
					 * 如果选择器为简单标签，第二次参数为标签属性，即$("<input>",{value:"test",type:"text"})
					 */
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {//遍历定义的属性

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {//如果属性是jquery的方法,则以值为参数执行方法
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {//否则，以标签属性方式添加到标签中
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				/**
				 * 选择器为id的形式，如$("#id")，["#div", undefined, "div"];
				 */
				} else {
					//通过getElementById选取element
					elem = document.getElementById( match[ 2 ] );
					//如果存在，注入到当前jquery对象中，返回
					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			/**
			 * 如果为复杂的元素选择器，如：$("ul li.class"),并且未指定选择上下文，
			 * 则等于$(document).find("ul li.class"),find如何选择，请查看sizzle.js
			 */
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			/**
			 * 同上，只不过多设定了context，因为find需要jquery对象才能使用，所以会使用 $(context).find
			 */
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		/**
		 * 对选择dom元素进行处理，如$(this),$(document)
		 */
		} else if ( selector.nodeType ) {
			//注入到当前jquery对象中，返回
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		/**
		 * 对函数的处理.如 $(function(){});
		 */
		} else if ( isFunction( selector ) ) {
			//如果$(document).ready存在，就调用$(document).ready(fn),否则，以jQuery为参数，立即执行函数,fn(jQuery)
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );

return init;

} );
