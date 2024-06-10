document.addEventListener('DOMContentLoaded', async () => {
    const albumList = document.getElementById('album-list');
    const createAlbumBtn = document.getElementById('new-album-btn');
    const createAlbumForm = document.getElementById('create-album-form');
    const submitAlbumBtn = document.getElementById('submit-album-btn');
    const cancelAlbumBtn = document.getElementById('cancel-album-btn');
    const editAlbumForm = document.getElementById('edit-album-form');
    const submitEditAlbumBtn = document.getElementById('submit-edit-album-btn');
    const cancelEditAlbumBtn = document.getElementById('cancel-edit-album-btn');
    const authBtn = document.getElementById('auth-btn');
    const slideCount = document.getElementById('slide-count');
    const loading = document.createElement('div');
    loading.className = 'loading';
    albumList.appendChild(loading);

    const user = window.checkLogin();
    window.updateAuthButton(user);

    window.deleteAlbum = async (albumId) => {
        const token = localStorage.getItem('token');
        const confirmDelete = confirm('정말로 이 앨범을 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                const response = await fetch('/api/albums', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ album_id: albumId })
                });
                if (response.ok) {
                    alert('앨범이 삭제되었습니다.');
                    await loadAlbums();
                } else {
                    alert('앨범 삭제에 실패했습니다.');
                }
            } catch (error) {
                console.error('앨범 삭제 오류:', error);
                alert('앨범 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    window.likeAlbum = async (albumId, heartIcon) => {
        try {
            const response = await fetch('/api/albums/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ album_id: albumId })
            });
            if (response.ok) {
                const result = await response.json();
                const likesElement = document.getElementById(`album-likes-${albumId}`);
                likesElement.textContent = `Likes: ${result.likes}`;

                heartIcon.classList.add('liked');
            } else {
                alert('Failed to like the album');
            }
        } catch (error) {
            console.error('Error liking album:', error);
            alert('An error occurred while liking the album');
        }
    };

    async function loadThumbnails(album) {
        try {
            const response = await fetch(`/api/photos/${album.album_id}`);
            const photos = await response.json();
            return photos.slice(0, 4).map(photo => photo.thumb_url);
        } catch (error) {
            console.error('Error fetching thumbnails:', error);
            return [];
        }
    }

    window.loadAlbums = async (query = '') => {
        try {
            loading.style.display = 'block'; // 로딩 애니메이션 표시
            const response = await fetch(`/api/albums${query}`);
            if (!response.ok) throw new Error('Failed to fetch albums');
            const albums = await response.json();

            if (!Array.isArray(albums)) throw new Error('Albums data is not an array');

            albumList.innerHTML = '';

            for (const album of albums) {
                const thumbnails = await loadThumbnails(album);
                const albumDiv = document.createElement('div');
                albumDiv.className = 'album';
                albumDiv.id = `album-${album.album_id}`;
                albumDiv.innerHTML = `
                    <div class="album-thumbnails">
                        ${thumbnails.length > 0 ? thumbnails.map(url => `<img src="${url}" alt="thumbnail">`).join('') : '<div class="loading"></div>'}
                    </div>
                    <div class="album-info">
                        <h2>${album.name}</h2>
                        <p>${album.photo_count} photos</p>
                        <p>Created on ${new Date(album.created_at).toLocaleDateString()}</p>
                        <p>by ${album.user_name}</p>
                        <p id="album-likes-${album.album_id}">Likes: ${album.likes}</p>
                        <button class="like-album-btn" onclick="window.likeAlbum(${album.album_id}, this)"><i class="fas fa-heart heart-icon"></i></button>
                        ${album.user_id === user?.user_id ? `
                        <button class="delete-album-btn" onclick="window.deleteAlbum(${album.album_id})">&times;</button>
                        <button class="edit-album-btn" onclick="window.showEditForm(${album.album_id}, '${album.name}')">&#9998;</button>` : ''}
                    </div>
                `;
                albumDiv.onclick = (e) => {
                    if (!e.target.classList.contains('delete-album-btn') && !e.target.classList.contains('edit-album-btn') && !e.target.classList.contains('like-album-btn') && !e.target.classList.contains('heart-icon')) {
                        window.location.href = `/albumPage?albumId=${album.album_id}&owner=${album.user_id === user?.user_id}`;
                    }
                };
                albumList.appendChild(albumDiv);
            }
        } catch (error) {
            console.error('Error loading albums:', error);
        } finally {
            loading.style.display = 'none'; // 로딩 애니메이션 숨김
        }
    };

    await window.loadAlbums();

    let slideIndex = 0;
    const slides = document.querySelectorAll('.slideshow img');
    const totalSlides = slides.length;

    function showSlides() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });
        slideCount.textContent = `${slideIndex + 1} / ${totalSlides}`;
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % totalSlides;
        showSlides();
    }

    function prevSlide() {
        slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
        showSlides();
    }

    document.getElementById('next-slide').addEventListener('click', nextSlide);
    document.getElementById('prev-slide').addEventListener('click', prevSlide);

    function startSlideShow() {
        setInterval(nextSlide, 4000);
    }

    showSlides();
    startSlideShow();

    submitAlbumBtn.addEventListener('click', async () => {
        const albumName = document.getElementById('album-name').value;
        const token = localStorage.getItem('token');
        if (albumName && token) {
            try {
                const response = await fetch('/api/albums', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name: albumName })
                });
                if (response.ok) {
                    createAlbumForm.style.display = 'none';
                    document.getElementById('album-name').value = '';
                    await loadAlbums();
                } else {
                    alert('Failed to create album');
                }
            } catch (error) {
                console.error('Error creating album:', error);
                alert('An error occurred during album creation');
            }
        } else {
            alert('Album name is required');
        }
    });

    cancelAlbumBtn.addEventListener('click', () => {
        createAlbumForm.style.display = 'none';
    });

    createAlbumBtn.addEventListener('click', () => {
        const user = window.checkLogin();
        if (user) {
            createAlbumForm.style.display = 'flex';
            createAlbumForm.style.position = 'absolute';
            createAlbumForm.style.top = `${createAlbumBtn.offsetTop + createAlbumBtn.offsetHeight}px`;
            createAlbumForm.style.left = `${createAlbumBtn.offsetLeft}px`;
        } else {
            window.toggleAuthForm('login');
        }
    });

    authBtn.addEventListener('click', () => {
        if (user) {
            window.logout();
        } else {
            window.toggleAuthForm('login');
        }
    });

    window.showEditForm = (albumId, albumName) => {
        const editPopup = document.getElementById('edit-popup');
        const editAlbumNameInput = document.getElementById('popup-edit-album-name');
        const submitEditAlbumBtn = document.getElementById('popup-submit-edit-album-btn');

        editAlbumNameInput.value = albumName;
        editPopup.classList.add('active');

        submitEditAlbumBtn.onclick = async () => {
            const newAlbumName = editAlbumNameInput.value;
            const token = localStorage.getItem('token');
            if (newAlbumName && token) {
                const response = await fetch('/api/albums', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ album_id: albumId, name: newAlbumName })
                });
                if (response.ok) {
                    editPopup.classList.remove('active');
                    await loadAlbums();
                } else {
                    alert('Failed to update album');
                }
            } else {
                alert('New album name is required');
            }
        };
    };

    window.toggleEditPopup = () => {
        document.getElementById('edit-popup').classList.toggle('active');
    };

    window.updateAlbum = async (albumId) => {
        const newAlbumName = document.getElementById('edit-album-name').value;
        const token = localStorage.getItem('token');
        if (newAlbumName && token) {
            const response = await fetch('/api/albums', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ album_id: albumId, name: newAlbumName })
            });
            if (response.ok) {
                editAlbumForm.style.display = 'none';
                await loadAlbums();
            } else {
                alert('Failed to update album');
            }
        } else {
            alert('New album name is required');
        }
    };

    cancelEditAlbumBtn.addEventListener('click', () => {
        editAlbumForm.style.display = 'none';
    });
});
