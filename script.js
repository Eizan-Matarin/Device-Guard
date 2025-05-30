// Device Guard - Plan selection logic and pricing utility

// Updated pricing table for all plans (add or update plans here)
const pricing = {
  mobile: { basic: 5, plus: 9, premium: 14, ultra: 20 },
  laptop: { basic: 7, plus: 12, premium: 18, ultra: 25 },
  pc: { basic: 6, plus: 11, premium: 16, ultra: 22 },
  console: { basic: 4, plus: 8, premium: 13, ultra: 19 },
  "Traveler Plan": { basic: 13, plus: 19, premium: 27, ultra: 35 },
  "House Plan": { basic: 18, plus: 26, premium: 36, ultra: 48 },
  "Total Plan": { basic: 22, plus: 32, premium: 45, ultra: 60 },
  "Business Plan": { basic: 30, plus: 45, premium: 60, ultra: 80 }
};

// Plan selection handler
function selectPlan(device, plan, price, event) {
  const chosen = `${device} - ${plan} ($${price}/mo)`;
  const chosenPlanInput = document.getElementById('chosen-plan');
  const selectedMsg = document.getElementById('selected-plan-message');
  if (chosenPlanInput && selectedMsg) {
    chosenPlanInput.value = chosen;
    selectedMsg.textContent = `Selected: ${chosen}`;
  }
  // Highlight selected
  document.querySelectorAll('.plan-cards li').forEach(li => li.classList.remove('selected-plan'));
  if (event && event.target) {
    event.target.classList.add('selected-plan');
  }
}

// Utility: Get price for a plan
function getPlanPrice(device, plan) {
  const dev = pricing[device];
  if (dev && dev[plan.toLowerCase()]) {
    return dev[plan.toLowerCase()];
  }
  return null;
}

// Attach event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Attach click listeners to all plan options
  document.querySelectorAll('.plan-cards li').forEach(li => {
    li.addEventListener('click', function(e) {
      // Get data attributes
      const card = li.closest('.card');
      let device = card.getAttribute('data-device');
      let plan = li.getAttribute('data-plan');
      let price = 0;

      // Normalize plan name for composed plans
      if (plan.startsWith('traveler')) plan = plan.replace('traveler-', '');
      else if (plan.startsWith('house')) plan = plan.replace('house-', '');
      else if (plan.startsWith('total')) plan = plan.replace('total-', '');
      else if (plan.startsWith('business')) plan = plan.replace('business-', '');

      // Get readable device name for composed plans
      if (device === 'traveler') device = 'Traveler Plan';
      else if (device === 'house') device = 'House Plan';
      else if (device === 'total') device = 'Total Plan';
      else if (device === 'business') device = 'Business Plan';

      // Capitalize plan name
      const planName = plan.charAt(0).toUpperCase() + plan.slice(1);

      // Get price from pricing table
      price = getPlanPrice(device, planName) || 0;

      selectPlan(device, planName, price, e);
    });
  });

  // Form submit handler
  const form = document.querySelector('.signup form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get values from inputs
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const job = document.getElementById('job').value.trim();
      const chosenPlan = document.getElementById('chosen-plan').value.trim();

      // Validate input before sending
      if (!name || !email || !job || !chosenPlan) {
        alert('❗ Please fill in all fields before submitting.');
        return;
      }

      // Package data to send
      const data = { name, email, job, chosenPlan };

      try {
        // Send data to backend
        const res = await fetch('http://localhost:3001/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        // Success feedback
        if (result.ok) {
          alert('✅ Thank you! Your information has been submitted.');
          form.reset();
          document.getElementById('chosen-plan').value = '';
          document.getElementById('selected-plan-message').textContent = '';
          document.querySelectorAll('.plan-cards li').forEach(li => li.classList.remove('selected-plan'));
        } else {
          alert('❌ Submission error: ' + result.error);
        }
      } catch (err) {
        // Network or server error
        alert('🚫 Failed to connect to server:\n' + err.message);
      }
    });
  }
});