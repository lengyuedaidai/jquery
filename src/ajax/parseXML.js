define( [
	"../core"
], function( jQuery ) {

"use strict";
/**
 * 用于XML的格式解析
 */
// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {//data格式必须为string
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	/**
	 * 使用DOMParser来进行XML解析，IE下，只对IE9以上支持
	 * 在IE下，如果解析出错，会抛出错误，使用try捕获拦截
	 */
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}
	/**
	 * 在非IE下，解析失败不会报错，会产生一个带有"<parsererror>错误信息</parsererror>"的标签
	 */
	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};

return jQuery.parseXML;

} );
