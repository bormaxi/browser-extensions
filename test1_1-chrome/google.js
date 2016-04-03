var googleExtension = {

  // Добавить "лайки" (строки с кнопкой и текстом) к результатам поиска.
  // doc - документ, search_el - div.search, внутри которого находится список.
  addLikes: function(doc, search_el) {
    // Элементы списка - результаты поиска.
    var li_els = search_el.querySelectorAll("ol li");
    for (var i = 0; i < li_els.length; i++)
    {
      // Очередной элемент.
      var li_el = li_els[i];
      // К "олайкленым" элементам добавляется атрибут like_added.
      // Можно просто проверять наличие дива "лайка",
      // обозначив его каким-нибудь классом.
      if (li_el.like_added)
        continue;
      li_el.like_added = true;
      // Элементы <a> и <div> с результатом поиска, до которого
      // нужно вставить "лайк".
      var a_el = li_el.querySelector("a");
      if (!a_el)
        continue;
      var verbal_el = li_el.querySelector("div[class=\"s\"]");
      if (!verbal_el)
        continue;
      // "Лайки" руками делать не надо, оказывается. Это iframe-ы:
      var iframe_el = doc.createElement("iframe");
      iframe_el.setAttribute("src", "http://www.facebook.com/plugins/like.php?href=" + a_el.href + "&amp;layout=standard&amp;show_faces=true&amp;&amp;action=like&amp;font&amp;colorscheme=light&amp;");
      iframe_el.setAttribute("scrolling", "no");
      iframe_el.setAttribute("frameborder", "0");
      iframe_el.style.cssText = "border:none;overflow:hidden;display:block;width:100%";
      iframe_el.setAttribute("allowTransparency", "true");
/*
Хотелось бы высоту сделать равной содержимому.
Так работает. Как говорят в интернетах - должно, но... не должно.
Потому в стиле написано жёстко - 2em. Кнопка влезает, текст в две строки - войдёт.
Если что - в css можно достучаться как #search ol li iframe.
      iframe_el.setAttribute("onload", "o1=this.contentDocument;alert('o1:' + o1);alert('o2:' + o1.firstChild);this.style.height=o.scrollHeight;this.style.height=o.scrollHeight-o.clientHeight+o.offsetHeight;");
*/
      // Вставить "лайк".
      verbal_el.parentNode.insertBefore(iframe_el, verbal_el);
    }
  },


  // Вернуть поисковый запрос или пустую строку, если не найден.
  getQuery: function(doc) {
    // Элемент с подсказкой, отображаемой серым цветом.
    var grey_el = doc.getElementById("grey");
    if (grey_el)
    {
      var grey = grey_el.value;
      if (grey)
        return grey;
    }
    // Поле ввода - введённые символы
    var input_el = doc.body.querySelector("input[name='q']");
    if (input_el)
    {
      var input = input_el.value;
      if (input)
        return input;
    }
    // Достаём из адреса.
    var pair = doc.location.href.match(/[?&]q=([^&]*)/);
    if (pair && pair.length > 1 && pair[1])
      return pair[1];
    else
      return "";
  },


  // Вернуть объект, содержащий правую колонку (col)
  // и контейнер в ней для рекламы и результатов Твиттера (container).
  // Элементов может не быть.
  getAdTwitterResultColContainer: function(doc)
  {
    var res = {};
    // Правая колонка.
    res.col = doc.getElementById("rhscol");
    res.container = res.col ? res.col.firstChild : null;
    return res;
  },

  
  // Показать результаты поиска Твиттера, поместив в соотетствующее место документа элемент el,
  // пометив, что это результат для запроса for_search, чтобы не дублировать вывод.
  showTwitterResultElement: function(doc, el, for_search, loading) {
    // Колонка и контейнер рекламы и результатов, отсутствует при пустой странице,
    // но тогда нам нечего туда отображать.
    var col_container_obj = googleExtension.getAdTwitterResultColContainer(doc);
    var col_el = col_container_obj.col;
    // Если нет колонки - ничего не делаем. Она должна быть.
    if (!col_el)
      return;
    // Контейнера может не быть.
    var container_el = col_container_obj.container;
con.ln().write(container_el + (container_el ? "|" + container_el.twitter_loading + "|" + container_el.for_search : "---"));
    // Если отображено то, что нужно отобразить - выйти.
    if (container_el && container_el.twitter_loading == loading && container_el.for_search == for_search)
      return;
    // Иначе нашего элемента нет - или вообще никакого нет, или есть рекламный,
    // или наш со старыми результатами..
    // В любом случае свой контейнер нужно создать, со стилем рекламного.
    var my_container_el = doc.createElement("div");
    my_container_el.classList.add("twitter_results");
    my_container_el.twitter_loading = loading;
    my_container_el.for_search = for_search;
    // Вставим в него то что нужно и вставим его в колонку
    // вместо имеющегося там контейнера, если он есть,
    // или добавим, если нет.
    my_container_el.insertBefore(el, null);
    while (col_el.hasChildNodes())
      col_el.removeChild(col_el.firstChild);
    col_el.insertBefore(my_container_el, null);
  },

  
  // Вернуть запорос, для которого выведен результат поиска в Твиттере или ничего.
  getCurrentTwitterResult: function(doc)
  {
    var col_container_obj = googleExtension.getAdTwitterResultColContainer(doc);
    if (!col_container_obj.container)
      return;
    return col_container_obj.container.for_search;
  },

  
  // Отобразить результаты поиска в Твиттере для того же, что и на странице.
  showTwitterResults: function(doc) {
    // Если нет запроса или он уже выведен - выйти.
    var query = googleExtension.getQuery(doc);
    if (!query)
      return;
    // Найденный или ускомый запрос.
    var has_result_for = googleExtension.getCurrentTwitterResult(doc);
con.ln().write("search for '" + query + "', has for '" + has_result_for + "', searchig...");
    if (has_result_for == query)
      return;

    // Этот текст не для красоты, его наличие не даёт запустить тот же поисковый запрос.
    var el = doc.createElement("div");
    el.innerHTML = "<b>Search for '" + query + "'...</b>";
    googleExtension.showTwitterResultElement(doc, el, query, true);

    function onResults(query, result)
    {
con.ln().write("found for '" + query + "': " + result);
con.ln().write("searched for '" + googleExtension.getCurrentTwitterResult(doc) + "'");
      // Сравним с тем, что искали, если искали.
      var searched_for = googleExtension.getCurrentTwitterResult(doc);
      if (searched_for && searched_for != query)
        return;
      var results_obj = result ? result.results : {};
      var ol_el = doc.createElement("ol");
      for (var i = 0; i < results_obj.length; i++)
      {
        var res_obj = results_obj[i];
        var li_el = doc.createElement("li");
        var href = "http://twitter.com/" + res_obj.from_user + "/statuses/" + res_obj.id_str;
/*
        var bold_re = new RegExp(query, "gi");
        var bold_text = res_obj.text.replace(bold_re, "<b>" + bold_re.$1 + "</b>")
con.ln().write(bold_text);
*/
        li_el.innerHTML =
          "<div class='avatar'>" +
            "<img src='" + res_obj.profile_image_url + "'>" +
          "</div>" +
          "<div class='message'>" +
            "<text class='username'>" + res_obj.from_user + ":&nbsp;</text>" +
            "<a href='" + href + "'>" + res_obj.text + "</a>" +
          "</div>";
        ol_el.insertBefore(li_el, null);
      }

/*
      var el = doc.createElement("div");
      el.innerHTML = ajax.responseText;
//      var ol_el = el.querySelector("ol[id='rso']");
      var ol_el = el.querySelector("div[id='results']");
*/
      googleExtension.showTwitterResultElement(doc, ol_el, query, false);
    }
    googleExtension.searchTwitter(query, onResults);
//    chrome.extension.sendRequest({ action: "searchTwitter", query: query }, onResults );
  },

  
  // Обработать обновления результатов поиска.
  // Сейчас может быть вызван и при неполном обновлении,
  // и при изменении результатов поиска,
  // в-общем во множестве случаев.
  // Вызывается и при загрузке страницы, если результаты уже есть.
  onSearchUpdate: function(doc, search_el) {
    // Добавить "лайки".
    googleExtension.addLikes(doc, search_el);
    googleExtension.showTwitterResults(doc);
  },

  
  onMainInsert: function(aEvent) {
con.ln().write("+");
  },

  // Обработать изменение <div.main>.
  // Рассматриваем как изменение результатов поиска или их появление.
  onMainChanged: function(aEvent) {
con.ln().write("~" + aEvent.target);
    // Получить документ и элемент с результатами поиска,
    // если есть результаты - обработать изменение.
    if (!aEvent.target)
      return;
    var doc = aEvent.target.ownerDocument;
/*
DOMNodeInserted
    if (aEvent.relatedNode && aEvent.relatedNode.id && aEvent.relatedNode.id == "rso")
    {
      // Изменились результаты поиска - добавим лайки и найдём то же в Твиттере.
      var search_el = doc.getElementById("search");
con.ln().write("S" + search_el);
      if (search_el)
        googleExtension.onSearchUpdate(doc, search_el);
      return;
    }
*/
    if (aEvent.target && aEvent.target.id && aEvent.target.id == "rso")
    {
      // Изменились результаты поиска - добавим лайки и найдём то же в Твиттере.
      var search_el = doc.getElementById("search");
con.ln().write("S" + search_el);
      if (search_el)
        googleExtension.onSearchUpdate(doc, search_el);
      return;
    }
    if (aEvent.target && aEvent.target.id && (id == "rhs"/* || id == "rhscol"*/))
    {
con.ln().write("R");
      // Изменилась правая колонка. Возможно появилась реклама - восстановим результаты поиска.
      googleExtension.showTwitterResults(doc);
      return;
    }
  },

  // Регексп обрабатываемых сайтов.
  // Черновой вариант, учитывается только /url в начале пути -
  // по нему идёт редирект на страницу с выбранным результатом поиска.
  google_href_regexp: /^http:\/\/(?:www.)*google.(?:com|ru)(?!\/url\?)/,


  // Обработать загрузку документа doc.
  // Если insert_firefox_css - добавить стили к документа.
  onDocLoad: function(doc, insert_firefox_css) {
    var href = doc.location.href;

/*
Определение сайта гугла и страницы поиска
по версии одного из разработчиков расширений.
    var is_google = !(/\.(js|css|xml|rss|pdf)$/.test(href)) && !(/complete\/search/.test(href)) && ( /^http[s]?:\/\/.*?\.(google|googleproxy)\.[a-z\.]+\//.test(href) || /^http:\/\/(64\.233\.161\.99|64\.233\.161\.104|64\.233\.161\.105|64\.233\.161\.147|64\.233\.167\.99|64\.233\.167\.104|64\.233\.167\.147|64\.233\.171\.99|64\.233\.171\.104|64\.233\.171\.105|64\.233\.171\.147|64\.233\.179\.99|64\.233\.179\.99|64\.233\.183\.99|64\.233\.183\.104|64\.233\.185\.99|64\.233\.185\.104|64\.233\.187\.99|64\.233\.187\.104|64\.233\.189\.104|66\.102\.7\.104|66\.102\.7\.105|66\.102\.7\.147|66\.102\.9\.104|66\.102\.11\.104|216\.239\.37\.104|216\.239\.37\.105|216\.239\.37\.147|216\.239\.39\.104|216\.239\.53\.104|216\.239\.57\.98|216\.239\.57\.104|216\.239\.57\.105|216\.239\.57\.147|216\.239\.59\.104|216\.239\.59\.105|216\.239\.63\.104|66\.249\.81\.99)\//.test(href) );
    var is_search = href.match(/^http:\/\/[^\/]+\/(search|cse|custom|unclesam|linux|bsd|mac|microsoft|intl)/);
*/

    // Если не гугл - уходим.
    var is_google = href.match(googleExtension.google_href_regexp);
    if (!is_google)
      return;

    // Если нет елемента #main - уходим.
    var main_el = doc.getElementById("main")
    if (!main_el)
      return;

    if (insert_firefox_css)
    {
      // Добавляем свои стили.
      var head_els = doc.getElementsByTagName("head");
      if(head_els && head_els[0])
      {
        var style = doc.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", "chrome://test1shared/content/google.css");
        head_els[0].appendChild(style);
      }
    }

//con.init(doc);

    // Элемент с результатами поиска, может изначально отсутствовоать.
    // Но если есть - обработать его изменение.
    var search_el = doc.getElementById("search");
con.write(search_el);
    if (search_el)
      googleExtension.onSearchUpdate(doc, search_el);
con.write(1);

    // Отслеживаем его изменения.
    main_el.addEventListener(/*"DOMNodeInserted"*/"DOMSubtreeModified", googleExtension.onMainChanged, false);
    main_el.addEventListener("DOMNodeInserted"/*"DOMSubtreeModified"*/, googleExtension.onMainInsert, false);
con.write(2);
  }

};
