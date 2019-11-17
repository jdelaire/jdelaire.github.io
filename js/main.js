
function initApp() {
    var items = [];
    $.each(model, function (i, item) {
        items.push("<li class='list-group-item' id='" + item.id + "'>" + item.display + "</li>");
    });
    $('#selectList').html(items);
    bindListeners();
}

function retrieveItem(index) {
    var foundItem;
    $.each(model, function (i, item) {
        if (item.id == index) {
            console.log(item);
            foundItem = item;
        }
    });
    return foundItem;
}

function bindListeners() {
    $('#selectList > li').bind("click", function (e) {
        clickedItem = retrieveItem($(this).attr('id'));

        //US
        beforeUs = $('#result_us').text();
        $('#result_us').text(beforeUs + "- " + clickedItem.display_us + "\n");
    
        //FR
        beforeFr = $('#result_fr').text();
        $('#result_fr').text(beforeFr + "- " + clickedItem.display_fr + "\n");
    })

    $('#generate').bind("click", function () {
        introFr = $('#intro_text_fr').text();
        introUs = $('#intro_text_us').text();
        closingTextFr = $('#closing_text_fr').text();
        closingTextUs = $('#closing_text_us').text();
        resultFr = $('#result_fr').text();
        resultUs = $('#result_us').text();
        hashtags = $('#hastags').text();
    
        $('#result').text(introFr + "\n" + resultFr + "\n" + closingTextFr + "\n"
            + introUs + "\n" + resultUs + closingTextUs + "\n\n" + hashtags);
            $('#result').select();
    });

    $('#reset').bind("click", function() {
        $('#result').text("");
    });
}


