# My-social

**Tác giả:** @HaTrungHieu  
**GitHub:** [motcaitenkhongtrungvoiai](https://github.com/motcaitenkhongtrungvoiai)

## MÔ TẢ

Ứng dụng mạng xã hội đơn giản được xây dựng trên nền tảng:

- Hệ điều hành: Windows 11
- Backend: Node.js v22.11.0
- Database: MongoDB v1.46.3
- để chạy trương trình vui lòng khởi tạo trong môi trường NodeJs và thông qua một hosting/ hosting ảo như live server trên visual studio code 2022

## CÀI ĐẶT

1. tải mã nguồn ```bash
   Cd server && npm install
   ```
2. thiết lập .env
``` bash
mkdir server/.env
```
- tạo một file .env rồi sau đó nhập dòng bên dưới
```
 connectionString= `database connnecting String`
  KEY_token=`your_secret_key`
  TOKEN_EXPIRES_IN=`thời gian hết token`
  KEY_refresh_token=`my_refresh_secret_key`
  REFRESH_TOKEN_EXPIRES_IN=`thời gian hết refersh token`
  HOST_URL=`cổng chạy hosting`
  MAX_IMAGE_PER_POST=1,
```
3. thiết lập API kết nối server với client

```bash
 Cd path/client/src/modules/Url_api.js
```

- sau đó sửa đổi hai function này theo cổng kết nối của bạn

```
export function URL_api(){
    return "http://localhost:3000"
}
export function wsSocket(){
    return "ws://localhost:3000"
}
```

## START

- bạn có thể thực hiện lệnh sau để chạy chương trình

```bash
Cd path/server
npm start
```

sau đó try cập vào path/public/index.html bằng Live server hoặc bất kỳ phương thức hosting nào khác để có thể truy cập giao diện web.
