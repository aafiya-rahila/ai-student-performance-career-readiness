from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional


app = FastAPI(
    title="AI Student Performance & Career Readiness System",
    description="Student analytics, attendance analysis, AI insights and career readiness",
    version="2.0"
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# DATA MODELS
# ---------------------------------------------------------

class StudentCreate(BaseModel):
    name: str
    roll_no: str
    department: str = "AI & Data Science"
    year: str = "3rd Year"
    email: str = ""

    cgpa: float = 0.0

    classes_conducted: int = 100
    classes_attended: int = 0

    projects: int = 0
    internships: int = 0
    certifications: int = 0
    hackathons: int = 0
    paper_presentations: int = 0
    awards: int = 0

    skills: List[str] = Field(default_factory=list)

    placement_status: str = "Not Placed"


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    roll_no: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    email: Optional[str] = None

    cgpa: Optional[float] = None

    classes_conducted: Optional[int] = None
    classes_attended: Optional[int] = None

    projects: Optional[int] = None
    internships: Optional[int] = None
    certifications: Optional[int] = None
    hackathons: Optional[int] = None
    paper_presentations: Optional[int] = None
    awards: Optional[int] = None

    skills: Optional[List[str]] = None

    placement_status: Optional[str] = None


# ---------------------------------------------------------
# SAMPLE STUDENTS
# ---------------------------------------------------------

students = [
    {
        "id": 1,
        "name": "Ananya Sharma",
        "roll_no": "AIDS001",
        "department": "AI & Data Science",
        "year": "3rd Year",
        "email": "ananya@example.com",
        "cgpa": 9.2,
        "classes_conducted": 100,
        "classes_attended": 94,
        "projects": 4,
        "internships": 2,
        "certifications": 4,
        "hackathons": 2,
        "paper_presentations": 1,
        "awards": 1,
        "skills": [
            "Python",
            "Machine Learning",
            "SQL",
            "Deep Learning",
            "Git"
        ],
        "placement_status": "Not Placed"
    },
    {
        "id": 2,
        "name": "Rahul Kumar",
        "roll_no": "AIDS002",
        "department": "AI & Data Science",
        "year": "3rd Year",
        "email": "rahul@example.com",
        "cgpa": 8.5,
        "classes_conducted": 100,
        "classes_attended": 79,
        "projects": 2,
        "internships": 1,
        "certifications": 2,
        "hackathons": 1,
        "paper_presentations": 0,
        "awards": 0,
        "skills": [
            "Python",
            "SQL",
            "Java"
        ],
        "placement_status": "Not Placed"
    },
    {
        "id": 3,
        "name": "Priya Nair",
        "roll_no": "AIDS003",
        "department": "AI & Data Science",
        "year": "3rd Year",
        "email": "priya@example.com",
        "cgpa": 7.4,
        "classes_conducted": 100,
        "classes_attended": 61,
        "projects": 1,
        "internships": 0,
        "certifications": 0,
        "hackathons": 0,
        "paper_presentations": 0,
        "awards": 0,
        "skills": [
            "Python"
        ],
        "placement_status": "Not Placed"
    },
    {
        "id": 4,
        "name": "Arjun Raj",
        "roll_no": "AIDS004",
        "department": "AI & Data Science",
        "year": "3rd Year",
        "email": "arjun@example.com",
        "cgpa": 8.9,
        "classes_conducted": 100,
        "classes_attended": 88,
        "projects": 3,
        "internships": 2,
        "certifications": 3,
        "hackathons": 2,
        "paper_presentations": 1,
        "awards": 1,
        "skills": [
            "Java",
            "Python",
            "SQL",
            "Git",
            "React"
        ],
        "placement_status": "Not Placed"
    }
]


# ---------------------------------------------------------
# BASIC CALCULATIONS
# ---------------------------------------------------------

def calculate_attendance(student):
    conducted = max(student.get("classes_conducted", 0), 0)
    attended = max(student.get("classes_attended", 0), 0)

    if conducted == 0:
        return 0.0

    percentage = (attended / conducted) * 100

    return round(min(percentage, 100), 1)


def attendance_category(attendance):
    if attendance >= 85:
        return "Excellent"
    elif attendance >= 75:
        return "Average"
    else:
        return "Low"


def calculate_achievements(student):
    return (
        student.get("projects", 0)
        + student.get("internships", 0)
        + student.get("certifications", 0)
        + student.get("hackathons", 0)
        + student.get("paper_presentations", 0)
        + student.get("awards", 0)
    )


def calculate_career_score(student):
    attendance = calculate_attendance(student)
    cgpa = float(student.get("cgpa", 0))

    projects = min(student.get("projects", 0), 5)
    internships = min(student.get("internships", 0), 3)
    certifications = min(student.get("certifications", 0), 5)
    hackathons = min(student.get("hackathons", 0), 3)
    papers = min(student.get("paper_presentations", 0), 3)
    awards = min(student.get("awards", 0), 3)

    skills = student.get("skills", [])
    skill_score = min(len(skills), 6)

    score = 0

    score += (cgpa / 10) * 30
    score += (attendance / 100) * 20
    score += (projects / 5) * 10
    score += (internships / 3) * 10
    score += (certifications / 5) * 8
    score += (hackathons / 3) * 7
    score += (papers / 3) * 5
    score += (awards / 3) * 5
    score += (skill_score / 6) * 5

    return round(min(score, 100), 1)


def career_score_category(score):
    if score >= 80:
        return "High"
    elif score >= 65:
        return "Medium"
    else:
        return "Low"


# ---------------------------------------------------------
# FEATURE 1 — AT-RISK STUDENT DETECTION
# ---------------------------------------------------------

def analyze_risk(student):
    attendance = calculate_attendance(student)
    cgpa = float(student.get("cgpa", 0))
    career_score = calculate_career_score(student)

    reasons = []

    if attendance < 75:
        reasons.append("Attendance is below 75%")

    if cgpa < 7:
        reasons.append("Academic performance needs improvement")

    if student.get("projects", 0) == 0:
        reasons.append("No projects recorded")

    if student.get("internships", 0) == 0:
        reasons.append("No internship experience")

    if student.get("certifications", 0) == 0:
        reasons.append("No certifications recorded")

    if career_score < 50:
        reasons.append("Overall career readiness is low")

    if len(reasons) >= 3:
        level = "High Risk"
    elif len(reasons) >= 1:
        level = "Medium Risk"
    else:
        level = "Low Risk"

    return {
        "risk_level": level,
        "risk_reasons": reasons
    }


# ---------------------------------------------------------
# FEATURE 2 — PERFORMANCE PREDICTION
# ---------------------------------------------------------

def predict_performance(student):
    cgpa = float(student.get("cgpa", 0))
    attendance = calculate_attendance(student)

    prediction = cgpa

    if attendance >= 85:
        prediction += 0.15
    elif attendance < 75:
        prediction -= 0.20

    prediction += min(student.get("projects", 0), 4) * 0.05
    prediction += min(student.get("certifications", 0), 4) * 0.03

    prediction = max(0, min(prediction, 10))

    prediction = round(prediction, 2)

    if prediction > cgpa:
        message = "The student shows potential for academic improvement."
    elif prediction < cgpa:
        message = "The student may need additional academic support."
    else:
        message = "The student's academic performance is expected to remain stable."

    return {
        "predicted_cgpa": prediction,
        "prediction_message": message
    }


# ---------------------------------------------------------
# FEATURE 3 — SKILL GAP ANALYSIS
# ---------------------------------------------------------

CAREER_SKILLS = {
    "AI / ML Engineer": [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "SQL",
        "Git"
    ],
    "Data Analyst": [
        "Python",
        "SQL",
        "Excel",
        "Statistics",
        "Power BI"
    ],
    "Software Developer": [
        "Java",
        "Data Structures",
        "SQL",
        "Git",
        "React"
    ],
    "Data Scientist": [
        "Python",
        "Statistics",
        "SQL",
        "Machine Learning",
        "Data Visualization"
    ]
}


def normalize_skill(skill):
    return skill.lower().strip()


def skill_gap_analysis(student, career):
    current_skills = [
        normalize_skill(skill)
        for skill in student.get("skills", [])
    ]

    required = CAREER_SKILLS[career]

    matched = []
    gaps = []

    for skill in required:
        if normalize_skill(skill) in current_skills:
            matched.append(skill)
        else:
            gaps.append(skill)

    percentage = round((len(matched) / len(required)) * 100)

    return {
        "career": career,
        "required_skills": required,
        "matched_skills": matched,
        "skill_gaps": gaps,
        "skill_match_percentage": percentage
    }


# ---------------------------------------------------------
# FEATURE 4 — PERSONALIZED CAREER RECOMMENDATION
# ---------------------------------------------------------

def recommend_career(student):
    skills = [
        normalize_skill(skill)
        for skill in student.get("skills", [])
    ]

    scores = {
        "AI / ML Engineer": 0,
        "Data Analyst": 0,
        "Software Developer": 0,
        "Data Scientist": 0
    }

    for skill in skills:

        if skill in [
            "python",
            "machine learning",
            "deep learning"
        ]:
            scores["AI / ML Engineer"] += 2

        if skill in [
            "python",
            "sql",
            "excel",
            "statistics",
            "power bi"
        ]:
            scores["Data Analyst"] += 2

        if skill in [
            "java",
            "data structures",
            "react",
            "javascript",
            "git"
        ]:
            scores["Software Developer"] += 2

        if skill in [
            "python",
            "statistics",
            "machine learning",
            "sql",
            "data visualization"
        ]:
            scores["Data Scientist"] += 2

    # Academic and project information also affects recommendation
    if student.get("projects", 0) >= 3:
        scores["Software Developer"] += 1
        scores["AI / ML Engineer"] += 1

    if student.get("certifications", 0) >= 2:
        scores["Data Analyst"] += 1
        scores["Data Scientist"] += 1

    recommended = max(scores, key=scores.get)

    return {
        "recommended_career": recommended,
        "career_scores": scores
    }


# ---------------------------------------------------------
# FEATURE 5 — PLACEMENT READINESS
# ---------------------------------------------------------

def placement_readiness(student):
    attendance = calculate_attendance(student)
    cgpa = float(student.get("cgpa", 0))

    projects = min(student.get("projects", 0), 5)
    internships = min(student.get("internships", 0), 3)
    certifications = min(student.get("certifications", 0), 5)
    skills = min(len(student.get("skills", [])), 6)
    achievements = min(
        student.get("hackathons", 0)
        + student.get("awards", 0)
        + student.get("paper_presentations", 0),
        5
    )

    academic_score = (cgpa / 10) * 25
    attendance_score = (attendance / 100) * 10
    project_score = (projects / 5) * 20
    internship_score = (internships / 3) * 15
    certification_score = (certifications / 5) * 10
    skill_score = (skills / 6) * 10
    achievement_score = (achievements / 5) * 10

    total = (
        academic_score
        + attendance_score
        + project_score
        + internship_score
        + certification_score
        + skill_score
        + achievement_score
    )

    total = round(min(total, 100), 1)

    if total >= 80:
        status = "Placement Ready"
    elif total >= 60:
        status = "Almost Ready"
    else:
        status = "Needs Preparation"

    return {
        "placement_readiness_score": total,
        "placement_readiness_status": status,
        "placement_components": {
            "academic": round(academic_score, 1),
            "attendance": round(attendance_score, 1),
            "projects": round(project_score, 1),
            "internships": round(internship_score, 1),
            "certifications": round(certification_score, 1),
            "skills": round(skill_score, 1),
            "achievements": round(achievement_score, 1)
        }
    }


# ---------------------------------------------------------
# COMPLETE STUDENT DATA
# ---------------------------------------------------------

def enrich_student(student):
    attendance = calculate_attendance(student)
    career_score = calculate_career_score(student)

    risk = analyze_risk(student)
    prediction = predict_performance(student)
    recommendation = recommend_career(student)
    placement = placement_readiness(student)

    career = recommendation["recommended_career"]

    skill_gap = skill_gap_analysis(student, career)

    result = dict(student)

    result["attendance_percentage"] = attendance
    result["attendance_category"] = attendance_category(attendance)

    result["achievement_count"] = calculate_achievements(student)

    result["career_score"] = career_score
    result["career_score_category"] = career_score_category(career_score)

    result.update(risk)
    result.update(prediction)
    result.update(recommendation)
    result.update(skill_gap)
    result.update(placement)

    return result


# ---------------------------------------------------------
# ROOT
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "AI Student Performance & Career Readiness System is running"
    }


