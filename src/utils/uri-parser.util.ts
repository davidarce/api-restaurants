export function uriParser(uri: string, values: any) {
    Object.keys(values).forEach(function (key) {
        var regex = new RegExp(":" + key + "\\b", "g");
        var queryRegex = new RegExp("([a-zA-Z0-9-_\.]*)\=:" + key + "\\b");
        var match = uri.match(queryRegex);
        var queryParam;
        if (match && match.length > 1) {
            queryParam = match[1];
            regex = new RegExp(queryRegex, "g");
        }
        var replacement = "";
        var tokenValue = values[key];
        if (tokenValue !== undefined) {
            if (Array.isArray(tokenValue)) {
                for (var i in tokenValue) {
                    replacement += queryParam + '=' + tokenValue[i] + "&";
                }
                replacement = replacement.substring(0, replacement.length - 1)
            } else {
                replacement = (queryParam === undefined ? '' : queryParam + '=')
                    + tokenValue.toString();
            }
        }
        uri = uri.replace(regex, replacement);
    });


    uri = uri.replace(/(&|\?)[a-zA-Z0-9-_\.]*=:[a-zA-Z0-9-_\.]*/g, '');
    uri = (uri.indexOf('?') !== -1) ? uri : uri.replace('&', '?');

    return uri;
};