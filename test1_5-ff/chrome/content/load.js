// ������� ��� �������.
// ��� ������� ���������� ��������� �������.
var con = {
  // ������������� ����������.
  init: function(doc)
  {
    con.doc = doc;
    con.el = doc.createElement("div");
    con.el.style.cssText = "position:fixed;top:100px;width:500px;height:150px;background:yellow;opacity:0.85;overflow:auto;z-index:10000";
    doc.body.insertBefore(con.el, doc.body.firstChild);
    return con;
  },
  // �������� �������.
  add: function(el)
  {
    if (con.el && el)
    {
      con.el.insertBefore(el, null);
      el.scrollIntoView();
    }
    return con;
  },
  // �������� �����, ����� �������� html-��������.
  write: function(text)
  {
    var el;
    if (con.doc && text)
    {
      el = con.doc.createElement("text");
      el.innerHTML += text;
    }
    return con.add(el);
  },
  // �������� ������� ������.
  ln: function()
  {
    if (con.doc)
      con.add(con.doc.createElement("br"));
    return con;
  }
};

var googleExtension = {

  // ��������� ����� Like
  onLike: function(aEvent) {
    // ������
    var button_el = aEvent.originalTarget;
    // �������, ��� �����, � ������ ����� ��������� ������.
    // ���� - � � �������� google_search_href.
    // ����� ���� ������� ����� ������������� <li> � �� ���� <a>.
    alert("Like: " + button_el.google_search_href);
  },

  // �������� "�����" (������ � ������� � �������) � ����������� ������.
  // doc - ��������, search_el - div.search, ������ �������� ��������� ������.
  addLikes: function(doc, search_el) {
    // �������� ������ - ���������� ������.
    var li_els = search_el.querySelectorAll("ol li");
    for (var i = 0; i < li_els.length; i++)
    {
      // ��������� �������.
      var li_el = li_els[i];
      // � "����������" ��������� ����������� ������� like_added.
      // ����� ������ ��������� ������� ���� "�����",
      // ��������� ��� �����-������ �������.
      if (li_el.like_added)
        continue;
      li_el.like_added = true;
      // �������� <a> � <div> � ����������� ������, �� ��������
      // ����� �������� "����".
      var a_el = li_el.querySelector("a");
      if (!a_el)
        continue;
      var verbal_el = li_el.querySelector("div[class=\"s\"]");
      if (!verbal_el)
        continue;
      // "�����" ������ ������ �� ����, �����������. ��� iframe-�:
      var iframe_el = doc.createElement("iframe");
      iframe_el.setAttribute("src", "http://www.facebook.com/plugins/like.php?href=" + a_el.href + "&amp;layout=standard&amp;show_faces=true&amp;&amp;action=like&amp;font&amp;colorscheme=light&amp;");
      iframe_el.setAttribute("scrolling", "no");
      iframe_el.setAttribute("frameborder", "0");
      iframe_el.style.cssText = "border:none;overflow:hidden;display:block;width:100%";
      iframe_el.setAttribute("allowTransparency", "true");
/*
�������� �� ������ ������� ������ �����������.
��� ��������. ��� ������� � ���������� - ������, ��... �� ������.
������ � ����� �������� ����� - 2em. ������ �������, ����� � ��� ������ - �����.
���� ��� - � css ����� ����������� ��� #search ol li iframe.
      iframe_el.setAttribute("onload", "o1=this.contentDocument;alert('o1:' + o1);alert('o2:' + o1.firstChild);this.style.height=o.scrollHeight;this.style.height=o.scrollHeight-o.clientHeight+o.offsetHeight;");
*/
      // �������� "����".
      verbal_el.parentNode.insertBefore(iframe_el, verbal_el);
    }
  },

  // �������� �������-��������� ������ �������.
  // ��� ���� ��������� �������, ���� ����������� ��������, ���� ��� ���.
  getRHSContainer: function(doc) {
    // ������ �������, ����������� ��� ������ ��������,
    // �� ����� ��� ������ ���� ����������.
    var rhs_col_el = doc.getElementById("rhscol");
    if (!rhs_col_el)
      return;
    // ������� ������ �������. ���� �� ��� �������� ��� ������� - �����,
    // ����� - ����������� ������� ��� ������� � ���� �����������.
    return rhs_col_el.firstChild;
  },

  // ������� ��������� ������ ��� ������ ������, ���� �� ������.
  getQuery: function(doc) {
    // ������� � ����������, ������������ ����� ������.
    var grey_el = doc.getElementById("grey");
    if (grey_el)
    {
      var grey = grey_el.value;
      if (grey)
        return grey;
    }
    // ���� ����� - �������� �������
    var input_el = doc.body.querySelector("input[name='q']");
    if (input_el)
    {
      var input = input_el.value;
      if (input)
        return input;
    }
    // ������ �� ������.
    var pair = doc.location.href.match(/[?&]q=([^&]*)/);
    if (pair && pair.length > 1 && pair[1])
      return pair[1];
    else
      return "";
  },

  // ������� ��������� ��� ������� � ����������� �������� ��� ������.
  getAdTwitterResultContainer: function(doc)
  {
    // ������ �������.
    var rhs_col_el = doc.getElementById("rhscol");
    if (!rhs_col_el)
      return;
    // ������� ������ �������.
    var container_el = rhs_col_el.firstChild;
    return container_el;
  },

  // �������� ���������� ������ ��������, �������� � �������������� ����� ��������� ������� el,
  // �������, ��� ��� ��������� ��� ������� for_search, ����� �� ����������� �����.
  showTwitterResultElement: function(doc, el, for_search, loading) {
    // ��������� ������� � �����������, ����������� ��� ������ ��������,
    // �� ����� ��� ������ ���� ����������.
    var container_el = googleExtension.getAdTwitterResultContainer(doc);
    // ���� ���������� ��, ��� ����� ���������� - �����.
    if (container_el && container_el.twitter_loading == loading && container_el.for_search == for_search)
      return;
    // ����� ������ �������� ��� - ��� ������ �������� ���, ��� ���� ���������,
    // ��� ��� �� ������� ������������..
    // � ����� ������ ���� ��������� ����� �������, �� ������ ����������.
    var my_container_el = doc.createElement("div");
    my_container_el.classList.add("twitter_results");
    my_container_el.twitter_loading = loading;
    my_container_el.for_search = for_search;
    // ������� � ���� �� ��� ����� � ������� ��� � �������.
    my_container_el.insertBefore(el, null);
    var rhs_col_el = doc.getElementById("rhscol");
    if (container_el)
      rhs_col_el.replaceChild(my_container_el, container_el);
    else
      rhs_col_el.insertBefore(my_container_el, null);
  },

  // ������� �������, ��� �������� ������� ��������� ������ � �������� ��� ������.
  getCurrentTwitterResult: function(doc)
  {
    var container_el = googleExtension.getAdTwitterResultContainer(doc);
    if (!container_el)
      return;
    return container_el.for_search;
  },

  // ���������� ���������� ������ � �������� ��� ���� ��, ��� � �� ��������.
  showTwitterResults: function(doc) {
    // ���� ��� ������� ��� �� ��� ������� - �����.
    var query = googleExtension.getQuery(doc);
    if (!query)
      return;
    var has_result_for = googleExtension.getCurrentTwitterResult(doc);
    if (has_result_for == query)
      return;

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (this.readyState != 4)
        return;
      if (this.status == 200)
      {
        var results_obj = eval("(" + ajax.responseText + ")").results;
        var ol_el = doc.createElement("ol");
/*
        var el = doc.createElement("div");
        el.innerHTML = query;
        ol_el.insertBefore(el, null);
*/
        for (var i = 0; i < results_obj.length; i++)
        {
          var res_obj = results_obj[i];
con.write(i + ": ");
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
/*
          li_el.innerHTML =
            "<div>" +
              "<span class='user'>" +
                "<img src='" + res_obj.profile_image_url + "'>" +
                "<span class='name'>" + res_obj.from_user + "</span>" +
              "</span>" +
              "<span class='content'>" +
                "<a href='" + href + "'>" + bold_text + "</a>" +
              "</span>" +
            "</div>";
*/
          ol_el.insertBefore(li_el, null);
        }

/*
        var el = doc.createElement("div");
        el.innerHTML = ajax.responseText;
//        var ol_el = el.querySelector("ol[id='rso']");
        var ol_el = el.querySelector("div[id='results']");
con.ln().write("received '" + query + "'");
*/
        googleExtension.showTwitterResultElement(doc, ol_el, query, false);
      }
    };
con.ln().write("get '" + query + "'... has '" + has_result_for + "'");
    ajax.open("get", "http://search.twitter.com/search.json?q=" + query);
//    ajax.open("get", "http://search.twitter.com/search?q=" + query);
//    ajax.open("get", "http://www.google.ru/search?q=site%3Atwitter.com+" + query);
    ajax.send(null);

    // ���� ����� �� ��� �������, ��� ������� �� ��� ��������� ��� �� ��������� ������.
    var el = doc.createElement("div");
    el.innerHTML = "<b>Search for '" + query + "'...</b>";
    googleExtension.showTwitterResultElement(doc, el, query, true);
  },

  // ���������� ���������� ����������� ������.
  // ������ ����� ���� ������ � ��� �������� ����������,
  // � ��� ��������� ����������� ������,
  // �-����� �� ��������� �������.
  // ���������� � ��� �������� ��������, ���� ���������� ��� ����.
  onSearchUpdate: function(doc, search_el) {
    // �������� "�����".
    googleExtension.addLikes(doc, search_el);
    googleExtension.showTwitterResults(doc);
  },

  // ���������� ��������� <div.main>.
  // ������������� ��� ��������� ����������� ������ ��� �� ���������.
  onMainChanged: function(aEvent) {
    // �������� �������� � ������� � ������������ ������,
    // ���� ���� ���������� - ���������� ���������.
    if (!aEvent.target)
      return;
    var id = aEvent.target.id;
    if (!id)
      return;
    var doc = aEvent.originalTarget.ownerDocument;
    if (id == "rhs" || id == "rhscol")
    {
      // ���������� ������ �������. �������� ��������� ������� - ����������� ���������� ������.
con.ln().write(id);
      googleExtension.showTwitterResults(doc);
      return;
    }
    if (id == "rso")
    {
      // ���������� ���������� ������ - ������� ����� � ����� �� �� � ��������.
      con.ln().write(id);
      var search_el = doc.getElementById("search");
      if (search_el)
        googleExtension.onSearchUpdate(doc, search_el);
      return;
    }
  },

  // ������� �������������� ������.
  // �������� �������, ����������� ������ /url � ������ ���� -
  // �� ���� ��� �������� �� �������� � ��������� ����������� ������.
  google_href_regexp: /^http:\/\/(?:www.)*google.(?:com|ru)(?!\/url\?)/,

  // ���������� �������� ��������.
  onPageLoad: function(aEvent) {
    // �������� � ��� �����.
    var doc = aEvent.originalTarget;
    var href = doc.location.href;

    var head_els = doc.getElementsByTagName("head");
    if(head_els && head_els[0])
    {
      var style = doc.createElement("link");
      style.setAttribute("rel", "stylesheet");
      style.setAttribute("href", "chrome://test1shared/content/shared.css");
      head_els[0].appendChild(style);
    }

    // ����������� ����� ����� � �������� ������ �� ������ ������ �� ������������� ����������.
//    var google = !(/\.(js|css|xml|rss|pdf)$/.test(href)) && !(/complete\/search/.test(href)) && ( /^http[s]?:\/\/.*?\.(google|googleproxy)\.[a-z\.]+\//.test(href) || /^http:\/\/(64\.233\.161\.99|64\.233\.161\.104|64\.233\.161\.105|64\.233\.161\.147|64\.233\.167\.99|64\.233\.167\.104|64\.233\.167\.147|64\.233\.171\.99|64\.233\.171\.104|64\.233\.171\.105|64\.233\.171\.147|64\.233\.179\.99|64\.233\.179\.99|64\.233\.183\.99|64\.233\.183\.104|64\.233\.185\.99|64\.233\.185\.104|64\.233\.187\.99|64\.233\.187\.104|64\.233\.189\.104|66\.102\.7\.104|66\.102\.7\.105|66\.102\.7\.147|66\.102\.9\.104|66\.102\.11\.104|216\.239\.37\.104|216\.239\.37\.105|216\.239\.37\.147|216\.239\.39\.104|216\.239\.53\.104|216\.239\.57\.98|216\.239\.57\.104|216\.239\.57\.105|216\.239\.57\.147|216\.239\.59\.104|216\.239\.59\.105|216\.239\.63\.104|66\.249\.81\.99)\//.test(href) );
//    var search = href.match(/^http:\/\/[^\/]+\/(search|cse|custom|unclesam|linux|bsd|mac|microsoft|intl)/);

    // ���� �� ���� - ������.
    var isgoogle = href.match(googleExtension.google_href_regexp);
    if (!isgoogle)
      return;

    // ���� ��� �������� #main - ������.
    var main_el = doc.getElementById("main")
    if (!main_el)
      return;

//con.init(doc);

    // ������� � ������������ ������, ����� ���������� ��������������.
    // �� ���� ���� - ���������� ��� ���������.
    var search_el = doc.getElementById("search");
    if (search_el)
      googleExtension.onSearchUpdate(doc, search_el);

    // ����������� ��� ���������.
    main_el.addEventListener("DOMSubtreeModified", googleExtension.onMainChanged, false);
  },

  // ��������� �������� ����.
  init: function() {
    var appcontent = document.getElementById("appcontent");
    if(appcontent)
      appcontent.addEventListener("DOMContentLoaded", googleExtension.onPageLoad, false);
  }
};

window.addEventListener("load", googleExtension.init, false);
