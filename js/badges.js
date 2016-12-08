/**
 * Load all url's
 *
 * @type {HTMLCollection}
 */
var links = document.links;
var linkCount = document.links.length;
var domains = {};
var badges = [];

/**
 *
 */
for (var i = 0; i < links.length; i++) {

    // fill array with links to check
    if (links[i].hostname
        && links[i].hostname !== '') {

        domains[links[i].hostname] = -1;
    }
}

var observeDOM = (function () {

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var eventListenerSupported = window.addEventListener;

    return function (obj, callback) {

        if (MutationObserver) {

            // define a new observer
            var obs = new MutationObserver(function (mutations, observer) {

                callback();
            });

            // have the observer observe foo for changes in children
            obs.observe(obj, {childList: true, subtree: true});

        } else if (eventListenerSupported) {

            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();


// Observe the body for changes in links
observeDOM(document.body, function () {

    // link count changed
    if (linkCount !== document.links.length) {

        // get all unique domain names on the page
        var domainUpdate = {};

        for (var i = 0; i < links.length; i++) {

            // fill array with links to check
            if (links[i].hostname
                && links[i].hostname !== '') {

                domainUpdate[links[i].hostname] = -1;
            }
        }

        var arr = Object.keys(domainUpdate).map(function (key) {
            return key;
        });

        var arr2 = Object.keys(domains).map(function (key) {
            return key;
        });

        if (arr.length !== arr2.length) {

            console.warn('changed');

            domains = domainUpdate;

            var xhr = new XMLHttpRequest();

            xhr.open('PUT', 'https://filtr.news/_api/search/domain', true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xhr.onreadystatechange = function () {

                if (xhr.readyState == 4) {

                    var result = JSON.parse(xhr.responseText);

                    console.info(result);

                    // clear previously injected badges
                    for (var b = 0; b < badges.length; b++) {

                        badges[b].remove();
                        badges.splice(b, 1);

                    }

                    var links = document.links;

                    for (var i = 0; i < links.length; i++) {

                        if (result[links[i].hostname]) {

                            //console.info(links[i].hostname);
                            var span = document.createElement('span');
                            span.style.position = 'absolute';
                            span.style.backgroundColor = '#D75452';
                            span.style.borderRadius = '10px';
                            span.innerText = result[links[i].hostname].category;
                            span.style.color = '#fff';
                            span.style.display = 'inline-block';
                            span.style.float = 'right';
                            span.style.fontSize = '14px';
                            span.style.padding = '5px';
                            span.style.marginTop = '-15px';
                            span.style.marginLeft = '10px';
                            span.style.zIndex = '9999';

                            links[i].parentNode.appendChild(span);

                            //console.info(links[i]);

                            badges.push(span);

                        }
                    }
                }
            };

            console.info(JSON.stringify(domains));

            xhr.send(JSON.stringify(domains));
        }


    }
});
