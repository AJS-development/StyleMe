  /*
  Copyright 2016 Andrew S

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   */
module.exports = function() {
  var list = JSON.parse(require('fs').readFileSync(__dirname + '/styles.json',"utf8"))
  var colors = {};
  for (var i in list)
  {
    
    eval("colors." + i + " = \"" + list[i].replace(/\|/g,"\\") + "\"")
    
  }
  
  var special = require('./special/')
  var curr = false;
  function checkSpecial(a) {
      if (!special[a]) return false;
      curr = special[a];
      return true;
  }
function check(a) {
    if (!list[a]) return false
    
    eval("var g = \""  + list[a].replace(/\|/g,"\\") + "\"")
   
    return g;
}

for (var i in special) {
  var a = special[i].toString();
  var b = a.indexOf("(") + 1
  a = a.substring(b);
  var c = a.substring(0,a.indexOf(")")).split(",");
    c = c[2]
    
  if (c) {
  for (var i in colors) {
      if (a.indexOf(c + "." + i) == -1) continue;
a = a.replace(new RegExp(c + "\\." + i,"g"),"\"" + colors[i] + "\"");
  }
      
  }
    var g = "String.prototype." + i + " = function() {function cur(" + a +"var final = \"\";for (var i = 0; i < this.length; i ++) { final += cur(this.charAt(i),i);}return final + \"\x1b[0m\"}";
  eval(g)
}
for (var i in list) {
  var a = list[i];
    if (!a) continue;
  eval("String.prototype." + i + "=function(){return \"" + a.replace(/\|/g,"\\") +"\" + this;}");
  
}
String.prototype.end = function() {
  return this + "\x1b[0m";
}
String.prototype.styleMe = function() {
var t = 0;
    var k = []
    var o = 0;
    var thi = this;
    var result = "";
    var index = 0;
    for (var i = 0; i < 100; i ++) {
         var h = thi.indexOf("}",index) 
         var a = thi.charAt(i)
        if (curr && a != "}") {
        
           
            var g = curr(a,o,colors);
       
            o++;
            thi = thi.substring(0,i) + g + thi.substr(i+1);
            i += g.length - a.length
            continue;
        } else if (a == "}") {
            t--;
            curr = false;
            thi = thi.substring(0,i) + "\x1b[0m"+ thi.substr(i+1);
            continue;
        }
        
      var a = thi.indexOf("{",index);
      
       
       if ((h != -1 && h < a) || (a == -1 && h != -1)) {
       if (t == 0) throw "SYTAX ERROR";
       
           k.pop()
           var extra = k.join("")
       
           thi = thi.substring(0,h) + "\x1b[0m" + extra + thi.substring(h + 1);
          
           t--;
       } else if (a == -1) break;
        
        
     var c = thi.substring(a-3,a);
     var j = check(c);
        if (j) {
            thi = thi.substring(0,a-3) + j + thi.substring(a + 1)
            
        k[t] = j
        t++;
        } else if (checkSpecial(c)) {
            i = a - 4;
           
            o = 0;
              thi = thi.substring(0,a-3) + thi.substring(a + 1);
            
            t++;
        } else {
            index = a + 1;
        }
        
    }
    
    return thi + "\x1b[0m";
}
}

