document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchAlbumNameInput = document.getElementById('search-album-name');
    const searchAlbumAuthorInput = document.getElementById('search-album-author');

    // Ensure the code runs after homePage.js has defined window.loadAlbums
    function waitForLoadAlbums() {
        if (typeof window.loadAlbums === 'function') {
            searchBtn.addEventListener('click', async () => {
                const albumName = searchAlbumNameInput.value.trim();
                const albumAuthor = searchAlbumAuthorInput.value.trim();

                let query = '';
                if (albumName) {
                    query += `?name=${encodeURIComponent(albumName)}`;
                }
                if (albumAuthor) {
                    query += query ? `&author=${encodeURIComponent(albumAuthor)}` : `?author=${encodeURIComponent(albumAuthor)}`;
                }

                await window.loadAlbums(query);
            });
        } else {
            setTimeout(waitForLoadAlbums, 100); // Retry after 100ms
        }
    }

    waitForLoadAlbums();
});
