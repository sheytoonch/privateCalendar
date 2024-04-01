const container = document.getElementById('container');

const fullCurrentDate = new Date();
const currentDate = {
    year: fullCurrentDate.getFullYear(),
    month: fullCurrentDate.getMonth(),
    day: fullCurrentDate.getDay()
}

const dataMonthStandardToPolishNames = {
    0: "STYCZEŃ",
    1: "LUTY",
    2: "MARZEC",
    3: "KWIECIEŃ",
    4: "MAJ",
    5: "CZERWIEC",
    6: "LIPIEC",
    7: "SIERPIEŃ",
    8: "WRZESIEŃ",
    9: "PAŹDZIERNIK",
    10: "LISTOPAD",
    11: "GRUDZIEŃ"
}

// Not used
const dataDayToToPolishNames = {
    0: "NIEDZIELA",
    1: "PONIEDZIAŁEK",
    2: "WTOREK",
    3: "ŚRODA",
    4: "CZWARTEK",
    5: "PIĄTEK",
    6: "SOBOTA"
}

const dataDayStandardToNatural = {
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    0: 6
}


function getMonthMetadata(year, month) {
    const firstDayOfTheMonth = new Date(year, month, 1);
    const firstDayOfNextMonth = new Date(year, month + 1, 1);

    // take next month and go one day back
    const lastDayOfTheMonth = new Date(firstDayOfNextMonth - 1);

    return {
        year: firstDayOfTheMonth.getFullYear(),
        month: firstDayOfTheMonth.getMonth(),
        firstDay: firstDayOfTheMonth.getDay(),
        lastDay: lastDayOfTheMonth.getDay(),
        length: lastDayOfTheMonth.getDate(),
        name: dataMonthStandardToPolishNames[firstDayOfTheMonth.getMonth()]
    }
}


function mapHumanInputToDateStandard(year, month, day) {
    return {
        year: year,
        month: month - 1,
        day: day
    }
}


function getListOfMonthsToDisplay(numberOfMonths) {
    const curentDate = new Date();
    const thisYear = curentDate.getFullYear();
    const thisMonth = curentDate.getMonth();

    const listOfMonths = [];

    let monthNumber = thisMonth - 1;
    const endingMonth = thisMonth + numberOfMonths;

    for(monthNumber; monthNumber < endingMonth; monthNumber++) {
        const monthMetadata = getMonthMetadata(thisYear, monthNumber);
        listOfMonths.push(monthMetadata);
    }

    return listOfMonths;
}


function generateId(year, month, day) {
    return `${year}-${month}-${day}`;
}


function applyBusyDays(busyDates) {
    for(let date of busyDates) {
        const id = generateId(date[0], date[1], date[2]);
        try {
            const busyDay = document.getElementById(id);
            busyDay.classList.add('busy');
        } catch (error) {
            console.log('-- id failed: ', id);
        }
    }
}


function planningEvent() {
    if(this.classList.contains('planning')) {
        this.classList.remove('planning');
    } else {
        this.classList.add('planning');
    }
}


function initiateCalendar() {
    const listOfMonthsToDisplay = getListOfMonthsToDisplay(13);

    for(let month of listOfMonthsToDisplay) {

        // Initiate month container
        const monthContainer = document.createElement('div');
        
        // Add header to the month container
        const monthHeader = document.createElement('div');
        monthHeader.innerText = `${month.name} - ${month.year}`;
        monthHeader.classList.add('monthHeader');
        monthContainer.appendChild(monthHeader);

        // Initiate weeks container
        const weeksContainer = document.createElement('div');

        // Initiate week container
        let weekContainer = document.createElement('div');
        let dayCounter = 0;
        for(let dayNumber = 1; dayNumber <= month.length; dayNumber++) {
            const naturalFirstDay = dataDayStandardToNatural[month.firstDay];
            const naturalLastDay = dataDayStandardToNatural[month.lastDay];

            if(dayNumber === 1) {
                // Add filler days before the first day of the month

                for(let i = 0; i < naturalFirstDay; i++) {
                    const fillerDay = document.createElement('div');
                    fillerDay.classList.add('day', 'filler');
                    fillerDay.style.visibility = 'hidden';
                    weekContainer.appendChild(fillerDay);
                    dayCounter++;
                }
                // Add normal day
                const normalDay = document.createElement('div');
                normalDay.classList.add('day');
                normalDay.innerText = dayNumber;
                normalDay.id = generateId(month.year, month.month + 1, dayNumber);
                normalDay.addEventListener('click', planningEvent);
                weekContainer.appendChild(normalDay);
                dayCounter++;

            } else if(dayNumber === month.length) {
                // Add normal day
                const normalDay = document.createElement('div');
                normalDay.classList.add('day');
                normalDay.innerText = dayNumber;
                normalDay.id = generateId(month.year, month.month + 1, dayNumber);
                normalDay.addEventListener('click', planningEvent);
                weekContainer.appendChild(normalDay);
                dayCounter++;

                // Add filler days after the last day of the month
                for(let i = naturalLastDay + 1; i < 7; i++) {
                    const fillerDay = document.createElement('div');
                    fillerDay.classList.add('day', 'filler');
                    fillerDay.style.visibility = 'hidden';
                    weekContainer.appendChild(fillerDay);
                    dayCounter++;
                }

            } else {
                // Add normal day to the week container
                const normalDay = document.createElement('div');
                normalDay.classList.add('day');
                normalDay.innerText = dayNumber;
                normalDay.id = generateId(month.year, month.month + 1, dayNumber);
                normalDay.addEventListener('click', planningEvent);
                weekContainer.appendChild(normalDay);
                dayCounter++;
            }

            if(dayCounter >= 7) {
                // Add week to weeks
                weekContainer.classList.add('weekContainer');
                weeksContainer.appendChild(weekContainer);
                weekContainer = document.createElement('div');
                dayCounter = 0;
            }
        }
        // Add weeks to the month container
        monthContainer.appendChild(weeksContainer)

        // Add month to the calendar
        container.appendChild(monthContainer);
    }
}


initiateCalendar();
applyBusyDays(busyDates);