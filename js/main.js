
jQuery.ajaxSetup({async:false})
var htags = []

function initApp() {
    var items = [];
    // we generate some random guid for each item
    $.each(model, function (i, item) {
        item.id=guid()
    });
    // we insert all data in the oage
    $.each(model, function (i, item) {
        var details = ""
        if (item.P != undefined) {
            details = "<span class='details'> P:"+ item.P +" C:"+ item.C +" F:"+ item.F + "</span>";
        }
        items.push("<li class='list-group-item "+ item.type +"' title='" + item.id + "' id='" + item.id + "'><span>" 
        + item.display + "</span>" + details + "</li>");
    });
    $('#selectList').html(items);
    bindListeners();
}

//generates random id;
let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function getHashTags(hashtag) {
    url = "https://apidisplaypurposes.com/tag" + hashtag;
    $.get(url, function( data ) {
        // console.log(data)
        generateHashTagList(data.results)
      });
}

function generateHashTagList(datas) {
    $.each(datas, function(i, htag) {
        htags.push(htag)
    })
}

function getBestHtags(tags) {
    $.each(tags, function(i, tag){
        getHashTags(tag)
    })
    // we compute a value to sort tags
    $.each(htags, function (i, htag) {
        var rank = htag.rank
        var rel = htag.relevance
        htag.power = rel * rank
    })
    // we sort by the new valur
    htags.sort(sortByProperty("power"))

    var bestTags = []
    for (i = htags.length - 1; i >= htags.length - 30; i--) {
        bestTags.push("#".concat(htags[i].tag))
    }
    return bestTags.join(" ");
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
    reset_data();
    selectedTemplate = templates[templateName];
    console.log(selectedTemplate);
    $('#intro_text_fr').text(selectedTemplate.intro_fr);
    $('#intro_text_us').text(selectedTemplate.intro_us);
    $('#closing_text_fr').text(selectedTemplate.closing_fr);
    $('#closing_text_us').text(selectedTemplate.closing_us);
    $('#hastags').text(getBestHtags(selectedTemplate.hashtags.split(" ")));
}

function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
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
        reset_data()
    });
}

function reset_data() {
    $('#result').text("");
    $('#result_fr').text("");
    $('#result_us').text("");
    htags = []
}