# ---------------------------------------------------------
# GET ALL STUDENTS
# ---------------------------------------------------------

@app.get("/students")
def get_students():
    return [
        enrich_student(student)
        for student in students
    ]


# ---------------------------------------------------------
# GET SINGLE STUDENT
# ---------------------------------------------------------

@app.get("/students/{student_id}")
def get_student(student_id: int):

    for student in students:
        if student["id"] == student_id:
            return enrich_student(student)

    raise HTTPException(
        status_code=404,
        detail="Student not found"
    )


# ---------------------------------------------------------
# AI ANALYSIS FOR STUDENT
# ---------------------------------------------------------

@app.get("/students/{student_id}/ai-analysis")
def student_ai_analysis(student_id: int):

    for student in students:

        if student["id"] == student_id:

            data = enrich_student(student)

            career = data["recommended_career"]

            # Personalized recommendations
            recommendations = []

            if data["attendance_percentage"] < 75:
                recommendations.append(
                    "Improve attendance to at least 75%."
                )

            if data["cgpa"] < 8:
                recommendations.append(
                    "Focus on improving academic performance."
                )

            if data["projects"] < 2:
                recommendations.append(
                    "Complete more practical projects."
                )

            if data["internships"] == 0:
                recommendations.append(
                    "Gain internship or industry experience."
                )

            if data["certifications"] == 0:
                recommendations.append(
                    "Complete relevant technical certifications."
                )

            if data["skill_gaps"]:
                recommendations.append(
                    f"Develop missing skills for {career}: "
                    + ", ".join(data["skill_gaps"])
                )

            if not recommendations:
                recommendations.append(
                    "Maintain current performance and continue building industry experience."
                )

            data["recommendations"] = recommendations

            # Overall assessment
            if data["risk_level"] == "High Risk":
                assessment = (
                    "The student requires immediate academic and career support."
                )
            elif data["placement_readiness_score"] >= 80:
                assessment = (
                    "The student demonstrates strong academic performance and placement readiness."
                )
            elif data["placement_readiness_score"] >= 60:
                assessment = (
                    "The student is progressing well but has some areas that should be improved before placement."
                )
            else:
                assessment = (
                    "The student needs focused improvement in academics, skills and career preparation."
                )

            data["overall_assessment"] = assessment

            # Strengths
            strengths = []

            if data["attendance_percentage"] >= 85:
                strengths.append("Excellent attendance")

            if data["cgpa"] >= 8.5:
                strengths.append("Strong academic performance")

            if data["projects"] >= 2:
                strengths.append("Good project experience")

            if data["internships"] >= 1:
                strengths.append("Industry exposure")

            if data["certifications"] >= 2:
                strengths.append("Technical certifications")

            if len(data["skills"]) >= 3:
                strengths.append("Good technical skill base")

            if not strengths:
                strengths.append("Potential for improvement")

            data["strengths"] = strengths

            # Areas to improve
            improvements = []

            if data["attendance_percentage"] < 85:
                improvements.append("Attendance")

            if data["cgpa"] < 8:
                improvements.append("Academic performance")

            if data["projects"] < 2:
                improvements.append("Project experience")

            if data["internships"] == 0:
                improvements.append("Internship experience")

            if data["skill_gaps"]:
                improvements.append("Career-specific skills")

            if not improvements:
                improvements.append("Continue developing advanced skills")

            data["areas_to_improve"] = improvements

            return data

    raise HTTPException(
        status_code=404,
        detail="Student not found"
    )


