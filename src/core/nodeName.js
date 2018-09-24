define( function() {

"use strict";
/**
 * 是否为指定节点名
 * elem 为element节点
 * name 字符串，节点名
 * 如 $.nodeName(document.body,"body")
 */
function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};

return nodeName;

} );
