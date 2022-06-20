# Instalasi
- Node Js
- NPM

# Cara Menjalankan

``` npm install ```
``` node app.js ```

# Cara Menggunakan

URL : localhost:3000/send-message

Method : POST

key : 123aasd213aaaaaa //Gunakan key ini

## send text
```json
{
	"key": "123aasd213aaaaaa",
	"number": "0828282933",
	"message": "asdasd https://niandev.com",
	"type": "text"
}
```

## send Buttons
```json
{
	"key": "123aasd213aaaaaa",
	"number": "0828282933",
	"message": "asdasd https://niandev.com",
	"type": "button",
	"option": [
		{"id": "nada", "text":"ini button"}
	]
}
````

## Send Template Button
```json
{
	"key": "123aasd213aaaaaa",
	"message": "asdasd",
	"number": "0828282933",
	"type": "template",
	"option": [
		{"type": "url", "text":"ini button", "url":"https://niandev.com"},
		{"type": "call", "text":"hubungi kami", "number":"0828282933"}
	]
}
```

## Send List
```json
{
	"key": "123aasd213aaaaaa",
	"message": "asdasd",
	"number": "0828282933",
	"footer": "nice footer, link: https://google.com",
	"buttontext": "Judul Button",
	"title": "Amazing boldfaced list title",
	"type": "list",
	"option": [
		{
			"text":"ini button",
			"sections": [
				{
					"title": "button Title",
					"rowid": "option1",
					"description": "asdasdasd"
				},
				{
					"title": "button Title",
					"rowid": "option12",
					"description": "asdasdasd"
				}
			]
		}
	]
}
```

## Dukung Kami
Kamu dapat mendukung kami melalui [DONASI](./DONATE.md). Terima kasih.


## Fitur Selanjutnya
- [ ] Multi Session