# ---------------------------------------------------------
# ADD STUDENT
# ---------------------------------------------------------

@app.post("/students")
def add_student(student: StudentCreate):

    new_id = max(
        [s["id"] for s in students],
        default=0
    ) + 1

    new_student = student.model_dump()

    new_student["id"] = new_id

    students.append(new_student)

    return enrich_student(new_student)


# ---------------------------------------------------------
# UPDATE STUDENT
# ---------------------------------------------------------

@app.put("/students/{student_id}")
def update_student(
    student_id: int,
    updated_student: StudentUpdate
):

    for student in students:

        if student["id"] == student_id:

            changes = updated_student.model_dump(
                exclude_unset=True
            )

            student.update(changes)

            return enrich_student(student)

    raise HTTPException(
        status_code=404,
        detail="Student not found"
    )


# ---------------------------------------------------------
# DELETE STUDENT
# ---------------------------------------------------------

@app.delete("/students/{student_id}")
def delete_student(student_id: int):

    for index, student in enumerate(students):

        if student["id"] == student_id:

            deleted = students.pop(index)

            return {
                "message": "Student deleted successfully",
                "student": deleted
            }

    raise HTTPException(
        status_code=404,
        detail="Student not found"
    )


# ---------------------------------------------------------
# DASHBOARD
# ---------------------------------------------------------

