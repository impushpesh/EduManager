# EduManager

## Project Overview
The **EduManager** is a web-based platform designed to streamline the management of students, teachers, courses, and classes. The system provides administrators, teachers, and students with different roles and functionalities, making it easy to manage educational records and day-to-day activities.

The project follows the **RESTful API** design and leverages **Node.js**, **Express**, and **MongoDB** for backend development, with **JWT** (JSON Web Tokens) for secure authentication. **Postman** is used for API testing.

## Features

### Admin Functionality
- **Basic Features**:
  - Register, login, and logout admin users.
  - Refresh tokens and change passwords for admin users.

- **Student Management**:
  - Add and remove students by their student ID (`SID`).

- **Course Management**:
  - Add and remove courses by their course ID.

- **Teacher Management**:
  - Add and remove teachers by their teacher ID.

- **Class Management**:
  - Add and remove classes by their class ID.

- **Notice Management**:
  - Add and remove notices by their notice ID.

- **Fetching Details**:
  - Fetch student details by `SID`.
  - Fetch teacher details by teacher ID, including class and subject taught.
  - Fetch course details by course ID.
  - Fetch class details by class ID.

### Teacher Functionality
- **Basic Features**:
  - Login, logout, refresh tokens, and change passwords.

- **Student Management**:
  - Assign grades to students.
  - Mark student attendance.

- **Fetching**:
  - View notices by teacher ID.

### Student Functionality
- **Basic Features**:
  - Login, logout, refresh tokens, and change passwords.

- **Fetching**:
  - Check attendance by `SID`.
  - Check grades by `SID`.
  - Check pending fees by `SID`.
  - View notices by `SID`.

## API Endpoints

### Admin Routes
| Endpoint                               | Method | Description                                      |
|----------------------------------------|--------|--------------------------------------------------|
| `/admin/register`                      | POST   | Register a new admin.                            |
| `/admin/login`                         | POST   | Admin login.                                     |
| `/admin/logout`                        | POST   | Admin logout (requires JWT).                     |
| `/admin/refreshToken`                  | POST   | Refresh admin token.                             |
| `/admin/changePassword`                | POST   | Change admin password (requires JWT).            |
| `/admin/addStudent`                    | POST   | Add a new student.                               |
| `/admin/removeStudent/:SID`            | DELETE | Remove a student by `SID`.                       |
| `/admin/addTeacher`                    | POST   | Add a new teacher.                               |
| `/admin/removeTeacher/:teacherId`      | DELETE | Remove a teacher by `teacherId`.                 |
| `/admin/addCourse`                     | POST   | Add a new course.                                |
| `/admin/removeCourse/:courseId`        | DELETE | Remove a course by `courseId`.                   |
| `/admin/addClass`                      | POST   | Add a new class.                                 |
| `/admin/removeClass/:classId`          | DELETE | Remove a class by `classId`.                     |
| `/admin/addNotice`                     | POST   | Add a new notice.                                |
| `/admin/removeNotice/:noticeId`        | DELETE | Remove a notice by `noticeId`.                   |
| `/admin/fetch/studentDetails/:SID`     | GET    | Fetch details of a student by `SID`.             |
| `/admin/fetch/teacherDetails/:teacherId` | GET  | Fetch teacher details along with class and subject. |
| `/admin/fetch/courseDetails/:courseId` | GET    | Fetch details of a course by `courseId`.         |
| `/admin/fetch/classDetails/:classId`   | GET    | Fetch details of a class by `classId`.           |

### Teacher Routes
| Endpoint                               | Method | Description                                      |
|----------------------------------------|--------|--------------------------------------------------|
| `/teacher/login`                       | POST   | Teacher login.                                   |
| `/teacher/logout`                      | POST   | Teacher logout (requires JWT).                   |
| `/teacher/refreshToken`                | POST   | Refresh teacher token.                           |
| `/teacher/changePassword`              | POST   | Change teacher password (requires JWT).          |
| `/teacher/assignGrades`                | POST   | Assign grades to students.                       |
| `/teacher/markAttendance`              | POST   | Mark attendance for students.                    |
| `/teacher/viewNotice/:teacherId`        | GET    | View notices for the teacher by `teacherId`.     |

### Student Routes
| Endpoint                               | Method | Description                                      |
|----------------------------------------|--------|--------------------------------------------------|
| `/student/login`                       | POST   | Student login.                                   |
| `/student/logout`                      | POST   | Student logout (requires JWT).                   |
| `/student/refreshToken`                | POST   | Refresh student token.                           |
| `/student/changePassword`              | POST   | Change student password (requires JWT).          |
| `/student/checkAttendance/:SID`        | GET    | Check student attendance by `SID`.               |
| `/student/checkGrades/:SID`            | GET    | Check student grades by `SID`.                   |
| `/student/checkFees/:SID`              | GET    | Check pending fees by `SID`.                     |
| `/student/viewNotice/:SID`             | GET    | View notices for the student by `SID`.           |

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **API Testing**: Postman

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/impushpesh/EduManager.git

2. Navigate into the project directory:
   ```bash
   cd EduManager

3. Install dependencies:
   ```bash
   npm install

4. Start the development server:
   ```bash
   npm run dev

Make sure to set up your environment variables (e.g., MongoDB connection string, JWT secrets) in a .env file at the root of the project.

Sample .env file-

```bash
PORT= 8000
CORS_ORIGIN=*
MONGODB_URI= <MongoDb URI>

ACCESS_TOKEN_SECRET = <Enter token secret>
ACCESS_TOKEN_EXPIRY = <Enter expiry>

REFRESH_TOKEN_SECRET = <Enter refresh token >
REFRESH_TOKEN_EXPIRY = <Enter expiry>
```
### Developed by - Pushpesh Pant
