define( [
	"../var/document"//window.document对象
], function( document ) {
	"use strict";
	/**
	 * 可用于创建全局变量
	 * window.eval和eval不一样，
	 * window.eval会将eval作用域改为全局
	 * eval是关键字，作用域还是当前，外部并不会找到其声明变量
	 * 
	 */
	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

	function DOMEval( code, doc, node ) {
		doc = doc || document;
		
		var i,
			script = doc.createElement( "script" );//创建script标签

		script.text = code;//将代码放到script标签中
		if ( node ) {//如果写有其他script标签属性，将【type,src,noModule】属性付给script标签
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}
		//将script添加到head标签中，然后删除
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	return DOMEval;
} );
