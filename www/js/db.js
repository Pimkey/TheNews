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

function getLists(listViewId) {
    var lists = [];
    var transaction = db.transaction(["lists"], "readonly");
    var store = transaction.objectStore("lists");
    store.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
            var list = cursor.value;
            lists.push(list);
            addToListsListView(listViewId, list);
            cursor.continue();
        } else {
            console.log("All lists have been read from db");
            refreshListView(listViewId);
        }
    }
}

function addSourceToList(element, listId) {
    var transaction = db.transaction(["lists"], "readwrite");
    var store = transaction.objectStore("lists");
    var result = store.get(parseInt(listId));
    result.onsuccess = function (e) {
        var list = e.target.result;
        list.sources.push(element);
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
        $("#sources").find("h1.page_title").text(list.name);
        sources = list.sources;
        sourcesHtml = "";
        sources.forEach(function (source) {
            sourcesHtml += buildSourceHtml(source, listId);
        });
        $("#sources_listview").append(sourcesHtml);
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
            var source = sources[i];
            if (source.id == sourceId) {
                sources.splice(i, 1);
                removeFromListView(sourceId, 'sources_listview');
            }
        }
        store.put(list);
    }
}

function editListName(listId, listName) {
    var transaction = db.transaction(["lists"], "readwrite");
    var store = transaction.objectStore("lists");
    var result = store.get(parseInt(listId));
    result.onsuccess = function (e) {
        var list = e.target.result;
        list.name = listName;
        store.put(list);
    }
}

function addSourceToFavourites(sourceToSave) {
    var transaction = db.transaction(["favourites"], "readwrite");
    var store = transaction.objectStore("favourites");
    var result = store.put(sourceToSave);
}

function loadFavourites() {
    var sourcesHtml = "";
    var sources = [];
    var transaction = db.transaction(["favourites"], "readonly");
    var store = transaction.objectStore("favourites");
    store.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
            var source = cursor.value;
            sources.push(source);
            sourcesHtml += buildSourceHtml(source, 'favourites');
            cursor.continue();
        } else {
            console.log("All favourites have been read from db");
            $("#sources").find("h1.page_title").text("Favourites");
            $("#sources_listview").append(sourcesHtml);
            refreshListView('sources_listview');
        }

    }
}

function deleteFromFavourites(sourceId) {
    var transaction = db.transaction(["favourites"], "readwrite");
    var store = transaction.objectStore("favourites");
    var result = store.delete(sourceId);
    result.onsuccess = function (e) {
        removeFromListView(sourceId, 'sources_listview')
        console.log("Source with id " + sourceId + " was deleted from favs");
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

function saveSettings(settings) {
    var transaction = db.transaction(["settings"], "readwrite");
    var store = transaction.objectStore("settings");
    var request = store.get(1);
    request.onsuccess = function (e) {
        var settingsFromDB = e.target.result;
        if (settingsFromDB != undefined) {
            settings.id = settingsFromDB.id;
        }
        store.put(settings);
    }
    //TODO
    //tutaj mozna popupa jakiegos wstawic, np appendem.
    console.log("saved");
}

function loadSettings() {
    var transaction = db.transaction(["settings"], "readwrite");
    var store = transaction.objectStore("settings");
    var request = store.get(1);
    request.onsuccess = function (e) {
        var settings = e.target.result;
        if (settings == undefined) {
            var settings = {};
            settings.language = "en";
            settings.theme = "blue";
        }
        $("#select_language").val(settings.language).selectmenu('refresh');
        $("#" + settings.theme + "_theme").attr("checked", true).checkboxradio("refresh");
        $("#settingnav").css("background-color",settings.theme)
    }
}

function loadAllSources(categoryId) {
    var transaction = db.transaction(["settings"], "readwrite");
    var store = transaction.objectStore("settings");
    var request = store.get(1);
    request.onsuccess = function (e) {
        var settings = e.target.result;
        var language = (settings == undefined) ? "en" : settings.language;
        loadAllSourcesAjax(language, categoryId)
    }
}
function openDB() {
    var openRequest = window.indexedDB.open("TheNewsDB", 2);

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
            thisDb.createObjectStore("favourites", {
                keyPath: "id",
            });
            thisDb.createObjectStore("settings", {
                keyPath: "id"
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
