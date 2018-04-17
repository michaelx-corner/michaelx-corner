var loc = GetUrlRelativePath();
if(loc == '/')
{
  var loc_en = "./en" + loc;
  var loc_cn = "./zh-CN" + loc;
}
else
{
  var loc_cur = loc.substring(loc.indexOf("/", 1));
  aler(loc_cur);
  var loc_en = "./en" + loc_cur;
  var loc_cn = "./zh-CN" + loc_cur;
}
document.write("<div style=\"text-align:right; font-size:0.75em\"><span><a href=\"");
document.write(loc_cn);
document.write("\">CN（中文）</a></span> | <span><a href=\"");
document.write(loc_en);
document.write("\">EN(English)</a></span></div>");

function GetUrlRelativePath()
{
  var url = document.location.toString();
  var arrUrl = url.split("//");

  var start = arrUrl[1].indexOf("/");
  var relUrl = arrUrl[1].substring(start);

  //if(relUrl.indexOf("?") != -1)
  //{
  //  relUrl = relUrl.split("?")[0];
  //}
  return relUrl;
}
