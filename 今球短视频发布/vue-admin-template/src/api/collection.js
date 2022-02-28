import request from '@/utils/request'


export function createCollection(parmas) {
    return request({
        url: `/cloud-news-publish/home/collection/create`,
        method: 'post',
        data:parmas
    })
}



export function CollectionList(parmas) {
    return request({
        url: `/cloud-news-publish/home/collection/list/${parmas.pageNum}/${parmas.pageSize}/${parmas.state}`,
        method: 'get',
    })
}


export function deleteCollection(collectionId) {
    return request({
        url: `/cloud-news-publish/home/collection/delete/${collectionId}`,
        method: 'delete',
    })
}

export function checkCollectionVideos(parmas) {
    return request({
        url: `/cloud-news-publish/home/collection/videos/${parmas.pageNum}/${parmas.pageSize}/${parmas.collectionId}`,
        method: 'get',
    })
}


export function addVideoCollection(parmas) {
    return request({
        url: `/cloud-news-publish/home/collection/add-video/${parmas.collectionId}?videoId=${parmas.videoId}`,
        method: 'get',
        // params:{videoId:parmas.videoId}
        // data:
    })
}


export function collectionDeleteVideo(parmas) {
    return request({
        url: `/cloud-news-publish/home/collection/delete-video/${parmas.collectionId}?videoId=${parmas.videoId}`,
        method: 'delete',
        // params:{videoId:parmas.videoId}
        // data:
    })
}