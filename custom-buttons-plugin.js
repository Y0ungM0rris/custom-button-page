(function() {
    function removeParams(params, link) {
        var url = new URL(link.getAttribute('href'), window.location.origin);
        var path = url.pathname; 
        var searchParams = new URLSearchParams(url.search);
        params.forEach(param => searchParams.delete(param));
        var newSearch = searchParams.toString();
        return `#${path}${newSearch ? '?' + newSearch : ''}`;
    }
    function removeParam(key, sourceURL) {
        var splitUrl = sourceURL.split('?');
        var baseUrl = splitUrl[0];
        var queryString = (splitUrl[1] || '');
        var params = queryString.split('&');
        var updatedParams = params.filter(param => {
            return param.split('=')[0] !== key;
        });
        var newQueryString = updatedParams.join('&');
        return baseUrl + (newQueryString ? '?' + newQueryString : '');
    }

    var customLinksPlugin = function(hook, vm) {
        hook.afterEach(function(html, next) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            var links = tempDiv.querySelectorAll('a');

            links.forEach(function(link) {
                function addStyles() {
                    const css = `
                    th{
                        border: none !important;
                    }
                    tr{
                        border: none !important;
                    }
                    td{
                        border: none !important;
                    }
                        body{
                        overflow: scroll;
                        /* scrollbar-color: #1E6FFE rgba(240, 240, 240, 0.781); */
                        scrollbar-color: #1e70fe00 #1e70fe00;
                        scrollbar-width: thin;
                    }
                    `;
                    const style = document.createElement('style');
                    style.textContent = css;
                    document.head.appendChild(style);
                }
                addStyles();

                var url = new URL(link.getAttribute('href'), window.location.origin);
                var searchParams = url.searchParams;

                var href = link.getAttribute('href');
                let linkArrow = searchParams.has('arrow');

                if (href && href.includes('image') && href.includes('button')) {
                    var imageUrl = searchParams.get('image');
                    var linkText = link.textContent;
                    var customLink = document.createElement('a');
                    var descriptionDiv = document.createElement('div');
                    var customDiv = document.createElement('div');
                    var imgDiv = document.createElement('div');
                    var altText = document.createElement('div');
                    var paramsToRemove = ['button', 'image', 'image-size', 'arrow'];
                    var newHref = removeParams(paramsToRemove, link);
                    customLink.href = newHref;

                    imgDiv.className = 'img-div';
                    imgDiv.style.backgroundImage = `url('${imageUrl}')`;
                    customDiv.className = 'image-link';
                    descriptionDiv.className = 'image-container';
                    altText.textContent = linkText;
                    customLink.style.textDecoration = 'none';

                    descriptionDiv.appendChild(imgDiv);
                    descriptionDiv.appendChild(altText);
                    customDiv.appendChild(descriptionDiv);
                    if (!linkArrow) {
                        var imgArrow = document.createElement('img');
                        imgArrow.src = './custom-buttons-arrow.svg';
                        imgArrow.style.width = '8px';
                        imgArrow.alt = 'Arrow';
                        customDiv.appendChild(imgArrow);
                    }
                    customLink.appendChild(customDiv);
                    link.parentNode.insertBefore(customLink, link.nextSibling);
                    link.remove();
                } else if (href && href.includes('image') && href.includes('card')) {
                    var imageUrl = searchParams.get('image');
                    var linkText = link.textContent;
                    var customLink = document.createElement('a');
                    var customDiv = document.createElement('div');
                    var backgroundDiv = document.createElement('div');
                    var img = document.createElement('img');
                    var paramsToRemove = ['button', 'image', 'image-size', 'card', 'outlined', 'arrow'];
                    var newHref = removeParams(paramsToRemove, link);
                    var altText = document.createElement('div');

                    customDiv.style.backgroundImage = `url('${imageUrl}')`;
                    customDiv.className = 'card-link';
                    backgroundDiv.className = 'card-background';
                    customLink.style.textDecoration = 'none';
                    customLink.style.color = 'white';
                    customLink.href = newHref;
                    img.alt = linkText;
                    altText.className = 'card-title';
                    altText.textContent = linkText;
                    altText.style.zIndex = 1;

                    customDiv.appendChild(backgroundDiv);
                    customDiv.appendChild(altText);
                    customLink.appendChild(customDiv);
                    link.parentNode.insertBefore(customLink, link.nextSibling);
                    link.remove();
                } else if (href && href.includes('outlined')) {
                    var linkText = link.textContent;
                    var customLink = document.createElement('a');
                    var newHref = removeParam('outlined', href); 
                    var imgArrow = document.createElement('img');
                
                    imgArrow.src = './custom-buttons-arrow.svg';
                    imgArrow.className = 'image-arrow';
                    imgArrow.style.marginLeft= '15px';
                    customLink.className = 'outlined-link';
                    customLink.style.textDecoration = 'none';
                    customLink.href = newHref;
                    customLink.textContent = linkText;
                    customLink.appendChild(imgArrow);

                    if (href && href.includes('arrow')) {
                        customLink.removeChild(imgArrow)
                        var newHref = removeParam('arrow', newHref);
                    }

                    customLink.href = newHref;
                    link.parentNode.insertBefore(customLink, link.nextSibling);
                    link.remove();
                } else if (href && href.includes('button')) {
                    var linkText = link.textContent;
                    var customLink = document.createElement('a');
                    var newHref = removeParam('button', href);
                    var imgArrow = document.createElement('img');
                    
                    imgArrow.src = './custom-buttons-arrow.svg';
                    imgArrow.className = 'image-arrow';
                    customLink.className = 'button-link';
                    customLink.style.textDecoration = 'none';
                    customLink.textContent = linkText;
                    customLink.appendChild(imgArrow);

                    if (href && href.includes('arrow')) {
                        customLink.removeChild(imgArrow)
                        var newHref = removeParam('arrow', newHref);
                    }

                    customLink.href = newHref;
                    link.parentNode.insertBefore(customLink, link.nextSibling);
                    link.remove();
                }
            });
            next(tempDiv.innerHTML);
        });
    };

    $docsify = $docsify || {};
    $docsify.plugins = [].concat(customLinksPlugin, $docsify.plugins || []);
})();