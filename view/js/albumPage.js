document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('albumId');
    const isOwner = urlParams.get('owner') === 'true'; // URL에서 owner 정보 가져오기
    const photoList = document.getElementById('photo-list');
    const uploadForm = document.getElementById('upload-popup'); // 팝업 엘리먼트로 변경
    const uploadPhotoBtn = document.getElementById('upload-photo-btn');
    const loading = document.getElementById('loading');
    const photoPopup = document.getElementById('photo-popup');
    const overlay = document.getElementById('overlay');
    const popupPhoto = document.getElementById('popup-photo');
    const popupFileName = document.getElementById('popup-file-name');
    const popupUploadDate = document.getElementById('popup-upload-date');
    const popupFileSize = document.getElementById('popup-file-size');

    const user = window.checkLogin();

    async function loadPhotos() {
        try {
            loading.style.display = 'block'; // 로딩 애니메이션 표시
            const response = await fetch(`/api/photos/${albumId}`);
            const photos = await response.json();

            photoList.innerHTML = '';
            photos.reverse().forEach(photo => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo';
                photoDiv.innerHTML = `
                    <img src="${photo.original_url}" alt="${photo.file_name}">
                    <button class="download-icon" onclick="downloadPhoto(${photo.photo_id})">&#x1F4E5;</button>
                `;
                photoDiv.querySelector('img').addEventListener('click', () => {
                    showPhotoDetails(photo.photo_id, photo.original_url, photo.file_name, photo.uploaded_at, photo.file_size);
                });
                photoList.appendChild(photoDiv);
            });
        } catch (error) {
            console.error('Error fetching photos:', error);
            alert('An error occurred while loading photos');
        } finally {
            loading.style.display = 'none'; // 로딩 애니메이션 숨김
        }
    }

    if (isOwner) {
        uploadPhotoBtn.style.display = 'block'; // 앨범 주인인 경우 업로드 버튼 표시
    }

    await loadPhotos();

    window.toggleUploadForm = () => {
        if (!user) {
            alert('You need to log in to upload photos.');
            return;
        }
        uploadForm.classList.toggle('active'); // 팝업 활성화/비활성화
    };

    window.submitPhoto = async () => {
        const fileInput = document.getElementById('photo-input');
        const files = fileInput.files;
        const token = localStorage.getItem('token');
        if (files.length > 0 && token) {
            const formData = new FormData();
            for (let file of files) {
                formData.append('photos', file);
            }

            try {
                const response = await fetch(`/api/photos/${albumId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    uploadForm.classList.remove('active'); // 업로드 완료 후 팝업 닫기
                    fileInput.value = '';
                    await loadPhotos(); // 업로드 후 사진 목록 다시 로드
                } else {
                    alert('Failed to upload photos');
                }
            } catch (error) {
                console.error('Error uploading photos:', error);
                alert('An error occurred while uploading photos');
            }
        } else {
            alert('No files selected');
        }
    };

    window.downloadPhoto = (photoId) => {
        window.location.href = `/api/photos/download/${photoId}`;
    };

    window.togglePhotoPopup = () => {
        photoPopup.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    function showPhotoDetails(photoId, photoUrl, fileName, uploadedAt, fileSize) {
        popupPhoto.src = photoUrl;
        popupFileName.innerText = `File Name: ${fileName}`;
        popupUploadDate.innerText = `Upload Date: ${new Date(uploadedAt).toLocaleDateString()}`;
        popupFileSize.innerText = `File Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`; // 파일 사이즈를 MB로 계산
        togglePhotoPopup();
    }
});
