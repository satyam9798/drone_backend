import { deleteImageById, fetchAllImages } from '../service/service.js';

export const getAllImages = async (req, res) => {
    const images = await fetchAllImages();

    res.json({ linked: Object.values(images?.linked), unlinked: images?.unlinked });
};

export const deleteImageController = async (req, res) => {
    try {
        const imageId = parseInt(req.params.id, 10);
        if (isNaN(imageId)) {
            return res.status(400).json({ message: 'Invalid image ID' });
        }
        await deleteImageById(imageId);

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        if (error?.message === 'image_linked') {
            res.status(500).json({ error: 'Image is linked to a product and cannot be deleted' });
        } else {
            res.status(500).json({ error: 'Failed to persist data' });
        }
    }
};
