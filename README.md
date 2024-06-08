# E-Learning Backend Application

This project is a backend application for an E-Learning platform, built using Node.js, Express.js, JWT, and RESTful API principles. The application leverages MongoDB for the database, Multer for file handling, and Nodemailer for email functionalities. It features a fully functional authentication system using cookies and JWT.

## API documentation

https://documenter.getpostman.com/view/31297722/2sA3XJnRJd

## Hosted application

to access resources add (/api/v1/resourcesName )
example : https://e-learning-backend-application.onrender.com/api/v1/courses

https://e-learning-backend-application.onrender.com

## Installation-locally

clone the project to your machine with the following command

1. git clone https://github.com/Mohamed-Ramadan1/E-Learning-Backend-Application
2. navigate to the project
3. run npm install

## Very important note to be able to run the application

the application has missing file (.env) file that contains important information without this data the project will not work

1.  in root folder create (.env) file (use the exact name =.env)
2.  add this variable to the file and add your own data
    NODE_ENV=development
    NODE_ENV=production
    PORT=3000

DATABASE= (your database)
DATABASE_PASSWORD = (your database password)

SECRET=(secret for JWT authentication encryption)
JWT_EXPIRES_IN=90d
JWT_EXPIRES_IN_LOGOUT=0s
JWT_COOKIE_EXPIRES_IN=90

cloudinary configuration
CLOUD_NAME=()
CLOUD_API_KEY=592256278369915
CLOUD_API_SECRET=gTAYBtaSemj3NhhNPo8xfIa4m7g

EMAIL_PASSWORD= ( your outlook email password )

## Features

### Courses

View Courses:

1. Non-Authenticated Users: Can view available courses.
2. Authenticated Users: Can purchase courses, enroll in courses, or apply for financial aid to access courses for free.
3. Admin Users: Can add new courses, update existing courses, delete courses, and retrieve details of all courses or a single course.

### Users

User Authentication:

1. Sign Up: Users can create an account.
2. Sign In: Users can log into their account.
3. Password Management: Users can reset their password or request a password reset email.
4. Authenticated User Management:
5. Account Management: Authenticated users can update their account information (name, email, password, photo) or delete their account.
6. Account Deactivation: Users can deactivate their accounts (deactivated accounts cannot access the system).
7. Course Enrollment: Users can view all courses they are enrolled in.
8. Email Verification: Users can verify their account via email sent to their email address.

Admin Management:

1. Special User Accounts: Admins can create special user accounts (admin/instructor).
2. User Management: Admins can retrieve user accounts, delete user accounts, view all users on the system, deactivate/reactivate user accounts, and re-verify accounts if needed.
3. Email Verification: Admins can verify user account emails.

### Enrollments

1. User Enrollments:
2. Enroll in Courses: Users can enroll in available courses.

Admin Management:

1. Manage Enrollments: Admins can view all enrollments in the application.
2. Delete Enrollments: Admins can delete any enrollment.
3. Verify Enrollments: Admins can verify enrollments to ensure they are valid.

### Reviews

1. User Reviews:
2. Create Reviews: Users can create reviews for courses they are enrolled in.
3. Update Reviews: Users can update their existing reviews.
4. Delete Reviews: Users can delete their reviews.
5. View Reviews: Users can view their own reviews and see all reviews for a specific course.

### Tasks

1. User Tasks:
2. Create Tasks: Users can create new tasks.
3. Update Tasks: Users can update their existing tasks.
4. Delete Tasks: Users can delete their tasks.
5. View Tasks: Users can view all their tasks or get details of a specific task.
6. Task Statistics: Users can view statistics about their tasks.

### Blog

Admin Management:

1. Manage Blogs: Admins can view all blogs, unpublish blogs, republish blogs, and delete blogs.
2. User Blog Management:
3. Create Blogs: Users can create new blogs.
4. Update Blogs: Users can update their existing blogs.
5. Delete Blogs: Users can delete their blogs.
6. View Blogs: Users can view all blogs and their own blogs.
7. Blog Privacy: Users can set their blogs to be private or public.

### Become Instructors

Application to Become Instructor:

1. Non-Authenticated Users: Can apply to become instructors.
2. Authenticated Users: Can apply to become instructors.
3. Admin Management:
4. View Applications: Admins can view all applications and individual applications.
5. Manage Applications: Admins can update, delete, approve, or reject applications to become instructors.

### Payment Records

User Payments:

1. Create Payment Records: Users can create payment records when they enroll in courses.

Admin Management:

2. Manage Payment Records: Admins can create, retrieve, update, and delete all payment records.

### Financial Aid Requests

User Financial Aid Requests:

1. Apply for Financial Aid: Users can apply for financial aid for courses they are not enrolled in.
2. View Request Status: Users can view the status of their financial aid requests.
3. Delete Requests: Users can delete their financial aid requests.

Admin Management:

1. View Requests: Admins can view all financial aid requests.
2. Manage Requests: Admins can update, delete, approve, or reject financial aid requests.

### Courses Notes

User Notes:

1. Create Notes: Users can take notes while watching enrolled courses.
2. Update Notes: Users can update their existing notes.
3. Delete Notes: Users can delete their notes.

### Wishlist

User Wishlist:

1. Add Courses: Users can add courses to the wishlist.

2. Delete Courses: Users can delete their courses from the wishlist.
