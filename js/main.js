
function initApp() {
    var items = [];
    $.each(model, function (i, item) {
        items.push("<li class='list-group-item' id='" + item.id + "'>" + item.display + "</li>");
    });
    $('#selectList').html(items);
    bindListeners();
}

function getHashTags(hashtag) {
    url = "https://query.displaypurposes.com/tag/" + hashtag;
    $.get(url, function( data ) {
        result = data;
        console.log(data)
      });
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

function fillFromTemplate(templateName) {
    selectedTemplate = templates[templateName];
    console.log(selectedTemplate);
    $('#intro_text_fr').text(selectedTemplate.intro_fr);
    $('#intro_text_us').text(selectedTemplate.intro_us);
    $('#closing_text_fr').text(selectedTemplate.closing_fr);
    $('#closing_text_us').text(selectedTemplate.closing_us);
    $('#hastags').text(selectedTemplate.hashtags);
}

function bindListeners() {
    $('#templateSelector > li > a').bind("click", function(e){
        selectedTemplate = $(this).attr('id');
        console.log(selectedTemplate);
        fillFromTemplate(selectedTemplate);
    });

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
    
        $('#result').text(introFr + "\n" + resultFr + "\n" + closingTextFr + "\n\n"
            + introUs + "\n" + resultUs + "\n" + closingTextUs + "\n\n" + hashtags);
            $('#result').select();
    });

    $('#reset').bind("click", function() {
        $('#result').text("");
        $('#result_fr').text("");
        $('#result_us').text("");
    });
}


