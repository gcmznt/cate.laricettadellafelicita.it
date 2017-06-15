/* globals self, clients */

self.addEventListener('push', function (event) {
  // var obj = event.data.json();
  // console.log(event)

  fireNotification({}, event)
})

function fireNotification (obj, event) {
  const title = 'È nata! 🌈'
  const now = new Date()
  const today = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
  const body = `Caterina è nata! ${today}`
  const icon = 'fiocco.png'
  const tag = 'nata'

  event.waitUntil(self.registration.showNotification(title, {
    body: body,
    icon: icon,
    tag: tag
    // actions: [{
    //   action: 'click',
    //   title: '😄',
    // }],
  }))
}

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  clients.openWindow('/?notification')
}, false)
