var con = {
  // Инициализация документом.
  init: function(doc)
  {
    con.doc = doc;
    con.el = doc.createElement("div");
    con.el.classList.add("console");
    con.el.style.cssText = "position:fixed;top:100px;width:500px;height:150px;background:yellow;opacity:0.85;overflow:auto;z-index:10000";
    doc.body.insertBefore(con.el, doc.body.firstChild);
    return con;
  },
  // Добавить элемент.
  add: function(el)
  {
    if (con.el && el)
    {
      con.el.insertBefore(el, null);
      el.scrollIntoView();
    }
    return con;
  },
  // Добавить текст, можно включать html-разметку.
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
  // Добавить перевод строки.
  ln: function()
  {
    if (con.doc)
      con.add(con.doc.createElement("br"));
    return con;
  }
};
