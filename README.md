# react-testing-library-help

I'm currently trying to write a test to verify that the image cropped is saved for this custom ImageUpload component, 
which implements Domonic Tobias’s React Image Crop. I’ve run into an issue that when the file is uploaded to the img tag, 
the image element’s height and width are both zero, even-though src value is correct. This only occurs when the running 
the test, the values are correct when running the application.
