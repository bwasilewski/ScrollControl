'use strict';

window.ScrollController = function ScrollController () {
    var pages = $('.page')
        ,navigablePages = $('.page--navigable')
        ,pagePositions = []
        ,totalHeight = 0
        ,currentPage = 0
        ,hash = window.location.hash;

    function init () {

        detectScrollPosition();
        populatePositionsArray();
        bindEvents();
        snapToPage( getHashIndex() );
    }

    function populatePositionsArray () {
        // get the xpos of each .page and add it to our array
        $.each(pages, function (ind, val) {
            var xPos = Math.ceil( $(val).offset().top );
            totalHeight += xPos;
            pagePositions.push(xPos);
        });
    }

    function bindEvents () {

        $(window).bind('scroll', function (ev) {

            detectScrollPosition();
        });

        window.pubsub.subscribe('/Menu/ItemClick', function (data) {
            scrollToPage(data);
        });
    }

    function unbindEvents () {
        $(window).unbind('scroll');
        window.pubsub.unsubscribe('/Menu/ItemClick');
    }

    function detectScrollPosition () {
        var currentScrollPos = $(window).scrollTop()
            ,oldVal = 0;

        // Iterate through each page position and compare it to
        // the current scroll position. If it matches the criteria,
        // publish the change page event and supply the index
        $.each(pagePositions, function (ind, val) {

            if ( currentScrollPos >= ( val - 100 ) ) {

                if ( currentScrollPos <= ( pagePositions[ind+1] - 100 ) || ind === pagePositions.length - 1 ) {
                    window.pubsub.publish('/ScrollController/ChangePage', [ind]);
                    updateHash(ind);
                }
            }

            oldVal = val;
        });
    }

    function getHashIndex () {
        var hash = window.location.hash
            ,index = 0;

        switch (hash) {

        case '#home':
            index = 0;
            break;

        case '#overview':
            index = 1;
            break;

        case '#how':
            index = 5;
            break;

        case '#benefits':
            index = 6;
            break;

        case '#contact':
            index = 7;
            break;

        default:
            index = 0;
            break;
        }

        return index;
    }

    function scrollToPage (index) {
        var scrollVal = 0;

        if ( index !== 0 ) {
            scrollVal = 90;
        }

        unbindEvents();

        // Scroll window to the page that corresponds with the hash
        $('html, body').stop().animate({
            scrollTop: pagePositions[index]
        }, 600, 'easeInOutQuart', function () {

            bindEvents();
        });
    }

    function snapToPage (index) {
        var scrollVal = 0;
        if ( index !== 0 ) {
            scrollVal = 90;
        }

        $('html, body').scrollTop(pagePositions[index] + scrollVal);
    }

    function updateHash (index) {

        console.log('Update Hash: ', index);

        switch (index) {
        case 0:
            window.app.updateHash( '#home' );
            return;

        case 1:
            window.app.updateHash( '#overview' );
            return;

        case 2:
            window.app.updateHash( '#overview' );
            return;

        case 3:
            window.app.updateHash( '#overview' );
            return;

        case 4:
            window.app.updateHash( '#overview' );
            return;

        case 5:
            window.app.updateHash( '#how' );
            return;

        case 6:
            window.app.updateHash( '#benefits' );
            return;

        case 7:
            window.app.updateHash( '#contact' );
            return;
        }

    }

    init();

};

