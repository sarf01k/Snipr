document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById("sign-up-btn");

    signUpButton.addEventListener("click", signUp);

    async function signUp(event) {
        event.preventDefault();

        signUpButton.innerText = "Signing up...";

        const formData = new FormData(document.querySelector("form"));
        const urlEncodedData = new URLSearchParams(formData).toString();

        const request = new Request("/sign_up", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlEncodedData,
        });

        try {
            const response = await fetch(request);
            const contentType = response.headers.get('Content-Type');

            if (response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    console.log(data);
                } else {
                    console.log("No JSON response");
                    window.location.href = "/home";
                }
            } else {
                const data = await response.json();
                console.log(data);
                document.getElementById("signup-error").innerText = `* ${data.message}`;
                const errorMessage = document.querySelector(".error-message");
                errorMessage.style.color = "red";
                setTimeout(() => {
                    errorMessage.style.color = "transparent";
                }, 3000);
            }

        } catch (error) {
            console.error(`Error:\n${error}`);
        } finally {
            signUpButton.innerText = "Sign up";
        }
    }
});