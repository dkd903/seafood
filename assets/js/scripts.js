/* Given the very very short duration associated with this project, I am staying away from ES6 and associated transpiling */

"use strict";
$( document ).ready(function() {
    /* Contants - ideally this would come from a serverside constant variable and be read by JavaScript */
    var baseUrl = ''; // eg. http://wp48.wp/seafood/seafood

    if ( baseUrl.length !== 0 ) {

    	// the store
	    var seafoodData;

	    // get the data fetch promise
		var jqxhr = $.getJSON( baseUrl + '/assets/data/data.json' );

		jqxhr.done( function( data ) {
			// process the fetched data and render the necessary info
			seafoodData = data;
			dataProc.call( this, seafoodData );

		} )
		.fail( function( data, textStatus, error ) {
			// notify user about the error
			console.error( "getJSON failed, status: " + textStatus + ", error: " + error )
		} )
		.always( function() {
			console.log( "Request for data.json complete" );
			$( '.loading' ).hide();
		} );
    } else {

    	// throw a JS exception here ideally
    	// but for the purposes of this project, throwing an alert
    	alert( 'Open assets/js/scripts.js and update the baseUrl' );
    }

    /* Event handlers for the select dropdown */
	$( 'body' ).on( 'change', 'select', function() {
		var value = $( this ).val();

		if ( value.length !== 0 ) {
			updateChart.call( this, value, seafoodData );
		}
	} );

    /**
      Process the loaded data
     */
    var dataProc = function( data ) {

    	// build the select species chooser
    	var priceChooser = '<option value="">Select a Species</option>';
		$.each(data, function(i, item) {
		    priceChooser += '<option value="' + i + '">' + item.specie + '</option>';
		})

		// update DOM
    	$( '#price-chooser' ).html( '<select>' + priceChooser + '<select>' );

    };

    /**
	  Update the chart function using D3

	  Notes: D3.js bar chart helper code partly from D3 samples
     */
    var updateChart = function( value, seafoodData ) {
    	// empty the chart
    	$( '#chart' ).html( '' );

    	// check if the pricing for chosen species exists
    	if ( typeof seafoodData[value] === "undefined" ) {
    		return "";
    	}

    	// build price data from seafood data
        var jsonData = [];
        var firstWeek = seafoodData[value].firstWeek, //TODO: null guard
        	firstYear = seafoodData[value].firstYear,
        	firstYearEnd = firstYear,
        	specie = seafoodData[value].specie,
        	origin = seafoodData[value].origin,
        	pricingUnit = seafoodData[value].caption;
        var maxPrice = 0;

		// update the title
		$( '#info' ).html( specie + " (" + origin + ") " );

        // TODO: null guard for seafoodData[value].prices
		$.each(seafoodData[value].prices, function(i, item) {
			// perform week calulcations for bigger data sets
		    if ( firstWeek > 52 ) {
				firstYearEnd += 1;
		    	firstWeek = 1;
		    }

		    // push the data to data array
		    jsonData.push( { "WeekNo": firstWeek, "Price": item } );
		    firstWeek += 1;
		    if ( item > maxPrice ) {
		    	maxPrice = parseInt( item );
		    }
		});

        var svgWidth = document.body.clientWidth || 1280;
        svgWidth = svgWidth - 100;

        var svgHeight = window.innerHeight || 768;
        svgHeight = svgHeight - 200;

        var heightPad = 50;
        var widthPad = 40;

        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", svgWidth + (widthPad * 2))
            .attr("height", svgHeight + (heightPad * 2))
            .append("g")
            .attr("transform", "translate(" + widthPad + "," + heightPad + ")");

        //Set up scales
        var xScale = d3.scale.ordinal()
            .domain(jsonData.map(function(d) { return d.WeekNo; }))
            .rangeRoundBands([0, svgWidth], .1);

       var yScale = d3.scale.linear()
            .domain([0, maxPrice])
            .range([svgHeight,0]);

       // Create bars
        svg.selectAll("rect")
            .data(jsonData)
            .enter().append("rect")
            .attr("x", function (d) { return xScale(d.WeekNo) + widthPad; })
            .attr("y", function (d) { return yScale(d.Price); })
            .attr("height", function (d) { return svgHeight - yScale(d.Price); })
            .attr("width", xScale.rangeBand())
            .attr("fill", "red");

        // X axis
        var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + widthPad + "," + svgHeight + ")")
            .call(xAxis)
         .append("text")
            .attr("x", svgWidth / 2 - widthPad)
            .attr("y", 50)
            .text("Week " + (firstYearEnd == firstYear ? firstYear : firstYear + " - " + firstYearEnd));

        // Y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + widthPad + ",0)")
            .call(yAxis)
         .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .style("text-anchor", "end")
            .text("Price - " + pricingUnit);
    }
});