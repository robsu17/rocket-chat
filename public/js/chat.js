const socket = io('http://localhost:3000');
let idChatRoom = ''

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search)
  const name = urlParams.get('name')
  const email = urlParams.get('email')
  const avatar = urlParams.get('avatar')

  document.querySelector('.user_logged').innerHTML += `
    <img
      class="avatar_user_logged"
      src=${avatar}
    />
    <strong id="user_logged">${name}</strong>
  `

  socket.emit('start', {
    email,
    name,
    avatar
  })

  socket.on('new_users', data => {
    const existInDiv = document.getElementById(`users_${user._id}`)

    if (!existInDiv) {
      addUser(data)
    }
  })

  socket.emit('get_users', (users) => {
    users.map(user => {
      if (user.email !== email) {
        addUser(user)
      }
    })
  })

  socket.on('message', (data) => {
    if (data.message.roomId === idChatRoom) {
      addMessage(data)
    }
  })

  socket.on('notification', data => {
    if (data.roomId !== idChatRoom) {
      const user = document.getElementById(`user_${data.from._id}`)

      user.insertAdjacentHTML('afterbegin', `
        <div class="notification"></div>
      `)
    }
  })
}

function addMessage(data) {
  const divMessageUser = document.getElementById('message_user')
  divMessageUser.innerHTML += `
    <span class="user_name user_name_date">
      <img
        class="img_user"
        src="${data.user.avatar}"
      />
      <div class="flex gap-4">
        <strong>${data.user.name}</strong>
        <span> ${dayjs(data.message.created_at).format('DD/MM/YYYY HH:mm')}</span>
      </div>
    </span>
    <div class="messages">
      <span class="chat_message">${data.message.text}</span>
    </div>
  `
}

function addUser(user) {
  const usersList = document.getElementById('users_list')
  usersList.innerHTML += `
    <li
      class="user_name_list"
      id="user_${user._id}"
      idUser="${user._id}"
    >
      <img
        id="avatar_img"
        class="nav_avatar"
        src="${user.avatar}"
      />
      ${user.name}
    </li>
  `
}

document.getElementById('users_list').addEventListener('click', (event) => {
  const inputMessage = document.getElementById('user_message')
  inputMessage.classList.remove('hidden')

  document
    .querySelectorAll('li.user_name_list')
    .forEach((item) => item.classList.remove('user_in_focus'))

  document.getElementById('message_user').innerHTML = ''
  if (event.target && event.target.matches('li.user_name_list')) {
    const idUser = event.target.getAttribute('idUser')

    event.target.classList.add('user_in_focus')

    const notification = document.querySelector(`#user_${idUser} .notification`)
    if (notification) {
      notification.remove()
    }
  
    socket.emit('start_chat', { idUser }, (response) => {
      idChatRoom = response.room.idChatRoom

      response.messages.forEach(message => {
        const data = {
          message,
          user: message.to
        }

        addMessage(data)
      })
    })
  }
})

document.getElementById('user_message').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const message = event.target.value

    event.target.value = ''

    const data = {
      message,
      idChatRoom
    }

    socket.emit('message', data)
  }
})

onLoad()