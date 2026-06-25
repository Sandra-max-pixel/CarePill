function login() {
    window.location.href = "dashboard.html";
}

// Dashboard data load
if (window.location.pathname.includes("dashboard.html")) {

    async function loadData() {

        try {

            const response = await fetch("http://localhost:3000/status");
            const data = await response.json();

            document.getElementById("morning").innerText = data.morning;
            document.getElementById("afternoon").innerText = data.afternoon;
            document.getElementById("night").innerText = data.night;

            document.getElementById("stock").innerText =
                data.stock + " Tablets Left";

            document.getElementById("emergency").innerText =
                data.emergency;

        } catch (error) {
            console.log(error);
        }
    }

    loadData();
    setInterval(loadData, 5000);
}