var params = [];

document.addEventListener("DOMContentLoaded", function () {
    openDB()
}, false);

$(document).ready(function () {
    $("#sources_button").click(function () {
        $.mobile.changePage("#sources");
    });

    $(document).on("pageshow", "#sources", function () {
        $("#sources_listview").empty();
        loadSources();
    });

    $("#lists_button").click(function () {
        $.mobile.changePage("#lists");
    });

    $(document).on("pageshow", "#lists", function () {
        $("#lists_listview").empty();
        getLists('lists_listview');
    });


    $("#sources").on('click', '.source_button', function () { // do dynamicznego contentu (gdy guzik się generuje przy ładowaniu strony)
        params.sourceId = this.id;
        $.mobile.changePage("#articles");
    });

    $(document).on("pageshow", "#articles", function (e) {
        $("#articles_listview").empty();
        loadArticles(params.sourceId);
    });

    $('#sources').on('click', '#sources_listview a', function (event) {
        $('#add_to_list_listview').attr('data-source-id', ($(this).data('sourceId')));
    });

    $("#add_to_list").on({
        popupbeforeposition: function (e) {
            $("#add_to_list_listview").empty();
            getLists('add_to_list_listview');
        }
    });

    $("#add_to_list").on('click', '#add_to_list_listview li', function () {
        addArticleToList(this.parentNode.dataset.sourceId, this.innerText);
    });

    document.getElementById("save_new_list").addEventListener("click", function (e) {
        e.preventDefault();
        var listName = document.getElementById('list_name_textbox').value
        addList(listName);
    }, false);

});
