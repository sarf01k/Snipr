document.addEventListener('DOMContentLoaded', function() {
    const resetPasswordButton = document.getElementById("reset-btn");

    resetPasswordButton.addEventListener("click", resetPassword);

    async function resetPassword(e) {
        e.preventDefault();

        resetPasswordButton.innerText = "...";

        const pathSegments = window.location.pathname.split('/');
        const id = pathSegments[2];
        const token = pathSegments[3];

        const formData = new FormData(document.querySelector("form"));
        const urlEncodedData = new URLSearchParams(formData).toString();

        const request = new Request(`/reset-password/${id}/${token}`, {
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
                    window.location.href = "/login";
                }
            } else {
                const data = await response.json();
                console.log(data);
                const errorMessage = document.querySelector(".error-message");

                errorMessage.innerText = `* ${data.message}`;
                errorMessage.style.color = "red";

                setTimeout(() => {
                    errorMessage.style.color = "transparent";
                }, 3000);
            }

        } catch (error) {
            console.error(`Error:\n${error}`);
        } finally {
            resetPasswordButton.innerText = "Reset password";
        }
    }
});