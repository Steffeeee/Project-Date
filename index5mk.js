var DC = (function() {
  function calculate(date1, date2) {
      if (!date1 || !date2) return 0;
      return date2 instanceof Date ? difference(date1, date2) : addDuration(date1, date2);
  }

  function addDuration(date, duration) {
      return new Date(
          date.getFullYear() + (duration[0] || 0),
          date.getMonth() + (duration[1] || 0),
          date.getDate() + (duration[2] || 0)
      );
  }

  function difference(date1, date2) {
      date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
      date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
      
      var time1 = date1.getTime(),
          time2 = date2.getTime();
      
      if (time1 > time2) return difference(date2, date1);
      
      var daysDiff = Math.round((time2 - time1) / 86400000);
      var year1 = date1.getFullYear(),
          year2 = date2.getFullYear(),
          month1 = date1.getMonth(),
          month2 = date2.getMonth(),
          day1 = date1.getDate(),
          day2 = date2.getDate();

      if (day1 > day2) {
          day2 += daysInMonth(++month1, year1);
      }
      if (month1 > month2) {
          month2 += 12;
          year1++;
      }
      
      return [
          year2 - year1,
          month2 - month1,
          day2 - day1,
          daysDiff
      ];
  }

  function daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
  }
  
  return calculate;
})();

var DP = (function() {
  function parse(input) {
      var str = input.toLowerCase(),
          numberMatches = str.match(numberRegex);
          
      if (str.includes("денес") || str.includes("today")) 
          return new Date();
      if (str.includes("утре") || str.includes("tomorrow")) 
          return new Date(new Date().setDate(new Date().getDate() + 1));
      
      if (str.match(/^[\+\-]/) && str.match(/[a-zа-я]/)) 
          return parseDuration(str);
      
      var monthIndex = getMonthIndex(str);
      if (monthIndex !== null && numberMatches) 
          return parseDateWithMonth(str, monthIndex);
      
      if (numberMatches && numberMatches.length >= 3) 
          return parseNumericDate(str);
      
      return null;
  }

  function parseDuration(str) {
      var result = [0, 0, 0],
          parts = str.split(",");
      var operation = str.startsWith("-") ? -1 : 1;

      parts.forEach(function(part) {
          var tokens = part.trim().split(" "),
              num = parseInt(tokens[0]);
              
          units.forEach(function(unit, index) {
              shortUnits.forEach(function(shortUnit, shortIndex) {
                  if (tokens[1] && tokens[1].startsWith(shortUnit)) {
                      var multiplier = shortUnit === "н" ? 7 : 1; // week handling
                      result[shortIndex > 2 ? 2 : shortIndex] += operation * num * multiplier;
                  }
              });
          });
      });
      return result;
  }

  function parseDateWithMonth(str, monthIndex) {
      var nums = str.match(numberRegex),
          day = parseInt(nums[0]),
          year = nums[1] ? parseInt(nums[1]) : new Date().getFullYear();
          
      return day > new Date(year, monthIndex + 1, 0).getDate() ? 
          null : new Date(year, monthIndex, day);
  }

  function parseNumericDate(str) {
      var nums = str.match(numberRegex),
          parts = [parseInt(nums[0]), parseInt(nums[1]), parseInt(nums[2])];
          
      if (isValidDate(parts[1], parts[0], parts[2])) 
          return new Date(parts[2], parts[1] - 1, parts[0]);
      if (isValidDate(parts[0], parts[1], parts[2])) 
          return new Date(parts[2], parts[0] - 1, parts[1]);
          
      return null;
  }

  function getMonthIndex(str) {
      var index = null;
      shortMonths.some(function(month, i) {
          if (str.includes(month)) return index = i, true;
      });
      if (index === null) {
          months.some(function(month, i) {
              if (str.includes(month)) return index = i, true;
          });
      }
      return index;
  }

  function isValidDate(month, day, year) {
      return !(month > 12 || year < 1000 || day > new Date(year, month, 0).getDate());
  }

  var numberRegex = new RegExp(/[0-9]+/g);
  return parse;
})();

