var TimeZoneCalculator = function() {
    var localTimeInput, capitalInput, result, sub, otherSection, otherList, selectedTimeZone = null, intervalId = null;

    const timeZones = {
        "скопје": "Europe/Skopje",
        "skopje": "Europe/Skopje",
        "лондон": "Europe/London",
        "london": "Europe/London",
        "токио": "Asia/Tokyo",
        "tokyo": "Asia/Tokyo",
        "вашингтон": "America/New_York",
        "washington": "America/New_York",
        "париз": "Europe/Paris",
        "paris": "Europe/Paris",
        "пекинг": "Asia/Shanghai",
        "beijing": "Asia/Shanghai",
        "москва": "Europe/Moscow",
        "moscow": "Europe/Moscow",
        "канбера": "Australia/Canberra",
        "canberra": "Australia/Canberra",
        "берлин": "Europe/Berlin",
        "berlin": "Europe/Berlin",
        "рим": "Europe/Rome",
        "rome": "Europe/Rome",
        "бразилија": "America/Sao_Paulo",
        "brasilia": "America/Sao_Paulo",
        "њу делхи": "Asia/Kolkata",
        "new delhi": "Asia/Kolkata",
        "отава": "America/Toronto",
        "ottawa": "America/Toronto",
        "мадрид": "Europe/Madrid",
        "madrid": "Europe/Madrid",
        "атена": "Europe/Athens",
        "athens": "Europe/Athens",
        "каиро": "Africa/Cairo",
        "cairo": "Africa/Cairo",
        "abu dhabi": "Asia/Dubai",
        "accra": "Africa/Accra",
        "addis ababa": "Africa/Addis_Ababa",
        "algiers": "Africa/Algiers",
        "amman": "Asia/Amman",
        "amsterdam": "Europe/Amsterdam",
        "andorra la vella": "Europe/Andorra",
        "ankara": "Europe/Istanbul",
        "antananarivo": "Indian/Antananarivo",
        "apia": "Pacific/Apia",
        "ashgabat": "Asia/Ashgabat",
        "asmara": "Africa/Asmara",
        "astana": "Asia/Almaty",
        "asunción": "America/Asuncion",
        "baghdad": "Asia/Baghdad",
        "baku": "Asia/Baku",
        "bamako": "Africa/Bamako",
        "bandar seri begawan": "Asia/Brunei",
        "bangkok": "Asia/Bangkok",
        "banjul": "Africa/Banjul",
        "basseterre": "America/St_Kitts",
        "belgrade": "Europe/Belgrade",
        "belmopan": "America/Belize",
        "bishkek": "Asia/Bishkek",
        "bissau": "Africa/Bissau",
        "bogotá": "America/Bogota",
        "bratislava": "Europe/Bratislava",
        "bridgetown": "America/Barbados",
        "brussels": "Europe/Brussels",
        "bucharest": "Europe/Bucharest",
        "budapest": "Europe/Budapest",
        "buenos aires": "America/Argentina/Buenos_Aires",
        "castries": "America/St_Lucia",
        "chisinau": "Europe/Chisinau",
        "colombo": "Asia/Colombo",
        "conakry": "Africa/Conakry",
        "copenhagen": "Europe/Copenhagen",
        "dakar": "Africa/Dakar",
        "damascus": "Asia/Damascus",
        "dhaka": "Asia/Dhaka",
        "dili": "Asia/Dili",
        "djibouti": "Africa/Djibouti",
        "doha": "Asia/Qatar",
        "dublin": "Europe/Dublin",
        "dushanbe": "Asia/Dushanbe",
        "freetown": "Africa/Freetown",
        "funafuti": "Pacific/Funafuti",
        "gaborone": "Africa/Gaborone",
        "georgetown": "America/Guyana",
        "gitega": "Africa/Gitega",
        "guatemala city": "America/Guatemala",
        "hanoi": "Asia/Ho_Chi_Minh",
        "harare": "Africa/Harare",
        "havana": "America/Havana",
        "helsinki": "Europe/Helsinki",
        "honiara": "Pacific/Guadalcanal",
        "islamabad": "Asia/Karachi",
        "jakarta": "Asia/Jakarta",
        "jerusalem": "Asia/Jerusalem",
        "juba": "Africa/Juba",
        "kabul": "Asia/Kabul",
        "kampala": "Africa/Kampala",
        "kathmandu": "Asia/Kathmandu",
        "khartoum": "Africa/Khartoum",
        "kiev": "Europe/Kiev",
        "kyiv": "Europe/Kiev",
        "kigali": "Africa/Kigali",
        "kingston": "America/Jamaica",
        "kinshasa": "Africa/Kinshasa",
        "kuala lumpur": "Asia/Kuala_Lumpur",
        "kuwait city": "Asia/Kuwait",
        "la paz": "America/La_Paz",
        "libreville": "Africa/Libreville",
        "lilongwe": "Africa/Blantyre",
        "lima": "America/Lima",
        "lisbon": "Europe/Lisbon",
        "ljubljana": "Europe/Ljubljana",
        "lomé": "Africa/Lome",
        "luanda": "Africa/Luanda",
        "lusaka": "Africa/Lusaka",
        "luxembourg": "Europe/Luxembourg",
        "malabo": "Africa/Malabo",
        "male": "Indian/Maldives",
        "managua": "America/Managua",
        "manama": "Asia/Bahrain",
        "manila": "Asia/Manila",
        "maputo": "Africa/Maputo",
        "maseru": "Africa/Maseru",
        "mbabane": "Africa/Mbabane",
        "mexico city": "America/Mexico_City",
        "minsk": "Europe/Minsk",
        "mogadishu": "Africa/Mogadishu",
        "монако": "Europe/Monaco",
        "monaco": "Europe/Monaco",
        "monrovia": "Africa/Monrovia",
        "montevideo": "America/Montevideo",
        "moroni": "Indian/Comoro",
        "muscat": "Asia/Muscat",
        "nairobi": "Africa/Nairobi",
        "nassau": "America/Nassau",
        "naypyidaw": "Asia/Yangon",
        "ndjamena": "Africa/Ndjamena",
        "niamey": "Africa/Niamey",
        "nicosia": "Asia/Nicosia",
        "nouakchott": "Africa/Nouakchott",
        "oslo": "Europe/Oslo",
        "ouagadougou": "Africa/Ouagadougou",
        "panama city": "America/Panama",
        "paramaribo": "America/Paramaribo",
        "phnom penh": "Asia/Phnom_Penh",
        "podgorica": "Europe/Podgorica",
        "port louis": "Indian/Mauritius",
        "port moresby": "Pacific/Port_Moresby",
        "port of spain": "America/Port_of_Spain",
        "port vila": "Pacific/Efate",
        "porto-novo": "Africa/Porto-Novo",
        "prague": "Europe/Prague",
        "praia": "Atlantic/Cape_Verde",
        "pretoria": "Africa/Johannesburg",
        "pyongyang": "Asia/Pyongyang",
        "quito": "America/Guayaquil",
        "rabat": "Africa/Casablanca",
        "reykjavik": "Atlantic/Reykjavik",
        "riga": "Europe/Riga",
        "riyadh": "Asia/Riyadh",
        "roseau": "America/Dominica",
        "saint george's": "America/Grenada",
        "saint john's": "America/Antigua",
        "san josé": "America/Costa_Rica",
        "san juan": "America/Puerto_Rico",
        "san marino": "Europe/San_Marino",
        "san salvador": "America/El_Salvador",
        "sana'a": "Asia/Aden",
        "santiago": "America/Santiago",
        "santo domingo": "America/Santo_Domingo",
        "são tomé": "Africa/Sao_Tome",
        "sarajevo": "Europe/Sarajevo",
        "seoul": "Asia/Seoul",
        "singapore": "Asia/Singapore",
        "sofia": "Europe/Sofia",
        "stockholm": "Europe/Stockholm",
        "sucre": "America/La_Paz",
        "suva": "Pacific/Fiji",
        "taipei": "Asia/Taipei",
        "tallinn": "Europe/Tallinn",
        "tarawa": "Pacific/Tarawa",
        "tashkent": "Asia/Tashkent",
        "tbilisi": "Asia/Tbilisi",
        "tegucigalpa": "America/Tegucigalpa",
        "tehran": "Asia/Tehran",
        "thimphu": "Asia/Thimphu",
        "tirana": "Europe/Tirana",
        "tunis": "Africa/Tunis",
        "ulaanbaatar": "Asia/Ulaanbaatar",
        "vaduz": "Europe/Vaduz",
        "valletta": "Europe/Malta",
        "vatican city": "Europe/Rome",
        "vienna": "Europe/Vienna",
        "vientiane": "Asia/Vientiane",
        "vilnius": "Europe/Vilnius",
        "warsaw": "Europe/Warsaw",
        "wellington": "Pacific/Auckland",
        "windhoek": "Africa/Windhoek",
        "yamoussoukro": "Africa/Abidjan",
        "yaoundé": "Africa/Douala",
        "yerevan": "Asia/Yerevan",
        "zagreb": "Europe/Zagreb"
    };

    function init() {
        var mdlO = document.getElementById("mdlO"),
            mdlX = document.getElementById("mdlX");

        localTimeInput = document.getElementById("localtime");
        capitalInput = document.getElementById("capital");
        result = document.getElementById("result1");
        sub = document.getElementById("sub");
        otherSection = document.getElementById("otherSection");
        otherList = document.getElementById("otherList");

        capitalInput.addEventListener("keyup", handleCityInput);
        mdlO.onclick = mdlX.onclick = toggleModal;
        mdlO.classList.remove("hidden");

        updateLocalTime();
        intervalId = setInterval(updateTimes, 1000);
    }

    function updateLocalTime() {
        const now = new Date();
        localTimeInput.value = now.toLocaleTimeString(['mk-MK', 'en-US'], { hour12: false });
    }

    function getTimeInZone(timeZone) {
        return new Date().toLocaleTimeString(['mk-MK', 'en-US'], { timeZone: timeZone, hour12: false });
    }

    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString(['mk-MK', 'en-US'], options).replace(/(\d+)\/(\d+)\/(\d+)/, '$1.$2.$3');
    }

    function calculateTimeDifference(localDate, zoneDate) {
        const diffMs = zoneDate - localDate;
        const hours = Math.floor(Math.abs(diffMs) / 36e5);
        const minutes = Math.floor((Math.abs(diffMs) % 36e5) / 6e4);
        return {
            hours,
            minutes,
            ahead: diffMs >= 0
        };
    }

    function updateTimes() {
        updateLocalTime();
        
        if (selectedTimeZone) {
            const localDate = new Date();
            const zoneTime = getTimeInZone(selectedTimeZone);
            const zoneDate = new Date(localDate.toLocaleString(['mk-MK', 'en-US'], { timeZone: selectedTimeZone }));
            const diff = calculateTimeDifference(localDate, zoneDate);
            const capital = Object.keys(timeZones).find(key => timeZones[key] === selectedTimeZone);

            result.innerHTML = `Време во ${capital.charAt(0).toUpperCase() + capital.slice(1)}: ${zoneTime}`;
            sub.innerHTML = `Временска разлика: ${diff.ahead ? "Напред" : "Назад"} за ${diff.hours} ${diff.hours !== 1 ? "часови" : "час"}${diff.minutes ? " и " + diff.minutes + " " + (diff.minutes !== 1 ? "минути" : "минута") : ""}`;

            otherList.innerHTML = `
                <li>Локален датум: ${formatDate(localDate)}</li>
                <li>Датум во ${capital.charAt(0).toUpperCase() + capital.slice(1)}: ${formatDate(zoneDate)}</li>
                <li>Временска зона: ${selectedTimeZone}</li>
            `;
            otherSection.classList.remove("hidden");
        }
    }

    function handleCityInput() {
        const capital = capitalInput.value.trim().toLowerCase();
        result.innerHTML = "Внесете главен град погоре";
        sub.innerHTML = "";
        otherList.innerHTML = "";
        otherSection.classList.add("hidden");
        selectedTimeZone = null;

        if (!capital) return;

        const timeZone = timeZones[capital];
        if (!timeZone) {
            result.innerHTML = "Градот не е пронајден";
            sub.innerHTML = "Пробајте друг град или проверете го правописот";
            return;
        }

        selectedTimeZone = timeZone;
        updateTimes();
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
    TimeZoneCalculator.init();
};