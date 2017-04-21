document.addEventListener("DOMContentLoaded", function () {
    openDB()
}, false);

$(document).ready(function () {
    $("#sources_button").click(function () {
        $.ajax({
            type: 'GET',
            url: "https://newsapi.org/v1/sources?language=en",
            datatype: 'dataType',
            success: function (data, status) {
                var arrayOfSources = data.sources;
                var sourcesHtml = "";
                for (var i = 0; i < arrayOfSources.length; i++) {
                    sourcesHtml += buildSourceHtml(arrayOfSources[i]);
                }
                $("#sources").empty();
                $("#sources").append('<ul clas="sources_list">' + sourcesHtml + '</ul>');
                $.mobile.changePage("#sources");
            }
        });
    });

    $("#sources").on('click', '.source_button', function () {
        var id = this.id;
        $.ajax({
            type: 'GET',
            url: "https://newsapi.org/v1/articles?source=" + id + "&apiKey=203603e58f0a46b3abfaf912a4512372",
            datatype: 'dataType',
            success: function (data, status) {
                var arrayOfArticles = data.articles;
                var articlesHtml = "";
                for (var i = 0; i < arrayOfArticles.length; i++) {
                    articlesHtml += buildArticleHtml(arrayOfArticles[i]);
                }
                $("#articles").empty();
                $("#articles").append('<ul clas="articles_list">' + articlesHtml + '</ul>');
                $.mobile.changePage("#articles");
            }
        });
    });


    document.getElementById("save_new_list").addEventListener("click", function (e) {
        e.preventDefault();
        var listName = document.getElementById('list_name_textbox').value
        addList(listName);
    }, false);


});