@app.get("/dashboard")
def dashboard():

    data = [
        enrich_student(student)
        for student in students
    ]

    total_students = len(data)

    excellent = sum(
        1 for s in data
        if s["attendance_category"] == "Excellent"
    )

    average = sum(
        1 for s in data
        if s["attendance_category"] == "Average"
    )

    low = sum(
        1 for s in data
        if s["attendance_category"] == "Low"
    )

    high_risk = sum(
        1 for s in data
        if s["risk_level"] == "High Risk"
    )

    medium_risk = sum(
        1 for s in data
        if s["risk_level"] == "Medium Risk"
    )

    placement_ready = sum(
        1 for s in data
        if s["placement_readiness_status"] == "Placement Ready"
    )

    average_cgpa = (
        round(
            sum(s["cgpa"] for s in data) / total_students,
            2
        )
        if total_students
        else 0
    )

    average_attendance = (
        round(
            sum(
                s["attendance_percentage"]
                for s in data
            ) / total_students,
            1
        )
        if total_students
        else 0
    )

    average_career_score = (
        round(
            sum(
                s["career_score"]
                for s in data
            ) / total_students,
            1
        )
        if total_students
        else 0
    )

    return {
        "total_students": total_students,

        "excellent_attendance": excellent,
        "average_attendance": average,
        "low_attendance": low,

        "high_risk_students": high_risk,
        "medium_risk_students": medium_risk,

        "placement_ready_students": placement_ready,

        "average_cgpa": average_cgpa,
        "average_attendance_percentage": average_attendance,
        "average_career_score": average_career_score
    }


