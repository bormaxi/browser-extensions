/*
    function getXmlHttp() {
alert(10);
      var xmlhttp;
alert(11);
      try {
alert(12);
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
alert(13);
      } catch (e) {
alert(14);
        try {
alert(15);
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
alert(16);
        } catch (E) {
alert(17);
          xmlhttp = false;
alert(18);
        }
alert(19);
      }
alert(20);
      if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
alert(21);
        xmlhttp = new XMLHttpRequest();
alert(22);
      }
alert(23);
      return xmlhttp;
    }

    alert(1);
    var xmlhttp = getXmlHttp();
    alert(2);
    xmlhttp.open('GET', '/xhr/test.html', false);
    alert(3);
    xmlhttp.send(null);
    alert("status=" + xmlhttp.status);
    if(xmlhttp.status == 200) {
      alert(xmlhttp.responseText);
    }
*/
    var doc = button_el.ownerDocument;
/*
    alert(1);
    var iframe = doc.createElement("iframe");
    alert(2);
    iframe.width = document.width;
    alert(3);
    iframe.height = 200;
    alert(4);
    doc.body.insertBefore(iframe, doc.body.firstChild);
    alert(5);
    iframe.src = "http://www.ru";
    alert(iframe);
*/
//var ajax = new XMLHttpRequest();
//alert(ajax);
/*
ajax.onreadystatechange = function() {
  alert("s" + this.readyState);
  if (this.readyState == 4)
    alert("S" + this.status);
};
alert("<br>", ajax);
ajax.open("get", "http://yandex.ru/yandsearch?text=qwesta.ru&from=fx3&clid=46510&lr=65", true);
alert("<br2>", ajax);
ajax.send(null);
alert("<br3>", ajax);
alert("wait");
*/
