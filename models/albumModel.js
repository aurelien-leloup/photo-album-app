const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

// Initialize data file
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

class AlbumModel {
    static getAllAlbums() {
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    }

    static getAlbumById(id) {
        const albums = this.getAllAlbums();
        return albums.find(album => album.id === id);
    }

    static createAlbum(album) {
        const albums = this.getAllAlbums();
        albums.push({ ...album, id: Date.now() });
        fs.writeFileSync(DATA_FILE, JSON.stringify(albums));
    }

    static updateAlbum(id, newAlbum) {
        const albums = this.getAllAlbums();
        const index = albums.findIndex(album => album.id === id);
        if (index !== -1) {
            albums[index] = { ...albums[index], ...newAlbum };
            fs.writeFileSync(DATA_FILE, JSON.stringify(albums));
        }
    }

    static deleteAlbum(id) {
        const albums = this.getAllAlbums();
        const filteredAlbums = albums.filter(album => album.id !== id);
        fs.writeFileSync(DATA_FILE, JSON.stringify(filteredAlbums));
    }

    static addPhotoToAlbum(albumId, photo) {
        let data = this.getAllAlbums();
        const album = this.getAlbumById(albumId);
        if (album) {

            if (!album.photos) {
                album.photos = [];
            }

            album.photos.push({ ...photo, id: Date.now(), albumId });
            data = data.map(a => a.id === albumId ? album : a);
            fs.writeFileSync(DATA_FILE, JSON.stringify(data));
            return true;
        }
        return false;
    }

    static getPhotosByAlbumId(albumId) {
        const album = this.getAlbumById(albumId);
        return album ? album.photos : [];
    }

    static deletePhoto(photoId) {
        const data = this.getAllAlbums();
        const album = data.find(album => album.photos.some(photo => photo.id === photoId));
        if (album) {
            album.photos = album.photos.filter(photo => photo.id !== photoId);
            fs.writeFileSync(DATA_FILE, JSON.stringify(data));
            return true;
        }
        return false;
    }
}

module.exports = AlbumModel;
