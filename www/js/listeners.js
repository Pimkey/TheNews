var params = [];

document.addEventListener("DOMContentLoaded", function () {
    openDB()
}, false);

$(document).ready(function () {
    $("#sources_button").click(function () {
        $("#sources").data('list-id', 'all');
        $("#articles").data('articles', 'all');
        $.mobile.changePage("#sources");
    });

    $(document).on("pageshow", "#sources", function () {
        $("#sources_listview").empty();
        var listId = $("#sources").data('list-id');
        if (listId != 'all') {
            loadSourcesFromList(listId);
        } else {
            loadAllSources();
        }
        $.mobile.changePage("#sources");
    });

    $("#lists_button").click(function () {
        $.mobile.changePage("#lists");
    });

    $(document).on("pageshow", "#lists", function () {
        $("#lists_listview").empty();
        getLists('lists_listview');
    });

    $("#lists").on('click', '#lists_listview li', function () {
        $("#sources").data('list-id', this.dataset.listId);
        $.mobile.changePage("#sources");

    });

    $("#sources").on('click', '.source_button', function () { // do dynamicznego contentu (gdy guzik się generuje przy ładowaniu strony)
        params.sourceId = this.id;
        $.mobile.changePage("#articles");
    });

    $('#sources').on('click', '#sources_listview a', function (event) {
        $('#add_to_list_listview').attr('data-source-id', $(this).data('sourceId'))
    });

    $("#add_to_list").on({
        popupbeforeposition: function (e) {
            $("#add_to_list_listview").empty();
            getLists('add_to_list_listview');
        }
    });

    $("#add_to_list").on('click', '#add_to_list_listview li', function () {
        var sources = $('#sources_listview').data('sources');
        var me = this;
        var sourceToSave = sources.filter(function (obj) {
            return obj.id == me.parentElement.dataset.sourceId;
        });
        addSourceToList(sourceToSave, this.dataset.listId);
    });

    $("#articles_listview").on('click', '.save_article_button', function () {
        var article = {};
        article.title = this.parentElement.childNodes[1].childNodes[1].innerText;
        article.author = this.parentElement.childNodes[1].childNodes[2].childNodes[1].innerText;
        article.description = this.parentElement.childNodes[1].childNodes[3].innerText;
        article.publishDate = this.parentElement.childNodes[1].childNodes[4].childNodes[2].innerText;
        article.articleURL = this.parentElement.childNodes[1].childNodes[5].firstChild.href;
        article.pictureURL = this.parentElement.childNodes[1].childNodes[0].src;
        saveArticle(article);
    });

    $("#saved_button").click(function () {
        $("#articles").data('articles', 'saved');
        $.mobile.changePage("#articles");
    });

    $(document).on("pageshow", "#articles", function () {
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
