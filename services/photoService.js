const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { paths } = require('../config/config');
const photoRepository = require('../repositories/photoRepository');
const albumRepository = require('../repositories/albumRepository');

class PhotoService {
    async savePhoto(file, albumId) {
        const album = await albumRepository.findById(albumId);
        if (!album) {
            throw new Error("앨범이 존재하지 않습니다");
        }

        let fileName = file.originalname;
        const fileExt = path.extname(fileName);
        const baseName = path.basename(fileName, fileExt);

        // 파일 이름을 Base64로 인코딩
        const encodedBaseName = Buffer.from(baseName).toString('base64');
        fileName = await this.getNextFileName(encodedBaseName, fileExt, albumId);
        await this.saveFile(file, albumId, fileName);

        const photo = await photoRepository.create({
            original_url: `/api/uploads/original/${albumId}/${fileName}`,
            thumb_url: `/api/uploads/thumb/${albumId}/${fileName}`,
            file_name: fileName,
            file_size: file.size,
            uploaded_at: new Date(),
            album_id: albumId
        });

        return photo;
    }

    async getNextFileName(baseName, fileExt, albumId) {
        let fileName = `${baseName}${fileExt}`;
        let counter = 1;

        while (await photoRepository.findByFileNameAndAlbumId(fileName, albumId)) {
            fileName = `${baseName}_${counter}${fileExt}`;
            counter++;
        }

        return fileName;
    }

    async saveFile(file, albumId, fileName) {
        const originalPath = path.join(paths.original, `${albumId}`);
        const thumbPath = path.join(paths.thumb, `${albumId}`);

        if (!fs.existsSync(originalPath)) {
            fs.mkdirSync(originalPath, { recursive: true });
        }
        if (!fs.existsSync(thumbPath)) {
            fs.mkdirSync(thumbPath, { recursive: true });
        }

        const originalFilePath = path.join(originalPath, fileName);
        const thumbFilePath = path.join(thumbPath, fileName);

        fs.writeFileSync(originalFilePath, file.buffer);

        await sharp(file.buffer)
            .resize(300, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(thumbFilePath);
    }

    async getPhotos(album_id) {
        return await photoRepository.findAllByAlbumId(album_id);
    }

    async getPhotoDetails(photo_id) {
        return await photoRepository.findById(photo_id);
    }

    async deletePhoto(photo_id) {
        return await photoRepository.deleteById(photo_id);
    }
}

module.exports = new PhotoService();
