const mockRoadmaps = {
  "system-design": [
    {
      _id: "sd-1",
      prompt: "What is System Design?",
      response: "System design is the process of defining the architecture, modules, interfaces, and data for a system to satisfy specified requirements.",
      summary: "Introduction to System Design basics.",
      metadata: { category: "System Design", concept: "Introduction", difficulty: "Beginner", tags: ["architecture", "basics"] },
      isBookmarked: false,
      votes: 154,
      views: 1200
    },
    {
      _id: "sd-2",
      prompt: "Explain Load Balancing",
      response: "Load balancing refers to efficiently distributing incoming network traffic across a group of backend servers. It ensures high availability and reliability.",
      summary: "Distributing traffic to ensure high availability.",
      metadata: { category: "System Design", concept: "Load Balancing", difficulty: "Intermediate", tags: ["networking", "scalability"] },
      isBookmarked: false,
      votes: 342,
      views: 3100
    },
    {
      _id: "sd-3",
      prompt: "What is Caching?",
      response: "Caching is the process of storing copies of files in a cache, or temporary storage location, so that they can be accessed more quickly.",
      summary: "Speeding up reads by storing data closer to the user.",
      metadata: { category: "System Design", concept: "Caching", difficulty: "Intermediate", tags: ["performance", "memory"] },
      isBookmarked: false,
      votes: 211,
      views: 1800
    },
    {
      _id: "sd-4",
      prompt: "Database Sharding",
      response: "Sharding is a method for distributing a single database across multiple machines to improve scalability and performance.",
      summary: "Scaling databases horizontally by partitioning data.",
      metadata: { category: "System Design", concept: "Sharding", difficulty: "Advanced", tags: ["database", "scaling"] },
      isBookmarked: false,
      votes: 412,
      views: 2900
    }
  ],
  "backend": [
    {
      _id: "be-1",
      prompt: "How does the Internet work?",
      response: "The Internet is a global network of interconnected computers communicating via standardized protocols like TCP/IP.",
      summary: "Basic understanding of internet infrastructure.",
      metadata: { category: "Backend", concept: "Internet", difficulty: "Beginner", tags: ["networking"] },
      isBookmarked: false,
      votes: 89
    },
    {
      _id: "be-2",
      prompt: "What are RESTful APIs?",
      response: "REST API is an application programming interface that conforms to the constraints of REST architectural style.",
      summary: "Designing predictable and scalable APIs.",
      metadata: { category: "Backend", concept: "REST API", difficulty: "Beginner", tags: ["api", "http"] },
      isBookmarked: false,
      votes: 230
    },
    {
      _id: "be-3",
      prompt: "Relational vs NoSQL Databases",
      response: "Relational databases store data in tables with predefined schemas. NoSQL databases handle unstructured data and scale horizontally.",
      summary: "Choosing the right database for your application.",
      metadata: { category: "Backend", concept: "Databases", difficulty: "Intermediate", tags: ["sql", "nosql", "data"] },
      isBookmarked: false,
      votes: 560
    }
  ],
  "frontend": [
    {
      _id: "fe-1",
      prompt: "HTML/CSS Basics",
      response: "HTML provides the structure of a webpage, while CSS handles the presentation and layout.",
      summary: "The building blocks of the web.",
      metadata: { category: "Frontend", concept: "HTML & CSS", difficulty: "Beginner", tags: ["web", "ui"] },
      isBookmarked: false,
      votes: 110
    },
    {
      _id: "fe-2",
      prompt: "JavaScript Fundamentals",
      response: "JavaScript adds interactivity to web pages, enabling dynamic updates, event handling, and API integration.",
      summary: "Programming logic for the browser.",
      metadata: { category: "Frontend", concept: "JavaScript", difficulty: "Beginner", tags: ["js", "logic"] },
      isBookmarked: false,
      votes: 240
    },
    {
      _id: "fe-3",
      prompt: "React Components and State",
      response: "React relies on reusable components and state management to efficiently update the DOM.",
      summary: "Modern UI development with React.",
      metadata: { category: "Frontend", concept: "React", difficulty: "Intermediate", tags: ["react", "components"] },
      isBookmarked: false,
      votes: 890
    }
  ],
  "devops": [
    {
      _id: "do-1",
      prompt: "What is CI/CD?",
      response: "Continuous Integration and Continuous Deployment automates the building, testing, and deployment of applications.",
      summary: "Automating the software delivery pipeline.",
      metadata: { category: "DevOps", concept: "CI/CD", difficulty: "Intermediate", tags: ["automation", "deployment"] },
      isBookmarked: false,
      votes: 130
    },
    {
      _id: "do-2",
      prompt: "Docker and Containerization",
      response: "Docker packages applications and dependencies into standardized units called containers for consistent execution.",
      summary: "Running applications anywhere consistently.",
      metadata: { category: "DevOps", concept: "Docker", difficulty: "Intermediate", tags: ["containers", "docker"] },
      isBookmarked: false,
      votes: 299
    },
    {
      _id: "do-3",
      prompt: "Kubernetes Basics",
      response: "Kubernetes is an orchestration platform that automates deployment, scaling, and management of containerized applications.",
      summary: "Managing container clusters at scale.",
      metadata: { category: "DevOps", concept: "Kubernetes", difficulty: "Advanced", tags: ["k8s", "orchestration"] },
      isBookmarked: false,
      votes: 412
    }
  ]
};

module.exports = mockRoadmaps;