# ---------------------------------------------------------
# SMART QUERY
# ---------------------------------------------------------

@app.get("/smart-query")
def smart_query(query: str):

    q = query.lower()

    data = [
        enrich_student(student)
        for student in students
    ]

    if "low attendance" in q or "poor attendance" in q:

        result = [
            {
                "name": s["name"],
                "roll_no": s["roll_no"],
                "attendance": s["attendance_percentage"],
                "status": s["attendance_category"]
            }
            for s in data
            if s["attendance_percentage"] < 75
        ]

        return {
            "query": query,
            "answer": result
        }

    if "top students" in q or "best students" in q:

        result = sorted(
            data,
            key=lambda x: x["career_score"],
            reverse=True
        )

        return {
            "query": query,
            "answer": [
                {
                    "name": s["name"],
                    "cgpa": s["cgpa"],
                    "career_score": s["career_score"]
                }
                for s in result[:5]
            ]
        }

    if "placement ready" in q:

        result = [
            {
                "name": s["name"],
                "roll_no": s["roll_no"],
                "score": s["placement_readiness_score"],
                "status": s["placement_readiness_status"]
            }
            for s in data
            if s["placement_readiness_score"] >= 80
        ]

        return {
            "query": query,
            "answer": result
        }

    if "at risk" in q or "risk" in q:

        result = [
            {
                "name": s["name"],
                "roll_no": s["roll_no"],
                "risk": s["risk_level"],
                "reasons": s["risk_reasons"]
            }
            for s in data
            if s["risk_level"] != "Low Risk"
        ]

        return {
            "query": query,
            "answer": result
        }

    if "skill gap" in q or "missing skills" in q:

        result = [
            {
                "name": s["name"],
                "career": s["recommended_career"],
                "missing_skills": s["skill_gaps"]
            }
            for s in data
        ]

        return {
            "query": query,
            "answer": result
        }

    if "career" in q or "job" in q:

        result = [
            {
                "name": s["name"],
                "recommended_career": s["recommended_career"]
            }
            for s in data
        ]

        return {
            "query": query,
            "answer": result
        }

    if "achievement" in q:

        result = sorted(
            data,
            key=lambda x: x["achievement_count"],
            reverse=True
        )

        return {
            "query": query,
            "answer": [
                {
                    "name": s["name"],
                    "achievements": s["achievement_count"]
                }
                for s in result
            ]
        }

    return {
        "query": query,
        "answer": [],
        "message": (
            "Try asking about attendance, top students, "
            "placement readiness, at-risk students, "
            "skill gaps, careers or achievements."
        )
    }


# ---------------------------------------------------------
# AI INSIGHTS SUMMARY
# ---------------------------------------------------------

@app.get("/ai-insights")
def ai_insights():

    data = [
        enrich_student(student)
        for student in students
    ]

    return {
        "total_students": len(data),

        "at_risk": [
            s for s in data
            if s["risk_level"] != "Low Risk"
        ],

        "placement_ready": [
            s for s in data
            if s["placement_readiness_status"] == "Placement Ready"
        ],

        "career_recommendations": [
            {
                "name": s["name"],
                "career": s["recommended_career"],
                "match": s["skill_match_percentage"]
            }
            for s in data
        ],

        "performance_predictions": [
            {
                "name": s["name"],
                "current_cgpa": s["cgpa"],
                "predicted_cgpa": s["predicted_cgpa"],
                "message": s["prediction_message"]
            }
            for s in data
        ]
    }