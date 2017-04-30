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

    addToListsListView(name, list, 'list_item')
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
            addToListsListView(cursor.value.name, cursor.value, 'list_item');
            cursor.continue();
        } else {
            console.log("All lists has been read from db");
            refreshListView(listId);
        }

    }
}

function addSourceToList(element, listName) {
    var transaction = db.transaction(["lists"], "readwrite");
    var store = transaction.objectStore("lists");
    var result = store.get(listName);
    result.onsuccess = function (e) {
        var list = e.target.result;
        list.sources.push(JSON.stringify(element));
        store.put(list);
    }

}

function loadSourcesFromList(listName) {
    var lists = [];
    var transaction = db.transaction(["lists"], "readonly");
    var store = transaction.objectStore("lists");
    var result = store.get(listName);
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

function openDB() {
    var openRequest = window.indexedDB.open("TheNewsDB", 1);

    openRequest.onupgradeneeded = function (e) {
        console.log("db object was updated");
        var thisDb = e.target.result;
        if (!thisDb.objectStoreNames.contains("lists")) {
            thisDb.createObjectStore("lists", {
                keyPath: "name"
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
