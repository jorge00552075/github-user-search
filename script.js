'strict mode';
const htmlEl = document.documentElement;
const themeText = document.querySelector('.theme-text');
const themeIcon = document.querySelector('.theme-icon');
const themeBtn = document.querySelector('.theme-btn');
const input = document.querySelector('.search-input');
const errMessage = document.querySelector('.err-message');
const searchBtn = document.querySelector('.btn');
// LINKS
const location1 = document.querySelector('.location');
const twitter = document.querySelector('.twitter_username');
const blog = document.querySelector('.blog');
const company = document.querySelector('.company');

// TOGGLE THEME
function changeTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);

  themeText.textContent = theme === 'light' ? 'Dark' : 'Light';
  themeIcon.src =
    theme === 'light' ? './assets/icon-moon.svg' : './assets/icon-sun.svg';
  themeIcon.alt = theme === 'light' ? 'Moon icon' : 'Sun Icon';
  setGrayColor([location1, twitter, blog, company]);
}
/////////////////////////

async function getUserData(username) {
  try {
    const user = await fetch(`https://api.github.com/users/${username}`);
    if (user.ok !== true) throw new Error('😡 oops something went wrong!');
    const response = await user.json();
    const data = await response;
    setUserData(data);
  } catch (error) {
    errMessage.style.display = 'block';
    console.log(error);
  }
}

function setUserData(data) {
  document.querySelector('.avatar').src = data.avatar_url;
  document.querySelector('.profile-name').textContent = data.name ?? data.login;
  document.querySelector('.profile-login').textContent = data.login;
  document.querySelector('.profile-joined-date').textContent = getJoinedDate(
    data.created_at
  );
  document.querySelector('.profile-bio').textContent =
    data.bio ?? 'This profile has no bio';

  document.querySelector('.public-repos').textContent = data.public_repos;
  document.querySelector('.followers').textContent = data.followers;
  document.querySelector('.following').textContent = data.following;

  // LINKS
  location1.textContent = data.location ?? 'Not Available';
  twitter.textContent = data.twitter_username ?? 'Not Available';
  // prettier-ignore
  twitter.setAttribute('href', `${'https://twitter.com/'}${data.twitter_username}`);
  blog.textContent = data.blog === '' ? 'Not Available' : data.blog;
  blog.setAttribute('href', `${'https://'}${data.blog}`);
  company.textContent = data.company ?? 'Not Available';

  setGrayColor([location1, twitter, blog, company]);
}

function getJoinedDate(data) {
  const day = data.slice(8, 10);
  const month = data.slice(5, 7);
  const year = data.slice(0, 4);

  return `Joined ${day} ${month} ${year}`;
}

function setGrayColor(links) {
  if (htmlEl.getAttribute('data-theme') === 'dark') {
    links.forEach((link) => {
      link.textContent === 'Not Available'
        ? (link.style.color = '#C4C4C4')
        : (link.style.color = 'hsl(0, 0%, 100%)');
    });
  } else {
    links.forEach((link) => {
      link.textContent === 'Not Available'
        ? (link.style.color = '#C4C4C4')
        : (link.style.color = 'hsl(218, 35%, 45%)');
    });
  }
}

// INITIAL LOAD
let init = true;
if (init) {
  getUserData('octocat');
  init = false;
}

/////////////////////////

themeBtn.addEventListener('click', () => {
  htmlEl.getAttribute('data-theme') === 'light'
    ? changeTheme('dark')
    : changeTheme('light');
});

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (input.value.length === 0) {
    errMessage.style.display = 'block';
    return;
  }
  if (input.value.length > 0) errMessage.style.display = 'none';
  const username = input.value;
  getUserData(username);
  input.value = '';
});
