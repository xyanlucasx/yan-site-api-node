const setImagesUrl = (documents) => {
    const url = process.env.BUCKET_URL
    documents.forEach(document => {
        if (document.original._id) {
            document.original.fullSizeUrl = `${url}/${document.original.fullSizeUrl}`
            document.original.optimizedUrl = `${url}/${document.original.optimizedUrl}`
            document.original.thumbnailUrl = `${url}/${document.original.thumbnailUrl}`
        }

        document.images?.forEach(image => {
            if (image._id) {
                image.fullSizeUrl = `${url}/${image.fullSizeUrl}`
                image.optimizedUrl = `${url}/${image.optimizedUrl}`
                image.thumbnailUrl = `${url}/${image.thumbnailUrl}`
            }
        })

    })
    return documents
}

module.exports = {
    setImagesUrl
}