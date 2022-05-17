import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import ImageUpload from './Components/ImageUpload'

function App() {
  const [currImage, setCurrImage] = useState(null);
  const [openUpload, setOpenUpload] = useState(false)


  const handleSave = (savedImage) => {
    setCurrImage(savedImage);
  }
  const handleCancel = () => {
    setOpenUpload(false);
  }
  const openImageUpload = () => {
    setOpenUpload(true)
  }
  return (
    <div style={{display: 'inline-grid'}}>
      <p>
        Hi! Need help with React Testing Library? The best way to get it is by
        forking this repo, making a reproduction of your issue (or
        showing what you're trying to do), and posting a link to it on our
        Discord chat:
      </p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://testing-library.com/discord"
      >
        testing-library.com/discord
      </a>
      {currImage?<img style={{maxHeight: 200}} src={URL.createObjectURL(currImage)} />:<></>}
      <button onClick={openImageUpload}>
        Upload Image
      </button>
      {openUpload?<ImageUpload handleClose={handleCancel} open={openUpload} handleSave={handleSave} />:<></>}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
