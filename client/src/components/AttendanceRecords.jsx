import React, {
  useState,
  useEffect,
} from "react";
import "../css/AttendanceRecords.css";

function AttendanceRecords() {
  const API_URL = "http://localhost:8000";

  const teacher = JSON.parse(
    localStorage.getItem("teacher")
  );

  const teacherId =
    teacher?.teacher_id;

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [subjectFilter,setSubjectFilter] = useState("");
  const [dateFilter,setDateFilter] =  useState("");

  const [stats, setStats] =
    useState({
      totalRecords: 0,
      todayPresent: 0,
      subjects: 0,
      attendanceRate: 0,
    });

  const fetchAttendanceRecords =
    async () => {
      try {
        const response =
          await fetch(
            `${API_URL}/attendance/records/${teacherId}`
          );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch attendance records"
          );
        }

        const data =
          await response.json();
        setRecords(data);
        setStats({
          totalRecords: data.length,
          todayPresent:
            data.filter(
              (record) =>
                record.status ===
                "Present"
            ).length,
          subjects:
            new Set(
              data.map(
                (record) =>
                  record.subject_name
              )
            ).size,
          attendanceRate:
            data.length > 0
              ? Math.round(
                  (
                    data.filter(
                      (record) =>
                        record.status ===
                        "Present"
                    ).length /
                    data.length
                  ) *
                    100
                )
              : 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    if (teacherId) {
      fetchAttendanceRecords();
    }
  }, [teacherId]);

  const filteredRecords =
    records.filter((record) => {
      const matchesSearch =
        (
          record.student_name ||
          ""
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesSubject =
        !subjectFilter ||
        record.subject_name ===
          subjectFilter;

      const matchesDate =
        !dateFilter ||
        record.date ===
          dateFilter;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesDate
      );
    });

  const uniqueSubjects = [
    ...new Set(
      records.map(
        (record) =>
          record.subject_name
      )
    ),
  ];

  const exportCSV = () => {
    const csvRows = [
      [
        "Student ID",
        "Student Name",
        "Subject",
        "Date",
        "Time",
        "Status",
      ],

      ...filteredRecords.map(
        (record) => [
          record.student_id,
          record.student_name,
          record.subject_name,
          record.date,
          record.time,
          record.status,
        ]
      ),
    ];

    const csvContent =
      csvRows
        .map((row) =>
          row.join(",")
        )
        .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv",
      }
    );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "attendance_records.csv";

    document.body.appendChild(
      a
    );

    a.click();

    document.body.removeChild(
      a
    );

    window.URL.revokeObjectURL(
      url
    );
  };

  return (
  <div className="records-pagear">

    <div className="records-headerar">
      <h1>
        Attendance Records
      </h1>

      <p>
        View attendance history
        and analytics
      </p>
    </div>

    <div className="stats-gridar">

      <div className="stat-cardar">
        <h3>
          {stats.totalRecords}
        </h3>

        <p>
          Total Records
        </p>
      </div>

      <div className="stat-cardar">
        <h3>
          {stats.todayPresent}
        </h3>

        <p>
          Present Records
        </p>
      </div>

      <div className="stat-cardar">
        <h3>
          {stats.subjects}
        </h3>

        <p>
          Subjects
        </p>
      </div>

      <div className="stat-cardar">
        <h3>
          {stats.attendanceRate}
          %
        </h3>

        <p>
          Attendance Rate
        </p>
      </div>

    </div>

    <div className="filtersar">

      <select
        value={subjectFilter}
        onChange={(e) =>
          setSubjectFilter(
            e.target.value
          )
        }
      >
        <option value="">
          All Subjects
        </option>

        {uniqueSubjects.map(
          (subject) => (
            <option
              key={subject}
              value={subject}
            >
              {subject}
            </option>
          )
        )}
      </select>

      <input
        type="date"
        value={dateFilter}
        onChange={(e) =>
          setDateFilter(
            e.target.value
          )
        }
      />

      <input
        type="text"
        placeholder="Search Student..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

    </div>

    <div className="table-wrapperar">

      <table className="records-tablear">

        <thead>
          <tr>
            <th>
              Student ID
            </th>

            <th>
              Student Name
            </th>

            <th>
              Subject
            </th>

            <th>
              Date
            </th>

            <th>
              Time
            </th>

            <th>
              Status
            </th>
          </tr>
        </thead>

        <tbody>

          {filteredRecords.length ===
          0 ? (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign:
                    "center",
                  padding:
                    "20px",
                }}
              >
                No attendance
                records found
              </td>
            </tr>
          ) : (
            filteredRecords.map(
              (record, index) => (
                <tr
                  key={`${record.student_id}-${index}`}
                >
                  <td>
                    {
                      record.student_id
                    }
                  </td>

                  <td>
                    {
                      record.student_name
                    }
                  </td>

                  <td>
                    {
                      record.subject_name
                    }
                  </td>

                  <td>
                    {record.date}
                  </td>

                  <td>
                    {record.time}
                  </td>

                  <td>
                    <span
                      className={
                        record.status === "Present"
                          ? "present-badgear"
                          : "absent-badgear"
                      }
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>

    <button
      className="export-btnar"
      onClick={exportCSV}
    >
      Export CSV
    </button>
  </div>
);
}

export default AttendanceRecords;