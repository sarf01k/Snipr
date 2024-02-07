document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById("log-in-btn");

    loginButton.addEventListener("click", login);

    async function login(e) {
        e.preventDefault();

        loginButton.innerText = "Logging in...";

        const formData = new FormData(document.querySelector("form"));
        const urlEncodedData = new URLSearchParams(formData).toString();

        const request = new Request("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlEncodedData,
        });

        try {
            const response = await fetch(request);
            const contentType = response.headers.get("Content-Type");

            if (response.ok) {
                if (contentType && contentType.includes("application/json")) {

                    const data = await response.json();
                    console.log(data);

                } else {
                    console.log("Non-JSON response");
                    window.location.href = "/home";
                }
            } else {
                const data = await response.json();
                console.log(data);
                document.getElementById("login-error").innerText = `* ${data.message}`;
                const errorMessage = document.querySelector(".error-message");
                errorMessage.style.color = "red";
                setTimeout(() => {
                    errorMessage.style.color = "transparent";
                }, 3000);
            }

        } catch (error) {
            console.error(`Error:\n${error}`);
        } finally {
            loginButton.innerText = "Log In";
        }
    }
});