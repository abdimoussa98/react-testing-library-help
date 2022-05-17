import React from 'react';
import ImageUpload from './index';
import userEvent from '@testing-library/user-event';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import path from 'path';
import '@testing-library/jest-dom'

declare let window: { fetch: jest.Mock };

describe('<ImageUpload />', () => {
  beforeEach(() => {
    window.fetch = jest.fn();
    const res = new Response('', {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));
  });

  it('should save when image is selected and crop not adjusted', async () => {
    let isModalOpen = true;
    const handleClose = jest.fn(() => {
      isModalOpen = false;
    });
    const handleSave = jest.fn();
    const file = new File(['101010101010'], 'file.png', {
      type: 'image/png',
    });
    const croppedFileSize = file.size; //current value is intialFileSize --> change to croppedFileSize

    render(
      <ImageUpload
        handleClose={handleClose}
        open={isModalOpen}
        handleSave={handleSave}
      />,
    );

    const fs = require('fs');
    require('jest-canvas-mock');

    const data = await fs.promises.readFile(
      path.join(__dirname, '../ImageUpload') + '/citizenchain.png',
    );
    const mockImage = new File([data.buffer], 'citizenchain.png', {
      type: 'image/png',
    });

    const uploadInput = document.getElementById('contained-button-file');

    userEvent.upload(uploadInput!!, mockImage);

    // userEvent.upload(uploadInput!!, file);

    expect(await screen.findByTestId('image-crop')).toBeInTheDocument();

    const imageElement = await screen.findByAltText('crop area');

    expect(imageElement).toHaveAttribute(
      'src',
      expect.stringContaining('data'),
    );

    fireEvent.load(imageElement);
    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });

    userEvent.click(saveButton);

    await waitFor(() => expect(handleSave).toBeCalledTimes(1));
    await waitFor(() =>
      expect(handleSave).toHaveBeenCalledWith(expect.any(File)),
    );
    expect(
      handleSave.mock.calls[handleSave.mock.calls.length - 1][0].size,
    ).toBe(croppedFileSize);
  });
});
