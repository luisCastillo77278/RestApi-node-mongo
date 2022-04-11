const form = document.querySelector('form');

const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000/api/auth'
  : 'https://rest-node-api-mongo.herokuapp.com/api/auth';

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const el of form.elements) {
    if (el.name.length > 0) formData[el.name] = el.value;
  }

  const { msg, token } = await fetch(`${url}/login`, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' },
  }).then((resp) => resp.json());

  if (msg) {
    return console.log(msg);
  }

  console.log(token);
  return localStorage.setItem('token', token);
});

// eslint-disable-next-line no-unused-vars
function handleCredentialResponse(response) {
  // google_token: ID_token
  // console.log('Token: ',response.credential);
  const body = { id_token: response.credential };
  fetch(`${url}/google`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      localStorage.setItem('token', token);
      console.log(token);
    })
    .catch(console.warn);
}
const btn = document.querySelector('#google_logout');
btn.addEventListener('click', () => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem('emailUser'), (done) => {
    localStorage.clear();
    window.location.reload();
  });
});
