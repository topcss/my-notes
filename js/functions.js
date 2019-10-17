const video = document.getElementById('video')
const downloadBtn = document.getElementById('download')
const recordBtn = document.getElementById('record')
const stopBtn = document.getElementById('stop')
const streamBtn = document.getElementById('stream')
const streamDiv = document.getElementById('streamDiv')
let captureStream
let recorder

if(window.location.hash){
  recordBtn.style = 'display: none'
  stopBtn.style = 'display: none'
  streamBtn.style = 'display: none'
  downloadBtn.style = 'display: none'
  stream(window.location.hash.slice(1))  
}

async function record() {
  try{
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      cursor: 'always'
    })
  }catch(e){
    alert('Could not get stream')
    return
  }

  downloadBtn.disabled = true
  recordBtn.style = 'display: none'
  stopBtn.style = 'display: inline'
  streamBtn.style = 'display: inline'

  window.URL.revokeObjectURL(video.src)

  video.autoplay = true
  video.srcObject = captureStream

  recorder = new MediaRecorder(captureStream)
  recorder.start()

  captureStream.getVideoTracks()[0].onended = () => {
    recorder.stop()
  }

  recorder.addEventListener('dataavailable', event => {
    let videoUrl = URL.createObjectURL(event.data, {type: 'video/ogg'})

    video.srcObject = null
    video.src = videoUrl
    video.autoplay = false

    downloadBtn.disabled = false
    recordBtn.style = 'display: inline'
    stopBtn.style = 'display: none'
    streamBtn.style = 'display: none'
    streamDiv.style = 'display: none'
  })
}

function download(){
  const url = video.src
  const name = new Date().toISOString().slice(0, 19).replace('T',' ').replace(' ','_').replace(/:/g,'-')
  const a = document.createElement('a')

  a.style = 'display: none'
  a.download = `${name}.ogg`
  a.href = url

  document.body.appendChild(a)

  a.click()
}

function stop(){
  let tracks = video.srcObject.getTracks()
  tracks.forEach(track => track.stop())
  recorder.stop()
}
 