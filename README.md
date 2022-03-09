# 火星图社

- github仓库：https://github.com/chenaild/mars_picture
- gitee仓库：

[TOC]

## 0. 所有步骤

1）先让大家预览下将要进行的所有步骤：

1. 创建免费服务器
2. 购买授权源码
3. 本地部署源码
4. 源码发布上线



2）**功能介绍：**

功能包含：

- 表情包、头像、壁纸的展示与下载。
- 下载时需消耗积分或观看流量主广告，为小程序带来收益。
- 可设置外卖CPS，带来分佣收益。
- 可让用户投稿和审核。
- 小程序内置管理后台界面，方便管理。

小程序界面预览如下：

![Xnip2022-03-09_22-48-55](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-48-55.jpg)

![Xnip2022-03-09_22-49-51](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-49-51.jpg)

![Xnip2022-03-09_22-50-19](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-50-19.jpg)

![Xnip2022-03-09_22-50-29](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-50-29.jpg)

![Xnip2022-03-09_22-51-09](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-51-09.jpg)

![Xnip2022-03-09_22-51-27](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-51-27.jpg)

![Xnip2022-03-09_22-51-54](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-51-54.jpg)

![Xnip2022-03-09_22-52-20](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-52-20.jpg)

小程序体验：

//待补充。。



3）**预先准备**的事情：

