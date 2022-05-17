import React, { useEffect, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import {Box} from '@material-ui/core'



export type PreviewStyle = 'round' | '16:9';

export interface Props {
  handleClose: () => void;
  open: boolean;
  handleSave: (file: File) => void;
  title?: string;
  previewStyle?: PreviewStyle;
  currentImage?: string;
}

export default function ImageUpload(
  this: any,
  {
    handleClose,
    open,
    handleSave,
    title,
    previewStyle = 'round',
    currentImage,
  }: Props,
) {

  const [error, setError] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [imageSizeError, setImageSizeError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [beginCrop, setBeginCrop] = useState<any>(false);
  const [uploadImage, setUploadImage] = useState<any>();
  const previewCanvasRef = useRef<any>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<any>({
    unit: '%',
    height: previewStyle === 'round' ? 75 : 100,
    x: previewStyle === 'round' ? 25 : 0,
    y: previewStyle === 'round' ? 12.5 : 0,
  });
  const [completedCrop, setCompletedCrop] = useState<any>(null);

  const aspect = 1;
  const headerMessage = "CROP IMAGE";

  const handleCropping = () => {
    console.log('inside handleCropping()');
    if (!imageRef.current) return;
    const imageElement = imageRef.current;
    console.log('crop value below');
    console.log(crop);
    const canvas = document.createElement('canvas');
    const scaleX = imageElement.naturalWidth / imageElement.width;
    const scaleY = imageElement.naturalHeight / imageElement.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    if (ctx) {
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        imageElement,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );
    };

    const base64Image = canvas.toDataURL('image/jpeg');
    setResult(base64Image);
  };

  const onSelectFile = e => {
    console.log(
      'UPLOADED FILE --> onSelectFile() target.files[0].size: ' +
        e.target.files[0].size,
    );
    if (e.target.files && e.target.files.length > 0) {
      const fileSize = Math.round(e.target.files[0].size / 1000000);
      if (fileSize < 20) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setUploadImage(reader.result);
          // console.log('value of uploadImage: ' + reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
        setImageSizeError(null);
        setFileSelected(true);
        setBeginCrop(true);
      } else {
        setImageSizeError('IMAGE TO LARGE');
        setFileSelected(false);
        setImageFile(null);
        setBeginCrop(false);
      }
    }
  };

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      console.log('in onLoad');
      console.log('image ref natural width: ' + imageRef.current?.naturalWidth);
      console.log(
        'image ref natural height: ' + imageRef.current?.naturalHeight,
      );
      console.log('e.currentTarget width: ' + width);
      console.log('e.currentTarget height: ' + height);
      const initialCropValue = centerAspectCrop(width, height, aspect);
      setCrop(initialCropValue);
      setCompletedCrop(initialCropValue);
    }
  };

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef || !imageRef) {
      return;
    }
    handleCropping();
  }, [completedCrop]);

  useEffect(() => {
    urltoFile(result, result, 'image/jpeg').then(function (file) {
      if (file)
        console.log('file size after crop: ' + file.size);
      setImageFile(file);
    });
  }, [result]);

  const urltoFile = (fileUrl, filename, mimeType) => {
    return fetch(fileUrl)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      })
      .catch(e => console.log('Error: ', e));
  };

  const handleSubmit = () => {
    if (fileSelected && imageSizeError === null && beginCrop) {
      console.log('value of param passed to handleSave():');
      console.log(imageFile);
      handleSave(imageFile);
    } else {
      setError("IMAGE SUBMIT ERROR");
    }
  };

  useEffect(() => {
    if (open) {
      setError(null);
      setImageSizeError(null);
      setFileSelected(false);
      setImageFile(null);
    } else {
      setFileSelected(false);
    }
  }, [open]);

  return (
    <Grid>
      <Grid>
        <Typography >
          {headerMessage}
        </Typography>
      </Grid>

      {beginCrop ? (
        <Grid
          item
          container
          direction="column"
          justifyContent={'center'}
          data-testid="image-crop"
        >
          <ReactCrop
            circularCrop={previewStyle === 'round'}
            aspect={aspect}
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
          >
            <img
              src={uploadImage}
              ref={imageRef}
              onLoad={onLoad}
              alt={'crop area'}
            />
          </ReactCrop>
        </Grid>
      ) : (
        <label htmlFor="contained-button-file">
          <Grid item >
            <input
              accept=".jpg,.jpeg,.png"
              id="contained-button-file"
              data-testid="upload-input"
              multiple
              type="file"

              onChange={onSelectFile}
            />
          </Grid>
        </label>
      )}
      {
        <Typography >
          {error ?? imageSizeError ?? ' '}
        </Typography>
      }
      <Grid
        item
        container
        justifyContent={'center'}
        direction={'column'}
      >
        <Box
          mt={3}
        >
          <Button
            style={{ borderRadius: 50 }}
            variant="contained"
            id="button"
            data-testid="submit-button"
            type="submit"
            color="primary"
            {...(handleSubmit && { onClick: handleSubmit })}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            onClick={handleClose}
            data-testid="back-button"
          >
            Close
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  console.log('mediaWidth: ' + mediaWidth);
  console.log('mediaHeight: ' + mediaHeight);
  console.log('aspect: ' + aspect);

  return centerCrop(
    makeAspectCrop(
      {
        unit: 'px',
        width: mediaWidth,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}
