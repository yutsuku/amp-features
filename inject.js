document.addEventListener('DOMContentLoaded', main, false);

function main() {
	if ( window.location.href.indexOf("forumtopic-647851") == -1 ) return false;
	var title = document.title.split(" ");
	var currentPage = title[title.length-1];
	var lastPage = localStorage.getItem("page");
	
	if ( lastPage == null ) {
		localStorage.setItem("page", currentPage);
		console.log("no session found, setting new one... " + currentPage);
	} else {
		var diff = (currentPage - lastPage);
		if ( diff == 1 ) {
			// update
			localStorage.setItem("page", currentPage);
			console.log("updating..");
		} else if ( diff == 0 ) {
			// page reloaded/same
		} else {
			// random jumping... 
			console.log("not latest page... ", lastPage, currentPage);
			$("body").append('<div id="header_beta" style="position: fixed; top:0; right:0; line-height: 64px; padding: 0px 12px; font-size: 14px; font-weight: 700;">Latest visted page was <a href="http://www.crunchyroll.com/forumtopic-647851/anime-motivational-posters-read-first-post?pg=' + (lastPage-1) + '">' + lastPage + '</a></div>');
		}
	}
	EasyNavigation();
};

function EasyNavigation() {

	var images;
	var overlayImages;
	var imagesPos;
	
	var isEnabled = localStorage.getItem("lightboxEnabled");
	if ( isEnabled == null ) {
		localStorage.setItem("lightboxEnabled", "false");
	}
	attachSettings();
	
	if ( isEnabled == "true" ) {
		ShowOverlay();
	}
	
	function ShowOverlay() {
		document.onkeydown = checkKey;
		images = document.querySelectorAll(".showforumtopic-message-contents-text > .bb-image");
		console.log("EasyNavigation(): found " + images.length + " images");
		imagesPos = 0;
		document.getElementById("lightbox-status").innerHTML = "On";
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
			document.getElementById("lightbox-status").innerHTML = "Off";
		} else {
			localStorage.setItem("lightboxEnabled", "true");
			document.getElementById("lightbox-status").innerHTML = "On";
			ShowOverlay();
		}
	}
	
	/* OVERLAY */
	function CreateOverlay() {
		var style = document.createElement("style");
		style.innerHTML = ".hidden { display: none; } #overlay { display: block;position: fixed;top: 0%;left: 0%;width: 100%;height: 100%;background: rgba(0,0,0, 0.8);z-index:1001; } #overlay_content { text-align:center; margin: 25px auto; overflow: auto; } #overlay_text { color: #DF6300; }";
		document.body.appendChild(style);
		
		var overlay = document.createElement("div");
		overlay.id = "overlay";
		overlay.addEventListener('click', function() {
			(elem=document.getElementById("overlay")).parentNode.removeChild(elem);
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
		overlayImages = document.querySelectorAll("#overlay_content .overlayElement");
	}
	/* END OF OVERLAY */
	
	function checkKey(e) {
		// DO NOT "RETURN FALSE" HERE!
		// IT MAY FUCK UP BROWSER SCROLLING!
		e = e || window.event;
		//console.log(e);
		
		if (e.keyCode == '37') {
			// left arrow
			scrollToPrevious();
		}
		else if (e.keyCode == '39') {
			// right arrow
			scrollToNext();
		}
		else if (e.keyCode == '27') {
			// Escape
			if ( typeof document.getElementById("overlay") != "undefined") {
				(elem=document.getElementById("overlay")).parentNode.removeChild(elem);
			}
		}
	}
	
	function scrollToNext() {
		//alert("next");
		if ( imagesPos >= images.length-1 ) {
			return false;
		}
		overlayImages[imagesPos].classList.add("hidden");
		++imagesPos;
		overlayImages[imagesPos].classList.remove("hidden");
		document.getElementById("overlay_text").innerHTML = imagesPos+1 + " / " + overlayImages.length;
	}
	
	function scrollToPrevious() {
		if ( imagesPos <= 0 ) {
			return false;
		}
		overlayImages[imagesPos].classList.add("hidden");
		--imagesPos;
		overlayImages[imagesPos].classList.remove("hidden");
		document.getElementById("overlay_text").innerHTML = imagesPos+1 + " / " + overlayImages.length;
	}
	
}