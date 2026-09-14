import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Award,
  Briefcase,
  Search,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  GraduationCap,
  ChevronRight,
  X,
  UserPlus,
  Target,
  Sparkles,
  Pencil,
  Trash2
} from "lucide-react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [page, setPage] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [search, setSearch] = useState("");
  const [smartQuery, setSmartQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [form, setForm] = useState({
    name: "",
    roll_no: "",
    department: "AI & Data Science",
    year: "3rd Year",
    email: "",
    cgpa: "",
    classes_conducted: 100,
    classes_attended: 0,
    projects: 0,
    internships: 0,
    certifications: 0,
    hackathons: 0,
    paper_presentations: 0,
    awards: 0,
    skills: "",
    placement_status: "Not Placed"
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const studentResponse = await fetch(`${API}/students`);
      const dashboardResponse = await fetch(`${API}/dashboard`);

      const studentData = await studentResponse.json();
      const dashboardData = await dashboardResponse.json();

      setStudents(studentData);
      setDashboard(dashboardData);
    } catch (error) {
      console.error("Backend connection error:", error);
    }
  }

  async function openStudent(student) {
    setSelectedStudent(student);
    setAnalysis(null);

    try {
      const response = await fetch(
        `${API}/students/${student.id}/ai-analysis`
      );

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error(error);
    }
  }

  function resetForm() {
    setForm({
      name: "",
      roll_no: "",
      department: "AI & Data Science",
      year: "3rd Year",
      email: "",
      cgpa: "",
      classes_conducted: 100,
      classes_attended: 0,
      projects: 0,
      internships: 0,
      certifications: 0,
      hackathons: 0,
      paper_presentations: 0,
      awards: 0,
      skills: "",
      placement_status: "Not Placed"
    });
  }

  function openAddStudent() {
    setEditingStudent(null);
    resetForm();
    setShowAddStudent(true);
  }

  function openEditStudent(student) {
    setSelectedStudent(null);
    setAnalysis(null);
    setEditingStudent(student);

    setForm({
      name: student.name || "",
      roll_no: student.roll_no || "",
      department: student.department || "AI & Data Science",
      year: student.year || "3rd Year",
      email: student.email || "",
      cgpa: student.cgpa ?? "",
      classes_conducted: student.classes_conducted ?? 100,
      classes_attended: student.classes_attended ?? 0,
      projects: student.projects ?? 0,
      internships: student.internships ?? 0,
      certifications: student.certifications ?? 0,
      hackathons: student.hackathons ?? 0,
      paper_presentations: student.paper_presentations ?? 0,
      awards: student.awards ?? 0,
      skills: Array.isArray(student.skills)
        ? student.skills.join(", ")
        : student.skills || "",
      placement_status: student.placement_status || "Not Placed"
    });

    setShowAddStudent(true);
  }

  async function saveStudent(e) {
    e.preventDefault();

    const student = {
      ...form,
      cgpa: Number(form.cgpa),
      classes_conducted: Number(form.classes_conducted),
      classes_attended: Number(form.classes_attended),
      projects: Number(form.projects),
      internships: Number(form.internships),
      certifications: Number(form.certifications),
      hackathons: Number(form.hackathons),
      paper_presentations: Number(form.paper_presentations),
      awards: Number(form.awards),
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    };

    try {
      const url = editingStudent
        ? `${API}/students/${editingStudent.id}`
        : `${API}/students`;

      const response = await fetch(url, {
        method: editingStudent ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
      });

      if (!response.ok) {
        throw new Error("Unable to save student");
      }

      setShowAddStudent(false);
      setEditingStudent(null);
      resetForm();
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Could not save student. Please check the backend.");
    }
  }

  async function deleteStudent(student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API}/students/${student.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete student");
      }

      setSelectedStudent(null);
      setAnalysis(null);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Could not delete student. Please check the backend.");
    }
  }

  async function runSmartQuery() {
    if (!smartQuery.trim()) return;

    try {
      const response = await fetch(
        `${API}/smart-query?query=${encodeURIComponent(smartQuery)}`
      );

      const data = await response.json();
      setQueryResult(data);
    } catch (error) {
      console.error(error);
    }
  }

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.roll_no} ${student.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function getAttendanceClass(value) {
    if (value >= 85) return "excellent";
    if (value >= 75) return "average";
    return "low";
  }

  function getScoreClass(value) {
    if (value >= 80) return "score-high";
    if (value >= 65) return "score-medium";
    return "score-low";
  }

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <Brain size={23} />
          </div>

          <div>
            <h2>StudentAI</h2>
            <span>Career Intelligence</span>
          </div>
        </div>

        <nav>

          <button
            className={page === "dashboard" ? "nav-active" : ""}
            onClick={() => setPage("dashboard")}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className={page === "students" ? "nav-active" : ""}
            onClick={() => setPage("students")}
          >
            <Users size={19} />
            Students
          </button>

          <button
            className={page === "achievements" ? "nav-active" : ""}
            onClick={() => setPage("achievements")}
          >
            <Award size={19} />
            Achievements
          </button>

          <button
            className={page === "career" ? "nav-active" : ""}
            onClick={() => setPage("career")}
          >
            <Briefcase size={19} />
            Career Readiness
          </button>

          <button
            className={page === "advisor" ? "nav-active" : ""}
            onClick={() => setPage("advisor")}
          >
            <Sparkles size={19} />
            AI Advisor
          </button>

        </nav>

        <div className="sidebar-bottom">
          <div className="ai-status">
            <span className="status-dot"></span>

            <div>
              <strong>AI System Active</strong>
              <small>Analysis engine online</small>
            </div>
          </div>
        </div>

      </aside>


      {/* MAIN */}

      <main className="main">

        <header className="topbar">

          <div>
            <p className="eyebrow">STUDENT INTELLIGENCE PLATFORM</p>
            <h1>
              {page === "dashboard" && "Overview"}
              {page === "students" && "Student Profiles"}
              {page === "achievements" && "Student Achievements"}
              {page === "career" && "Career Readiness"}
              {page === "advisor" && "AI Student Advisor"}
            </h1>
          </div>

          <div className="top-actions">

            <div className="search-box">
              <Search size={17} />
              <input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="add-btn"
              onClick={openAddStudent}
            >
              <UserPlus size={18} />
              Add Student
            </button>

          </div>

        </header>


        {/* DASHBOARD */}

        {page === "dashboard" && dashboard && (

          <div className="content">

            <div className="welcome-card">

              <div>
                <span className="badge">
                  <Sparkles size={14} />
                  AI-Powered Analytics
                </span>

                <h2>
                  Understand your students.
                  <br />
                  <span>Improve their future.</span>
                </h2>

                <p>
                  StudentAI combines academic performance, attendance,
                  achievements and career experience to identify student
                  strengths and development opportunities.
                </p>
              </div>

              <div className="welcome-graphic">
                <Brain size={80} strokeWidth={1} />
              </div>

            </div>


            <div className="stats-grid">

              <StatCard
                icon={<Users />}
                label="Total Students"
                value={dashboard.total_students}
                detail="Registered students"
              />

              <StatCard
                icon={<GraduationCap />}
                label="Average CGPA"
                value={dashboard.average_cgpa}
                detail="Overall academic performance"
              />

              <StatCard
                icon={<TrendingUp />}
                label="Average Attendance"
                value={`${dashboard.average_attendance}%`}
                detail="Across all students"
              />

              <StatCard
                icon={<Target />}
                label="Placement Ready"
                value={dashboard.placement_ready}
                detail="Students with strong profiles"
              />

            </div>


            <div className="dashboard-grid">

              <section className="panel">

                <div className="panel-heading">
                  <div>
                    <h3>Student Performance</h3>
                    <p>Recent student profiles</p>
                  </div>

                  <button onClick={() => setPage("students")}>
                    View all <ChevronRight size={16} />
                  </button>
                </div>

                <StudentTable
                  students={students}
                  openStudent={openStudent}
                  openEditStudent={openEditStudent}
                  deleteStudent={deleteStudent}
                  getAttendanceClass={getAttendanceClass}
                  getScoreClass={getScoreClass}
                />

              </section>


              <section className="panel">

                <div className="panel-heading">
                  <div>
                    <h3>Attendance Analysis</h3>
                    <p>Current attendance distribution</p>
                  </div>
                </div>

                <div className="attendance-summary">

                  <div className="attendance-number">
                    {dashboard.average_attendance}%
                    <span>Average attendance</span>
                  </div>

                  <div className="attendance-bars">

                    <Progress
                      label="Excellent"
                      value={dashboard.excellent_attendance}
                      total={dashboard.total_students}
                    />

                    <Progress
                      label="Average"
                      value={dashboard.average_attendance_count}
                      total={dashboard.total_students}
                    />

                    <Progress
                      label="Low"
                      value={dashboard.low_attendance}
                      total={dashboard.total_students}
                    />

                  </div>

                </div>

              </section>

            </div>

          </div>

        )}


        {/* STUDENTS */}

        {page === "students" && (

          <div className="content">

            <div className="page-intro">

              <div>
                <h2>Student Profiles</h2>
                <p>
                  Academic, attendance and career information for every student.
                </p>
              </div>

              <button
                className="add-btn"
                onClick={openAddStudent}
              >
                <UserPlus size={18} />
                Add Student
              </button>

            </div>


            <section className="panel">

              <StudentTable
                students={filteredStudents}
                openStudent={openStudent}
                openEditStudent={openEditStudent}
                deleteStudent={deleteStudent}
                getAttendanceClass={getAttendanceClass}
                getScoreClass={getScoreClass}
              />

            </section>

          </div>

        )}


        {/* ACHIEVEMENTS */}

        {page === "achievements" && (

          <div className="content">

            <div className="page-intro">
              <div>
                <h2>Achievements</h2>
                <p>
                  Discover students with strong academic and extracurricular achievements.
                </p>
              </div>
            </div>


            <div className="achievement-grid">

              {filteredStudents.map((student) => (

                <div
                  className="achievement-card"
                  key={student.id}
                  onClick={() => openStudent(student)}
                >

                  <div className="student-avatar">
                    {student.name.charAt(0)}
                  </div>

                  <div className="achievement-info">
                    <h3>{student.name}</h3>
                    <p>{student.roll_no}</p>
                  </div>

                  <div className="achievement-items">

                    <Achievement
                      label="Hackathons"
                      value={student.hackathons}
                    />

                    <Achievement
                      label="Awards"
                      value={student.awards}
                    />

                    <Achievement
                      label="Papers"
                      value={student.paper_presentations}
                    />

                    <Achievement
                      label="Certifications"
                      value={student.certifications}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}


        {/* CAREER */}

        {page === "career" && (

          <div className="content">

            <div className="page-intro">
              <div>
                <h2>Career Readiness</h2>
                <p>
                  AI-generated career readiness scores based on student profiles.
                </p>
              </div>
            </div>


            <div className="career-grid">

              {filteredStudents
                .sort((a, b) => b.career_score - a.career_score)
                .map((student, index) => (

                  <div
                    className="career-card"
                    key={student.id}
                    onClick={() => openStudent(student)}
                  >

                    <div className="rank">
                      #{index + 1}
                    </div>

                    <div className="career-person">

                      <div className="student-avatar">
                        {student.name.charAt(0)}
                      </div>

                      <div>
                        <h3>{student.name}</h3>
                        <p>{student.roll_no}</p>
                      </div>

                    </div>

                    <div className={`career-score ${getScoreClass(student.career_score)}`}>
                      {student.career_score}
                      <span>/100</span>
                    </div>

                    <div className="score-label">
                      {student.career_status}
                    </div>

                  </div>

                ))}

            </div>

          </div>

        )}


        {/* AI ADVISOR */}

        {page === "advisor" && (

          <div className="content">

            <div className="advisor-hero">

              <div className="advisor-icon">
                <Brain size={32} />
              </div>

              <div>
                <span className="badge">
                  <Sparkles size={14} />
                  Intelligent Student Analysis
                </span>

                <h2>Ask the Student Advisor</h2>

                <p>
                  Ask questions about attendance, achievements,
                  student performance and placement readiness.
                </p>
              </div>

            </div>


            <div className="query-box">

              <input
                value={smartQuery}
                onChange={(e) => setSmartQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runSmartQuery();
                }}
                placeholder="Example: Which students have low attendance?"
              />

              <button onClick={runSmartQuery}>
                <Brain size={18} />
                Analyze
              </button>

            </div>


            <div className="suggestion-row">

              <button onClick={() => setSmartQuery("Which students have low attendance?")}>
                Low attendance students
              </button>

              <button onClick={() => setSmartQuery("Who are the top students?")}>
                Top performing students
              </button>

              <button onClick={() => setSmartQuery("Who is placement ready?")}>
                Placement ready
              </button>

              <button onClick={() => setSmartQuery("Who has the most achievements?")}>
                Top achievements
              </button>

            </div>


            {queryResult && (

              <div className="query-result">

                <div className="result-header">
                  <div className="result-ai">
                    <Brain size={19} />
                  </div>

                  <div>
                    <h3>AI Analysis</h3>
                    <p>{queryResult.message}</p>
                  </div>
                </div>


                <div className="result-list">

                  {queryResult.result.length === 0 ? (

                    <div className="empty-result">
                      No matching students found.
                    </div>

                  ) : (

                    queryResult.result.map((item, index) => (

                      <div className="result-item" key={index}>

                        {typeof item === "string" ? (
                          <>
                            <div className="student-avatar small">
                              {item.charAt(0)}
                            </div>

                            <strong>{item}</strong>
                          </>
                        ) : (
                          <>
                            <div className="student-avatar small">
                              {item.name.charAt(0)}
                            </div>

                            <div>
                              <strong>{item.name}</strong>
                              <small>
                                {item.career_score !== undefined
                                  ? `Career score: ${item.career_score}`
                                  : `Achievements: ${item.achievements}`}
                              </small>
                            </div>
                          </>
                        )}

                      </div>

                    ))

                  )}

                </div>

              </div>

            )}

          </div>

        )}

      </main>


      {/* STUDENT MODAL */}

      {selectedStudent && (

        <div className="modal-overlay">

          <div className="student-modal">

            <button
              className="close-btn"
              onClick={() => setSelectedStudent(null)}
            >
              <X size={20} />
            </button>


            <div className="profile-header">

              <div className="profile-avatar">
                {selectedStudent.name.charAt(0)}
              </div>

              <div>
                <h2>{selectedStudent.name}</h2>
                <p>
                  {selectedStudent.roll_no} • {selectedStudent.department}
                </p>
              </div>

            </div>


            <div className="profile-metrics">

              <Metric
                label="CGPA"
                value={selectedStudent.cgpa}
              />

              <Metric
                label="Attendance"
                value={`${selectedStudent.attendance_percentage}%`}
              />

              <Metric
                label="Career Score"
                value={selectedStudent.career_score}
              />

              <Metric
                label="Projects"
                value={selectedStudent.projects}
              />

            </div>


            <div className="profile-section">

              <h3>Academic & Career Profile</h3>

              <div className="detail-grid">

                <Detail
                  label="Internships"
                  value={selectedStudent.internships}
                />

                <Detail
                  label="Certifications"
                  value={selectedStudent.certifications}
                />

                <Detail
                  label="Hackathons"
                  value={selectedStudent.hackathons}
                />

                <Detail
                  label="Paper Presentations"
                  value={selectedStudent.paper_presentations}
                />

                <Detail
                  label="Awards"
                  value={selectedStudent.awards}
                />

                <Detail
                  label="Placement Status"
                  value={selectedStudent.placement_status}
                />

              </div>

            </div>


            <div className="profile-section">

              <h3>Technical Skills</h3>

              <div className="skill-list">

                {selectedStudent.skills.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}

              </div>

            </div>


            {analysis && (

              <div className="ai-analysis">

                <div className="analysis-title">
                  <div className="analysis-icon">
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <h3>AI Student Analysis</h3>
                    <p>
                      Generated from the student's complete profile
                    </p>
                  </div>
                </div>


                <div className="ai-overview">

                  <div>
                    <span>Career Readiness</span>
                    <strong>
                      {analysis.career_score}/100
                    </strong>
                  </div>

                  <span className="ai-status-label">
                    {analysis.career_status}
                  </span>

                </div>


                <p className="overall">
                  {analysis.overall_assessment}
                </p>


                <div className="analysis-columns">

                  <AnalysisList
                    title="Strengths"
                    items={analysis.strengths}
                    type="positive"
                  />

                  <AnalysisList
                    title="Areas to Improve"
                    items={analysis.areas_to_improve}
                    type="warning"
                  />

                </div>


                <div className="recommendations">

                  <h4>
                    <Target size={16} />
                    AI Recommendations
                  </h4>

                  {analysis.recommendations.map((item, index) => (
                    <div className="recommendation" key={index}>
                      <CheckCircle size={16} />
                      {item}
                    </div>
                  ))}

                </div>

              </div>

            )}

            <div style={{
              display: "flex",
              gap: "10px",
              marginTop: "22px",
              paddingTop: "18px",
              borderTop: "1px solid #e5e7eb"
            }}>
              <button
                type="button"
                className="view-btn"
                onClick={() => openEditStudent(selectedStudent)}
                style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}
              >
                <Pencil size={15} />
                Edit Student
              </button>

              <button
                type="button"
                className="view-btn"
                onClick={() => deleteStudent(selectedStudent)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  borderColor: "#ef4444",
                  color: "#dc2626"
                }}
              >
                <Trash2 size={15} />
                Delete Student
              </button>
            </div>

          </div>

        </div>

      )}


      {/* ADD STUDENT MODAL */}

      {showAddStudent && (

        <div className="modal-overlay">

          <div className="add-modal">

            <button
              className="close-btn"
              onClick={() => setShowAddStudent(false)}
            >
              <X size={20} />
            </button>

            <div className="modal-heading">
              <div className="modal-icon">
                <UserPlus size={22} />
              </div>

              <div>
                <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
                <p>{editingStudent ? "Update the student's academic and career information." : "Enter the student's academic and career information."}</p>
              </div>
            </div>


            <form onSubmit={saveStudent}>

              <div className="form-grid">

                <Input
                  label="Student Name"
                  value={form.name}
                  onChange={(value) =>
                    setForm({ ...form, name: value })
                  }
                  required
                />

                <Input
                  label="Roll Number"
                  value={form.roll_no}
                  onChange={(value) =>
                    setForm({ ...form, roll_no: value })
                  }
                  required
                />

                <Input
                  label="Email"
                  value={form.email}
                  onChange={(value) =>
                    setForm({ ...form, email: value })
                  }
                />

                <Input
                  label="CGPA"
                  type="number"
                  step="0.1"
                  value={form.cgpa}
                  onChange={(value) =>
                    setForm({ ...form, cgpa: value })
                  }
                  required
                />

                <Input
                  label="Classes Conducted"
                  type="number"
                  value={form.classes_conducted}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      classes_conducted: value
                    })
                  }
                />

                <Input
                  label="Classes Attended"
                  type="number"
                  value={form.classes_attended}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      classes_attended: value
                    })
                  }
                />

                <Input
                  label="Projects"
                  type="number"
                  value={form.projects}
                  onChange={(value) =>
                    setForm({ ...form, projects: value })
                  }
                />

                <Input
                  label="Internships"
                  type="number"
                  value={form.internships}
                  onChange={(value) =>
                    setForm({ ...form, internships: value })
                  }
                />

                <Input
                  label="Certifications"
                  type="number"
                  value={form.certifications}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      certifications: value
                    })
                  }
                />

                <Input
                  label="Hackathons"
                  type="number"
                  value={form.hackathons}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      hackathons: value
                    })
                  }
                />

                <Input
                  label="Paper Presentations"
                  type="number"
                  value={form.paper_presentations}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      paper_presentations: value
                    })
                  }
                />

                <Input
                  label="Awards"
                  type="number"
                  value={form.awards}
                  onChange={(value) =>
                    setForm({ ...form, awards: value })
                  }
                />

              </div>


              <div className="form-field full">
                <label>Placement Status</label>
                <select
                  value={form.placement_status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      placement_status: e.target.value
                    })
                  }
                >
                  <option value="Not Placed">Not Placed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Placement Ready">Placement Ready</option>
                  <option value="Placed">Placed</option>
                  <option value="Needs Improvement">Needs Improvement</option>
                </select>
              </div>


              <div className="form-field full">

                <label>Technical Skills</label>

                <input
                  value={form.skills}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      skills: e.target.value
                    })
                  }
                  placeholder="Python, SQL, Java, React"
                />

                <small>Separate skills using commas.</small>

              </div>


              <button className="submit-btn" type="submit">
                {editingStudent ? "Save Changes" : "Add Student"}
                <ChevronRight size={18} />
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


