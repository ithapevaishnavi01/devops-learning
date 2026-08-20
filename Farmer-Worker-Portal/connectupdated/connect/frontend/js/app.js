async function postJob() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const title = document.getElementById("title").value;
    const wage = document.getElementById("wage").value;
    const location = document.getElementById("location").value;
  
    const res = await fetch("http://localhost:5000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        title,
        wage,
        location,
        status: "Open"
      })
    });
  
    const data = await res.json();
    document.getElementById("msg").innerText = data.message;
  }
  
  async function loadJobs() {
    const res = await fetch("http://localhost:5000/jobs");
    const jobs = await res.json();
  
    const div = document.getElementById("jobs");
    div.innerHTML = "";
  
    jobs.forEach(job => {
      div.innerHTML += `
        <div style="border:1px solid #ddd; padding:10px; margin:10px 0; border-radius:8px;">
          <b>${job.title}</b><br>
          ₹${job.wage} | ${job.location}
        </div>
      `;
    });
  }