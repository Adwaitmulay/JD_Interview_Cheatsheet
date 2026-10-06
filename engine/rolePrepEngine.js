function buildRolePreparation(skill, category) {
    const tech = String(skill || "").toLowerCase();

    const backend = ["java","spring","node","python","go","c#","c++"].some(x => tech.includes(x));
    const frontend = ["react","javascript","typescript"].some(x => tech.includes(x));
    const database = ["sql","mongo"].some(x => tech.includes(x));
    const cloud = ["aws","docker","kubernetes"].some(x => tech.includes(x));

    let systemDesign = [];
    let visuals = [];

    if (backend) {
        systemDesign.push(
            "Client → API → Business Logic → Database",
            "Authentication and authorization flow",
            "REST API request/response lifecycle",
            "Caching layer",
            "Load balancer and horizontal scaling",
            "Logging and monitoring pipeline",
            "Database indexing and optimization",
            "Stateless application architecture"
        );

        visuals.push(
            {
                title: "Backend Request Flow",
                type: "flowchart",
                steps: ["Client","API","Service","Database","Response"]
            },
            {
                title: "Production Architecture",
                type: "architecture",
                steps: ["Client","Load Balancer","Application","Cache","Database","Monitoring"]
            }
        );
    }

    if (frontend) {
        systemDesign.push(
            "Browser → Frontend → API → Backend",
            "Component architecture",
            "State management and data flow",
            "API integration",
            "Frontend authentication flow",
            "Client-side caching",
            "Code splitting and performance",
            "Responsive architecture"
        );

        visuals.push(
            {
                title: "Frontend Data Flow",
                type: "flowchart",
                steps: ["User","Component","State","API","Backend","UI"]
            },
            {
                title: "Frontend Architecture",
                type: "architecture",
                steps: ["Components","State","API Layer","Backend","Database"]
            }
        );
    }

    if (database) {
        systemDesign.push(
            "Application → Database connection",
            "Database indexing",
            "Transactions and consistency",
            "Replication and backup"
        );

        visuals.push({
            title: "Database Request Flow",
            type: "flowchart",
            steps: ["Application","Query","Index","Database","Result"]
        });
    }

    if (cloud) {
        systemDesign.push(
            "Containerized deployment",
            "CI/CD pipeline",
            "Cloud load balancing",
            "Horizontal scaling",
            "Monitoring and logging"
        );

        visuals.push({
            title: "Cloud Deployment Flow",
            type: "architecture",
            steps: ["Developer","Git","CI/CD","Container","Cloud","Monitoring"]
        });
    }

    if (!systemDesign.length) {
        systemDesign = [
            `${skill} application architecture`,
            `${skill} component interaction`,
            `${skill} data flow`,
            `${skill} production deployment`,
            `${skill} performance considerations`
        ];

        visuals = [{
            title: `${skill} Interview Architecture`,
            type: "flowchart",
            steps: ["Input","Processing","Core Logic","Output"]
        }];
    }

    return {
        systemDesign: [...new Set(systemDesign)],
        visuals
    };
}

module.exports = { buildRolePreparation };
