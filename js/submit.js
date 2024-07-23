document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate fullName (not empty, more than 3 characters, and only alphabetic characters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (fullName.length <= 3 || !nameRegex.test(fullName)) {
        alert('Full name must be more than 3 characters and only contain alphabetic characters and spaces.');
        return;
    }

    // Validate email using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Validate message (not empty and more than 10 words)
    const wordCount = message.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount <= 10) {
        alert('Message must be more than 10 words.');
        return;
    }

    // Prepare data for the API request
    const data = {
        name: fullName,
        email: email,
        body: message
    };
    const btn = document.querySelector('[type="submit"]');
    const btn_text = btn.textContent;

    try {
        btn.disabled = true;
        btn.style.opacity = 0.5;
        btn.textContent = 'Sending...';
        const response = await fetch('https://learnspanishlikecrazy.com/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Message sent successfully!');
            this.reset();
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('A server error has occurred, please come back later.');
    } finally {
        btn.disabled = false;
        btn.style.opacity = 1;
        btn.textContent = btn_text;
    }
});
