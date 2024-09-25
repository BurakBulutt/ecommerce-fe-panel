import React, { useState } from 'react';
import axios from 'axios';
import { MdDelete, MdFileUpload } from 'react-icons/md';

const SingleFileUploadComponent = ({ onUploadSuccess,image }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState(image ? image : '');

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setError(null);

        if (file) {
            await handleUpload(file);
        }
    };

    const handleUpload = async (file) => {
        if (!file) {
            setError('Lütfen bir dosya seçin.');
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default'); // Cloudinary upload preset

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dwpprx3ec/image/upload', formData);
            setImageUrl(response.data.secure_url);
            onUploadSuccess(response.data.secure_url);
        } catch (err) {
            setError('Yükleme sırasında bir hata oluştu.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl('');
    };

    return (
        <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6 relative">
            {!imageUrl ? (
                <>
                    {/* Dosya yükleme input alanı */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-upload-input"
                    />

                    {/* Label ile input'u tetikleyin */}
                    <label htmlFor="file-upload-input" className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0 cursor-pointer">
                        <MdFileUpload className="text-[80px] text-brand-500 dark:text-white" />
                        <h4 className="text-xl font-bold text-brand-500 dark:text-white">
                            {uploading ? 'Yükleniyor...' : 'Upload Files'}
                        </h4>
                        <p className="mt-2 text-sm font-medium text-gray-600 py-2">
                            PNG, JPG veya GIF dosyası seçebilirsiniz.
                        </p>
                    </label>
                </>
            ) : (
                <div className="relative h-full w-full">
                    <img src={imageUrl} alt="Yüklenen" className="h-full w-full object-cover rounded-lg" />

                    {/* Sil butonu */}
                    <button
                        onClick={handleRemoveImage}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white opacity-55 p-2 rounded-full hover:opacity-100"
                    >
                        <MdDelete className="text-2xl bg-red-500" />
                    </button>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SingleFileUploadComponent;
