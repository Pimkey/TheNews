var db;

function addList(name) {

    var list = {
        "name": name,
        "sources": []
    }

    var transaction = db.transaction(["lists"], "readwrite");
    var store = transaction.objectStore("lists");
    var request = store.add(list);
    request.onerror = function (e) {
        console.log("Error saving list " + name, e.target.error.name);
    }
    request.onsuccess = function (e) {
        list.id = event.target.result;
        addToListsListView('lists_listview', list)
        refreshListView('lists_listview');
        console.log("List " + name + " successfully saved");
    }
}

function deleteList(listId) {

    var transaction = db.transaction(["lists"], "readwrite");
    var store = transaction.objectStore("lists");
    var request = store.delete(parseInt(listId));
    request.onerror = function (e) {
        console.log("Error saving list " + name, e.target.error.name);
    }
    request.onsuccess = function (e) {
        removeFromListView(listId, 'lists_listview');
        console.log('List with id ' + listId + ' was deleted');
    }

}

function getLists(listId) {

    var lists = [];
    var transaction = db.transaction(["lists"], "readonly");
    var store = transaction.objectStore("lists");
    store.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
            var list = cursor.value;
            lists.push(list);
            addToListsListView(listId, cursor.value);
            cursor.continue();
        } else {
            console.log("All lists have been read from db");
            refreshListView(listId);
        }

    }
}

function addSourceToList(element, listId) {
    var transaction = db.transaction(["lists"], "readwrite");
    var store = transaction.objectStore("lists");
    var result = store.get(parseInt(listId));
    result.onsuccess = function (e) {
        var list = e.target.result;
        list.sources.push(JSON.stringify(element));
        store.put(list);
    }

}

function loadSourcesFromList(listId) {
    var lists = [];
    var transaction = db.transaction(["lists"], "readonly");
    var store = transaction.objectStore("lists");
    var result = store.get(parseInt(listId));
    result.onsuccess = function (e) {
        var list = e.target.result;
        sources = list.sources;
        sourcesHtml = "";
        sources.forEach(function (source) {
            var ssource = JSON.parse(source);
            sourcesHtml += buildSourceHtml(ssource[0], listId);
        });
        $("#sources_listview").append(sourcesHtml);
        $("#sources_listview").attr('data-sources', JSON.stringify(sources));
        $("#sources_listview").listview("refresh");
    }
}

function deleteSourceFromList(listId, sourceId) {
    var transaction = db.transaction(["lists"], "readwrite");
    var store = transaction.objectStore("lists");
    var result = store.get(parseInt(listId));
    result.onsuccess = function (e) {
        var list = e.target.result;
        var sources = list.sources;
        for (var i = 0; i < sources.length; i++) {
            var ssource = JSON.parse(sources[i]);
            if (ssource[0].id == sourceId) {
                sources.splice(i, 1);
                removeFromListView(sourceId, 'sources_listview');
            }
        }
        store.put(list);
    }
}

function saveArticle(article) {
    var transaction = db.transaction(["saved_articles"], "readwrite");
    var store = transaction.objectStore("saved_articles");
    var request = store.add(article);
    request.onerror = function (e) {
        console.log("Error saving article " + article.title, e.target.error.name);
    }
    request.onsuccess = function (e) {
        console.log("Article " + article.title + " successfully saved");
    }
}

function loadSavedArticles() {
    var lists = [];
    var transaction = db.transaction(["saved_articles"], "readonly");
    var store = transaction.objectStore("saved_articles");
    store.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        var articlesHtml = "";
        if (cursor) {
            var article = cursor.value;
            articlesHtml += buildArticleHtml(article, 'saved');
            $("#articles_listview").append(articlesHtml);
            cursor.continue();
        } else {
            console.log("All saved articles have been read from db");
            refreshListView('articles_listview');
        }

    }
}

function deleteSavedArticle(articleId) {
    var transaction = db.transaction(["saved_articles"], "readwrite");
    var store = transaction.objectStore("saved_articles");
    var result = store.delete(parseInt(articleId));
    result.onsuccess = function (e) {
        removeFromListView(articleId, 'articles_listview')
        console.log("Article with id " + articleId + " was deleted");
    }
}

function openDB() {
    var openRequest = window.indexedDB.open("TheNewsDB", 1);

    openRequest.onupgradeneeded = function (e) {
        console.log("db object was updated");
        var thisDb = e.target.result;
        if (!thisDb.objectStoreNames.contains("lists")) {
            thisDb.createObjectStore("lists", {
                keyPath: "id",
                autoIncrement: true
            });
            thisDb.createObjectStore("saved_articles", {
                keyPath: "id",
                autoIncrement: true
            });
        }
    }
    openRequest.onsuccess = function (e) {
        console.log("TheNewsDB has been opened");
        db = e.target.result;
    }
    openRequest.onerror = function (e) {
        console.log("TheNewsDB can't be opened");
    }
}
