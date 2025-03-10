var MN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    SMN = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
    Un = ["year", "month", "day"];

var AgeCalculator = function() {
    var birthdateInput, result, sub, otherSection, otherList;

    function init() {
        var mdlO = document.getElementById("mdlO"),
            mdlX = document.getElementById("mdlX");
        
        birthdateInput = document.getElementById("birthdate");
        result = document.getElementById("result1");
        sub = document.getElementById("sub");
        otherSection = document.getElementById("otherSection");
        otherList = document.getElementById("otherList");

        birthdateInput.addEventListener("keyup", calculateAge);
        mdlO.onclick = mdlX.onclick = toggleModal;
        mdlO.classList.remove("hidden");
        birthdateInput.value = "";
    }

    function parseDate(str) {
        // First try standard Date parsing
        var date = new Date(str);
        if (!isNaN(date.getTime())) return date;

        // Try DD.MM.YYYY format (day.month.year)
        var dmyParts = str.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
        if (dmyParts) {
            var day = parseInt(dmyParts[1], 10);
            var month = parseInt(dmyParts[2], 10) - 1; // Months are 0-based in JS
            var year = parseInt(dmyParts[3], 10);
            date = new Date(year, month, day);
            if (!isNaN(date.getTime())) return date;
        }

        // Try other numeric formats (YYYY/MM/DD or MM/DD/YYYY)
        var parts = str.match(/(\d+)[/-](\d+)[/-](\d+)/);
        if (parts) {
            // Check if it's YYYY/MM/DD
            if (parts[1].length === 4) {
                var year = parseInt(parts[1], 10);
                var month = parseInt(parts[2], 10) - 1;
                var day = parseInt(parts[3], 10);
                date = new Date(year, month, day);
                if (!isNaN(date.getTime())) return date;
            } 
            // Otherwise assume MM/DD/YYYY
            else {
                var month = parseInt(parts[1], 10) - 1;
                var day = parseInt(parts[2], 10);
                var year = parseInt(parts[3], 10);
                date = new Date(year, month, day);
                if (!isNaN(date.getTime())) return date;
            }
        }

        // Try month name format (e.g., "March 11, 2006")
        var monthIndex = -1;
        SMN.some((m, i) => str.toLowerCase().includes(m) ? (monthIndex = i, true) : false);
        if (monthIndex >= 0) {
            var nums = str.match(/\d+/g);
            if (nums && nums.length >= 2) {
                var day = parseInt(nums[0]);
                var year = parseInt(nums[1]);
                if (nums.length === 3) {
                    year = parseInt(nums[2]);
                    if (year < 100) year += 1900; // Handle two-digit years
                }
                date = new Date(year, monthIndex, day);
                if (!isNaN(date.getTime())) return date;
            }
        }

        return null;
    }

    function calculateAgeDifference(birthDate, currentDate) {
        var diffMs = currentDate - birthDate;
        var years = currentDate.getFullYear() - birthDate.getFullYear();
        var months = currentDate.getMonth() - birthDate.getMonth();
        var days = currentDate.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        var totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return [years, months, days, totalDays];
    }

    function formatDate(date) {
        return MN[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    }

    function formatUnit(value, unit) {
        return value > 0 ? value + " " + (value === 1 ? unit : unit + "s") + " " : "";
    }

    function calculateAge() {
        var birthStr = birthdateInput.value;
        result.innerHTML = "Enter your birthday above";
        sub.innerHTML = "";
        otherList.innerHTML = "";
        otherSection.classList.add("hidden");

        if (!birthStr) return;

        var birthDate = parseDate(birthStr);
        if (!birthDate || isNaN(birthDate.getTime())) {
            result.innerHTML = "Invalid date format";
            return;
        }

        var today = new Date();
        if (birthDate > today) {
            result.innerHTML = "Birth date cannot be in the future";
            return;
        }

        var [years, months, days, totalDays] = calculateAgeDifference(birthDate, today);
        
        result.innerHTML = `You are ${formatUnit(years, Un[0])}${formatUnit(months, Un[1])}${formatUnit(days, Un[2])}old`;
        sub.innerHTML = `Born ${formatDate(birthDate)}`;

        // Other formats
        otherList.innerHTML = `
            <li>${years} years, ${months} months, ${days} days</li>
            <li>${(years * 12 + months)} months, ${days} days</li>
            <li>${Math.floor(totalDays / 7)} weeks, ${totalDays % 7} days</li>
            <li>${totalDays} days</li>
            <li>${totalDays * 24} hours</li>
            <li>${totalDays * 1440} minutes</li>
            <li>${totalDays * 86400} seconds</li>
        `;
        otherSection.classList.remove("hidden");
    }

    function toggleModal() {
        document.body.classList.toggle("mdl-visible");
        document.body.classList.contains("mdl-visible") ?
            document.getElementsByClassName("close")[0].focus() :
            document.getElementsByClassName("mdl-launch")[0].focus();
    }

    return { init: init };
}();

window.onload = function() {
    AgeCalculator.init();
};