from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="AI Student Performance & Career Readiness System")

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


class Student(BaseModel):
    id: int
    name: str
    roll_no: str
    department: str
    year: str
    email: str
    cgpa: float
    classes_conducted: int
    classes_attended: int
    projects: int
    internships: int
    certifications: int
    hackathons: int
    paper_presentations: int
    awards: int
    skills: List[str]
    placement_status: str = "Not Placed"


class StudentCreate(BaseModel):
    name: str
    roll_no: str
    department: str
    year: str
    email: str
    cgpa: float
    classes_conducted: int
    classes_attended: int
    projects: int
    internships: int
    certifications: int
    hackathons: int
    paper_presentations: int
    awards: int
    skills: List[str]
    placement_status: str = "Not Placed"


students = [
    Student(
        id=1,
        name="Ananya Sharma",
        roll_no="AIDS001",
        department="AI & Data Science",
        year="3rd Year",
        email="ananya@example.com",
        cgpa=9.2,
        classes_conducted=100,
        classes_attended=94,
        projects=4,
        internships=2,
        certifications=5,
        hackathons=3,
        paper_presentations=2,
        awards=4,
        skills=["Python", "SQL", "Machine Learning", "React"],
        placement_status="Placement Ready"
    ),
    Student(
        id=2,
        name="Rahul Kumar",
        roll_no="AIDS002",
        department="AI & Data Science",
        year="3rd Year",
        email="rahul@example.com",
        cgpa=8.5,
        classes_conducted=100,
        classes_attended=79,
        projects=3,
        internships=1,
        certifications=3,
        hackathons=1,
        paper_presentations=1,
        awards=1,
        skills=["Java", "SQL", "HTML", "CSS"],
        placement_status="In Progress"
    ),
    Student(
        id=3,
        name="Priya Nair",
        roll_no="AIDS003",
        department="AI & Data Science",
        year="3rd Year",
        email="priya@example.com",
        cgpa=7.4,
        classes_conducted=100,
        classes_attended=61,
        projects=1,
        internships=0,
        certifications=1,
        hackathons=0,
        paper_presentations=0,
        awards=0,
        skills=["Python", "HTML"],
        placement_status="Needs Improvement"
    ),
    Student(
        id=4,
        name="Arjun Raj",
        roll_no="AIDS004",
        department="AI & Data Science",
        year="3rd Year",
        email="arjun@example.com",
        cgpa=8.9,
        classes_conducted=100,
        classes_attended=88,
        projects=5,
        internships=2,
        certifications=4,
        hackathons=2,
        paper_presentations=3,
        awards=3,
        skills=["Python", "Java", "Machine Learning", "SQL"],
        placement_status="Placement Ready"
    ),
]


def attendance_percentage(student):
    if student.classes_conducted == 0:
        return 0

    return round(
        (student.classes_attended / student.classes_conducted) * 100,
        2
    )


def attendance_status(percentage):
    if percentage >= 85:
        return "Excellent"
    elif percentage >= 75:
        return "Average"
    else:
        return "Low"


def calculate_career_score(student):
    score = 0

    score += min(student.cgpa * 3.33, 30)
    score += min(attendance_percentage(student) * 0.15, 15)
    score += min(student.projects * 3, 15)
    score += min(student.internships * 5, 15)
    score += min(student.certifications, 5)
    score += min(student.hackathons * 2.5, 5)
    score += min(student.paper_presentations * 2.5, 5)
    score += min(student.awards * 1.25, 5)

    return round(min(score, 100), 1)


def career_status(score):
    if score >= 80:
        return "Excellent"
    elif score >= 65:
        return "Good"
    elif score >= 50:
        return "Developing"
    else:
        return "Needs Improvement"


def student_with_analysis(student):
    attendance = attendance_percentage(student)
    score = calculate_career_score(student)

    return {
        **student.model_dump(),
        "attendance_percentage": attendance,
        "attendance_status": attendance_status(attendance),
        "career_score": score,
        "career_status": career_status(score)
    }


def generate_ai_analysis(student):
    attendance = attendance_percentage(student)
    score = calculate_career_score(student)

    strengths = []
    improvements = []
    recommendations = []

    if student.cgpa >= 8.5:
        strengths.append("Strong academic performance")
    else:
        improvements.append("Improve academic performance")

    if attendance >= 85:
        strengths.append("Excellent attendance")
    elif attendance >= 75:
        improvements.append("Maintain consistent attendance")
    else:
        improvements.append("Attendance requires immediate attention")

    if student.projects >= 3:
        strengths.append("Good project experience")
    else:
        improvements.append("Build more practical projects")

    if student.internships >= 1:
        strengths.append("Has industry internship experience")
    else:
        improvements.append("Gain internship or industry experience")

    if student.hackathons >= 1:
        strengths.append("Active participation in hackathons")
    else:
        improvements.append("Participate in hackathons and technical events")

    if student.certifications >= 3:
        strengths.append("Good certification profile")
    else:
        improvements.append("Complete relevant technical certifications")

    if student.paper_presentations >= 1:
        strengths.append("Research and presentation exposure")

    if student.awards >= 2:
        strengths.append("Strong achievement record")

    if attendance < 75:
        recommendations.append(
            "Faculty should monitor attendance and discuss attendance improvement."
        )

    if student.projects < 2:
        recommendations.append(
            "Complete at least one industry-oriented project."
        )

    if student.internships == 0:
        recommendations.append(
            "Seek an internship to gain practical industry exposure."
        )

    if student.hackathons == 0:
        recommendations.append(
            "Participate in hackathons to improve problem-solving experience."
        )

    if student.certifications < 2:
        recommendations.append(
            "Complete relevant technical certifications."
        )

    if student.cgpa < 7.5:
        recommendations.append(
            "Focus on strengthening core academic subjects."
        )

    if not recommendations:
        recommendations.append(
            "Continue building projects, technical skills and interview readiness."
        )

    if score >= 80:
        overall = (
            "The student demonstrates strong academic and career readiness."
        )
    elif score >= 65:
        overall = (
            "The student has a good foundation but has areas that can be strengthened."
        )
    elif score >= 50:
        overall = (
            "The student is developing and should focus on building a stronger career profile."
        )
    else:
        overall = (
            "The student requires focused academic and career development support."
        )

    return {
        "career_score": score,
        "career_status": career_status(score),
        "overall_assessment": overall,
        "strengths": strengths,
        "areas_to_improve": improvements,
        "recommendations": recommendations
    }


