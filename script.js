let currentStep = 0;
const steps = document.querySelectorAll('.step');
const stepCircles = document.querySelectorAll('.step-circle');
const progressLines = document.querySelectorAll('.progress-line');
const progressWidth = 100; // Total width in percentage for each step

function showStep(stepIndex) {
    if (stepIndex >= steps.length || stepIndex < 0) {
        console.error("Invalid step index:", stepIndex);
        return;
    }

    steps.forEach((step, index) => {
        step.classList.toggle('active', index === stepIndex);
        stepCircles[index]?.classList.toggle('active', index === stepIndex);
    });

    // progressLines.forEach((line, index) => {
    //     line.classList.remove('filled');
    // });
}

function nextStep() {
    if (validateStep()) {
        steps[currentStep].classList.remove('active');
        currentStep++;
        steps[currentStep].classList.add('active');
        updateStepProgress();

        if (currentStep === steps.length - 1) {
            displayFormValues();
        }
    }
}

function prevStep() {
    if (currentStep > 0) {
        steps[currentStep].classList.remove('active');
        currentStep--;
        steps[currentStep].classList.add('active');
        updateStepProgress();
    }
}




function updateStepProgress() {
    stepCircles.forEach((circle, index) => {
        circle.classList.toggle('active', index <= currentStep);
    });

    progressLines.forEach((line, index) => {
        if (index < currentStep) {
            line.querySelector('.progress-line-x').style.width = "100%";
        } else {
            line.querySelector('.progress-line-x').style.width = "0%";
        }
    });
}

function displayFormValues() {
    const previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = '';

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        city: document.getElementById('city').value,
        dob: document.getElementById('dob').value,
        comments: document.getElementById('comments').value
    };

    for (const key in formData) {
        const fieldLabel = document.createElement('strong');
        const fieldValue = document.createElement('p');

        fieldLabel.textContent = capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1')) + ':';
        fieldValue.textContent = formData[key] || 'Not Provided';

        previewContainer.appendChild(fieldLabel);
        previewContainer.appendChild(fieldValue);
        previewContainer.appendChild(document.createElement('hr'));
    }
}

function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function validateStep() {
    const inputs = steps[currentStep].querySelectorAll('input, select');
    let valid = true;

    inputs.forEach(input => {
        const errorElement = document.getElementById(input.id + "-error");
        if (input.id === "email") {
            const errorFormatElement = document.getElementById(input.id + "-error-format");

            if (!input.value.trim()) {
                errorElement.style.display = "block";
                errorFormatElement.style.display = "none";
                valid = false;
                triggerShake(input);
            } else if (!input.checkValidity()) {
                errorElement.style.display = "none";
                errorFormatElement.style.display = "block";
                valid = false;
                triggerShake(input);
            } else {
                errorElement.style.display = "none";
                errorFormatElement.style.display = "none";
                input.classList.remove("shake");
            }
        } else {
            if (!input.checkValidity()) {
                errorElement.style.display = "block";
                valid = false;
                triggerShake(input);
            } else {
                errorElement.style.display = "none";
                input.classList.remove("shake");
            }
        }
    });
    return valid;
}

function triggerShake(input) {
    input.classList.remove("shake");
    void input.offsetHeight;
    input.classList.add("shake");
}

function updateFieldProgress(filledFields) {
    const currentInputs = steps[currentStep].querySelectorAll('input[required], select[required]');
    const completedFields = filledFields || Array.from(currentInputs).filter(input => input.value.trim()).length;
    const stepProgress = (completedFields / currentInputs.length) * progressWidth;

    if (progressLines[currentStep]) {
        progressLines[currentStep].querySelector('.progress-line-x').style.width = `${stepProgress}%`;
    }
}

function trackFieldChanges() {
    steps.forEach((step, index) => {
        const inputs = step.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (index === currentStep) {
                    updateFieldProgress();
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (steps.length > 0) {
        showStep(currentStep);
        trackFieldChanges();
    } else {
        console.error('No steps found on page.');
    }
});
