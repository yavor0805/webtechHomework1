const createIssueButton = document.getElementById('create-issue-button');
const newIssueForm = document.getElementById('new-issue-form');
const cancelButton = document.getElementById('cancel-button');
const issueList = document.getElementById('issue-list');

createIssueButton.addEventListener('click', () => {
  newIssueForm.style.display = 'block';
});

cancelButton.addEventListener('click', () => {
  newIssueForm.style.display = 'none';
  newIssueForm.reset();
});

newIssueForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title-input').value;
  const description = document.getElementById('description-input').value;
  const priority = document.getElementById('priority-select').value;
  const assignee = document.getElementById('assign-select').value;
  const status = document.getElementById('status-select').value;

  const issue = document.createElement('div');
  issue.classList.add('issue', priority);
  issue.innerHTML = `
    <h2 class="issue-title">${title}</h2>
    <p class="issue-assignee"><strong>Assignee:</strong> ${assignee}</p>
    <p>${description}</p>
    <p class="issue-priority"><strong>Priority:</strong> ${priority}</p>
    <p class="issue-status"><strong>Status:</strong> ${status}</p>
    <button class="delete-button">Delete</button>
  `;

  issueList.appendChild(issue);
  newIssueForm.style.display = 'none';
  newIssueForm.reset();

  const deleteButton = issue.querySelector('.delete-button');
  deleteButton.addEventListener('click', () => {
    issueList.removeChild(issue);
  });
});

const sortSelect = document.createElement('select');
sortSelect.innerHTML = `
  <option value="">Sort by:</option>
  <option value="name">Title</option>
  <option value="assignee">Assignee</option>
  <option value="priority-low-to-high">Priority (Low to High)</option>
  <option value="status-open-to-closed">Status (Open to Closed)</option>
`;
document.querySelector('header').appendChild(sortSelect);

issueList.parentNode.insertBefore(sortSelect, issueList);

const sortFunction = () => {
  const sortBy = sortSelect.value;
  const issues = Array.from(issueList.querySelectorAll('.issue'));

  if (sortBy === 'name') {
    issues.sort((a, b) => {
      const aTitle = a.querySelector('.issue-title').textContent;
      const bTitle = b.querySelector('.issue-title').textContent;

      return aTitle.localeCompare(bTitle);
    });
  } else if (sortBy === 'assignee') { 
    issues.sort((a, b) => {
      const aAssignee = a.querySelector('.issue-assignee').textContent;
      const bAssignee = b.querySelector('.issue-assignee').textContent;
      //Assignee is in the format "Assignee: John Doe" so we need to remove the first 10 characters
      const aAssigneeText = aAssignee.slice(10);
      const bAssigneeText = bAssignee.slice(10);

      return aAssigneeText.localeCompare(bAssigneeText);
    });
  } else if (sortBy === 'priority-low-to-high') {
    issues.sort((a, b) => {
      const aPriority = a.querySelector('.issue-priority').textContent;
      const bPriority = b.querySelector('.issue-priority').textContent;
      //Priority is in the format "Priority: low" so we need to remove the first 10 characters
      const aPriorityText = aPriority.slice(10);
      const bPriorityText = bPriority.slice(10);
      const priorityOrder = {low: 1, medium: 2, high: 3};

      return priorityOrder[aPriorityText] - priorityOrder[bPriorityText];
    });
  } else if (sortBy === 'status-open-to-closed') {
    issues.sort((a, b) => {
      const aStatus = a.querySelector('.issue-status').textContent;
      const bStatus = b.querySelector('.issue-status').textContent;
      //Status is in the format "Status: in-progress" so we need to remove the first 8 characters
      let aStatusText = aStatus.slice(8);
      let bStatusText = bStatus.slice(8);
      //If the status is "in-progress" we need to remove the dash to match the key in the object
      aStatusText = aStatusText.replace('-', '');
      bStatusText = bStatusText.replace('-', '');

      const statusOrder = {open: 1, inprogress: 2, closed: 3};

      return statusOrder[aStatusText] - statusOrder[bStatusText];
    });
  }

  issues.forEach(issue => {
    issueList.appendChild(issue);
  });
};

sortSelect.addEventListener('change', sortFunction);