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
      {currImage?<img style={{maxHeight: 200}} src={URL.createObjectURL(currImage)} />:<></>}
      <button onClick={openImageUpload}>
        Upload Image
      </button>
      {openUpload?<ImageUpload handleClose={handleCancel} open={openUpload} handleSave={handleSave} />:<></>}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
