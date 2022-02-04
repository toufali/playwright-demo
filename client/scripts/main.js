import './components/dialog-box.js'

const form = document.querySelector('main form')
const output = form.querySelector('output')
const listView = data => `
<style>
  h3, ul{
    margin-top: 12px;
  }
</style>
<h3>KNOWN DATA BROKERS</h3>
<ul>
  ${data.brokers.map(item => `<li>${item.link}
    <button data-broker="${item.id}" data-link="${item.link}" type="button">DETAILS</button>
  </li>`).join('')}
</ul>
<h3>OTHER SEARCH RESULTS</h3>
<ul>
  ${data.others.map(item => `<li>${item.link}</li>`).join('')}
</ul>
`

const detailView = data => `
<style>
  h2, p, figure{
    color: white;
    margin-top: 12px;
  }

  h2 > span{
    font-size: 14px;
    color: gray;
  }

  a{
    color: #eed5b9;
  }
</style>
<h2>${data.name}</h2>
<small>${data.domain}</small>
<p>Lorem Ipsum info about this data broker.</p>
<p>Opt-out link: <a href="${data.optout_url}" target="_blank">${data.optout_url}</a>
<figure>
  <figcaption>Screenshot of personal data found:</figcaption>
</figure>
`

form.addEventListener('submit', handleSubmit)
output.addEventListener('click', handleOutputClick)

async function handleSubmit(e) {
  e.preventDefault()
  output.textContent = ''
  output.classList.add('loading')

  const formData = new FormData(form)
  const results = await fetch('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData)
  })
    .then(res => res.json())

  const data = {
    brokers: results.filter(item => item.id),
    others: results.filter(item => item.id === null).slice(0, 15)
  }

  output.classList.remove('loading')
  output.innerHTML = listView(data)
}

async function handleOutputClick(e) {
  if (!e.target.hasAttribute('data-broker')) return

  const dialogBox = document.createElement('dialog-box')
  const detail = document.createElement('div')
  dialogBox.append(detail)
  detail.classList.add('loading')
  document.body.append(dialogBox)

  const broker = await getBroker(e.target.dataset.broker)
  detail.classList.remove('loading')
  console.log(broker)
  detail.innerHTML = detailView(broker)

  const figure = detail.querySelector('figure')
  const img = document.createElement('img')
  figure.classList.add('loading')
  img.src = await getScreenshot(e.target.dataset.link)
  figure.classList.remove('loading')
  figure.append(img)
}

async function getBroker(id) {
  const results = await fetch(`/broker/${id}`, {
    method: 'POST'
  })
    .then(res => res.json())

  return results
}

async function getScreenshot(link) {
  const dataUrl = await fetch('/screenshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ link })
  })
    .then(res => res.json())

  return dataUrl
}
