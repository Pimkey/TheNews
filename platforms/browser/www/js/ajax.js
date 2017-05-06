function loadAllSources() {
    $.ajax({
        type: 'GET',
        url: "https://newsapi.org/v1/sources?language=en",
        datatype: 'dataType',
        success: function (data, status) {
            var arrayOfSources = data.sources;
            var sources = []
            var sourcesHtml = "";
            for (var i = 0; i < arrayOfSources.length; i++) {
                var source = arrayOfSources[i];
                sources.push(source);
                sourcesHtml += buildSourceHtml(source, "");
            }
            $("#sources_listview").append(sourcesHtml);
            $("#sources_listview").attr('data-sources', JSON.stringify(sources));
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
