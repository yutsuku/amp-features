// ==UserScript==
// @name        /AMP/ features
// @description An UserJS to make browsing this specific topic easier, at least for me.
// @author      moh aka Yutsuku
// @version     1.3.2
// @include     https://www.crunchyroll.com/forumtopic-647851*
// @updateURL   https://raw.githubusercontent.com/yutsuku/amp-features/master/amp-features.user.js
// @downloadURL https://raw.githubusercontent.com/yutsuku/amp-features/master/amp-features.user.js
// ==/UserScript==

(function() {
var $ = function(e) { return document.getElementById(e) || (document.querySelectorAll(e).length == 1 ? document.querySelectorAll(e)[0] : (document.querySelectorAll(e).length == 0 ? false : document.querySelectorAll(e)) ) || false; }

var settings = {
	"lightbox-enabled": "false",
	"lightbox-spoilers": "false",
	"lightbox-resizeimg": "false",
	"lightbox-zoom": "false",
	"lightbox-bg": "rgba(0,0,0, 0.8)",
	"pager-enabled": "true"
}

function loadSettings() {
	var pagerEnabled = localStorage.getItem("pagerEnabled");
	if ( pagerEnabled == null ) {
		localStorage.setItem("pagerEnabled", settings["pager-enabled"]);
	} else {
		settings["pager-enabled"] = pagerEnabled;
	}

	var lightboxEnabled = localStorage.getItem("lightboxEnabled");
	if ( lightboxEnabled == null ) {
		localStorage.setItem("lightboxEnabled", settings["lightbox-enabled"]);
	} else {
		settings["lightbox-enabled"] = lightboxEnabled;
	}

	var lightboxSpoilers = localStorage.getItem("lightboxSpoilers");
	if ( lightboxSpoilers == null ) {
		localStorage.setItem("lightboxSpoilers", settings["lightbox-spoilers"]);
	} else {
		settings["lightbox-spoilers"] = lightboxSpoilers;
	}

	var lightboxResizeimg = localStorage.getItem("lightboxResizeimg");
	if ( lightboxResizeimg == null ) {
		localStorage.setItem("lightboxResizeimg", settings["lightbox-resizeimg"]);
	} else {
		settings["lightbox-resizeimg"] = lightboxResizeimg;
	}

	var lightboxZoom = localStorage.getItem("lightboxZoom");
	if ( lightboxZoom == null ) {
		localStorage.setItem("lightboxZoom", settings["lightbox-zoom"]);
	} else {
		settings["lightbox-zoom"] = lightboxZoom;
	}

	var lightboxBg = localStorage.getItem("lightboxBg");
	if ( lightboxBg == null ) {
		localStorage.setItem("lightboxBg", settings["lightbox-bg"]);
	} else {
		settings["lightbox-bg"] = lightboxBg;
	}
}

function main() {
	if ( window.location.href.indexOf("forumtopic-647851") == -1 ) return false;
	loadSettings();

	if ( settings["pager-enabled"] == "true" ) {
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
	}

	var style = document.createElement("style");
	style.innerHTML = "#lightbox-toggle { width: 100%; height: 100%; padding: 4px 8px; text-decoration: none; } .lightbox-settings { user-select: none; } #latest-plz { z-index: 1000; background: #ffffff; box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25); position: fixed; top: 5px; right:5px; line-height: 64px; padding: 0px 12px; font-size: 14px; font-weight: 700; }  #overlay { display: block;position: fixed;top: 0%;left: 0%;width: 100%;height: 100%;background: " + settings["lightbox-bg"] + ";z-index:1001; } #overlay_content { display: flex; flex-direction: column; width: 100%; height: 100%; text-align:center; margin: 0px auto; overflow: auto; } .overlayElement { width: 100%; height: 95%; } #overlay_text { text-shadow: 0px 1px 1px #000; display: table-row; color: #DF6300; } .hotkey { font-weight: bold; font-size: 18px; font-family: \"Source Sans Pro\", \"Helvetica\", \"Arial\", sans-serif; 	color: #070707; 	background: #f5f5f5; 	display: inline-block; 	padding: 3px 6px; 	border-radius: 3px; 	border: 1px solid #fff; 	box-shadow: 0px 2px 0px 2px #C4C4C4, inset 0px 1px 1px 1px #fff, 0px 3px 3px 3px rgba(0,0,0,0.1); 	margin: 1px 8px; } #tutorial { position: absolute; top: 25px; left: 25px; width: 300px; margin: 25px; background: #f5f5f5; border-radius: 4px; padding: 15px 25px } #tutorial p { margin-top: 10px; } .amp-features-settings { cursor: default; z-index: 1000; margin-top: 5px; position: absolute; left: 0px; white-space: nowrap; background: #fff; box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25); padding: 10px; border-radius: 4px; } .amp-features-settings li { display: block !important; float: none !important; margin: 5px 0px; } .amp-features-settings sup { font-size: 70%; } .amp-features-settings sup a { display: inline !important; font-size: inherit !important; margin: 0px !important; padding: 0px !important; line-height: inherit !important; } .hidden { display: none; } #overlay img {border: none;}";
	if ( settings["lightbox-resizeimg"] == "true" ) {
		style.innerHTML += ".overlayElement .bb-image { width: auto; height: 100%; }";
	}
	if ( settings["lightbox-zoom"] == "true" ) {
		style.innerHTML += ".overlayElement .bb-image { object-fit: contain; height: 100%; width: 100%; }";
	}
	document.head.appendChild(style);

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
	var nextPage;

    if ( $(".showforumtopic-paginator a[title=\"Next\"]").length > 0 ) {
        nextPage = $(".showforumtopic-paginator a[title=\"Next\"]")[0].href;
    }

	var isEnabled = localStorage.getItem("lightboxEnabled");
	if ( isEnabled == null ) {
		localStorage.setItem("lightboxEnabled", "false");
		isEnabled = localStorage.getItem("lightboxEnabled");
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
		if ( settings["lightbox-spoilers"] == "true" ) {
			images = $(".bb-image");
		} else {
			images = $(".showforumtopic-message-contents-text > .bb-image");
		}
		//console.log("EasyNavigation(): found " + images.length + " images");
		imagesPos = 0;
		CreateOverlay();
	}

	function attachSettings() {
		var handle = document.querySelector("#template_action_button");

		var root = document.createElement("div");
		root.className = "paginator-lite";
		root.style = "cursor: pointer; display: inline-block; margin: 0 4px; padding: 0px;";

		var a = document.createElement("a");
		a.id = "lightbox-toggle";
		a.style = "margin-right: 0px;";
		a.innerHTML = "/AMP/ Settings";
		a.setAttribute("onmousedown", "return false;");

		var arrowDown = document.createElement("span");
		arrowDown.id = "amp-menu-arrow-down";
		arrowDown.innerHTML = " \u25be";

		var arrowUp = document.createElement("span");
		arrowUp.id = "amp-menu-arrow-up";
		arrowUp.className = "hidden";
		arrowUp.innerHTML = " \u25B4";

		a.appendChild(arrowDown);
		a.appendChild(arrowUp);

		root.appendChild(a);

		root.innerHTML += "\
		<div class=\"amp-features-settings hidden\">\
		  <ul>\
			<h3>Lightbox</h3>\
			<li>\
				<label>\
					<input id=\"amp-features-lightbox-enabled\" " + (settings["lightbox-enabled"] == "true" ? "checked=\"checked\"" : "") + "type=\"checkbox\">\
					Enable\
				</label>\
			</li>\
			<li>\
				<label>\
					<input id=\"amp-features-lightbox-spoilers\" " + (settings["lightbox-spoilers"] == "true" ? "checked=\"checked\"" : "") + "type=\"checkbox\">\
					Include spoilers\
				</label>\
			</li>\
			<li>\
				<label>\
					<input id=\"amp-features-lightbox-zoom\" " + (settings["lightbox-zoom"] == "true" ? "checked=\"checked\"" : "") + "type=\"checkbox\">\
					Zoom images\
				</label>\
			</li>\
			<li>\
				<label>\
					<input id=\"amp-features-lightbox-resizeimg\" " + (settings["lightbox-resizeimg"] == "true" ? "checked=\"checked\"" : "") + "type=\"checkbox\">\
					Scale down large images\
				</label>\
			</li>\
			<li>\
				<label>\
					<input id=\"amp-features-lightbox-bg\" value=\"" + settings["lightbox-bg"] + "\" type=\"text\">\
					Background\
					<sup><a target=\"_blank\" href=\"https://developer.mozilla.org/en-US/docs/Web/CSS/background\">[1]</a></sup>\
					<sup><a target=\"_blank\" href=\"http://hslpicker.com/\">[2]</a></sup>\
				</label>\
			</li>\
			<h3>Pager</h3>\
			<li>\
				<label>\
					<input id=\"amp-features-pager-enabled\" " + (settings["pager-enabled"] == "true" ? "checked=\"checked\"" : "") + "type=\"checkbox\">\
					Enable\
				</label>\
			</li>\
			<h3>Misc</h3>\
			<li>\
				<label>\
					<input id=\"amp-features-tutorial-reset\" type=\"checkbox\">\
					Reset tutorial\
				</label>\
			</li>\
			<div>\
				<button id=\"amp-features-save\">Save</button>\
			</div>\
		  </ul>\
		</div>";

		handle.parentNode.insertBefore(root, handle);

		$("#lightbox-toggle").addEventListener('click', toggleMenu, false);

		$("#amp-features-save").addEventListener('click', function() {
			// save settings here, TO DO
			saveSettings();
			toggleMenu();
		}, false);

	}

	function saveSettings() {
		var changes = "";
		var lightboxEnabled = $("#amp-features-lightbox-enabled").checked.toString();
		var lightboxSpoilers = $("#amp-features-lightbox-spoilers").checked.toString();
		var lightboxResizeimg = $("#amp-features-lightbox-resizeimg").checked.toString();
		var lightboxZoom = $("#amp-features-lightbox-zoom").checked.toString();
		var lightboxBg = $("#amp-features-lightbox-bg").value;
		var pagerEnabled = $("#amp-features-pager-enabled").checked.toString();
		var tutorialReset = $("#amp-features-tutorial-reset").checked.toString();

		/*console.log("DEBUG: saveSettings()");
		console.log(lightboxEnabled);
		console.log(lightboxSpoilers);
		console.log(lightboxResizeimg);
		console.log(lightboxBg);
		console.log(pagerEnabled);*/

		if ( settings["lightbox-enabled"] != lightboxEnabled ) {
			settings["lightbox-enabled"] = lightboxEnabled;
			localStorage.setItem("lightboxEnabled", settings["lightbox-enabled"]);
			changes += "lightbox switch\n";
		}
		if ( settings["lightbox-spoilers"] != lightboxSpoilers ) {
			settings["lightbox-spoilers"] = lightboxSpoilers;
			localStorage.setItem("lightboxSpoilers", settings["lightbox-spoilers"]);
			changes += "lightbox spoilers\n";
		}
		if ( settings["lightbox-resizeimg"] != lightboxResizeimg ) {
			settings["lightbox-resizeimg"] = lightboxResizeimg;
			localStorage.setItem("lightboxResizeimg", settings["lightbox-resizeimg"]);
			changes += "lightbox resize images\n";
		}
		if ( settings["lightbox-zoom"] != lightboxZoom ) {
			settings["lightbox-zoom"] = lightboxZoom;
			localStorage.setItem("lightboxZoom", settings["lightbox-zoom"]);
			changes += "lightbox zoom\n";
		}
		if ( settings["lightbox-bg"] != lightboxBg ) {
			settings["lightbox-bg"] = lightboxBg;
			localStorage.setItem("lightboxBg", settings["lightbox-bg"]);
			changes += "lightbox background\n";
		}
		if ( settings["pager-enabled"] != pagerEnabled ) {
			settings["pager-enabled"] = pagerEnabled;
			localStorage.setItem("pagerEnabled", settings["pager-enabled"]);
			changes += "pager switch\n";
		}
		if ( tutorialReset == "true" ) {
			localStorage.setItem("ligthboxTutorialShown", "false");
			changes += "tutorial reset\n";
		}

		if ( changes == "" ) {
			alert("No changes to save");
		} else {
			alert("Settings saved\n\n" + changes + "\n\nSome changes may require a restart to take effect.");
		}

	}

	function toggleLightbox() {
		var state = localStorage.getItem("lightboxEnabled");
		if ( state == null ) {
			localStorage.setItem("lightboxEnabled", "false");
			return;
		}
		if ( state == "true" ) {
			localStorage.setItem("lightboxEnabled", "false");
		} else {
			localStorage.setItem("lightboxEnabled", "true");
			ShowOverlay();
		}
	}

	function toggleMenu() {
		$(".amp-features-settings").classList.toggle("hidden");
		$("#amp-menu-arrow-down").classList.toggle("hidden");
		$("#amp-menu-arrow-up").classList.toggle("hidden");
	}

	/* OVERLAY */
	function CreateOverlay() {

		var overlay = document.createElement("div");
		overlay.id = "overlay";
		overlay.addEventListener('click', function(e) {
			if ( e.target.tagName == "IMG" ) {
				e.preventDefault();
				return;
			}
			($("#overlay")).parentNode.removeChild(this);
		}, false);

		var overlay_content = document.createElement("div");
		overlay_content.id = "overlay_content";
		var overlay_element
		for(var i=0;i<images.length;++i) {
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
				($("#overlay")).parentNode.removeChild(this);
			}
		}
	}

	function ShowNext() {
		if ( imagesPos >= images.length-1 ) {
            if ( nextPage ) {
                window.location = nextPage;
            }
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
main();
})();