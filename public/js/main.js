const issuesOutput = document.querySelector('#issues');
const issuesCount = document.querySelector('#number');
const alertMessage= '<div class="alert alert-danger" role="alert">Something went wrong</div>'
const emptyUrl= '<div class="alert alert-danger" role="alert">Please add an URL</div>'
const warningMessage= '<div class="alert alert-warning" role="alert">no Issues Found</div>'
const csvMessage= '<div class="alert alert-warning" role="alert">CSV not available</div>'

// Fetch accessibility issues
const testAccessibility = async (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value;
    if (url === '') {
        alert('Please enter a URL');
        return;
    }

    try {
        setLoading()
    
        const response = await fetch(`/api/test-site?url=${url}`)
    
        if (response.status !== 200) {
            setLoading(false);
            issuesOutput.innerHTML = alertMessage;
        }
           
        const {issues } = await response.json();

        renderIssues(issues);
        setLoading(false);
         document.getElementById("clearResults").classList.remove("hideButton")
      document.getElementById("csvBtn").classList.remove("hideButton")
    } catch (error) {
        console.error(error);
    }
    
}

//Download CSV
const csvIssues = async (e) => {
  e.preventDefault()
  const url = document.querySelector('#url').value
  if (url === '') {
    issuesOutput.innerHTML = emptyUrl
  }
  else {
    const response = await fetch(`/api/test?url=${url}`)

    if (response.status !== 200) {
      setLoading(false)
      alert(csvMessage)
    } 
    else if(issues.length === 0){
      alert(csvMessage)
    }
    else {
      const { issues } = await response.json()
        const csv = issues.map(issue => {
          return `${issue.code},${issue.message},${issue.context}`
        }).join('\n')
    
        const csvBlob = new Blob([csv], { type: 'text/csv' })
        const csvUrl = URL.createObjectURL(csvBlob)
        const link = document.createElement('a')
        link.href = csvUrl
        link.download = 'Accessibility_issues_list_'+url.substring(12)+'.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)      
    }
  }
}

// Add issues to DOM
function renderIssues(issues) { 
    
    if (issues.length === 0) {
        issuesOutput.innerHTML = '<p>No accessibility issues found.</p>';
    } else {

        issues.forEach(issue => { 
            console.log(issue);
            const issueEl = `
            <div aria-label="issue" class="p-6 w-full mx-auto  rounded-lg shadow-lg my-5  bg-gray-900">
                <div class='p-2  mx-auto rounded-lg  my-2 p-3 bg-white text-gray-900'>
                <h4>${issue.message}</h4>
                </div>
                <div class='p-2  mx-auto rounded-lg  my-2 p-3 bg-white text-gray-900 whitespace-wrap'>
                <p>${escapeHTML(issue.context)}</p>
                </div>
                <div class='p-2  mx-auto rounded-lg  my-2 p-3 bg-white text-gray-900 whitespace-wrap'>
                <p>CODE: ${issue.code}</p>
                </div>
            </div>`
            issuesOutput.innerHTML += issueEl;
        });
    }
}

// Set loading state
function setLoading (isLoading = true) {
    const loader = document.querySelector('.loader');
    if (isLoading) {
        loader.style.display = 'block';
        issuesOutput.innerHTML = '';
    } else {
        loader.style.display = 'none';
    }
}

// Escape HTML
function escapeHTML(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


//Clear results
const clearResults = (e) => {
  e.preventDefault()
  issuesOutput.innerHTML = ''
  issuesCount.innerHTML = ''
  document.querySelector('#url').value = ''
}

document.querySelector('#form').addEventListener('submit', testAccessibility)
document.querySelector('#clearResults').addEventListener('click', clearResults)
document.querySelector('#csvBtn').addEventListener('click', csvIssues)