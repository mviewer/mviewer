String.prototype.sansAccent = function () {
  var accent = [
    /[\300-\306]/g,
    /[\340-\346]/g, // A, a
    /[\310-\313]/g,
    /[\350-\353]/g, // E, e
    /[\314-\317]/g,
    /[\354-\357]/g, // I, i
    /[\322-\330]/g,
    /[\362-\370]/g, // O, o
    /[\331-\334]/g,
    /[\371-\374]/g, // U, u
    /[\321]/g,
    /[\361]/g, // N, n
    /[\307]/g,
    /[\347]/g, // C, c
  ];
  var noaccent = ["A", "a", "E", "e", "I", "i", "O", "o", "U", "u", "N", "n", "C", "c"];

  var str = this;
  for (var i = 0; i < accent.length; i++) {
    str = str.replace(accent[i], noaccent[i]);
  }

  return str;
};

/**
 * @param {number} n The max number of characters to keep.
 * @return {string} Truncated string.
 */

String.prototype.truncate =
  String.prototype.truncate ||
  function (n) {
    return this.length > n ? this.substr(0, n - 1) + "..." : this.substr(0);
  };

String.prototype.divide =
  String.prototype.divide ||
  function (width, spaceReplacer) {
    var str = this;
    if (str.length > width) {
      var p = width;
      while (p > 0 && str[p] != " " && str[p] != "-") {
        p--;
      }
      if (p > 0) {
        var left;
        if (str.substring(p, p + 1) == "-") {
          left = str.substring(0, p + 1);
        } else {
          left = str.substring(0, p);
        }
        var right = str.substring(p + 1);
        return left + spaceReplacer + right.divide(width, spaceReplacer);
      }
    }
    return str;
  };
