function DOMtoString(document_root) {

    var html = 'testing';

    var links = document_root.links;

    for (var i = 0; i < links.length; i++) {

        var d = document.createElement('div');
        d.innerText = links[i].hostname;
        d.style.color = 'red';

        links[i].appendChild(d);
    }


    return html;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});