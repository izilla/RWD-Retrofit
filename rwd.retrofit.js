/*
 * RWD Retrofit v1.2
 * Allows an existing "desktop site" to co-exist with a "responsive site", while also able to serve the desktop site to a different breakpoint on "mobile" - useful for serving the desktop site to tablets, for example
 *
 * Returns an object containing the desktop (rwdRetrofit.desktop) and optional mobile (rwdRetrofit.mobile) media queries as strings for responding to media queries with JS; for example, by using enquire.js (http://wickynilliams.github.com/enquire.js)
 *
 * Requires: cssua.js (http://cssuseragent.org)
 *
 * Usage:
 * 1. Set up the viewport with: <meta name="viewport" content="width=device-width" />
 * 2. Reference the existing desktop stylesheet with a <link> with a relevant media query, eg. media="all and (min-width: 990px)" and class="rwdretro-desktop"
 * 3. Reference the new responsive stylesheet with a <link> with a relevant media query, eg. media="all and (max-width: 989px)" and class="rwdretro-mobile"
 * 4. Add an optional data-breakpoint-width="xxx" attribute to the desktop stylesheet <link>, where xxx is the pixel width that the desktop breakpoint will occur on mobile devices - eg. 768 for iPads and other large tablets
 * 5. Add an optional data-viewport-width="xxx" attribute to the desktop stylesheet <link>, where xxx is the pixel width that the desktop viewport will be set to on mobile devices
 * 6. Include cssua.js before rwd.retrofit.min.js
 *
 * Copyright (c) 2012 Izilla Partners Pty Ltd
 *
 * http://www.izilla.com.au
 *
 * Licensed under the MIT license
 */
;var rwdRetrofit = (function() {
	if (!document.querySelector || !document.getElementsByClassName || typeof(document.documentElement.clientWidth) == 'undefined')
		return;

	var meta = document.querySelector('meta[name="viewport"]'),
		desktop = document.getElementsByClassName('rwdretro-desktop'),
		mobile = document.getElementsByClassName('rwdretro-mobile');
	
	if (!meta || desktop.length === 0 || mobile.length === 0)
		return;

	var	content = 'content',
		media = 'media',
		initialContent = meta && meta.getAttribute(content),
		desktopContent = 'width=980',
		duration = 250,
		supportsOrientationChange = 'onorientationchange' in window,
		orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize',
		desktopMQ = desktop[0].getAttribute(media),
		mobileMQ = mobile[0].getAttribute(media),
		dataBreakpointWidth = desktop[0].getAttribute('data-breakpoint-width'),
		breakpointWidth,
		dataViewportWidth = desktop[0].getAttribute('data-viewport-width'),
		mediaQueries = {};
	
	if (cssua.ua.mobile) {
		if (dataBreakpointWidth)
			breakpointWidth = dataBreakpointWidth;
		if (dataViewportWidth)
			desktopContent = desktopContent.replace(/\d+/, dataViewportWidth);
	}
	else {
		breakpointWidth = desktopMQ.replace(/.*?min-width:\s?(\d*).*/g, '$1');
	}
	
	desktopMQ = desktopMQ.replace(/(min-width:\s?)\d*/g, '$1' + breakpointWidth);
	mobileMQ = mobileMQ.replace(/(max-width:\s?)\d*/g, '$1' + (breakpointWidth-1));
	
	mediaQueries.desktop = desktopMQ,
	mediaQueries.mobile = mobileMQ;
	
	if (cssua.ua.mobile) {
		for (var i=0; i < desktop.length; i++) {
			desktop[i].setAttribute(media, desktopMQ);
		}
		
		for (var i=0; i < mobile.length; i++) {
			mobile[i].setAttribute(media, mobileMQ);
		}
			
		if (cssua.ua.ios)
			duration = 0;
		
		function switchViewport() {
			meta.setAttribute(content, initialContent);
			window.setTimeout(function() {
				if (document.documentElement.clientWidth >= breakpointWidth)
					meta.setAttribute(content, desktopContent);
			}, duration);
		}
		
		switchViewport();
		window.addEventListener(orientationEvent, switchViewport, false);
	}
	
	return mediaQueries;
})();