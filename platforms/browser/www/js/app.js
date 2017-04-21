
$(document).ready(function () {
    $("#sources_button").click(function () {
        $.ajax({ type: 'GET',   
            url: "https://newsapi.org/v1/sources?language=en",   
            datatype: 'dataType',
            success : function(data, status) {  
                var arrayOfSources = data.sources;
                var sourcesHtml = "";
                for(var i = 0; i < arrayOfSources.length; i++){
                    sourcesHtml += buildSourceHtml(arrayOfSources[i]);
                }
                $("#sources").empty();
                $("#sources").append('<ul clas="sources_list">' + sourcesHtml+ '</ul>');
                $.mobile.changePage("#sources");
            }
        });
    });

    function buildSourceHtml(element){
        var elementHtml = '<li>'+
         '<div class="source_element">'+
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
    
    $("#sources").on('click', '.source_button', function () {
        var id = this.id;
        $.ajax({ type: 'GET',   
            url: "https://newsapi.org/v1/articles?source=" + id + "&apiKey=203603e58f0a46b3abfaf912a4512372",   
            datatype: 'dataType',
            success : function(data, status) {  
                var arrayOfArticles = data.articles;
                var articlesHtml = "";
                for(var i = 0; i < arrayOfArticles.length; i++){
                    articlesHtml += buildArticleHtml(arrayOfArticles[i]);
                }
                $("#articles").empty();
                $("#articles").append('<ul clas="articles_list">' + articlesHtml + '</ul>');
                $.mobile.changePage("#articles");
            }
        });
    });
    
    function buildArticleHtml(element){
        var elementHtml = '<li>'+
         '<div class="article_element">'+
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
});