var months = ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"],
  shortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", 
                "јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "ное", "дек"],
  units = ["годин", "месец", "ден"],
  shortUnits = ["г", "м", "д", "н"];

var app = (function() {
  var startInput, endInput, resultHeader, subText, otherSection, otherList;

  function init() {
      startInput = document.getElementById("d1");
      endInput = document.getElementById("d2");
      resultHeader = document.getElementById("result1");
      subText = document.getElementById("sub");
      otherSection = document.getElementById("otherSection");
      otherList = document.getElementById("otherList");
      
      document.getElementById("mdlO").addEventListener("click", toggleModal);
      document.getElementById("mdlX").addEventListener("click", toggleModal);
      
      startInput.addEventListener("keyup", update);
      endInput.addEventListener("keyup", update);
      
      update();
  }

  function update(e) {
      if (e && e.keyCode === 13) {
          e.preventDefault();
          endInput.focus();
      }
      
      var startVal = startInput.value,
          endVal = endInput.value,
          startDate = DP(startVal),
          endDate = DP(endVal),
          result = DC(startDate, endDate);
          
      resultHeader.innerHTML = "";
      subText.innerHTML = "";
      otherList.innerHTML = "";
      otherSection.classList.add("hidden");

      if (!result) {
          resultHeader.innerHTML = "Се чека внес...";
          if (startVal || endVal) {
              subText.innerHTML = formatDate(startDate, startVal) + 
                  (startDate ? " – " : "") + formatDate(endDate, endVal);
          }
          return;
      }

      if (result instanceof Date) {
          resultHeader.innerHTML = formatDate(result);
          subText.innerHTML = formatDate(startDate) + formatDate(endDate);
      } else {
          var mainResult = formatUnit(units[0], result[0]) + 
                         formatUnit(units[1], result[1]) + 
                         formatUnit(units[2], result[2], "", !result[0] && !result[1]);
          resultHeader.innerHTML = mainResult + 
              (result[0] || result[1] ? " (" + formatUnit(units[2], result[3], "") + ")" : "");
          subText.innerHTML = "Помеѓу " + formatDate(startDate) + " – " + formatDate(endDate);
          
          addOtherFormat([makeUnit(result[0], units[0]), makeUnit(result[1], units[1]), makeUnit(result[2], units[2])]);
          addOtherFormat([makeUnit(result[0] * 12 + result[1], units[1]), makeUnit(result[2], units[2])]);
          addOtherFormat([makeUnit(Math.floor(result[3] / 7), "недела"), makeUnit(result[3] % 7, units[2])]);
          addOtherFormat([makeUnit(result[3], units[2])]);
          addOtherFormat([makeUnit(result[3] * 24, "час")]);
          addOtherFormat([makeUnit(result[3] * 1440, "минута")]);
          addOtherFormat([makeUnit(result[3] * 86400, "секунда")]);
          addOtherFormat([makeUnit(result[3] * 86400000, "милисекунда")]);
          
          if (otherList.innerHTML) otherSection.classList.remove("hidden");
      }
  }

  function formatUnit(unit, count, prefix, forceDisplay) {
      return (count > 0 || forceDisplay) ? 
          (prefix || " ") + count + " " + (count === 1 ? unit : unit + "a") : "";
  }

  function formatDate(date, input) {
      if (!date) return input === "" ? "Нема Внесен Датум" : "Невалиден Датум";
      return months[date.getMonth()] + " " + ordinal(date.getDate()) + ", " + date.getFullYear();
  }

  function ordinal(num) {
      return num + (["ти", "ви", "ри", "ти"][num % 10 - 1] || "ти");
  }

  function makeUnit(count, unit) {
      return count ? count + " " + (count === 1 ? unit : unit + "и") : "";
  }

  function addOtherFormat(units) {
      var text = units.filter(Boolean).join(", ");
      if (text) {
          var li = document.createElement("li");
          li.textContent = text;
          otherList.appendChild(li);
      }
  }

  function toggleModal() {
      document.body.classList.toggle("mdl-visible");
  }

  return init;
})();

window.onload = app;