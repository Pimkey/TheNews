function buildSourceHtml(element, listId) {
    var elementHtml = '<li class="source_element" id="' + element.id + '"><a class="source_url" href="#">' +
        '<div>' +
        '<h3 class="source_name">' + element.name + '</h3>' +
        '<span><h4 class="source_category">Category: </h4><h4 class="source_category">' + element.category + '</h4></span>' +
        '<p class="source_description">' + element.description + '</p>' +
        '<div class="source_locale">' +
        '<span><p class="source_country">Country: </p><p class="source_country"><strong>' + element.country + '</strong></p></span>' +
        '<span><p class="source_language">Language: </p><p class="source_language"><strong>' + element.language + '</strong></p></span></div></div></a>';
    if (listId == 'all') {
        elementHtml += '<a href="#add_to_list" data-source-id="' + element.id + '" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a add_to_list_button">Add to list</a>' +
            '</li>';
    } else if (listId == 'favourites') {
        elementHtml += '<a href="#" data-list-id="favourites" class="ui-btn ui-btn-icon-notext ui-icon-delete ui-btn-a delete_from_favourites">Delete from favourites</a>' +
            '</li>';
    } else {
        elementHtml += '<a href="#" data-list-id="' + element.id + '" class="ui-btn ui-btn-icon-notext ui-icon-delete ui-btn-a delete_source">Delete from list</a>' +
            '</a></li>';
    }

    return elementHtml;
}

function buildArticleHtml(element, whichArticles) {
    var elementHtml = '<li class="article_element" id="' + element.id + '"><a href="' + element.url + '" class="article_url" rel="external">' +
        '<div> ' +
        '<img class="img_url" src="' + element.urlToImage + '" alt="' + element.title + '" style="width:200px;height:200px;">' +
        '<h3 class="article_title">' + element.title + '</h3>' +
        '<h4 class="article_author"><p>Author: </p><p><strong>' + element.author + '</strong></p></h4>' +
        '<p class="article_description">' + element.description + '</p>' +
        '<span><p class="article_published_at">Published at </p> ' +
        '<p class="published_at">' + element.publishedAt + '</p></span></div>';
    if (whichArticles == 'all') {
        elementHtml += '<a href="#" id="' + element.title + '" class="ui-btn ui-btn-icon-notext ui-icon-star ui-btn-a save-article-button">Save for later</a></a></li>'
    } else {
        elementHtml += '<a href="#" id="' + element.title + '" class="ui-btn ui-btn-icon-notext ui-icon-delete ui-btn-a delete-saved-article-button">Delete from saved articles</a></a></li>'
    }
    return elementHtml;
}

function addToListsListView(listViewId, object) {
    if (listViewId == 'lists_listview') {
        $("#" + listViewId).append('<li id="' + object.id + '" class="ui-btn ui-btn-icon-right ui-li ui-li-has-alt ui-btn-up-c"><a href="#" class="ui-btn list_item">' + object.name + '</a><a href="#"  class="ui-btn ui-btn-icon-notext ui-icon-delete ui-btn-a" title="delete"></a></li>');
    } else {
        $("#" + listViewId).append('<li id="' + object.id + '"><a href="#">' + object.name + '</a></li>');
    }
}

function refreshListView(listViewId) {
    $("#" + listViewId).listview("refresh");
}

function refreshPage(pageId) {
    $(":mobile-pagecontainer").pagecontainer("change",
        "#" + pageId, {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: false,
        }
    );
}

function removeFromListView(sourceId, listViewId) {
    $("#" + sourceId).remove();
    refreshListView(listViewId);
}
