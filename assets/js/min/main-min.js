!function(e){"use strict";var t=!1;if("undefined"!=typeof module&&module.exports){t=!0;var n=require("request")}var s=!1,i=!1;try{var o=new XMLHttpRequest;"undefined"!=typeof o.withCredentials?s=!0:"XDomainRequest"in window&&(s=!0,i=!0)}catch(a){}var l=Array.prototype.indexOf,r=function(e,t){var n=0,s=e.length;if(l&&e.indexOf===l)return e.indexOf(t);for(;s>n;n++)if(e[n]===t)return n;return-1},u=function(e){return this&&this instanceof u?("string"==typeof e&&(e={key:e}),this.callback=e.callback,this.wanted=e.wanted||[],this.key=e.key,this.simpleSheet=!!e.simpleSheet,this.parseNumbers=!!e.parseNumbers,this.wait=!!e.wait,this.reverse=!!e.reverse,this.postProcess=e.postProcess,this.debug=!!e.debug,this.query=e.query||"",this.orderby=e.orderby,this.endpoint=e.endpoint||"https://spreadsheets.google.com",this.singleton=!!e.singleton,this.simple_url=!!e.simple_url,this.callbackContext=e.callbackContext,"undefined"!=typeof e.proxy&&(this.endpoint=e.proxy.replace(/\/$/,""),this.simple_url=!0,this.singleton=!0,s=!1),this.parameterize=e.parameterize||!1,this.singleton&&("undefined"!=typeof u.singleton&&this.log("WARNING! Tabletop singleton already defined"),u.singleton=this),/key=/.test(this.key)&&(this.log("You passed an old Google Docs url as the key! Attempting to parse."),this.key=this.key.match("key=(.*?)&")[1]),/pubhtml/.test(this.key)&&(this.log("You passed a new Google Spreadsheets url as the key! Attempting to parse."),this.key=this.key.match("d\\/(.*?)\\/pubhtml")[1]),this.key?(this.log("Initializing with key "+this.key),this.models={},this.model_names=[],this.base_json_path="/feeds/worksheets/"+this.key+"/public/basic?alt=",this.base_json_path+=t||s?"json":"json-in-script",void(this.wait||this.fetch())):void this.log("You need to pass Tabletop a key!")):new u(e)};u.callbacks={},u.init=function(e){return new u(e)},u.sheets=function(){this.log("Times have changed! You'll want to use var tabletop = Tabletop.init(...); tabletop.sheets(...); instead of Tabletop.sheets(...)")},u.prototype={fetch:function(e){"undefined"!=typeof e&&(this.callback=e),this.requestData(this.base_json_path,this.loadSheets)},requestData:function(e,n){if(t)this.serverSideFetch(e,n);else{var o=this.endpoint.split("//").shift()||"http";!s||i&&o!==location.protocol?this.injectScript(e,n):this.xhrFetch(e,n)}},xhrFetch:function(e,t){var n=i?new XDomainRequest:new XMLHttpRequest;n.open("GET",this.endpoint+e);var s=this;n.onload=function(){try{var e=JSON.parse(n.responseText)}catch(i){console.error(i)}t.call(s,e)},n.send()},injectScript:function(e,t){var n=document.createElement("script"),s;if(this.singleton)t===this.loadSheets?s="Tabletop.singleton.loadSheets":t===this.loadSheet&&(s="Tabletop.singleton.loadSheet");else{var i=this;s="tt"+ +new Date+Math.floor(1e5*Math.random()),u.callbacks[s]=function(){var e=Array.prototype.slice.call(arguments,0);t.apply(i,e),n.parentNode.removeChild(n),delete u.callbacks[s]},s="Tabletop.callbacks."+s}var o=e+"&callback="+s;n.src=this.simple_url?-1!==e.indexOf("/list/")?this.endpoint+"/"+this.key+"-"+e.split("/")[4]:this.endpoint+"/"+this.key:this.endpoint+o,this.parameterize&&(n.src=this.parameterize+encodeURIComponent(n.src)),document.getElementsByTagName("script")[0].parentNode.appendChild(n)},serverSideFetch:function(e,t){var s=this;n({url:this.endpoint+e,json:!0},function(e,n,i){return e?console.error(e):void t.call(s,i)})},isWanted:function(e){return 0===this.wanted.length?!0:-1!==r(this.wanted,e)},data:function(){return 0===this.model_names.length?void 0:this.simpleSheet?(this.model_names.length>1&&this.debug&&this.log("WARNING You have more than one sheet but are using simple sheet mode! Don't blame me when something goes wrong."),this.models[this.model_names[0]].all()):this.models},addWanted:function(e){-1===r(this.wanted,e)&&this.wanted.push(e)},loadSheets:function(e){var n,i,o=[];for(this.foundSheetNames=[],n=0,i=e.feed.entry.length;i>n;n++)if(this.foundSheetNames.push(e.feed.entry[n].title.$t),this.isWanted(e.feed.entry[n].content.$t)){var a=e.feed.entry[n].link.length-1,l=e.feed.entry[n].link[a].href.split("/").pop(),r="/feeds/list/"+this.key+"/"+l+"/public/values?alt=";r+=t||s?"json":"json-in-script",this.query&&(r+="&sq="+this.query),this.orderby&&(r+="&orderby=column:"+this.orderby.toLowerCase()),this.reverse&&(r+="&reverse=true"),o.push(r)}for(this.sheetsToLoad=o.length,n=0,i=o.length;i>n;n++)this.requestData(o[n],this.loadSheet)},sheets:function(e){return"undefined"==typeof e?this.models:"undefined"==typeof this.models[e]?void 0:this.models[e]},loadSheet:function(e){var t=new u.Model({data:e,parseNumbers:this.parseNumbers,postProcess:this.postProcess,tabletop:this});this.models[t.name]=t,-1===r(this.model_names,t.name)&&this.model_names.push(t.name),this.sheetsToLoad--,0===this.sheetsToLoad&&this.doCallback()},doCallback:function(){0===this.sheetsToLoad&&this.callback.apply(this.callbackContext||this,[this.data(),this])},log:function(e){this.debug&&"undefined"!=typeof console&&"undefined"!=typeof console.log&&Function.prototype.apply.apply(console.log,[console,arguments])}},u.Model=function(e){var t,n,s,i;if(this.column_names=[],this.name=e.data.feed.title.$t,this.elements=[],this.raw=e.data,"undefined"==typeof e.data.feed.entry)return e.tabletop.log("Missing data for "+this.name+", make sure you didn't forget column headers"),void(this.elements=[]);for(var o in e.data.feed.entry[0])/^gsx/.test(o)&&this.column_names.push(o.replace("gsx$",""));for(t=0,s=e.data.feed.entry.length;s>t;t++){for(var a=e.data.feed.entry[t],l={},n=0,i=this.column_names.length;i>n;n++){var r=a["gsx$"+this.column_names[n]];l[this.column_names[n]]="undefined"!=typeof r?e.parseNumbers&&""!==r.$t&&!isNaN(r.$t)?+r.$t:r.$t:""}void 0===l.rowNumber&&(l.rowNumber=t+1),e.postProcess&&e.postProcess(l),this.elements.push(l)}},u.Model.prototype={all:function(){return this.elements},toArray:function(){var e=[],t,n,s,i;for(t=0,s=this.elements.length;s>t;t++){var o=[];for(n=0,i=this.column_names.length;i>n;n++)o.push(this.elements[t][this.column_names[n]]);e.push(o)}return e}},t?module.exports=u:e.Tabletop=u}(this),!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof exports&&"function"==typeof require?require("jquery"):jQuery)}(function(e){"use strict";function t(n,s){var i=function(){},o=this,a={ajaxSettings:{},autoSelectFirst:!1,appendTo:document.body,serviceUrl:null,lookup:null,onSelect:null,width:"auto",minChars:1,maxHeight:300,deferRequestBy:0,params:{},formatResult:t.formatResult,delimiter:null,zIndex:9999,type:"GET",noCache:!1,onSearchStart:i,onSearchComplete:i,onSearchError:i,containerClass:"autocomplete-suggestions",tabDisabled:!1,dataType:"text",currentRequest:null,triggerSelectOnValidInput:!0,preventBadQueries:!0,lookupFilter:function(e,t,n){return-1!==e.value.toLowerCase().indexOf(n)},paramName:"query",transformResult:function(t){return"string"==typeof t?e.parseJSON(t):t},showNoSuggestionNotice:!1,noSuggestionNotice:"No results",orientation:"bottom",forceFixPosition:!1};o.element=n,o.el=e(n),o.suggestions=[],o.badQueries=[],o.selectedIndex=-1,o.currentValue=o.element.value,o.intervalId=0,o.cachedResponse={},o.onChangeInterval=null,o.onChange=null,o.isLocal=!1,o.suggestionsContainer=null,o.noSuggestionsContainer=null,o.options=e.extend({},a,s),o.classes={selected:"autocomplete-selected",suggestion:"autocomplete-suggestion"},o.hint=null,o.hintValue="",o.selection=null,o.initialize(),o.setOptions(s)}var n=function(){return{escapeRegExChars:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},createNode:function(e){var t=document.createElement("div");return t.className=e,t.style.position="absolute",t.style.display="none",t}}}(),s={ESC:27,TAB:9,RETURN:13,LEFT:37,UP:38,RIGHT:39,DOWN:40};t.utils=n,e.Autocomplete=t,t.formatResult=function(e,t){var s="("+n.escapeRegExChars(t)+")";return e.value.replace(new RegExp(s,"gi"),"<strong>$1</strong>")},t.prototype={killerFn:null,initialize:function(){var n,s=this,i="."+s.classes.suggestion,o=s.classes.selected,a=s.options;s.element.setAttribute("autocomplete","off"),s.killerFn=function(t){0===e(t.target).closest("."+s.options.containerClass).length&&(s.killSuggestions(),s.disableKillerFn())},s.noSuggestionsContainer=e('<div class="autocomplete-no-suggestion"></div>').html(this.options.noSuggestionNotice).get(0),s.suggestionsContainer=t.utils.createNode(a.containerClass),n=e(s.suggestionsContainer),n.appendTo(a.appendTo),"auto"!==a.width&&n.width(a.width),n.on("mouseover.autocomplete",i,function(){s.activate(e(this).data("index"))}),n.on("mouseout.autocomplete",function(){s.selectedIndex=-1,n.children("."+o).removeClass(o)}),n.on("click.autocomplete",i,function(){s.select(e(this).data("index"))}),s.fixPositionCapture=function(){s.visible&&s.fixPosition()},e(window).on("resize.autocomplete",s.fixPositionCapture),s.el.on("keydown.autocomplete",function(e){s.onKeyPress(e)}),s.el.on("keyup.autocomplete",function(e){s.onKeyUp(e)}),s.el.on("blur.autocomplete",function(){s.onBlur()}),s.el.on("focus.autocomplete",function(){s.onFocus()}),s.el.on("change.autocomplete",function(e){s.onKeyUp(e)})},onFocus:function(){var e=this;e.fixPosition(),e.options.minChars<=e.el.val().length&&e.onValueChange()},onBlur:function(){this.enableKillerFn()},setOptions:function(t){var n=this,s=n.options;e.extend(s,t),n.isLocal=e.isArray(s.lookup),n.isLocal&&(s.lookup=n.verifySuggestionsFormat(s.lookup)),s.orientation=n.validateOrientation(s.orientation,"bottom"),e(n.suggestionsContainer).css({"max-height":s.maxHeight+"px",width:s.width+"px","z-index":s.zIndex})},clearCache:function(){this.cachedResponse={},this.badQueries=[]},clear:function(){this.clearCache(),this.currentValue="",this.suggestions=[]},disable:function(){var e=this;e.disabled=!0,e.currentRequest&&e.currentRequest.abort()},enable:function(){this.disabled=!1},fixPosition:function(){var t=this,n=e(t.suggestionsContainer),s=n.parent().get(0);if(s===document.body||t.options.forceFixPosition){var i=t.options.orientation,o=n.outerHeight(),a=t.el.outerHeight(),l=t.el.offset(),r={top:l.top,left:l.left};if("auto"==i){var u=e(window).height(),c=e(window).scrollTop(),h=-c+l.top-o,d=c+u-(l.top+a+o);i=Math.max(h,d)===h?"top":"bottom"}if(r.top+="top"===i?-o:a,s!==document.body){var p,g=n.css("opacity");t.visible||n.css("opacity",0).show(),p=n.offsetParent().offset(),r.top-=p.top,r.left-=p.left,t.visible||n.css("opacity",g).hide()}"auto"===t.options.width&&(r.width=t.el.outerWidth()-2+"px"),n.css(r)}},enableKillerFn:function(){var t=this;e(document).on("click.autocomplete",t.killerFn)},disableKillerFn:function(){var t=this;e(document).off("click.autocomplete",t.killerFn)},killSuggestions:function(){var e=this;e.stopKillSuggestions(),e.intervalId=window.setInterval(function(){e.hide(),e.stopKillSuggestions()},50)},stopKillSuggestions:function(){window.clearInterval(this.intervalId)},isCursorAtEnd:function(){var e,t=this,n=t.el.val().length,s=t.element.selectionStart;return"number"==typeof s?s===n:document.selection?(e=document.selection.createRange(),e.moveStart("character",-n),n===e.text.length):!0},onKeyPress:function(e){var t=this;if(!t.disabled&&!t.visible&&e.which===s.DOWN&&t.currentValue)return void t.suggest();if(!t.disabled&&t.visible){switch(e.which){case s.ESC:t.el.val(t.currentValue),t.hide();break;case s.RIGHT:if(t.hint&&t.options.onHint&&t.isCursorAtEnd()){t.selectHint();break}return;case s.TAB:if(t.hint&&t.options.onHint)return void t.selectHint();case s.RETURN:if(-1===t.selectedIndex)return void t.hide();if(t.select(t.selectedIndex),e.which===s.TAB&&t.options.tabDisabled===!1)return;break;case s.UP:t.moveUp();break;case s.DOWN:t.moveDown();break;default:return}e.stopImmediatePropagation(),e.preventDefault()}},onKeyUp:function(e){var t=this;if(!t.disabled){switch(e.which){case s.UP:case s.DOWN:return}clearInterval(t.onChangeInterval),t.currentValue!==t.el.val()&&(t.findBestHint(),t.options.deferRequestBy>0?t.onChangeInterval=setInterval(function(){t.onValueChange()},t.options.deferRequestBy):t.onValueChange())}},onValueChange:function(){var t,n=this,s=n.options,i=n.el.val(),o=n.getQuery(i);return n.selection&&n.currentValue!==o&&(n.selection=null,(s.onInvalidateSelection||e.noop).call(n.element)),clearInterval(n.onChangeInterval),n.currentValue=i,n.selectedIndex=-1,s.triggerSelectOnValidInput&&(t=n.findSuggestionIndex(o),-1!==t)?void n.select(t):void(o.length<s.minChars?n.hide():n.getSuggestions(o))},findSuggestionIndex:function(t){var n=this,s=-1,i=t.toLowerCase();return e.each(n.suggestions,function(e,t){return t.value.toLowerCase()===i?(s=e,!1):void 0}),s},getQuery:function(t){var n,s=this.options.delimiter;return s?(n=t.split(s),e.trim(n[n.length-1])):t},getSuggestionsLocal:function(t){var n,s=this,i=s.options,o=t.toLowerCase(),a=i.lookupFilter,l=parseInt(i.lookupLimit,10);return n={suggestions:e.grep(i.lookup,function(e){return a(e,t,o)})},l&&n.suggestions.length>l&&(n.suggestions=n.suggestions.slice(0,l)),n},getSuggestions:function(t){var n,s,i,o,a=this,l=a.options,r=l.serviceUrl;if(l.params[l.paramName]=t,s=l.ignoreParams?null:l.params,a.isLocal?n=a.getSuggestionsLocal(t):(e.isFunction(r)&&(r=r.call(a.element,t)),i=r+"?"+e.param(s||{}),n=a.cachedResponse[i]),n&&e.isArray(n.suggestions))a.suggestions=n.suggestions,a.suggest();else if(!a.isBadQuery(t)){if(l.onSearchStart.call(a.element,l.params)===!1)return;a.currentRequest&&a.currentRequest.abort(),o={url:r,data:s,type:l.type,dataType:l.dataType},e.extend(o,l.ajaxSettings),a.currentRequest=e.ajax(o).done(function(e){var n;a.currentRequest=null,n=l.transformResult(e),a.processResponse(n,t,i),l.onSearchComplete.call(a.element,t,n.suggestions)}).fail(function(e,n,s){l.onSearchError.call(a.element,t,e,n,s)})}},isBadQuery:function(e){if(!this.options.preventBadQueries)return!1;for(var t=this.badQueries,n=t.length;n--;)if(0===e.indexOf(t[n]))return!0;return!1},hide:function(){var t=this;t.visible=!1,t.selectedIndex=-1,e(t.suggestionsContainer).hide(),t.signalHint(null)},suggest:function(){if(0===this.suggestions.length)return void(this.options.showNoSuggestionNotice?this.noSuggestions():this.hide());var t,n=this,s=n.options,i=s.formatResult,o=n.getQuery(n.currentValue),a=n.classes.suggestion,l=n.classes.selected,r=e(n.suggestionsContainer),u=e(n.noSuggestionsContainer),c=s.beforeRender,h="";return s.triggerSelectOnValidInput&&(t=n.findSuggestionIndex(o),-1!==t)?void n.select(t):(e.each(n.suggestions,function(e,t){h+='<div class="'+a+'" data-index="'+e+'">'+i(t,o)+"</div>"}),this.adjustContainerWidth(),u.detach(),r.html(h),s.autoSelectFirst&&(n.selectedIndex=0,r.children().first().addClass(l)),e.isFunction(c)&&c.call(n.element,r),n.fixPosition(),r.show(),n.visible=!0,void n.findBestHint())},noSuggestions:function(){var t=this,n=e(t.suggestionsContainer),s=e(t.noSuggestionsContainer);this.adjustContainerWidth(),s.detach(),n.empty(),n.append(s),t.fixPosition(),n.show(),t.visible=!0},adjustContainerWidth:function(){var t,n=this,s=n.options,i=e(n.suggestionsContainer);"auto"===s.width&&(t=n.el.outerWidth()-2,i.width(t>0?t:300))},findBestHint:function(){var t=this,n=t.el.val().toLowerCase(),s=null;n&&(e.each(t.suggestions,function(e,t){var i=0===t.value.toLowerCase().indexOf(n);return i&&(s=t),!i}),t.signalHint(s))},signalHint:function(t){var n="",s=this;t&&(n=s.currentValue+t.value.substr(s.currentValue.length)),s.hintValue!==n&&(s.hintValue=n,s.hint=t,(this.options.onHint||e.noop)(n))},verifySuggestionsFormat:function(t){return t.length&&"string"==typeof t[0]?e.map(t,function(e){return{value:e,data:null}}):t},validateOrientation:function(t,n){return t=e.trim(t||"").toLowerCase(),-1===e.inArray(t,["auto","bottom","top"])&&(t=n),t},processResponse:function(e,t,n){var s=this,i=s.options;e.suggestions=s.verifySuggestionsFormat(e.suggestions),i.noCache||(s.cachedResponse[n]=e,i.preventBadQueries&&0===e.suggestions.length&&s.badQueries.push(t)),t===s.getQuery(s.currentValue)&&(s.suggestions=e.suggestions,s.suggest())},activate:function(t){var n,s=this,i=s.classes.selected,o=e(s.suggestionsContainer),a=o.find("."+s.classes.suggestion);return o.find("."+i).removeClass(i),s.selectedIndex=t,-1!==s.selectedIndex&&a.length>s.selectedIndex?(n=a.get(s.selectedIndex),e(n).addClass(i),n):null},selectHint:function(){var t=this,n=e.inArray(t.hint,t.suggestions);t.select(n)},select:function(e){var t=this;t.hide(),t.onSelect(e)},moveUp:function(){var t=this;return-1!==t.selectedIndex?0===t.selectedIndex?(e(t.suggestionsContainer).children().first().removeClass(t.classes.selected),t.selectedIndex=-1,t.el.val(t.currentValue),void t.findBestHint()):void t.adjustScroll(t.selectedIndex-1):void 0},moveDown:function(){var e=this;e.selectedIndex!==e.suggestions.length-1&&e.adjustScroll(e.selectedIndex+1)},adjustScroll:function(t){var n,s,i,o=this,a=o.activate(t),l=25;a&&(n=a.offsetTop,s=e(o.suggestionsContainer).scrollTop(),i=s+o.options.maxHeight-l,s>n?e(o.suggestionsContainer).scrollTop(n):n>i&&e(o.suggestionsContainer).scrollTop(n-o.options.maxHeight+l),o.el.val(o.getValue(o.suggestions[t].value)),o.signalHint(null))},onSelect:function(t){var n=this,s=n.options.onSelect,i=n.suggestions[t];n.currentValue=n.getValue(i.value),n.currentValue!==n.el.val()&&n.el.val(n.currentValue),n.signalHint(null),n.suggestions=[],n.selection=i,e.isFunction(s)&&s.call(n.element,i)},getValue:function(e){var t,n,s=this,i=s.options.delimiter;return i?(t=s.currentValue,n=t.split(i),1===n.length?e:t.substr(0,t.length-n[n.length-1].length)+e):e},dispose:function(){var t=this;t.el.off(".autocomplete").removeData("autocomplete"),t.disableKillerFn(),e(window).off("resize.autocomplete",t.fixPositionCapture),e(t.suggestionsContainer).remove()}},e.fn.autocomplete=e.fn.devbridgeAutocomplete=function(n,s){var i="autocomplete";return 0===arguments.length?this.first().data(i):this.each(function(){var o=e(this),a=o.data(i);"string"==typeof n?a&&"function"==typeof a[n]&&a[n](s):(a&&a.dispose&&a.dispose(),a=new t(this,n),o.data(i,a))})}}),$(function(){function e(){$(".more").hide()}function t(){$(".result").html("")}function n(){$(".focusMe").val("")}function s(e){var t=$(".box");$("#input").autocomplete({preventBadQueries:!0,autoSelectFirst:!0,lookupLimit:3,appendTo:t,orientation:top,lookup:e,onSelect:function(e){i(e)}})}function i(t){var n="<h1 class='num'>E "+t.data+"</h1><h2 class='titel'>"+t.titel+"</h2><p class='desc'>"+t.desc+"</p>";""!==t.details&&(n=n+"<h3 class='heading'>Details</h3><div class='more'><p>"+t.details+"</p></div>"),""!==t.notes&&(n=n+"<h3 class='heading'>Hinweise</h3><div class='more'><p>"+t.notes+"</p></div>"),$(".result").html(n),window.location.hash=t.data,e()}function o(e){}$("html").removeClass("no-js"),$(".focusMe").focus(),$("body").on("click","h3",function(){$(this).next(".more").toggle()}),$(".focusMe").on("click",function(){t(),n()}).on("keydown",function(){t()});var a,l=!1;Tabletop.init({key:"1m3X5Urii-NTiYu6S6RYnXOF63Tkgvd813-H1jnxb-hY",callback:function(e){a=e,l=!0,s(a)},simpleSheet:!0});var r=window.location.hash;""!==r&&o(r)});