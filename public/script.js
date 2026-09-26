

async function loadTeam() {

    try {

        const response = await fetch("/api/team");
        const team = await response.json();

        const container = document.getElementById("teamContainer");

        container.innerHTML = "";

        let available = 0;
        let busy = 0;
        let away = 0;

        team.forEach(member => {

            if (member.status === "Available") {
                available++;
            }

            if (member.status === "Busy") {
                busy++;
            }

            if (member.status === "Away") {
                away++;
            }

            const card = document.createElement("div");

            card.className = "member-card";

            card.innerHTML = `
                <h3>${member.name}</h3>

                <p class="role">
                    ${member.role}
                </p>

                <span class="status-badge status-${member.status}">
                    ${member.status}
                </span>

                <div class="buttons">

                    <button onclick="updateStatus(${member.id}, 'Available')">
                        Available
                    </button>

                    <button onclick="updateStatus(${member.id}, 'Busy')">
                        Busy
                    </button>

                    <button onclick="updateStatus(${member.id}, 'Away')">
                        Away
                    </button>

                </div>
            `;

            container.appendChild(card);

        });

        document.getElementById("availableCount").textContent = available;
        document.getElementById("busyCount").textContent = busy;
        document.getElementById("awayCount").textContent = away;

    }

    catch (error) {

        console.error("Error loading team:", error);

    }

}


async function updateStatus(id, status) {

    try {

        const response = await fetch(
            `/api/team/${id}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        if (!response.ok) {
            throw new Error("Status update failed");
        }

        loadTeam();

    }

    catch (error) {

        console.error("Error updating status:", error);

    }

}


loadTeam();

setInterval(loadTeam, 3000);

