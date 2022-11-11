
(function(){var alertLoaded=false;var assetsLoaded=false;var defaultOptions={mode:'prod',type:'ealert',location:'top'};var assets={css:['umalerts.css'],js:[]}
var ready=function(fn){if(document.attachEvent?document.readyState==='complete':document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);}};var hasClass=function(el,className){if(el.classList){return el.classList.contains(className);}
else{return(new RegExp('(^| )'+className+'( |$)','gi').test(el.className));}}
var addClass=function(el,className){if(el.classList){el.classList.add(className);}
else{el.className+=' '+className;}}
var remClass=function(el,className){if(el.classList){el.classList.remove(className);}
else{el.className=el.className.replace(new RegExp('(^|\\b)'+className.split(' ').join('|')+'(\\b|$)','gi'),' ');}}
var getCookie=function(name){var v=document.cookie.match('(^|;) ?'+name+'=([^;]*)(;|$)');return v?v[2]:null;}
var setCookie=function(name,value,days){if(days!=null){var d=new Date;d.setTime(d.getTime()+24*60*60*1000*days);document.cookie=name+"="+value+";path=/;expires="+d.toGMTString();}
else{document.cookie=name+"="+value+";path=/;";}}
var delCookie=function(name){setCookie(name,'',-1);}
var getAlert=function(){var alerts={};if(typeof(Storage)!=='undefined'){alerts=sessionStorage.getItem('umich-alerts');}
else{alerts=getCookie('umich-alerts');}
if((typeof alerts!=='undefined')&&alerts&&alerts.length){alerts=JSON.parse(alerts);if((alerts.mode==window.umalerts.mode)&&((new Date()).getTime()/1000)-alerts.unixtime<60){return alerts;}}
var params={mode:window.umalerts.mode,type:window.umalerts.type,source:window.location.hostname}
params=Object.keys(params).map(function(key){return key+'='+params[key];}).join('&');var ajax=new XMLHttpRequest();ajax.open('GET','https://umich.edu/apis/alerts/?'+params,true);ajax.onload=function(){if(ajax.status>=200&&ajax.status<400){var data=JSON.parse(ajax.responseText);saveAlert(data);processAlert();}}
ajax.send();return;}
var saveAlert=function(data){var alerts={timestamp:new Date(),unixtime:(new Date()).getTime()/1000,mode:window.umalerts.mode,alert:data};if(typeof(Storage)!=='undefined'){sessionStorage.setItem('umich-alerts',JSON.stringify(alerts));}
else{setCookie('umich-alerts',JSON.stringify(alerts),null);}}
var processAlert=function(){if(alertLoaded){return;}
var options=defaultOptions;for(var key in window.umalerts){options[key]=window.umalerts[key];}
window.umalerts=options;var alerts=getAlert();if((typeof alerts==='undefined')||!alerts||!Object.keys(alerts).length){return;}
if((typeof alerts.alert!=='undefined')&&alerts.alert&&Object.keys(alerts.alert).length){alertLoaded=true;var umEAlertHtml=alerts.alert.html;var thisHTMLEl=document.getElementsByTagName('html')[0];var thisBodyEl=document.getElementsByTagName('body')[0];if(!assetsLoaded){assetsLoaded=true;var head=document.getElementsByTagName('head')[0];var baseUrl=document.querySelector('script[src*="umalerts.js"]').getAttribute('src').replace(/umalerts\.js.*/,'');assets.js.forEach(function(asset,i){var script=document.createElement('script');script.type='text/javascript';script.src=baseUrl+asset;head.appendChild(script);});assets.css.forEach(function(asset,i){var style=document.createElement('link');style.rel='stylesheet';style.type='text/css';style.href=baseUrl+asset;style.onload=function(){resizeEvent();};head.appendChild(style);});}
var tmpEl=document.createElement('div');tmpEl.innerHTML=umEAlertHtml;addClass(thisHTMLEl,'umich-alerts--ealert-active');switch(window.umalerts.location){case'bottom':thisBodyEl.appendChild(tmpEl.firstChild);break;case'top':default:thisBodyEl.insertBefore(tmpEl.firstChild,thisBodyEl.firstChild);break;}
var thisEAlert=document.getElementById('umich-alerts--ealert');if(getCookie('umich-alerts')==thisEAlert.getAttribute('data-uid')){addClass(thisEAlert,'collapsed');addClass(thisHTMLEl,'umich-alerts--ealert-collapsed');}
else{delCookie('umich-alerts');}
thisEAlert.getElementsByClassName('umich-alerts-wrap')[0].addEventListener('click',function(){if(hasClass(thisEAlert,'collapsed')){remClass(thisEAlert,'collapsed');remClass(thisHTMLEl,'umich-alerts--ealert-collapsed');delCookie('umich-alerts');}
else{addClass(thisEAlert,'collapsed');addClass(thisHTMLEl,'umich-alerts--ealert-collapsed');setCookie('umich-alerts',thisEAlert.getAttribute('data-uid'),1);}
resizeEvent();});var resizeEvent=function(){document.getElementsByTagName('html')[0].style.setProperty('margin-top',thisEAlert.offsetHeight+'px','important');if(['absolute','relative','sticky'].indexOf(getComputedStyle(thisBodyEl)['position'])!=-1||['absolute','relative','sticky'].indexOf(getComputedStyle(thisHTMLEl)['position'])!=-1){thisEAlert.style.setProperty('margin-top','-'+thisEAlert.offsetHeight+'px');}
else{thisEAlert.style.setProperty('margin-top','');}};resizeEvent();window.onresize=resizeEvent;}}
ready(processAlert);}());