@app.get("/")
def home():
    return {
        "message": "AI Student Performance & Career Readiness System is running"
    }


@app.get("/students")
def get_students():
    return [student_with_analysis(student) for student in students]


@app.get("/students/{student_id}")
def get_student(student_id: int):
    for student in students:
        if student.id == student_id:
            return student_with_analysis(student)

    return {"error": "Student not found"}


@app.post("/students")
def add_student(student_data: StudentCreate):
    new_id = max(
        [student.id for student in students],
        default=0
    ) + 1

    student = Student(
        id=new_id,
        **student_data.model_dump()
    )

    students.append(student)

    return student_with_analysis(student)


@app.put("/students/{student_id}")
def update_student(student_id: int, student_data: StudentCreate):
    for index, student in enumerate(students):
        if student.id == student_id:

            updated_student = Student(
                id=student_id,
                **student_data.model_dump()
            )

            students[index] = updated_student

            return student_with_analysis(updated_student)

    return {"error": "Student not found"}


@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    global students

    for student in students:
        if student.id == student_id:
            deleted_name = student.name

            students = [
                student for student in students
                if student.id != student_id
            ]

            return {
                "message": f"{deleted_name} was deleted successfully."
            }

    return {"error": "Student not found"}


@app.get("/students/{student_id}/ai-analysis")
def get_ai_analysis(student_id: int):
    for student in students:
        if student.id == student_id:
            return generate_ai_analysis(student)

    return {"error": "Student not found"}


@app.get("/dashboard")
def dashboard():
    total = len(students)

    if total == 0:
        return {
            "total_students": 0,
            "average_attendance": 0,
            "average_cgpa": 0,
            "placement_ready": 0,
            "excellent_attendance": 0,
            "average_attendance_count": 0,
            "low_attendance": 0
        }

    attendance_values = [
        attendance_percentage(student)
        for student in students
    ]

    cgpa_values = [
        student.cgpa
        for student in students
    ]

    scores = [
        calculate_career_score(student)
        for student in students
    ]

    return {
        "total_students": total,
        "average_attendance": round(
            sum(attendance_values) / total,
            1
        ),
        "average_cgpa": round(
            sum(cgpa_values) / total,
            2
        ),
        "placement_ready": len(
            [score for score in scores if score >= 80]
        ),
        "excellent_attendance": len(
            [x for x in attendance_values if x >= 85]
        ),
        "average_attendance_count": len(
            [x for x in attendance_values if 75 <= x < 85]
        ),
        "low_attendance": len(
            [x for x in attendance_values if x < 75]
        )
    }


@app.get("/smart-query")
def smart_query(query: str):
    q = query.lower()

    if "low attendance" in q:
        matching = [
            student.name
            for student in students
            if attendance_percentage(student) < 75
        ]

        return {
            "query": query,
            "result": matching,
            "message": f"{len(matching)} student(s) have low attendance."
        }

    if "top" in q or "best" in q:
        sorted_students = sorted(
            students,
            key=lambda s: calculate_career_score(s),
            reverse=True
        )

        return {
            "query": query,
            "result": [
                {
                    "name": student.name,
                    "career_score": calculate_career_score(student),
                    "cgpa": student.cgpa
                }
                for student in sorted_students[:5]
            ],
            "message": "Top performing students based on career readiness."
        }

    if "placement" in q:
        matching = [
            student.name
            for student in students
            if calculate_career_score(student) >= 80
        ]

        return {
            "query": query,
            "result": matching,
            "message": f"{len(matching)} student(s) are placement ready."
        }

    if "achievement" in q:
        sorted_students = sorted(
            students,
            key=lambda s: (
                s.awards +
                s.hackathons +
                s.paper_presentations +
                s.certifications
            ),
            reverse=True
        )

        return {
            "query": query,
            "result": [
                {
                    "name": student.name,
                    "achievements": (
                        student.awards +
                        student.hackathons +
                        student.paper_presentations +
                        student.certifications
                    )
                }
                for student in sorted_students[:5]
            ],
            "message": "Students with the strongest achievement profiles."
        }

    return {
        "query": query,
        "result": [],
        "message": (
            "Try asking about low attendance, top students, "
            "placement readiness or achievements."
        )
    }