define( [
	"../core",
	"../var/document",
	"./var/rsingleTag",
	"../manipulation/buildFragment",

	// This is the only module that needs core/support
	"./support"
], function( jQuery, document, rsingleTag, buildFragment, support ) {

"use strict";

// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
/**
 * data:为html的字符串格式
 * context为执行对象，默认为document；
 * keepScripts为boolean，是否保存script标签，true为保存
 * eg: $.parseHTML("<div><span>test</span></div><script>alert(1)</script>",document,true)
 */
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {//data必须是字符串
		return [];
	}
	if ( typeof context === "boolean" ) {//支持参数前移
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {//如果未指定document

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {//如果支持创建document，自己创建一个document
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;//使用document
		}
	}

	parsed = rsingleTag.exec( data );//判断是否为单标签
	scripts = !keepScripts && [];//判断是否保存script标签

	// Single tag
	if ( parsed ) {//如果只是简单的标签，如"<div>",则创建并返回[element]
		return [ context.createElement( parsed[ 1 ] ) ];
	}
	//如果非简单标签，如：<div><span>test</span></div>，使用文档碎片创建节点
	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}
	//将文档碎片创建的所有子元素返回
	return jQuery.merge( [], parsed.childNodes );
};

return jQuery.parseHTML;

} );
