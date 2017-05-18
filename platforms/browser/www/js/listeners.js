var params = [];

document.addEventListener("DOMContentLoaded", function () {
    openDB();
}, false);

$(document).ready(function () {
    $("#sources_button, #sources_hamburger").click(function () {
        $("#sources").data('list-id', 'all');
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
        if (activePage[0].id == "sources") {
            refreshPage('sources');
        } else {
            $.mobile.pageContainer.pagecontainer("change", "#sources");
        }
    });

    $(document).on("pagebeforeshow", "#sources", function () {
        $("#sources_listview").empty();
        var listId = $("#sources").data('list-id');
        if (listId == 'all') {
            var categoryId = $("#sources").data('categories');
            $("#categories_button").show();
            loadAllSources(categoryId);
        } else if (listId == 'favourites') {
            $("#categories_button").hide();
            loadFavourites();
        } else {
            $("#categories_button").hide();
            loadSourcesFromList(listId);
        }
    });

    $("#lists_button, #lists_hamburger").click(function () {
        $.mobile.pageContainer.pagecontainer("change", "#lists");
    });

    $(document).on("pagebeforeshow", "#lists", function () {
        $("#lists_listview").empty();
        getLists('lists_listview');
    });

    $("#lists").on('click', '#lists_listview li a.list_item', function () {
        $("#sources").data('list-id', this.parentElement.id);
        $.mobile.pageContainer.pagecontainer("change", "#sources");
    });

    $("#lists").on('taphold', '#lists_listview li a.list_item', function () {
        var listId = $(this.parentElement).attr('id');
        var listName = $(this).text();
        $("#save_new_list").attr('data-list-id', listId);
        $("#list_name_textbox").val(listName);
        $("#add_list_popup").popup('open');
    });

    $("#save_new_list").click(function (e) {
        e.preventDefault();
        var listId = $(this).attr('data-list-id');
        var listName = $("#list_name_textbox").val();
        if (validateListName(listName)) {
            $("#list_validation_text").attr("hidden", true);
            if (listId == undefined || listId == "") {
                addList(listName);
            } else {
                editListName(listId, listName);
                var liId = '#' + listId + " .list_item";
                $(liId).text(listName);
                refreshListView('lists_listview');
                $(this).removeAttr('data-list-id');
            }
        }
    });

    $("#lists").on('click', '#lists_listview li a.ui-icon-delete', function () {
        var listId = this.parentElement.id;
        deleteList(listId);
    });

    $("#sources").on('click', '.source_url', function () { // do dynamicznego contentu (gdy guzik się generuje przy ładowaniu strony)
        params.sourceId = this.parentElement.id;
        var articlesPageTitle = $(this.parentElement).find(".source_name").text();
        $("#articles").find("h1.page_title").text(articlesPageTitle);
        $.mobile.pageContainer.pagecontainer("change", "#articles");
    });

    $('#sources').on('click', '#sources_listview a.add_to_list_button', function (event) {
        $('#add_to_list').attr('data-source-id', $(this).data('source-id'))
    });

    $("#add_to_list").on({
        popupbeforeposition: function (e) {
            $("#add_to_list_listview").empty();
            getLists('add_to_list_listview');
        }
    });

    $("#add_to_list").on('click', '#add_to_list_listview li, #add_to_favourites', function () {
        var sourceId = $("#add_to_list").attr('data-source-id');
        var $source = $("#" + sourceId);
        var sourceToSave = {};
        sourceToSave.id = sourceId;
        sourceToSave.name = $source.find('.source_name').text();
        sourceToSave.category = $source.find('.source_category').text();
        sourceToSave.description = $source.find('.source_description').text();
        sourceToSave.country = $source.find('.source_country').text();
        sourceToSave.language = $source.find('.source_language').text();
        if (this.id == 'add_to_favourites') {
            addSourceToFavourites(sourceToSave);
        } else {
            addSourceToList(sourceToSave, this.id);
        }
    });

    $("#favourites_button, #favourites_hamburger").click(function () {
        $("#sources").data('list-id', 'favourites');
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
        if (activePage[0].id == "sources") {
            refreshPage('sources');
        } else {
            $.mobile.pageContainer.pagecontainer("change", "#sources");
        }
    })

    $(document).on("pagehide", "#articles", function () {
        $("#articles").data('articles', 'all');
    });

    $("#articles_listview").on('click', '.save-article-button', function () {
        var $element = $(this.parentNode);
        var article = {};
        article.title = $element.find('.article_title').text();
        article.author = $element.find('.article_author').text();
        article.description = $element.find('.article_description').text();
        article.publishedAt = $element.find('.published_at').text();
        article.url = $element.find('a.article_url').attr('href');
        article.urlToImage = $element.find('img.img_url').attr('src');
        saveArticle(article);
    });

    $("#articles_listview").on('click', '.delete-saved-article-button', function () {
        var element = this.parentElement;
        var articleId = element.id;
        deleteSavedArticle(articleId);
    });

    $("#saved_articles_button, #saved_articles_hamburger").click(function () {
        $("#articles").data('articles', 'saved');
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
        if (activePage[0].id == "articles") {
            refreshPage('articles');
        } else {
            $.mobile.pageContainer.pagecontainer("change", "#articles");
        }
    });

    $("#articles_listview").on("click", "a.article_url", function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        window.open(href, '_system');
    });

    $("#sources").on('click', '.delete_source, .delete_from_favourites', function () {
        var sourceId = this.parentElement.id;
        var listId = $('#sources').data('list-id');
        if (listId == 'favourites') {
            deleteFromFavourites(sourceId);
        } else {
            deleteSourceFromList(listId, sourceId);
        }
    });

    $("#categories_listview").on('click', 'li.category', function () {
        $("#sources_listview").empty();
        var categoryId = this.id;
        $("li.category a").each(function () {
            $(this).removeClass("ui-icon-check ui-btn-icon-left");
            $("categories_listview").listview('refresh');
        })
        $(this.firstChild).buttonMarkup({
            icon: "check"
        });
        loadAllSources(categoryId);
        $("#sources").data('categories', categoryId)
        $("categories_listview").listview('refresh');
    })

    $(document).on("pagebeforeshow", "#articles", function () {
        $("#articles_listview").empty();
        var whichArticles = $("#articles").data('articles');
        if (whichArticles == 'all') {
            loadArticles(params.sourceId);
        } else {
            $("#articles").find("h1.page_title").text("Saved articles");
            loadSavedArticles();
        }
        $.mobile.pageContainer.pagecontainer("change", "#articles");
    });

});
