async function sendEmailToUser(forUserID, subject, content){
  const request = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ forUserID, subject, content })
  }
  const response = await fetch('/send-email-to-user', request)
    .then(res => res.json())
    .then((data) => {
      if (data) {
        console.log(data)
      }
    })
    .catch(e => console.log(e))
}

module.exports = { sendEmailToUser }
