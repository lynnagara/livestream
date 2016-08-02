+function () {
  var video
  var socket
  var recorder
  var buffer = initBuffer()

  connect()

  sendData()

  function connect () {
    var uri = 'ws://' + location.host + location.pathname
    uri = uri.substring(0, uri.lastIndexOf('/'))
    socket = new WebSocket(uri)
    socket.onopen = initVideo
    socket.onerror = handleError
    socket.onmessage = handleWebsocketMessage
    socket.onclose = handleWebsocketClose
  }

  // keep calling sendData in a loop
  function sendData () {
    window.requestAnimationFrame(sendData)
    buffer.sendData()
  }

  function handleWebsocketMessage (event) {
    var message = event.data
    if (typeof message === 'string') {
      console.log('received: ' + message)
    } else {
      console.log(message)
    }
  }

  function handleWebsocketClose (event) {
    console.log('Disconnected: ' + event.code + ' ' + event.reason)
    socket = undefined
  }

  function initVideo () {
    video = document.createElement('video')
    document.body.appendChild(video)
    video.style.width = '160px'
    video.style.height = '120px'

    // deprecated, but only care about it working in chrome
    navigator.webkitGetUserMedia(
      {video: true},
      handleStream,
      handleError
    )
  }

  function handleStream (stream) {
    video.src = window.URL.createObjectURL(stream)
    video.play()
    recorder = new MediaRecorder(stream)
    recorder.start(20) // ms timeslice = 10ms
    recorder.ondataavailable = function (blobevent) {
      if (socket) {
        buffer.add(blobevent.data)
      }
    }
    recorder.onerror = function(e){
      console.log('Error: ', e)
    }
  }

  function handleError (err) {
    console.log('An error occurred', err)
  }

  // Store data in `val` object before it gets sent to the server
  function initBuffer () {
    var val
    return {
      add: function (blob) {
        val = val ? new Blob([val, blob]) : blob
      },
      sendData: function () {
        if (val && val.size >= 8) {
          var MAX_BYTES = 4096
          var bytesToSend = val.size > MAX_BYTES ?
            MAX_BYTES :
            val.size - (val.size % 8)
          var blobToSend = val.slice(0, bytesToSend)
          val = val.slice(bytesToSend)
          socket.send(blobToSend)
        }
      }
    }
  }

}()
