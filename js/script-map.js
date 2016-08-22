(function(){

	$(window).on('load', function() {
		$(".loading").fadeOut();
		$(".loaderPage").delay(1000).fadeOut("slow");
	});

	$('.screen-size-warning').fadeOut();
	var url = 'https://restcountries.eu/rest/v1/name/';
	var countriesList = $('#countries');
	var object = document.querySelector(".logo");
	var a = null;
	var svgDoc = null;
	var arrayForSvgItems = [];
	var divWrapperInfo = $('<div></div>', {
			"class" : 'wrapper-info',
	}).slideUp();

	if(jQuery.browser.mobile) {
		$(window).on('load resize', checkViewPort);

		function checkViewPort() {
			if(screen.orientation.angle == 0) {
				$('.screen-size-warning').fadeIn();
			} else {
				$('.screen-size-warning').fadeOut();
			}
		}
	}

	window.onload=function() {
		a = document.getElementById("svg-content");
		svgDoc = a.contentDocument;
	};

	$('#search').on('click', searchCountries);
	$('input').on('keypress', function(e){
		if(event.key === 'Enter') {
			searchCountries();
		}
	});

	function searchCountries() {
		$('.country-error').removeClass('is-down');

		var countryName = $('#country-name').val();

		if(!countryName.length) {
			countryName = 'Poland'
		}

		$.ajax({
			url: url + countryName,
  			method: 'GET',
  			success: showCountriesList,
  			error: displayError
  		});
	}

	function showCountriesList(resp) {
		countriesList.empty();

		var mainSVGStructure = svgDoc.querySelector('svg');
		var tagWithAllStrokes = mainSVGStructure.children[1].children;

		if(arrayForSvgItems.length) {
			for(var i = 0; i < arrayForSvgItems.length; i++) {
			TweenMax.to(arrayForSvgItems[i], 1, {scale:1, transformOrigin:"50% 50%", fill: "#7E7E7E", opacity: 0.3} );
			}
		}

		resp.forEach(function(item) {
			createInfoBlock(item);
			var svgItem = svgDoc.getElementById(item.alpha2Code);
			arrayForSvgItems.push(svgItem);
			TweenMax.to(svgItem, 1, {scale:3, transformOrigin:"50% 50%", fill: "#00000", opacity: 1} );
			var getAllSibl = getSiblings(svgItem);

			for(var i = 0; i < getAllSibl.length; i++) {
				TweenMax.set(getAllSibl[i], {css:{opacity: 0.3}});
			};
		});
	}

	function createInfoBlock(item) {
		divWrapperInfo.empty();

		var countryName = $('<span></span>', {
			'class': 'name-country'
		}).text(item.name);

		var singleCountry = $('<ul></ul>', {
			'class': 'single-country'
		});

		var capitalCountry = $('<li></li>', {
			'class' : 'capital-country'
		}).html('<span>Capital:</span>' + ' ' + item.capital);

		var currenciesCountry = $('<li></li>', {
			'class' : 'currencies-country'
		}).html('<span>Current currency:</span>' + ' ' + item.currencies);

		capitalCountry.appendTo(singleCountry);
		currenciesCountry.appendTo(singleCountry);
		countryName.appendTo(divWrapperInfo);
		singleCountry.appendTo(divWrapperInfo);
		divWrapperInfo.appendTo('.input-wrapper');
		divWrapperInfo.slideDown(500);
	}

	var getSiblings = function (elem) {
	    var siblings = [];
	    var sibling = elem.parentNode.firstChild;
	    var skipMe = elem;
	    for ( ; sibling; sibling = sibling.nextSibling )
	       if ( sibling.nodeType == 1 && sibling != elem )
	          siblings.push( sibling );
	    return siblings;
	}

	function displayError() {
		$('.country-error').toggleClass('is-down');
	}
})();