1. 注册好微信小程序账号，个人或企业都行。[注册链接](https://mp.weixin.qq.com/wxopen/waregister?action=step1&token=&lang=zh_CN)

然后记下“小程序ID”和“小程序密钥”，后面要用到。

![Xnip2022-03-09_19-21-34](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_19-21-34.jpg)

2. 然后，就开始吧（**不需购买域名或服务器，更不用备案**）



## 1. 创建免费服务器

**简要介绍平台**：我们使用的平台叫**DCloud**，是一个开发工具平台，它集成了阿里云和腾讯云，大家可以无感使用这些大厂的服务器。其中，阿里云的服务器是**免费**了，腾讯云需**付费**。这里，我们只演示如何使用阿里云服务器，快速上手。

1）注册DCloud平台账号：[链接](https://unicloud.dcloud.net.cn/login)

2）创建阿里云服务器：[链接](https://unicloud.dcloud.net.cn/home) 

![image-20220309183635251](https://gitee.com/chenaild/mars_picture/raw/main/static/image-20220309183635251.png)

下面的服务空间随便填，**填后不能改了**，后续的小程序将绑定到这个服务器上。

选择阿里云，点击创建后就有免费服务器了。

![Xnip2022-03-09_18-39-46](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_18-39-46.jpg)



## 2. 购买授权源码

注：这里购买的源码大部分是我二次开发的，大家也可以二次开发。

购买链接：[火星图社](https://ext.dcloud.net.cn/plugin?id=7589#detail)

![Xnip2022-03-09_18-46-12](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_18-46-12.jpg)

![Xnip2022-03-09_18-48-16](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_18-48-16.jpg)

![Xnip2022-03-09_18-49-02](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_18-49-02.jpg)

付完款后，就要开始部署了，先停在这个界面吧。

![Xnip2022-03-09_18-52-52](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_18-52-52.jpg)

## 3. 本地部署源码

购买完毕后，需要部署到本地看看效果，操作如下：

1）下载 **微信开发者工具** 软件

[稳定版工具下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)，选择一个自己的平台下载安装，安装后打开登录一下，之后先放着。

2）下载 **Hbuilderx** 软件

[HBuilderX下载](https://www.dcloud.io/hbuilderx.html)，选择一个自己的平台下载安装，安装后打开登录一下，之后先放着。

3）部署运行代码

回到刚刚的页面：

![Xnip2022-03-09_18-52-52](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_18-52-52.jpg)

点击跳过后，就点击导入到 HBuilderX：

![Xnip2022-03-09_18-53-45](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_18-53-45.jpg)

浏览器可能有弹框：

![Xnip2022-03-09_18-59-54](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_18-59-54.jpg)

跳到了 HBuilderX 了：

![Xnip2022-03-09_19-02-11](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_19-02-11.jpg)

![Xnip2022-03-09_19-04-20](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_19-04-20.jpg)

![Xnip2022-03-09_19-04-52](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_19-04-52.jpg)

![Xnip2022-03-09_19-06-19](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_19-06-19.jpg)

在下图文件中右键，初始化云数据库：

![Xnip2022-03-09_19-07-42](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_19-07-42.jpg)

初始化完成：

![Xnip2022-03-09_19-09-11](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_19-09-11.jpg)

更改配置信息：

![Xnip2022-03-09_19-25-29](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_19-25-29.jpg)

配置业务域名：

```
//request合法域名：
https://api.bspapp.com;
https://spare.maibaapp.com;

//uploadFile合法域名：
https://bsppub.oss-cn-shanghai.aliyuncs.com;

//downloadFile合法域名：
https://mmbiz.qpic.cn;
https://vkceyugu.cdn.bspapp.com;
https://elf-deco.img.maibaapp.com;
https://vcdnb.huoying666.com;
https://t1.market.xiaomi.com;
```

在小程序网页后台，在**“开发”->“开发管理”**，配置上面三种域名：

![Xnip2022-03-09_21-55-30](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_21-55-30.jpg)

Dcloud后台（即服务器上）配置小程序信息，配置上之前记下来的**小程序ID和小程序密钥**：

![Xnip2022-03-09_22-02-36](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-02-36.jpg)

![Xnip2022-03-09_22-05-02](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-05-02.jpg)

![Xnip2022-03-09_22-05-44](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-05-44.jpg)

设置**小程序开发工具**的**端口号**：

![Xnip2022-03-09_22-07-09](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-07-09.jpg)

![Xnip2022-03-09_22-07-27](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-07-27.jpg)

运行小程序：

![Xnip2022-03-09_19-10-08](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_19-10-08.jpg)

稍等一会，出效果：

![Xnip2022-03-09_21-03-52](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_21-03-52.jpg)

## 4. 源码发布上线

因为上面的代码其实是没压缩的，体积比较大不能直接发布，需要走“发行”：

在发行之前，最好先关一下小程序开发工具。

![Xnip2022-03-09_22-15-46](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-15-46.jpg)

这时，小程序开发工具又被启动了。

为了更容易通过微信的审核，在服务器后台关闭投稿（当然也可以直接在小程序上面操作关闭，后面会介绍如何开通管理员，这里先用着）：

![Xnip2022-03-09_22-21-03](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-21-03.jpg)

点击“上传”：

![Xnip2022-03-09_22-17-13](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-17-13.jpg)

![Xnip2022-03-09_22-23-06](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-23-06.jpg)

到小程序网页后台“提交审核”：

![Xnip2022-03-09_22-25-03](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-25-03.jpg)

等审核通过受到通知后，还要在这个页面再操作点击“上线”，才会**真正上线**，工作时间内一般需要1-8个小时才会有审核结果。



## 5. 更改配置

如何在小程序上直接修改配置？

先登录：

![Xnip2022-03-09_22-35-27](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-35-27.jpg)

然后到Dcloud服务器上修改自己为管理员，加上`"system": 1`：

![Xnip2022-03-09_22-37-49](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-37-49.jpg)

重新打开或编译小程序，就多了一栏：

![Xnip2022-03-09_22-40-23](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-40-23.jpg)

可以方便修改配置了（就不用总要到Dcloud服务器上改）：

![Xnip2022-03-09_22-41-18](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-41-18.jpg)

![Xnip2022-03-09_22-41-39](https://gitee.com/chenaild/mars_picture/raw/main/static/Xnip2022-03-09_22-41-39.jpg)

**注意：**更改配置之后，小程序需要重新启动，或者点重新编译，配置才在当前小程序中生效



## 6. 其他说明

1）关于源码二次开发

源码只授权了前端的代码，前端的代码可以任意更改，后端的代码被加密了不可见，但完全不影响使用，满足大部分前端改变样式和逻辑的需要。

2）其他费用

不存在的。

