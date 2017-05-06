var params = [];

document.addEventListener("DOMContentLoaded", function () {
    openDB()
}, false);

$(document).ready(function () {
    $("#sources_button").click(function () {
        $("#sources").data('list-id', 'all');
        $.mobile.changePage("#sources");
    });

    $(document).on("pagebeforeshow", "#sources", function () {
        $("#sources_listview").empty();
        var listId = $("#sources").data('list-id');
        if (listId == 'all') {
            var categoryId = $("#sources").data('categories');
            loadAllSources(categoryId);
        } else if (listId == 'favourites') {
            loadFavourites();
        } else {
            loadSourcesFromList(listId);
        }
        $.mobile.changePage("#sources");
    });

    $("#lists_button").click(function () {
        $.mobile.changePage("#lists");
    });

    $(document).on("pagebeforeshow", "#lists", function () {
        $("#lists_listview").empty();
        getLists('lists_listview');
    });

    $("#lists").on('click', '#lists_listview li a.list-item', function () {
        $("#sources").data('list-id', this.parentElement.id);
        $.mobile.changePage("#sources");

    });

    $("#lists").on('click', '#lists_listview li a.ui-icon-delete', function () {
        var listId = this.parentElement.id;
        deleteList(listId);
    });

    $("#sources").on('click', '.source_button', function () { // do dynamicznego contentu (gdy guzik się generuje przy ładowaniu strony)
        params.sourceId = this.id;
        $.mobile.changePage("#articles");
    });

    $('#sources').on('click', '#sources_listview a', function (event) {
        $('#add_to_list').attr('data-source-id', $(this).data('sourceId'))
    });

    $("#add_to_list").on({
        popupbeforeposition: function (e) {
            $("#add_to_list_listview").empty();
            getLists('add_to_list_listview');
        }
    });

    $("#add_to_list").on('click', '#add_to_list_listview li, #add_to_favourites', function () {
        var sources = $('#sources_listview').data('sources');
        var sourceId = $("#add_to_list").data('source-id');
        var sourceToSave = sources.filter(function (obj) {
            return obj.id == sourceId;
        });
        if (this.id == 'add_to_favourites') {
            addSourceToFavourites(sourceToSave);
        } else {
            addSourceToList(sourceToSave, this.id);
        }
    });

    $("#favourites_button").click(function () {
        $("#sources").data('list-id', 'favourites');
        $.mobile.changePage("#sources");
    })

    $(document).on("pagehide", "#articles", function () {
        $("#articles").data('articles', 'all');
    });

    $("#articles_listview").on('click', '.save-article-button', function () {
        var article = {};
        article.title = this.parentElement.childNodes[1].childNodes[1].innerText;
        article.author = this.parentElement.childNodes[1].childNodes[2].childNodes[1].innerText;
        article.description = this.parentElement.childNodes[1].childNodes[3].innerText;
        article.publishedAt = this.parentElement.childNodes[1].childNodes[4].childNodes[2].innerText;
        article.url = this.parentElement.childNodes[1].childNodes[5].firstChild.href;
        article.urlToImage = this.parentElement.childNodes[1].childNodes[0].src;
        saveArticle(article);
    });

    $("#articles_listview").on('click', '.delete-saved-article-button', function () {
        var element = this.parentElement.parentElement;
        var articleId = element.id;
        deleteSavedArticle(articleId);
    });

    $("#saved_button").click(function () {
        $("#articles").data('articles', 'saved');
        $.mobile.changePage("#articles");
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
            loadSavedArticles();
        }
        $.mobile.changePage("#articles");
    });

    document.getElementById("save_new_list").addEventListener("click", function (e) {
        e.preventDefault();
        var listName = document.getElementById('list_name_textbox').value
        addList(listName);
    }, false);

});
