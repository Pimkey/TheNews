function buildSourceHtml(element) {
    var elementHtml = '<li>' +
        '<div class="source_element">' +
        '<h3 class="source_name">' + element.name + '</h3>' +
        '<h4 class="source_category">Category: <strong>' + element.category + '</strong></h4>' +
        '<p class="source_description">' + element.description + '</p>' +
        '<div class="source_locale">' +
        '<p class="souce_country">Country: <strong>' + element.country + '</strong></p>' +
        '<p class="souce_language">Language: <strong>' + element.language + '</strong></p></div>' +
        '<input type="button" value="See articles" id="' + element.id + '" class="source_button"></div>' +
        '</li>';
    return elementHtml;
}

function buildArticleHtml(element) {
    var elementHtml = '<li>' +
        '<div class="article_element">' +
        '<img src="' + element.urlToImage + '" alt="' + element.title + '" style="width:200px;height:200px;">' +
        '<h3 class="article_title">' + element.title + '</h3>' +
        '<h4 class="article_author">Author: <strong>' + element.author + '</strong></h4>' +
        '<p class="article_description">' + element.description + '</p>' +
        '<p class="article_published_at">Published at ' +
        element.publishedAt + '</p>' +
        '<p><a href="' + element.url + '" rel="external">Read more</a></p>' +
        '</li>';
    return elementHtml;
}

function addToListView(listId, object) {
    $("#" + listId).append("<li>" + object.name + "</li>");
    $("#list").listview("refresh");
}
