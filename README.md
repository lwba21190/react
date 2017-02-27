## LWBShop ##

  LWBShop是仿造京东商城手机端APP做的一个android版webapp应用，包括了京东app的首页，分类，发现，购物车，我的五个页面，并实现了登录/注册，购物车功能（京东自营）。整个项目利用前端React-native框架编写，后台使用的是Node.js，mongodb，redis相关技术。主要用于个人学习目的。
  
## 主要特性 ##
- 1，使用ES6语法；
- 2，使用react-native框架,后台使用NodeJS开发服务器；
- 3，使用mongodb存储用户注册信息，以及购物车信息
- 4，私用redis，session存储登录/注册信息
- 4，高仿手机京东app

## 下载安装 ##

1. download源码

		git clone https://github.com/lwba21190/react.git

2. 编译安装

		cd LWBShop/android
		gradlew assembleRelease
		拷贝 android\app\build\outputs\apk\app-release-unaligned.apk 到手机中安装

3. 运行服务器

		cd nodejs/LWBShop
		node ./bin/www
     
 
## License ##    
     
仅限于个人学习目的
