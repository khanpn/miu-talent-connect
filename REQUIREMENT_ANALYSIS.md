# MIU Talent Connect

## Requirement Analysis

- **1. Functional Requirements**

  - **1.1 User Types**

    - **Candidates (Students)**
      - Create and manage profiles showcasing experiences, skills, projects, educations, and references.
      - Upload resumes, certifications, and portfolio links.
      - Receive notifications for job matches or employer inquiries.
    - **Employer**

      - Register and manage organizational accounts.
      - Post job openings with detailed criteria.
      - Search and filter candidate profiles based on specific skills, education, and experience.
      - Manage job postings and view applicant details.

    - **University Admins**

      - Verify and endorse student profiles.
      - Verify employer profiles.
      - Send invitation to students and employers.

    - **System Admins**

      - Mangage system settings and all user types

  - **1.2 Core Features**

    - **Profile Management**
      - Students create detailed profiles with sections for experiences, skills, projects, education, certifications, and references.
    - **Search and Filter**
      - Employers can search for candidates using criteria like skills, location, education, or certifications.
    - **Notification**
      - Notify students of new job postings.
    - **Verification and Endorsements**
      - Universities can verify student profiles and issue endorsements, increasing credibility for employers.

  - **1.3 Additional Features**

    - **Auto Import Profile**
      - Allow students to import profile data from Resume or LinkedIn.
    - **Export Profile**

      - Allow students to export profile data as resume file.

- **2. Non-Functional Requirements**

  - **2.1 Security**

    - Protect API Resources using JWT
    - Prevent modification of data from unowned users

  - **2.2 Performance**

    - Ensure fast search and filtering for jobs and candidate profiles.

  - **2.3 Reliability**

    - Provide 99.9% uptime with fallback mechanisms for critical features.

  - **2.4 Scalability**

    - The platform should handle a large number of simultaneous users, including students, employers, and universities.

  - **2.5 Usability**

    - Intuitive user interface for all stakeholders.
    - Responsive design compatible with desktop and mobile devices.

  - **2.6 Cost Efficiency**

    - Use cost-effective cloud solutions (e.g., AWS Lightsail) to keep hosting and maintenance affordable.

- **3. Technical Requirements**

  - **3.1 Front-End**

    - **Technology Stack:** React.js, React Router Dom, React Hook Form, Axios, Zustand, Sass, Material UI.
    - **Features:** Responsive design, reusable components, and smooth navigation.

  - **3.2 Back-End**

    - **Technology Stack:** Java, Spring Boot, Spring Security, Spring Data Rest, JPA, Spring AOP, Thymeleaf, HAL Explorer, Actuator, Caching (Caffeine), AWS SDK, JWT, JavaMail.
    - **Features:** REST APIs for handling user data, job postings, and notifications.

  - **3.3 Database**

    - **Data Database:** MongoDB (Atlas).
    - **Search Engine:** Atlas **Full Text Search** engine for fast and efficient candidate/job search.
      - Indexed Fields:
        - firstName
        - middleName
        - lastName
        - phoneNumber
        - email
        - jobTitle
        - summary
        - primaryTechnologies
        - skills.name
        - profileStatus

  - **3.4 Deployment**

    - **Hosting Platform:**

      - **Front-End:** AWS Amplify for simplifying build and deploy.
      - **Back-End:** AWS Lightsail for containerized deployments.

    - **CI/CD Pipelines:** GitHub Actions for automated testing and deployment.
    - **Domain and SSL:** Configure custom domain and SSL certificates for secure access.
