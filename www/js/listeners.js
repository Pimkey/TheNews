var params = [];

document.addEventListener("DOMContentLoaded", function () {
    openDB()
}, false);

$(document).ready(function () {
    $("#sources_button").click(function () {
        $("#sources").data('list-name', 'all');
        $.mobile.changePage("#sources");
    });

    $(document).on("pageshow", "#sources", function () {
        $("#sources_listview").empty();
        var listName = $("#sources").data('list-name');
        if (listName != 'all') {
            loadSourcesFromList(listName);
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
        $("#sources").data('list-name', this.dataset.listName);
        $.mobile.changePage("#sources");

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
            return obj.id == me.parentNode.dataset.sourceId;
        });
        addSourceToList(sourceToSave, this.innerText);
    });

    document.getElementById("save_new_list").addEventListener("click", function (e) {
        e.preventDefault();
        var listName = document.getElementById('list_name_textbox').value
        addList(listName);
    }, false);

});
