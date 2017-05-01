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
        console.log("List " + name + " successfully saved");
    }

    addToListsListView('lists_listview', list, 'list_item')
    refreshListView('lists_listview');
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
            addToListsListView(listId, cursor.value, 'list_item');
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
            sourcesHtml += buildSourceHtml(ssource[0]);
        });
        $("#sources_listview").append(sourcesHtml);
        $("#sources_listview").attr('data-sources', JSON.stringify(sources));
        $("#sources_listview").listview("refresh");
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
            articlesHtml += buildArticleHtml(article);
            $("#articles_listview").append(articlesHtml);
            cursor.continue();
        } else {
            console.log("All saved articles have been read from db");
            refreshListView('articles_listview');
        }

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