// ---------------------------------------------------------
// COMPONENTS
// ---------------------------------------------------------

function StatCard({ icon, label, value, detail }) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>

    </div>
  );
}


function Progress({ label, value, total }) {

  const percentage =
    total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="progress-row">

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="progress-track">
        <div
          className={`progress-fill ${label.toLowerCase()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

    </div>
  );
}


function StudentTable({
  students,
  openStudent,
  openEditStudent,
  deleteStudent,
  getAttendanceClass,
  getScoreClass
}) {

  return (
    <div className="table-wrapper">

      <table>

        <thead>
          <tr>
            <th>Student</th>
            <th>CGPA</th>
            <th>Attendance</th>
            <th>Achievements</th>
            <th>Career Score</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.id}>

              <td>
                <div className="student-cell">

                  <div className="student-avatar small">
                    {student.name.charAt(0)}
                  </div>

                  <div>
                    <strong>{student.name}</strong>
                    <span>{student.roll_no}</span>
                  </div>

                </div>
              </td>

              <td>
                <strong>{student.cgpa}</strong>
              </td>

              <td>
                <div className="attendance-cell">

                  <span className={getAttendanceClass(student.attendance_percentage)}>
                    {student.attendance_percentage}%
                  </span>

                  <small>{student.attendance_status}</small>

                </div>
              </td>

              <td>
                <span className="achievement-count">
                  {student.awards +
                    student.hackathons +
                    student.paper_presentations +
                    student.certifications}
                </span>
              </td>

              <td>
                <span className={`score-pill ${getScoreClass(student.career_score)}`}>
                  {student.career_score}
                </span>
              </td>

              <td>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  flexWrap: "wrap"
                }}>
                  <button
                    className="view-btn"
                    onClick={() => openStudent(student)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    View
                    <ChevronRight size={15} />
                  </button>

                  <button
                    className="view-btn"
                    onClick={() => openEditStudent(student)}
                    title="Edit student"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "8px"
                    }}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="view-btn"
                    onClick={() => deleteStudent(student)}
                    title="Delete student"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "8px",
                      borderColor: "#ef4444",
                      color: "#dc2626"
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


function Achievement({ label, value }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}


function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


function Detail({ label, value }) {
  return (
    <div className="detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


function AnalysisList({ title, items, type }) {

  return (
    <div className="analysis-list">

      <h4>{title}</h4>

      {items.length === 0 ? (
        <p className="none">No items identified.</p>
      ) : (

        items.map((item, index) => (

          <div
            className={`analysis-item ${type}`}
            key={index}
          >
            {type === "positive" ? (
              <CheckCircle size={15} />
            ) : (
              <AlertTriangle size={15} />
            )}

            <span>{item}</span>

          </div>

        ))

      )}

    </div>
  );
}


function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  step
}) {

  return (
    <div className="form-field">

      <label>{label}</label>

      <input
        type={type}
        value={value}
        step={step}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />

    </div>
  );
}


export default App;