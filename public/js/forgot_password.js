document.addEventListener('DOMContentLoaded', function() {
    const resetButton = document.getElementById("send-email-btn");

    resetButton.addEventListener("click", forgotPassword);

    async function forgotPassword(e) {
        e.preventDefault();

        resetButton.innerText = "Hold on...";

        const formData = new FormData(document.querySelector("form"));
        const urlEncodedData = new URLSearchParams(formData).toString();

        const request = new Request("/forgot-password", {
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
                    window.location.href = `/reset-password/${data.id}/${data.token}`
                }
            } else {
                const data = await response.json();
                console.log(data);
                document.getElementById("email-error").innerText = `* ${data.message}`;
                const errorMessage = document.querySelector(".error-message");
                errorMessage.style.color = "red";
                setTimeout(() => {
                    errorMessage.style.color = "transparent";
                }, 3000);
            }

        } catch (error) {
            console.error(`Error:\n${error}`);
        } finally {
            resetButton.innerText = "Reset password";
        }
    }
});