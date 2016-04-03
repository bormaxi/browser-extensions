googleExtension.searchTwitter = function(query, callback)
{
  function objCallback(obj)
  {
    callback(obj.query, obj.result);
  }
  chrome.extension.sendRequest({ action: "searchTwitter", query: query }, objCallback );
}

googleExtension.onDocLoad(document, false);
