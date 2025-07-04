### 🚇 Everis — _Advanced Analyst/Programmer_

**Everis (Now NTT Data)** **Jan 2011 – May 2012 · Madrid, Spain**

Worked as part of a SCRUM team of software developers on a large-scale project for **Metro de
Madrid** (SIAR project), a critical web-based management application designed to optimize workforce
and infrastructure operations. The platform enabled dynamic task assignment for metro employees
using business rules (JRules), and extended to manage other metro resources such as trains,
stations, medical teams, and event response.

**Key Responsibilities and Achievements:**

- **Technology Stack:** Java/J2EE, Spring MVC, JSF, Hibernate, XHTML, XML, Oracle SQL. Development
  was carried out primarily in **Eclipse IDE** with Maven-based build pipelines.
- **Architecture & Frontend Development:** Reanalyzed and redesigned parts of the MVC model;
  developed new Servlet entry points and JSF views with reusable XHTML and XML templates to support
  new features for event and resource management.
- **Rule-Based Optimization:** Integrated and configured IBM JRules (now ODM) to encode complex
  business logic for employee task distribution, improving resource efficiency and operational
  flexibility.
- **Autonomy & Ownership:** Entrusted with architecting and implementing core application modules.
  Collaborated directly with system architects and product owners to translate business goals into
  maintainable codebases.
- **Agile Process:** Practiced SCRUM rituals with 2-week sprints, sprint planning, retrospectives,
  and continuous integration via Jenkins.

**Code Quality, Linting, and SAST:**

- Enforced coding standards using **Checkstyle** integrated into the Maven lifecycle and Eclipse via
  plugins, to maintain consistent formatting and reduce code smells.
- Adopted **PMD** to catch dead code, cyclomatic complexity, and poor design decisions early in the
  development phase.
- Used **FindBugs** (with the **FindSecurityBugs** extension) to perform static application security
  checks, flagging potential vulnerabilities like unsafe deserialization, SQL injections, and
  improper input validation—particularly critical due to the sensitivity of transport infrastructure
  data.
- Periodically ran **SonarQube** for consolidated metrics on code duplication, maintainability
  index, and security hotspots, helping guide team-wide refactoring efforts.
- Implemented team-wide pre-commit checks using Ant or shell scripts on Git/SVN repositories to
  enforce baseline linting before code review.

**Environment & Tooling:**

- **Build/CI:** Maven, Jenkins, SVN (transitioning to Git).
- **Security/Static Analysis:** Checkstyle, PMD, FindBugs, FindSecurityBugs, SonarQube.
- **IDE:** Eclipse with Maven plugin, JRules Developer, Oracle SQL Developer.
- **Deployment:** EAR/WAR packaging deployed to JBoss AS.

> [!NOTE] **Skills:** #Java #SpringMVC #JSF #Hibernate #OracleSQL #XHTML #JRules #Eclipse #Maven
> #Jenkins #Checkstyle #PMD #FindBugs #FindSecurityBugs #SonarQube #StaticAnalysis #Agile #SCRUM
> #CICD #WebDevelopment CV.
