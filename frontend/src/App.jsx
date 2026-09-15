import { useEffect, useMemo, useState } from "react";
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
  ShieldAlert,
  BarChart3,
  Lightbulb,
  FileText,
  Code2,
  Trophy,
  BookOpen,
  BriefcaseBusiness,
  Activity,
} from "lucide-react";
import "./App.css";

const API = "http://127.0.0.1:8000";

const emptyForm = {
  name: "",
  roll_no: "",
  department: "AI & Data Science",
  year: 3,
  email: "",
  cgpa: 0,
  classes_conducted: 0,
  classes_attended: 0,
  projects: 0,
  internships: 0,
  certifications: 0,
  hackathons: 0,
  paper_presentations: 0,
  awards: 0,
  skills: "",
  placement_status: "Not Ready",
};

function attendanceColor(value) {
  if (value >= 85) return "excellent";
  if (value >= 75) return "average";
  return "low";
}

function careerColor(value) {
  if (value >= 80) return "high";
  if (value >= 65) return "medium";
  return "low";
}

function App() {
  const [page, setPage] = useState("Dashboard");
  const [students, setStudents] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [search, setSearch] = useState("");
  const [smartQuery, setSmartQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [studentsResponse, dashboardResponse] = await Promise.all([
        fetch(`${API}/students`),
        fetch(`${API}/dashboard`),
      ]);

      const studentsData = await studentsResponse.json();
      const dashboardData = await dashboardResponse.json();

      setStudents(studentsData);
      setDashboard(dashboardData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function openStudent(student) {
    try {
      setSelectedStudent(student);

      const response = await fetch(
        `${API}/students/${student.id}/ai-analysis`
      );

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      } else {
        setAnalysis(null);
      }
    } catch (error) {
      console.error(error);
      setAnalysis(null);
    }
  }

  function closeStudent() {
    setSelectedStudent(null);
    setAnalysis(null);
  }

  async function addStudent() {
    try {
      const payload = {
        ...form,
        year: String(form.year),
        cgpa: Number(form.cgpa),
        classes_conducted: Number(form.classes_conducted),
        classes_attended: Number(form.classes_attended),
        projects: Number(form.projects),
        internships: Number(form.internships),
        certifications: Number(form.certifications),
        hackathons: Number(form.hackathons),
        paper_presentations: Number(form.paper_presentations),
        awards: Number(form.awards),
        skills:
          typeof form.skills === "string"
            ? form.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : form.skills,
      };

      const response = await fetch(`${API}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to add student");
      }

      setForm(emptyForm);
      setShowAddStudent(false);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Could not add student. Please check the details.");
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
      setQueryResult({
        answer: "Unable to connect to the AI Advisor.",
        students: [],
      });
    }
  }

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return students;

    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(value) ||
        student.roll_no?.toLowerCase().includes(value) ||
        student.department?.toLowerCase().includes(value)
    );
  }, [students, search]);

  const atRiskStudents = students.filter(
    (student) =>
      student.risk_level === "High" ||
      student.risk_level === "Medium" ||
      student.attendance < 75
  );

  const placementReady = students.filter(
    (student) =>
      student.placement_readiness === "Ready" ||
      student.placement_status === "Ready"
  );

  const averageCGPA =
    students.length > 0
      ? (
          students.reduce((sum, student) => sum + Number(student.cgpa || 0), 0) /
          students.length
        ).toFixed(2)
      : "0.00";

  const averageAttendance =
    students.length > 0
      ? Math.round(
          students.reduce(
            (sum, student) => sum + Number(student.attendance || 0),
            0
          ) / students.length
        )
      : 0;

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      icon: Users,
    },
    {
      name: "Achievements",
      icon: Award,
    },
    {
      name: "Career Readiness",
      icon: Briefcase,
    },
    {
      name: "AI Advisor",
      icon: Brain,
    },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>

          <div>
            <h1>StudentAI</h1>
            <span>Performance System</span>
          </div>
        </div>

        <div className="sidebar-section-title">MAIN MENU</div>

        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.name;

            return (
              <button
                key={item.name}
                className={`nav-item ${active ? "active" : ""}`}
                onClick={() => {
                  setPage(item.name);
                  setQueryResult(null);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>

                {active && <ChevronRight size={16} />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            <div>
              <strong>System Online</strong>
              <small>AI analysis active</small>
            </div>
          </div>

          <div className="sidebar-footer">
            AI Student Performance
            <br />
            & Career Readiness
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Student Management / {page}</p>
            <h2>{page}</h2>
          </div>

          <div className="topbar-actions">
            <div className="top-search">
              <Search size={17} />
              <input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setPage("Students")}
              />
            </div>

            <div className="profile-circle">AI</div>
          </div>
        </header>

        <div className="content-area">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading student data...</p>
            </div>
          ) : (
            <>
              {page === "Dashboard" && (
                <Dashboard
                  students={students}
                  dashboard={dashboard}
                  averageCGPA={averageCGPA}
                  averageAttendance={averageAttendance}
                  atRiskStudents={atRiskStudents}
                  placementReady={placementReady}
                  openStudent={openStudent}
                  setPage={setPage}
                />
              )}

              {page === "Students" && (
                <StudentsPage
                  students={filteredStudents}
                  search={search}
                  setSearch={setSearch}
                  openStudent={openStudent}
                  setShowAddStudent={setShowAddStudent}
                />
              )}

              {page === "Achievements" && (
                <AchievementsPage students={students} />
              )}

              {page === "Career Readiness" && (
                <CareerPage students={students} openStudent={openStudent} />
              )}

              {page === "AI Advisor" && (
                <AIAdvisor
                  smartQuery={smartQuery}
                  setSmartQuery={setSmartQuery}
                  runSmartQuery={runSmartQuery}
                  queryResult={queryResult}
                  students={students}
                  atRiskStudents={atRiskStudents}
                  openStudent={openStudent}
                />
              )}
            </>
          )}
        </div>
      </main>

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          analysis={analysis}
          closeStudent={closeStudent}
        />
      )}

      {showAddStudent && (
        <AddStudentModal
          form={form}
          setForm={setForm}
          addStudent={addStudent}
          close={() => setShowAddStudent(false)}
        />
      )}
    </div>
  );
}

function Dashboard({
  students,
  dashboard,
  averageCGPA,
  averageAttendance,
  atRiskStudents,
  placementReady,
  openStudent,
  setPage,
}) {
  const topStudents = [...students]
    .sort((a, b) => Number(b.career_score || 0) - Number(a.career_score || 0))
    .slice(0, 5);

  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <h3>Student Performance Overview</h3>
          <p>
            Monitor academic performance, attendance, achievements and career
            readiness from one place.
          </p>
        </div>

        <button className="primary-button" onClick={() => setPage("Students")}>
          <Users size={17} />
          View Students
        </button>
      </div>

      <div className="stat-grid">
        <StatCard
          icon={<Users size={21} />}
          label="Total Students"
          value={students.length}
          detail="Students registered"
        />

        <StatCard
          icon={<GraduationCap size={21} />}
          label="Average CGPA"
          value={averageCGPA}
          detail="Overall academic performance"
        />

        <StatCard
          icon={<Activity size={21} />}
          label="Average Attendance"
          value={`${averageAttendance}%`}
          detail="Across all students"
        />

        <StatCard
          icon={<BriefcaseBusiness size={21} />}
          label="Placement Ready"
          value={placementReady.length}
          detail={`${students.length} total students`}
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel large-panel">
          <PanelHeader
            title="Student Performance"
            subtitle="Academic and career overview"
            icon={<BarChart3 size={19} />}
          />

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>CGPA</th>
                  <th>Attendance</th>
                  <th>Career Score</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {topStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {student.name?.charAt(0)}
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
                      <div className="progress-with-text">
                        <div className="mini-progress">
                          <div
                            className={`mini-progress-fill ${attendanceColor(
                              student.attendance
                            )}`}
                            style={{
                              width: `${Math.min(
                                Number(student.attendance || 0),
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span>{student.attendance}%</span>
                      </div>
                    </td>

                    <td>
                      <strong>{student.career_score || 0}</strong>
                    </td>

                    <td>
                      <StatusBadge
                        text={
                          student.placement_readiness ||
                          student.placement_status ||
                          "Not Ready"
                        }
                      />
                    </td>

                    <td>
                      <button
                        className="icon-button"
                        onClick={() => openStudent(student)}
                      >
                        <ChevronRight size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="AI Risk Monitor"
            subtitle="Students requiring attention"
            icon={<ShieldAlert size={19} />}
          />

          {atRiskStudents.length === 0 ? (
            <div className="empty-small">
              <CheckCircle size={30} />
              <strong>No high-risk students</strong>
              <span>Students are currently performing well.</span>
            </div>
          ) : (
            <div className="risk-list">
              {atRiskStudents.slice(0, 5).map((student) => (
                <div
                  className="risk-item"
                  key={student.id}
                  onClick={() => openStudent(student)}
                >
                  <div className="risk-icon">
                    <AlertTriangle size={17} />
                  </div>

                  <div className="risk-info">
                    <strong>{student.name}</strong>
                    <span>
                      {student.attendance < 75
                        ? `Low attendance: ${student.attendance}%`
                        : `Risk level: ${student.risk_level}`}
                    </span>
                  </div>

                  <ChevronRight size={16} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="section-heading">
        <div>
          <h3>AI-Powered Insights</h3>
          <p>Key capabilities of the student intelligence system.</p>
        </div>
      </div>

      <div className="feature-grid">
        <FeatureCard
          icon={<ShieldAlert size={21} />}
          title="At-Risk Detection"
          text="Identify students who may need academic or attendance support."
        />

        <FeatureCard
          icon={<TrendingUp size={21} />}
          title="Performance Prediction"
          text="Estimate future academic performance using current student data."
        />

        <FeatureCard
          icon={<Target size={21} />}
          title="Skill Gap Analysis"
          text="Find missing technical skills and areas that need improvement."
        />

        <FeatureCard
          icon={<Briefcase size={21} />}
          title="Career Recommendation"
          text="Recommend suitable career paths based on student strengths."
        />

        <FeatureCard
          icon={<CheckCircle size={21} />}
          title="Placement Readiness"
          text="Evaluate whether students are ready for placement opportunities."
        />
      </div>
    </div>
  );
}

function StudentsPage({
  students,
  search,
  setSearch,
  openStudent,
  setShowAddStudent,
}) {
  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <h3>Student Management</h3>
          <p>Search, review and analyze student performance.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowAddStudent(true)}
        >
          <UserPlus size={17} />
          Add Student
        </button>
      </div>

      <div className="student-toolbar">
        <div className="large-search">
          <Search size={18} />
          <input
            placeholder="Search by name, roll number or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="result-count">
          {students.length} student{students.length !== 1 ? "s" : ""}
        </div>
      </div>

      <section className="panel">
        <div className="table-wrapper">
          <table className="data-table student-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Department</th>
                <th>Year</th>
                <th>CGPA</th>
                <th>Attendance</th>
                <th>Career Score</th>
                <th>Risk</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">
                        {student.name?.charAt(0)}
                      </div>

                      <div>
                        <strong>{student.name}</strong>
                        <span>{student.roll_no}</span>
                      </div>
                    </div>
                  </td>

                  <td>{student.department}</td>
                  <td>Year {student.year}</td>
                  <td>
                    <strong>{student.cgpa}</strong>
                  </td>

                  <td>
                    <span
                      className={`attendance-text ${attendanceColor(
                        student.attendance
                      )}`}
                    >
                      {student.attendance}%
                    </span>
                  </td>

                  <td>{student.career_score || 0}</td>

                  <td>
                    <StatusBadge
                      text={student.risk_level || "Low"}
                      risk
                    />
                  </td>

                  <td>
                    <button
                      className="view-button"
                      onClick={() => openStudent(student)}
                    >
                      View
                      <ChevronRight size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan="8">
                    <div className="empty-table">No students found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AchievementsPage({ students }) {
  const totalHackathons = students.reduce(
    (sum, student) => sum + Number(student.hackathons || 0),
    0
  );

  const totalAwards = students.reduce(
    (sum, student) => sum + Number(student.awards || 0),
    0
  );

  const totalPapers = students.reduce(
    (sum, student) => sum + Number(student.paper_presentations || 0),
    0
  );

  const totalCertifications = students.reduce(
    (sum, student) => sum + Number(student.certifications || 0),
    0
  );

  const achievementCards = [
    {
      icon: <Trophy size={22} />,
      label: "Hackathons",
      value: totalHackathons,
      text: "Hackathon participations and wins",
    },
    {
      icon: <Award size={22} />,
      label: "Awards",
      value: totalAwards,
      text: "Academic and project awards",
    },
    {
      icon: <FileText size={22} />,
      label: "Paper Presentations",
      value: totalPapers,
      text: "Research presentations",
    },
    {
      icon: <BookOpen size={22} />,
      label: "Certifications",
      value: totalCertifications,
      text: "Professional certifications",
    },
  ];

  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <h3>Student Achievements</h3>
          <p>Track accomplishments beyond classroom performance.</p>
        </div>
      </div>

      <div className="achievement-summary-grid">
        {achievementCards.map((card) => (
          <div className="achievement-summary" key={card.label}>
            <div className="summary-icon">{card.icon}</div>
            <div>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.text}</small>
            </div>
          </div>
        ))}
      </div>

      <section className="panel">
        <PanelHeader
          title="Achievement Overview"
          subtitle="Student accomplishments"
          icon={<Award size={19} />}
        />

        <div className="achievement-list">
          {students.map((student) => {
            const total =
              Number(student.hackathons || 0) +
              Number(student.awards || 0) +
              Number(student.paper_presentations || 0) +
              Number(student.certifications || 0);

            return (
              <div className="achievement-row" key={student.id}>
                <div className="student-cell">
                  <div className="student-avatar">
                    {student.name?.charAt(0)}
                  </div>

                  <div>
                    <strong>{student.name}</strong>
                    <span>{student.roll_no}</span>
                  </div>
                </div>

                <div className="achievement-stat">
                  <Trophy size={16} />
                  <span>{student.hackathons || 0} Hackathons</span>
                </div>

                <div className="achievement-stat">
                  <Award size={16} />
                  <span>{student.awards || 0} Awards</span>
                </div>

                <div className="achievement-stat">
                  <FileText size={16} />
                  <span>{student.paper_presentations || 0} Papers</span>
                </div>

                <div className="achievement-total">
                  <strong>{total}</strong>
                  <span>Total</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CareerPage({ students, openStudent }) {
  const rankedStudents = [...students].sort(
    (a, b) => Number(b.career_score || 0) - Number(a.career_score || 0)
  );

  return (
    <div className="page-content">
      <div className="welcome-row">
        <div>
          <h3>Career Readiness</h3>
          <p>
            Understand placement readiness, career direction and skill gaps.
          </p>
        </div>
      </div>

      <div className="career-intro">
        <div className="career-intro-icon">
          <Target size={27} />
        </div>

        <div>
          <h3>Placement & Career Intelligence</h3>
          <p>
            The system evaluates academic performance, attendance,
            achievements, projects, internships, certifications and technical
            skills to estimate career readiness.
          </p>
        </div>
      </div>

      <section className="panel">
        <PanelHeader
          title="Career Readiness Ranking"
          subtitle="Students ranked by overall career score"
          icon={<TrendingUp size={19} />}
        />

        <div className="career-ranking">
          {rankedStudents.map((student, index) => (
            <div
              className="career-rank-row"
              key={student.id}
              onClick={() => openStudent(student)}
            >
              <div className="rank-number">{index + 1}</div>

              <div className="student-cell career-student">
                <div className="student-avatar">
                  {student.name?.charAt(0)}
                </div>

                <div>
                  <strong>{student.name}</strong>
                  <span>{student.roll_no}</span>
                </div>
              </div>

              <div className="score-block">
                <span>Career Score</span>
                <strong>{student.career_score || 0}/100</strong>
              </div>

              <div className="score-progress">
                <div
                  className={`score-progress-fill ${careerColor(
                    Number(student.career_score || 0)
                  )}`}
                  style={{
                    width: `${Math.min(
                      Number(student.career_score || 0),
                      100
                    )}%`,
                  }}
                ></div>
              </div>

              <StatusBadge
                text={
                  student.placement_readiness ||
                  student.placement_status ||
                  "Not Ready"
                }
              />

              <ChevronRight size={17} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AIAdvisor({
  smartQuery,
  setSmartQuery,
  runSmartQuery,
  queryResult,
  students,
  atRiskStudents,
  openStudent,
}) {
  const examples = [
    "Which students have low attendance?",
    "Who are the top students?",
    "Who is placement ready?",
    "Who has the most achievements?",
  ];

  return (
    <div className="page-content">
      <div className="ai-hero">
        <div className="ai-hero-icon">
          <Sparkles size={27} />
        </div>

        <div>
          <span className="eyebrow">AI STUDENT INTELLIGENCE</span>
          <h3>AI Advisor</h3>
          <p>
            Ask questions about student performance and receive data-driven
            insights.
          </p>
        </div>
      </div>

      <section className="advisor-query-panel">
        <div className="advisor-input">
          <Brain size={20} />
          <input
            value={smartQuery}
            onChange={(e) => setSmartQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSmartQuery();
            }}
            placeholder="Ask something about your students..."
          />

          <button onClick={runSmartQuery}>
            Analyze
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="example-queries">
          <span>Try asking:</span>

          {examples.map((example) => (
            <button
              key={example}
              onClick={() => {
                setSmartQuery(example);
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      {queryResult && (
        <section className="panel advisor-result">
          <PanelHeader
            title="AI Analysis Result"
            subtitle="Based on the current student dataset"
            icon={<Brain size={19} />}
          />

          <div className="result-answer">
            <Sparkles size={18} />
            <p>
               {typeof queryResult.answer === "string"
                 ? queryResult.answer
                 : JSON.stringify(queryResult.answer)}
            </p>
          </div>

          {queryResult.students?.length > 0 && (
            <div className="query-students">
              {queryResult.students.map((student) => (
                <button
                  className="query-student"
                  key={student.id}
                  onClick={() => openStudent(student)}
                >
                  <div className="student-avatar">
                    {student.name?.charAt(0)}
                  </div>

                  <div>
                    <strong>{student.name}</strong>
                    <span>{student.roll_no}</span>
                  </div>

                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="advisor-grid">
        <div className="advisor-card">
          <div className="advisor-card-icon risk">
            <ShieldAlert size={21} />
          </div>

          <div>
            <span>At-Risk Students</span>
            <strong>{atRiskStudents.length}</strong>
            <small>Need attention or intervention</small>
          </div>
        </div>

        <div className="advisor-card">
          <div className="advisor-card-icon">
            <Users size={21} />
          </div>

          <div>
            <span>Total Students</span>
            <strong>{students.length}</strong>
            <small>Students in the system</small>
          </div>
        </div>

        <div className="advisor-card">
          <div className="advisor-card-icon">
            <Lightbulb size={21} />
          </div>

          <div>
            <span>AI Capabilities</span>
            <strong>5</strong>
            <small>Smart analysis features</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentModal({ student, analysis, closeStudent }) {
  const skillList = Array.isArray(student.skills)
    ? student.skills
    : typeof student.skills === "string"
      ? student.skills.split(",").map((skill) => skill.trim())
      : [];

  return (
    <div className="modal-overlay" onClick={closeStudent}>
      <div className="student-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-student-heading">
            <div className="large-avatar">{student.name?.charAt(0)}</div>

            <div>
              <span className="eyebrow">STUDENT PROFILE</span>
              <h2>{student.name}</h2>
              <p>
                {student.roll_no} · {student.department} · Year {student.year}
              </p>
            </div>
          </div>

          <button className="close-button" onClick={closeStudent}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="profile-metrics">
            <Metric
              label="CGPA"
              value={student.cgpa}
              icon={<GraduationCap size={18} />}
            />

            <Metric
              label="Attendance"
              value={`${student.attendance}%`}
              icon={<Activity size={18} />}
            />

            <Metric
              label="Career Score"
              value={`${student.career_score || 0}/100`}
              icon={<TrendingUp size={18} />}
            />

            <Metric
              label="Achievements"
              value={student.achievement_count || 0}
              icon={<Award size={18} />}
            />
          </div>

          <div className="analysis-grid">
            <AnalysisCard
              icon={<ShieldAlert size={19} />}
              title="At-Risk Detection"
              className="risk-analysis"
            >
              <div className="analysis-highlight">
                <strong>{student.risk_level || "Low"}</strong>
                <span>
                  {student.risk_reason ||
                    "Current student indicators are being monitored."}
                </span>
              </div>
            </AnalysisCard>

            <AnalysisCard
              icon={<TrendingUp size={19} />}
              title="Performance Prediction"
            >
              <div className="prediction-box">
                <strong>
                  {student.predicted_performance ||
                    student.performance_prediction ||
                    "Stable"}
                </strong>

                <span>
                  Estimated future academic performance based on current
                  indicators.
                </span>
              </div>
            </AnalysisCard>

            <AnalysisCard
              icon={<Target size={19} />}
              title="Skill Gap Analysis"
            >
              <div className="skill-section">
                <span className="sub-label">Current Skills</span>

                <div className="skill-tags">
                  {skillList.length > 0 ? (
                    skillList.map((skill) => (
                      <span className="skill-tag" key={skill}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="muted-text">No skills added</span>
                  )}
                </div>

                <span className="sub-label gap-label">Recommended Skills</span>

                <div className="skill-tags">
                  {(student.skill_gaps || student.recommended_skills || [])
                    .slice?.(0, 8)
                    .map((skill) => (
                      <span className="skill-tag recommended" key={skill}>
                        + {skill}
                      </span>
                    ))}
                </div>
              </div>
            </AnalysisCard>

            <AnalysisCard
              icon={<Briefcase size={19} />}
              title="Career Recommendation"
            >
              <div className="career-recommendation">
                <strong>
                  {student.career_recommendation ||
                    student.recommended_career ||
                    "Technology / Software Development"}
                </strong>

                <span>
                  Recommended based on the student's academic and technical
                  profile.
                </span>
              </div>
            </AnalysisCard>

            <AnalysisCard
              icon={<CheckCircle size={19} />}
              title="Placement Readiness"
            >
              <div className="placement-box">
                <StatusBadge
                  text={
                    student.placement_readiness ||
                    student.placement_status ||
                    "Not Ready"
                  }
                />

                <span>
                  {student.placement_reason ||
                    "Readiness is calculated using academics, skills,experience and achievements."}
                    
                </span>
              </div>
            </AnalysisCard>
          </div>

          <section className="profile-section">
            <div className="section-title-row">
              <div>
                <h3>Academic & Career Profile</h3>
                <p>Current student information</p>
              </div>
            </div>

            <div className="detail-grid">
              <Detail label="Email" value={student.email || "Not provided"} />
              <Detail label="Department" value={student.department} />
              <Detail label="Projects" value={student.projects || 0} />
              <Detail label="Internships" value={student.internships || 0} />
              <Detail
                label="Certifications"
                value={student.certifications || 0}
              />
              <Detail label="Hackathons" value={student.hackathons || 0} />
              <Detail
                label="Paper Presentations"
                value={student.paper_presentations || 0}
              />
              <Detail label="Awards" value={student.awards || 0} />
            </div>
          </section>

          {analysis && (
            <section className="ai-assessment">
              <div className="ai-assessment-heading">
                <div className="ai-small-icon">
                  <Brain size={18} />
                </div>

                <div>
                  <span className="eyebrow">AI ASSESSMENT</span>
                  <h3>Student Analysis</h3>
                </div>
              </div>

              <p className="assessment-text">
                {analysis.overall_assessment ||
                  analysis.assessment ||
                  "Analysis generated from the student's current profile."}
              </p>

              <div className="assessment-columns">
                <div>
                  <h4>Strengths</h4>

                  <ul>
                    {(analysis.strengths || []).map((item) => (
                      <li key={item}>
                        <CheckCircle size={15} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>Areas to Improve</h4>

                  <ul>
                    {(analysis.areas_to_improve || []).map((item) => (
                      <li key={item}>
                        <AlertTriangle size={15} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {analysis.recommendations?.length > 0 && (
                <div className="recommendation-list">
                  <h4>Recommended Actions</h4>

                  {analysis.recommendations.map((recommendation) => (
                    <div
                      className="recommendation-item"
                      key={recommendation}
                    >
                      <Lightbulb size={16} />
                      <span>{recommendation}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function AddStudentModal({ form, setForm, addStudent, close }) {
  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="add-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">STUDENT MANAGEMENT</span>
            <h2>Add New Student</h2>
            <p>Enter the student's academic and career information.</p>
          </div>

          <button className="close-button" onClick={close}>
            <X size={20} />
          </button>
        </div>

        <div className="form-body">
          <FormSection title="Basic Information">
            <InputField
              label="Full Name"
              value={form.name}
              onChange={(value) => updateField("name", value)}
              placeholder="Enter student name"
            />

            <InputField
              label="Roll Number"
              value={form.roll_no}
              onChange={(value) => updateField("roll_no", value)}
              placeholder="e.g. AIDS005"
            />

            <InputField
              label="Email"
              value={form.email}
              onChange={(value) => updateField("email", value)}
              placeholder="student@email.com"
            />

            <InputField
              label="Department"
              value={form.department}
              onChange={(value) => updateField("department", value)}
              placeholder="AI & Data Science"
            />

            <InputField
              label="Year"
              type="number"
              value={form.year}
              onChange={(value) => updateField("year", value)}
            />
          </FormSection>

          <FormSection title="Academic Information">
            <InputField
              label="CGPA"
              type="number"
              step="0.1"
              value={form.cgpa}
              onChange={(value) => updateField("cgpa", value)}
              placeholder="e.g. 8.5"
            />

            <InputField
              label="Classes Conducted"
              type="number"
              value={form.classes_conducted}
              onChange={(value) =>
                updateField("classes_conducted", value)
              }
            />

            <InputField
              label="Classes Attended"
              type="number"
              value={form.classes_attended}
              onChange={(value) => updateField("classes_attended", value)}
            />
          </FormSection>

          <FormSection title="Experience & Achievements">
            <InputField
              label="Projects"
              type="number"
              value={form.projects}
              onChange={(value) => updateField("projects", value)}
            />

            <InputField
              label="Internships"
              type="number"
              value={form.internships}
              onChange={(value) => updateField("internships", value)}
            />

            <InputField
              label="Certifications"
              type="number"
              value={form.certifications}
              onChange={(value) =>
                updateField("certifications", value)
              }
            />

            <InputField
              label="Hackathons"
              type="number"
              value={form.hackathons}
              onChange={(value) => updateField("hackathons", value)}
            />

            <InputField
              label="Paper Presentations"
              type="number"
              value={form.paper_presentations}
              onChange={(value) =>
                updateField("paper_presentations", value)
              }
            />

            <InputField
              label="Awards"
              type="number"
              value={form.awards}
              onChange={(value) => updateField("awards", value)}
            />
          </FormSection>

          <FormSection title="Technical Profile">
            <div className="full-width-field">
              <label>Technical Skills</label>
              <input
                value={form.skills}
                onChange={(e) => updateField("skills", e.target.value)}
                placeholder="Python, Java, SQL, React"
              />
              <small>Separate skills with commas.</small>
            </div>

            <div className="full-width-field">
              <label>Placement Status</label>
              <select
                value={form.placement_status}
                onChange={(e) =>
                  updateField("placement_status", e.target.value)
                }
              >
                <option>Not Ready</option>
                <option>Preparing</option>
                <option>Ready</option>
              </select>
            </div>
          </FormSection>
        </div>

        <div className="form-footer">
          <button className="secondary-button" onClick={close}>
            Cancel
          </button>

          <button className="primary-button" onClick={addStudent}>
            <UserPlus size={17} />
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, detail }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>

      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  );
}

function PanelHeader({ title, subtitle, icon }) {
  return (
    <div className="panel-header">
      <div className="panel-title">
        <div className="panel-icon">{icon}</div>

        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ text, risk = false }) {
  const value = String(text || "").toLowerCase();

  let className = "neutral";

  if (
    value.includes("ready") ||
    value.includes("excellent") ||
    value === "low"
  ) {
    className = "positive";
  }

  if (
    value.includes("medium") ||
    value.includes("average") ||
    value.includes("preparing")
  ) {
    className = "warning";
  }

  if (
    value.includes("high") ||
    value.includes("not ready") ||
    value.includes("critical")
  ) {
    className = "danger";
  }

  if (risk) {
    if (value === "low") className = "positive";
    if (value === "medium") className = "warning";
    if (value === "high") className = "danger";
  }

  return <span className={`status-badge ${className}`}>{text}</span>;
}

function Metric({ label, value, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AnalysisCard({ icon, title, children, className = "" }) {
  return (
    <section className={`analysis-card ${className}`}>
      <div className="analysis-card-header">
        <div className="analysis-card-icon">{icon}</div>
        <h3>{title}</h3>
      </div>

      {children}
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="form-section">
      <h3>{title}</h3>
      <div className="form-grid">{children}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
}) {
  return (
    <div className="form-field">
      <label>{label}</label>

      <input
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default App;