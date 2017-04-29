function loadSources() {
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
            $("#sources_listview").append(sourcesHtml);
            $("#sources_listview").listview("refresh");
        }
    });
}

function loadArticles(sourceId) {
    $.ajax({
        type: 'GET',
        url: "https://newsapi.org/v1/articles?source=" + sourceId + "&apiKey=203603e58f0a46b3abfaf912a4512372",
        datatype: 'dataType',
        success: function (data, status) {
            var arrayOfArticles = data.articles;
            var articlesHtml = "";
            for (var i = 0; i < arrayOfArticles.length; i++) {
                articlesHtml += buildArticleHtml(arrayOfArticles[i]);
            }
            $("#articles_listview").append(articlesHtml);
            $("#articles_listview").listview('refresh');
        }
    });
}
