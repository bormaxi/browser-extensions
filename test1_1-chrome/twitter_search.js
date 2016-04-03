// Послать поисковый запрос query в Твиттер,
// ответ предполагается получить в формате format.
// Вызвать callback с двумя параметрами -
// посланным запросом и полученым текстом,
// который может быть null, если код ответа сервера не 200.
function twitterSearch(query, callback, format)
{    
  var ajax = new XMLHttpRequest();
  ajax.onreadystatechange =
    function()
    {
      if (this.readyState != 4)
        return;
      callback(
        query,
        this.status == 200
        ? ajax.responseText : null);
    };
  ajax.open(
    "get",
    "http://search.twitter.com/search"
    + (format ? "." + format : "")
    + "?q=" + encodeURIComponent(query));
  ajax.send(null);
}

// Послать поисковый запрос query в Твиттер,
// ответ получается в json.
// Вызвать callback с двумя параметрами -
// посланным запросом и полученым объектом,
// который может быть null, если код ответа сервера не 200
// или ответ не является валидным.
function twitterSearchJSON(query, callback)
{
  function recvCallback(query, text)
  {
    var o = null;
    if (text)
    {
      try
      {
        o = JSON.parse(text);
      }
      catch(e) {}
    }
    callback(query, o);
  }
  twitterSearch(query, recvCallback, "json");
}
