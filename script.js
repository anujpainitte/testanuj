function processRawData() {
    const rawData = document.getElementById("dataInput").value;
    const startIndex = rawData.indexOf("Subject Name");
    const endIndex = rawData.indexOf("Note :");
    const data = rawData.substring(startIndex, endIndex).trim();
    const rows = data.split('\n');
    rows.splice(0, 3);
    const table = document.createElement("table");

    const headers = ["Subject", "Current Attendance (%)", "Classes to attend for above 75%", "Classes to attend for above 85%", "Total Marks (out of 50)"];
    const headerRow = document.createElement("tr");
    headers.forEach(headerText => {
        const header = document.createElement("th");
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    let totalMarks = 0;

    rows.forEach((rowData, index) => {
        const columns = rowData.trim().split('\t');

        const subject = columns[1];
        const classesHeld = columns[columns.length - 2] !== '' ? parseFloat(columns[columns.length - 2]) : 0;
        const classesAttended = columns[columns.length - 1] !== '' ? parseFloat(columns[columns.length - 1]) : 0;
        const currentAttendance = classesHeld !== 0 ? (classesAttended / classesHeld * 100).toFixed(2) : '-';

        const marksData = columns.slice(2, columns.length - 2).filter(mark => mark !== '' && mark !== '*' && mark !== '#');
        const marks = marksData.length > 0 ? marksData.reduce((sum, mark) => sum + parseFloat(mark), 0) : 0;

        totalMarks += marks;

        const row = document.createElement("tr");

        const subjectCell = document.createElement("td");
        subjectCell.textContent = subject;
        row.appendChild(subjectCell);

        const currentAttendanceCell = document.createElement("td");
        currentAttendanceCell.textContent = !isNaN(currentAttendance) ? currentAttendance : '-';
        row.appendChild(currentAttendanceCell);

        const attendanceNeeded75Cell = document.createElement("td");
        const attendanceNeeded85Cell = document.createElement("td");

        if (currentAttendance !== '-' && currentAttendance < 75) {
            const classesNeeded75 = Math.ceil((0.75 * classesHeld - classesAttended) / 0.15);
            attendanceNeeded75Cell.textContent = classesNeeded75;
            attendanceNeeded75Cell.classList.add("red-text");
        } else {
            attendanceNeeded75Cell.textContent = '-';
        }

        row.appendChild(attendanceNeeded75Cell);

        if (currentAttendance !== '-' && currentAttendance < 85) {
            const classesNeeded85 = Math.ceil((0.85 * classesHeld - classesAttended) / 0.15);
            attendanceNeeded85Cell.textContent = classesNeeded85;
            attendanceNeeded85Cell.classList.add("orange-text");
        } else {
            attendanceNeeded85Cell.textContent = attendanceNeeded75Cell.textContent;
        }

        row.appendChild(attendanceNeeded85Cell);

        const totalMarksCell = document.createElement("td");
        totalMarksCell.textContent = marks;
        row.appendChild(totalMarksCell);

        table.appendChild(row);
    });

    const outputContainer = document.getElementById("outputContainer");
    outputContainer.innerHTML = '';
    outputContainer.appendChild(table);
}

function calculateSEE() {
    var totalMarks = parseInt(document.getElementById("totalMarks").value);
    var desiredGradePoint = parseInt(document.getElementById("desiredGradePoint").value);

    if (totalMarks < 20) {
        document.getElementById("result").innerHTML = "Not eligible for calculation. Total marks should be at least 20.";
        return;
    }

    var seeMarks = ((desiredGradePoint * 10) - totalMarks - 10) * 2;

    if (seeMarks > 100) {
        document.getElementById("result").innerHTML = "You need to score more than 100 marks in the SEE to achieve a grade point of " + desiredGradePoint + " which is impossible. So study well next semester :-)";
    } else {
        document.getElementById("result").innerHTML = "You need to score at least " + seeMarks.toFixed(2) + " marks or more in the SEE to achieve a grade point of " + desiredGradePoint;
    }
}

// Auto-hide instructions after 10 seconds
setTimeout(() => {
    document.getElementById("instruction1").style.display = "none";
    document.getElementById("instruction2").style.display = "none";
    document.getElementById("instruction3").style.display = "none";
    document.getElementById("instruction4").style.display = "none";
    document.getElementById("instruction5").style.display = "none";
    document.getElementById("instruction6").style.display = "none";
    document.getElementById("instruction7").style.display = "none";
}, 10000);
