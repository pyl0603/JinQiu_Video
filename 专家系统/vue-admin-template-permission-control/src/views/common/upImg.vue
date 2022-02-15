<template>
    <label for="file" class="upImg">
        <input type="file" id="file" @change="upImg" ref="file" accept="image/png,image/gif,image/jpg,image/jpeg,image/bmp;">
        晒图
    </label>
</template>


<script>
    // import {upLoad,getOssKey} from 'api/order';
    export default {
        name: 'upImg',
        props: {
            userKey : String,
            oss: {              // 是否上传至oss
                type: Boolean,
                default: false
            },
            quality: {          // 图片质量，1为不压缩
                type: Number,
                default: 0.4
            }
        },
        methods: {
            // 上传图片
            async upImg(ev) {
                try {
                    let  file = this.$refs.file.files[0];
                    let minFile = null;
                    // 超过 1m 的启动压缩
                    if(file.size / 1024 > 1024 && this.quality < 1 && this.quality > 0) {
                        minFile = await this.compreImg(file);
                    }
                    console.log(minFile)
                    // return;
                    // 使用阿里云
                    if(this.oss) {
                        // await this.ossUpLoad(minFile || file,file);
                    } else {
                        // 站点内上传 
                        // await this.localUpLoad(minFile || file,file);
                    } 
                    this.$refs.file.value = null;
                } catch (error) {
                    this.$refs.file.value = null;
                    alert(error);
                }
            },
            /*  
             *  oss 上传图片
             *  minFile 压缩后的文件
             *  file 源文件
             */
            // async ossUpLoad(minFile,file) {
            //     // 获取token
            //     let token = await getOssKey(this.userKey);
            //     let {datas:data} = token
            //     // 新建 oss 对象
            //     let client = new OSS.Wrapper({
            //         region: data.region,
            //         bucket: data.bucket,
            //         accessKeyId: data.AccessKeyId,
            //         accessKeySecret: data.AccessKeySecret,
            //         stsToken: data.SecurityToken,
            //         secure: true
            //     })
            //     // member_id + 时间戳 + 本来名字
            //     let name = `${data.dir}${data.member_id}_${new Date().getTime()}_${Math.random().toString(36).substr(2)}`
            //     // 分片上传
            //     let res = await client.multipartUpload(name,minFile)
            //     this.$emit('upLoad',{
            //         state: true,
            //         file_name: res.name,
            //         file_url: data.showurl + res.name
            //     })
            // },
            // 本地上传
            async localUpLoad(minFile,file) {
                upLoad(this.userKey,minFile).then(res => {
                    res.datas.state = true;
                    this.$emit('upLoad',res.datas);
                }).catch(err => {
                    this.$emit('upLoad',{state: false})
                })
            },
            // 压缩图片
            async compreImg(file) {
                let ready = await this.readFile(file);
                ready =  await this.canvasDataURL(ready);

                return this.base64toBlob(ready);
            },
            // 读取图片
            readFile(file) {
                return new Promise((resolve,reject) => {
                    let ready = new FileReader();
                    ready.readAsDataURL(file);
                    ready.onload = function() {
                        // this 指向 ready对象，获取result
                        resolve(this.result);
                    }
                })
            },
            // 创建 canvas 压缩图片
            async canvasDataURL(path) {
                let img = new Image();
                img.src = path;
                return new Promise((resolve,reject) => {
                    // 这儿 this 指向 vm,获取 img 属性请使用 img 变量
                    img.onload = () => {
                        let {width: w,height: h} = img;
                        // 生成 canvas 
                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');

                        // 生成属性节点
                        let anw = document.createAttribute('width');
                        let anh = document.createAttribute('height');
                        anw.nodeValue = w;
                        anh.nodeValue = h;
                        canvas.setAttributeNode(anw);
                        canvas.setAttributeNode(anh);

                        ctx.drawImage(img,0,0,w,h);
                        resolve(canvas.toDataURL('image/jpeg',this.quality));
                    }
                })
            },
            // base64转二进制
            base64toBlob(base64) {
                let arr = base64.split(',');
                let mime = arr[0].match(/:(.*?);/)[1];
                let bstr = atob(arr[1]);
                let n = bstr.length;
                let u8arr = new Uint8Array(n);

                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type:mime,name: 'test'});
            }
        }
    }
</script>



<style scoped>
#file{
    display: none;
}
.upImg{
    width :6rem;
    height :6rem;
    margin-right :.5rem;
    margin-bottom: .5rem;
    background :#f1f1f1 url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8BAMAAADI0sRBAAAAMFBMVEVMaXEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACbsZG/AAAAD3RSTlMAu8zu3TNViBEid2aZqkSQPn29AAABwklEQVR4XuXSsWsTYRjH8V8tIUlpg406n1EXp4CITvoqQSgo5BDBRawgZNDBLh3EoYd/QCkuLorFxcEhTi4d7FAHt/sPdBQUpLmroY3l65lcknvxff8A8UPIcM897/O7u0f/gZeM7Iay3Q0l1ZrkrstSpi/pBxPvVLQMoSrtpL7Y+PM7xr6KAog1w55GqqSRCr5tbd1TwLZyXZZkK73mVyFLuhpFlfysnVar1YZYE2twPnNjQ9IjhvqammPkglRi6FKogheGoVBH6L3vdDqRLOvZpYdNjqpLLI8FBjKJfComFbvyamKX1988+aqpILHKdwwknwrdVrlsANicdluHB3D1DBy6u2dIVqXbEDtndzmrzDMOXMmr9CJlKm0iR/f8eElese2YPcvK+L4lR/JlQg2V2HN0f0iVMwPH7G5vEvjASu4tB+7Df1qzPdHs5LPjx53niqO7zP74mBXH7KpJ85eabDiSq8s1ZW4xcH6xBfgofYfYvS2f4dxpOPRsy5wBSDbl7tbzNqSPvZuq2oO3oWfPbXa3v9yTVxsZvsijRqo1LsvjPn09hVOLjUa9/tffcTipEn6E0k2DzwlldvC4qH/YbzWtgwfOrsE9AAAAAElFTkSuQmCC') 1.5rem 1.5rem no-repeat;
    background-size: 3rem 2rem;
    text-align: center;
    color: #888;
    padding-top: 4rem;
    box-sizing: border-box;
}
</style>