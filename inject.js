// ==UserScript==
// @name        /AMP/ features
// @description An UserJS to make browsing this specific topic easier, at least for me.
// @author      moh aka Yutsuku
// @version     1.1
// @include     http://www.crunchyroll.com/forumtopic-647851*
// ==/UserScript==

(function() {
document.addEventListener('DOMContentLoaded', main, false);

var $ = function(e) { return document.getElementById(e) || (document.querySelectorAll(e).length == 1 ? document.querySelectorAll(e)[0] : (document.querySelectorAll(e).length == 0 ? false : document.querySelectorAll(e)) ) || false; }

function main() {
	if ( window.location.href.indexOf("forumtopic-647851") == -1 ) return false;
	var title = document.title.split(" ");
	var currentPage = title[title.length-1];
	var lastPage = localStorage.getItem("page");
	
	if ( lastPage == null ) {
		localStorage.setItem("page", currentPage);
		//console.log("no session found, setting new one... " + currentPage);
	} else {
		var diff = (currentPage - lastPage);
		if ( diff == 1 ) {
			// update
			localStorage.setItem("page", currentPage);
			//console.log("updating..");
		} else if ( diff == 0 ) {
			// page reloaded/same
		} else {
			// random jumping... 
			//console.log("not latest page... ", lastPage, currentPage);
			document.body.innerHTML += '<div id="latest-plz">Latest visted page was <a href="http://www.crunchyroll.com/forumtopic-647851/anime-motivational-posters-read-first-post?pg=' + (lastPage-1) + '">' + lastPage + '</a></div>';
		}
	}
	
	var style = document.createElement("style");
	style.innerHTML = "#latest-plz { z-index: 1000; background: #ffffff; box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25); position: fixed; top: 5px; right:5px; line-height: 64px; padding: 0px 12px; font-size: 14px; font-weight: 700; } .hidden { display: none; } #overlay { display: block;position: fixed;top: 0%;left: 0%;width: 100%;height: 100%;background: rgba(0,0,0, 0.8);z-index:1001; } #overlay_content { text-align:center; margin: 25px auto; overflow: auto; } #overlay_text { color: #DF6300; } .hotkey { font-weight: bold; font-size: 18px; font-family: \"Source Sans Pro\", \"Helvetica\", \"Arial\", sans-serif; 	color: #070707; 	background: #f5f5f5; 	display: inline-block; 	padding: 3px 6px; 	border-radius: 3px; 	border: 1px solid #fff; 	box-shadow: 0px 2px 0px 2px #C4C4C4, inset 0px 1px 1px 1px #fff, 0px 3px 3px 3px rgba(0,0,0,0.1); 	margin: 1px 8px; } #tutorial { width: 300px; margin: 0px auto; background: #f5f5f5; border-radius: 4px; padding: 15px 25px } #tutorial p { margin-top: 10px; }";
	document.body.appendChild(style);
	
	EasyNavigation();
}

function attachTutorial(hook) {
	var block = document.createElement("div");
	block.id = "tutorial";
	
	var h2 = document.createElement("h2");
	h2.innerHTML = "Controls";
	block.appendChild(h2);
	
	var buttonLeft = document.createElement("div");
	buttonLeft.className="hotkey";
	buttonLeft.innerHTML = "&#8592;";
	
	var buttonRight = document.createElement("div");
	buttonRight.className="hotkey";
	buttonRight.innerHTML = "&#8594;";
	
	var buttonEsc = document.createElement("div");
	buttonEsc.className="hotkey";
	buttonEsc.innerHTML = "Esc";
	
	var p = document.createElement("p");
	p.appendChild(buttonLeft);
	p.innerHTML += "Previous Image";
	block.appendChild(p);
	
	p = document.createElement("p");
	p.appendChild(buttonRight);
	p.innerHTML += "Next Image";
	block.appendChild(p);
	
	p = document.createElement("p");
	p.appendChild(buttonEsc);
	p.innerHTML += "Exit";
	block.appendChild(p);
	
	hook.appendChild(block);
}

function EasyNavigation() {

	var images;
	var overlayImages;
	var imagesPos;
	var nextPage = $(".showforumtopic-paginator a[title=\"Next\"]")[0].href;
	
	var isEnabled = localStorage.getItem("lightboxEnabled");
	if ( isEnabled == null ) {
		localStorage.setItem("lightboxEnabled", "false");
		isEnabled =  localStorage.getItem("lightboxEnabled");
	}
	var tutorialShown = localStorage.getItem("ligthboxTutorialShown");
	if ( tutorialShown == null ) {
		localStorage.setItem("ligthboxTutorialShown", "false");
		tutorialShown = localStorage.getItem("ligthboxTutorialShown");
	}
	
	attachSettings();
	
	if ( isEnabled == "true" ) {
		ShowOverlay();
	}
	
	function ShowOverlay() {
		document.onkeydown = checkKey;
		images = $(".showforumtopic-message-contents-text > .bb-image");
		//console.log("EasyNavigation(): found " + images.length + " images");
		imagesPos = 0;
		$("#lightbox-status").innerHTML = "On";
		CreateOverlay();
	}
	
	function attachSettings() {
		var handle = document.querySelector("#header_userpanel_beta .login.left");
		
		var li = document.createElement("li");
		li.className = "login lightbox-settings";
		li.style = "margin-right: 20px; cursor: pointer;";
		
		var a = document.createElement("a");
		a.id = "lightbox-toggle";
		a.style = "margin-right: 0px;";
		a.innerHTML = "Lightbox";
		a.addEventListener('click', toggleLightbox, false);
		
		var span = document.createElement("span");
		span.id = "lightbox-status";
		span.className = "superscript-free";
		span.innerHTML = "Off";
		
		li.appendChild(a);
		li.appendChild(span);
		handle.parentNode.insertBefore(li, handle);
		
	}
	
	function toggleLightbox() {
		var state = localStorage.getItem("lightboxEnabled");
		if ( state == null ) {
			localStorage.setItem("lightboxEnabled", "false");
			return;
		}
		if ( state == "true" ) {
			localStorage.setItem("lightboxEnabled", "false");
			$("#lightbox-status").innerHTML = "Off";
		} else {
			localStorage.setItem("lightboxEnabled", "true");
			$("#lightbox-status").innerHTML = "On";
			ShowOverlay();
		}
	}
	
	/* OVERLAY */
	function CreateOverlay() {
		
		var overlay = document.createElement("div");
		overlay.id = "overlay";
		overlay.addEventListener('click', function() {
			(elem=$("#overlay")).parentNode.removeChild(elem);
		}, false);
		
		var overlay_content = document.createElement("div");
		overlay_content.id = "overlay_content";
		var overlay_element
		for(i=0;i<images.length;++i) {
			overlay_element = document.createElement("div");
			overlay_element.id = "overlay_element_" + i;
			if ( i == 0 ) {
				overlay_element.className = "overlayElement";
			} else {
				overlay_element.className = "hidden overlayElement";
			}
			overlay_element.appendChild(images[i].cloneNode());
			overlay_content.appendChild(overlay_element);
		}
		
		var overlay_textbar = document.createElement("div");
		overlay_textbar.id = "overlay_text";
		overlay_textbar.innerHTML = "1 / " + images.length;
		
		overlay_content.appendChild(overlay_textbar);
		overlay.appendChild(overlay_content);
		document.body.appendChild(overlay);
		overlayImages = $("#overlay_content .overlayElement");
		
		console.log("DEBUG tutorialShown:");
		console.log(tutorialShown);
		
		console.log("DEBUG tutorialShown.localStorage:");
		console.log(localStorage.getItem("ligthboxTutorialShown"));
		
		if ( tutorialShown == "false" ) {
			localStorage.setItem("ligthboxTutorialShown", "true");
			attachTutorial(overlay);
		}
	}
	/* END OF OVERLAY */
	
	function checkKey(e) {
		// DO NOT "RETURN FALSE" HERE!
		// IT MAY FUCK UP BROWSER SCROLLING!
		e = e || window.event;
		//console.log(e);
		
		if (e.keyCode == '37') {
			// left arrow
			if ( $("#overlay") ) {
				ShowPrevious();
			}
		}
		else if (e.keyCode == '39') {
			// right arrow
			if ( $("#overlay") ) {
				ShowNext();
			}
		}
		else if (e.keyCode == '27') {
			// Escape
			if ( $("#overlay") ) {
				(elem=$("#overlay")).parentNode.removeChild(elem);
			}
		}
	}
	
	function ShowNext() {
		if ( imagesPos >= images.length-1 ) {
			window.location = nextPage;
			return false;
		}
		overlayImages[imagesPos].classList.add("hidden");
		++imagesPos;
		overlayImages[imagesPos].classList.remove("hidden");
		$("#overlay_text").innerHTML = imagesPos+1 + " / " + overlayImages.length;
	}
	
	function ShowPrevious() {
		if ( imagesPos <= 0 ) {
			return false;
		}
		overlayImages[imagesPos].classList.add("hidden");
		--imagesPos;
		overlayImages[imagesPos].classList.remove("hidden");
		$("#overlay_text").innerHTML = imagesPos+1 + " / " + overlayImages.length;
	}
	
}
})();