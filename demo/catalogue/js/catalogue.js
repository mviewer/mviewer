/**
 * Props
 */
var fuse, template, inputMin;

/**
 * Call JSON file on JS loading directly
 */
$.ajax({
    type: "GET",
    url: "./catalogue/data.json",
    crossDomain: true,
    dataType: "json",
    success: function(result) {
        // create template for each
        $.get(result.config.template, function(template) {
            createCards(template, result);
            $('#inputSearch').on('keyup', searchText);
            $('#inputSearch').change(controlEmpty);
            inputMin = result.config.inputMin || 2;
        });
        // init research
        fuse = search.init(result);
    }
})

/**
 * Return ordered array calcultate from a properties name
 * @param {Array} data
 * @param {String} propName
 * @return {Array}
 */
function orderData(data, propName) {
    var ordered = [];
    data.forEach(e => {
        ordered[e[propName]] = e;
    });
    return ordered;
}

/**
 * Create Mustache render from JSON file
 * @param {MST} template file
 * @param {Object} contain is data json file from local folder
 */
function createCards(template, contain) {
    contain.data = orderData(contain.data, 'id').filter(e => e);
    var card = Mustache.render(template,contain);
    $('#catalogAppsSant').append(card);
}

/**
 * Parse each items from JSON file data
 * @param {Object} results
 * @param {String} attr
 * @return {Array} of selected items match with specific attr passes as param
 */
function getResultByAttr(results, attr) {
    var selected = [];
    results.forEach(element => {
        element = element.item;
        if(element[attr]) {
            selected.push(element.id.toString());
        }
    });
    return selected;
}

/**
 * Get text from input. Triggered by event.
 * @param {Object} e - input component scope
 */
function searchText(e) {
    var input = e.target.value;
    fuseResult = fuse.search(input);
    console.log(inputMin);
    if(input.length > inputMin && fuseResult.length > 0) {
        var fuseResult = fuse.search(input);
        var toSelect = getResultByAttr(fuseResult, 'id');
        $('.searchable').each( function() {
            if(toSelect.indexOf($(this).attr('id')) <0 ) {
                // hide this
                $(this).addClass('hidden');
            }
        })
    } else {
        displayAll();
    }
}

/**
 * Display all cards.
 */
function displayAll() {
    $('.searchable').each( function() {
        $(this).removeClass('hidden');
    })
}

/**
 * Display all cards if user input empty text
 * @param {Object} e - input component scope
 */
function controlEmpty(e) {
    if(!e.target.value.length) {
        displayAll();
    }
}

/*
 * Buton scroll top
 */

var btn = $('#btn-scroll');

      $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
          btn.addClass('show');
        } else {
          btn.removeClass('show');
        }
      });

      btn.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop:0}, '300');
      });

