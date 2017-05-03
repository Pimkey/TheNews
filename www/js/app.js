function buildSourceHtml(element, listId) {
    var elementHtml = '<li id="' + element.id + '"><a href="#">' +
        '<div class="source_element">' +
        '<h3 class="source_name">' + element.name + '</h3>' +
        '<h4 class="source_category">Category: <strong>' + element.category + '</strong></h4>' +
        '<p class="source_description">' + element.description + '</p>' +
        '<div class="source_locale">' +
        '<p class="souce_country">Country: <strong>' + element.country + '</strong></p>' +
        '<p class="souce_language">Language: <strong>' + element.language + '</strong></p></div>' +
        '<input type="button" value="See articles" id="' + element.id + '" class="source_button"></div>';
    if (listId != "") {
        elementHtml += '<input type="button" data-list-id="' + listId + '" value="Remove from list" class="delete_source"></div>' +
            '</li>';
    } else {
        elementHtml += '<a href="#add_to_list" data-source-id="' + element.id + '" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a">Add to list</a>' +
            '</a></li>';
    }

    return elementHtml;
}

function buildArticleHtml(element, whichArticles) {
    var elementHtml = '<li id="' + element.id + '">' +
        '<div class="article_element"> ' +
        '<div>' +
        '<img src="' + element.urlToImage + '" alt="' + element.title + '" style="width:200px;height:200px;">' +
        '<h3 class="article_title">' + element.title + '</h3>' +
        '<h4 class="article_author"><p>Author: </p><p><strong>' + element.author + '</strong></p></h4>' +
        '<p class="article_description">' + element.description + '</p>' +
        '<span><p class="article_published_at">Published at </p> ' +
        '<p>' + element.publishedAt + '</p></span>' +
        '<p><a href="' + element.url + '" rel="external">Read more</a></p></div>';
    if (whichArticles == 'all') {
        elementHtml += '<input type="button" value="Save for later" id="' + element.title + '" class="save-article-button"></div></li>'
    } else {
        elementHtml += '<input type="button" value="Delete from saved articles" id="' + element.title + '" class="delete-saved-article-button"></div></li>'
    }
    return elementHtml;
}

function addToListsListView(listViewId, object) {
    if (listViewId == 'lists_listview') {
        $("#" + listViewId).append('<li id="' + object.id + '" class="ui-btn ui-btn-icon-right ui-li ui-li-has-alt ui-btn-up-c"><a href="#" class="ui-btn list-item">' + object.name + '</a><a href="#"  class="ui-btn ui-btn-icon-notext ui-icon-delete ui-btn-a" title="delete"></a></li>');
    } else {
        $("#" + listViewId).append('<li id="' + object.id + '"><a href="#">' + object.name + '</a></li>');
    }
}

function refreshListView(listViewId) {
    $("#" + listViewId).listview("refresh");
}

function removeFromListView(sourceId, listViewId) {
    $("#" + sourceId).remove();
    refreshListView(listViewId);
}
