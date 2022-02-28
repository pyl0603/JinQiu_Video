import request from '@/utils/request'

/**
 * 
 * @param {*} url 
 * @param {*} data 
 */
export function upload(url,data) {
    return request({
        url: url,
        method: 'post',
        data
    })
}


/**
 * 获取token
 */
export function getOssToken(params) {
	return request({
			url: '/client-publish/tool/oss/token',
			method: 'get',
			params
	})
}


/**
 * 读取图库
 */
export function getOssImgs(day, params) {
	return request({
			url: `/client-publish/tool/oss/${day}/pictures`,
			method: 'get',
			params
	})
}
 

/**
 * 读取视频
 */
export function getOssVideos(day, params) {
	return request({
			url: `/client-publish/tool/oss/${day}/videos`,
			method: 'get',
			params
	})
}

/**
 * 获取图片列表
 */

 export function getOssImgList(params) {
	return request({
		url: '/client-publish/tool/oss/pictures',
		method: 'get',
		params
	})
}

/**
 * 获取视频列表
 */

export function getOssVideoList(params) {
	return request({
		url: '/client-publish/tool/oss/videos',
		method: 'get',
		params
	})
}

// h获取阿里云对象存储api凭证
export function getOssCertificate() {
	return request({
		url: '/cloud-oss/oss/news-publish/token',
		method: 'get',
	})
}

// 获取资源
export function getImage(nextToken) {
	return request({
		url:`/cloud-oss/oss/news-publish/${nextToken}`,
		method: 'get',
	})
}



// 发布资讯
export function uploadNews(dtoAddNews) {
	return request({
		url:`/cloud-news-publish/news/publish`,
		method: 'post',
		dtoAddNews,
		// dataType:'json'
	})
}



export function WithdrawNews(newsId) {
	return request({
		url:`/cloud-news-publish/news/withdraw/${newsId}`,
		method: 'get',
	})
}
export function FailNews(newsId) {
	return request({
		url:`/cloud-news-publish/news/check/fail/${newsId}`,
		method: 'get',
	})
}
export function KpassThroughNews(newsId) {
	return request({
		url:`/cloud-news-publish/news/check/pass/${newsId}`,
		method: 'get',
	})
}


export function getNews(newsId) {
	return request({
		url:`/cloud-news-publish/news/detail/${newsId}`,
		method: 'get',
	})
}



export function getLabel(searchText) {
	return request({
		url:`/cloud-news-publish/tags/search`,
		method: 'get',
		// searchText
		params:{searchText}
	})
}

export function recommendNews(nowNewsId) {
	return request({
		url:`/cloud-news-publish/news/rec/${nowNewsId}`,
		method: 'get',
	})
}




export function getResourceLibrary(nextToken) {
	return request({
		url:`/cloud-oss/oss/news-publish/repository/${nextToken}`,
		method: 'get',
	})
}



export function deleteNews(videoId) {
	return request({
		url:`/cloud-news-publish/home/video/delete/${videoId}`,
		method: 'delete',
	})
}