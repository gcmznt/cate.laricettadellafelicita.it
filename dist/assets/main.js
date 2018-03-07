/* globals ga, fetch */

function addShare () {
  const btn = document.getElementById('share')
  if ('share' in navigator) {
    ga('send', 'event', 'button', 'share', { nonInteraction: true })
    btn.style.display = 'block'
    btn.addEventListener('click', function (event) {
      event.preventDefault()
      ga('send', 'event', 'interaction', 'share')
      navigator.share({
        title: document.title,
        text: 'Ti interessa sapere quando nascerà Caterina? Tieniti informato con questo link! Le linee telefoniche dei genitori sono intasate.',
        url: 'https://cate.laricettadellafelicita.it'
      })
    })
  }
}

let lock = false
function subscribe (event) {
  if (!lock) {
    lock = true
    ga('send', 'event', 'interaction', 'subscribe')
    navigator
      .serviceWorker
      .getRegistration()
      .then(function (reg) {
        reg
          .pushManager
          .subscribe({userVisibleOnly: true})
          .then(function (sub) {
            fetch(`./new/${encodeURIComponent(sub.endpoint)}`)
            document.getElementById('subscribe').style.display = 'none'
            document.getElementById('subscribed').style.display = 'block'
          // }).catch(function (error) {
          //   console.log('Unable to subscribe user', error)
          })
      })
  }
}

const nata = document.body.classList.contains('yes')

ga(
  'send',
  'event',
  'load',
  'random',
  document.querySelector('.answer').innerText.trim(),
  { nonInteraction: true }
)

ga(
  'send',
  'event',
  'load',
  'shareApi',
  ('share' in navigator ? 'available' : 'not available'),
  { nonInteraction: true }
)

ga(
  'send',
  'event',
  'load',
  'pushApi',
  ('PushManager' in window ? 'available' : 'not available'),
  { nonInteraction: true }
)

if (!nata && 'serviceWorker' in navigator && 'PushManager' in window) {
  navigator
    .serviceWorker
    .register('./sw.js')
    .then(function (reg) {
      reg
        .pushManager
        .getSubscription()
        .then(function (sub) {
          if (!sub) {
            document.getElementById('subscribe').style.display = 'block'
            ga('send', 'event', 'button', 'subscribe', { nonInteraction: true })
          } else {
            addShare()
          }
        })
    })
} else {
  addShare()
}

document.getElementById('subscribe').addEventListener('click', subscribe)

document.getElementById('amazon').addEventListener('click', function () {
  ga('send', 'event', 'lista', 'amazon')
})

document.getElementById('prenatal').addEventListener('click', function () {
  ga('send', 'event', 'lista', 'prenatal')
})
