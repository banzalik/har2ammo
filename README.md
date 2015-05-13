# har2ammo 
=============
[![Build Status][travis-img]][travis-url]
[![NPM Downloads][downloads-img]][downloads-url]

Генератор патронов из [.har](http://en.wikipedia.org/wiki/.har) файлов в [ammo.txt](https://yandextank.readthedocs.org/en/latest/tutorial.html#uri-style-uris-in-file) для [yandex-tank](https://github.com/yandex-load/yandex-tank).

## Возможности

* генерация патронов из HAR файла;
* фильтрация по домену (не генерирует патроны к внешним ресурсам);
* возможность заменять оригинальные cookies своими;
* возможность удалять все cookies;
* автоматическое тегирование патронов;
* установка собственных заголовков;
* конфигурирование с помощью `config.json` или  `config.js`.

## Описание config.json

**По умолчанию файл** `config.json` имеет следующий вид:

```json
{
    "autoTag": true,
    "host": null,
    "excludeHostRegexp": false,
    "pathFilterRegexp": false,
    "excludePathFilterRegexp": false,
    "clearCookies": false,
    "customCookies": false,
    "replaceDateInURL": false,
    "repeat": 0,
    "customHeaders": [{
		"name": "User-Agent",
        "value": "yandex-tank yandex-tank/har2ammo"
    }]
}
```
**По умолчанию файл** `config.js` имеет следующий вид:

```js
module.exports = {
    "autoTag": true,
    "host": null,
    "excludeHostRegexp": false,
    "pathFilterRegexp": false,
    "excludePathFilterRegexp": false,
    "clearCookies": false,
    "customCookies": false,
    "replaceDateInURL": false,
    "repeat": 0,
    "customHeaders": [{
		"name": "User-Agent",
        "value": "yandex-tank yandex-tank/har2ammo"
    }],
    "replaceData": {
      headers: false,
      content: false,
      cookies: false,
      every: false,
      tags: false,
      url: false
    }
};
```
где:

* `autoTag` - включить автоматическое тегирование патронов, возможные варианты - `true` | `false`. В качестве тега используется относительный путь к цели. **Важно** - все знаки «точка» в тегах по умолчанию заменяются на знак нижнее подчеркивание `_`.
* `host` - имя хоста (мишени), запросы на другие хосты в ленту не попадут, возможные варианты - строка (`youdomain.com`) или регулярное выражение, запросы на который, фильтр не будет блокировать | `false` - выключает фильтрацию | `null` - в качестве базового хоста будет использоваться домен, к которому был **первый** запрос в `har` файле;
* `excludeHostRegexp` - имя хоста (мишени), запросы на другие хосты в ленту не попадут, возможные варианты - строка (`youdomain.com`) или регулярное выражение, запросы на который, фильтр будет блокировать | `false` - выключает фильтрацию;
* `pathFilterRegexp` - регулярное выражение для фильтрации запросов по `path`, не прошедшие фильтр запросы в ленту не попадут, возможные варианты - `false` | `string`. Например, `"^\/api\/(user|config)"` - оставит только запросы, начинающиеся с `/api/user` или `/api/config`;
* `excludePathFilterRegexp` - регулярное выражение для фильтрации запросов по `path`, прошедшие фильтр запросы в ленту не попадут, возможные варианты - `false` | `string`. Например, `"^\/api\/(user|config)"` - исключит все запросы, начинающиеся с `/api/user` или `/api/config`;
* `clearCookies` - удаляет любые cookies из запросов;
* `customCookies` - позволяет использовать собственные cookies, возможные варианты - `string` | `array`. В случаи, когда передается срока - она будет использована во всех запросах. В случаи, когда используется массив - то для каждого элемента массива, будет сгенерирована своя лента и в результате они будет сшиты в конечную ленту.
* `replaceDateInURL` - позволяет заменять в запросах dateStamp на актуальный, возможные варианты - `true` | `false` | `string`. `false` - не заменяет дату, `true` заменяет на текущую, `string` - подставляет указанное значение.
* `repeat` - повторяет генерацию ленты N раз, позволяет увеличить размер ленты за счет многократного ее создания.
* `customHeaders` - массив объектов, которые заменят или добавят новые заголовки.
* `replaceData` - объект, позволяющий модифицировать патроны (добавлять, удалять или менять в нем любые данные).

## Использование

В самом простом случаи достаточно:

`har2ammo -i test.har -o ammo.txt`

Для более тонкой настройки - рекомендую воспользоваться файлом конфигурации `config.json`:

`har2ammo -c config.json -i test.har -o ammo.txt`

## Использование секции `replaceData`

**Внимание** использование секции `replaceData` возможно только в коняги файлах с расширением **`.js`**

В объекте `replaceData` используются следующие атрибуты:

* `headers` - секция правил, позволяющая модифицировать заголовки запроса
* `content` - секция правил, позволяющая модифицировать содержимое POST запроса
* `cookies` - секция правил, позволяющая модифицировать cookies
* `tag` - секция правил, позволяющая модифицировать метки патронов
* `url` - секция правил, позволяющая модифицировать URL (GET запросы) 
* `every` - секция правил, позволяющая модифицировать любую часть патрона, работает глобально, выполняется перед каждым предыдущими правилам.

Каждая из секций может принимать объект или массив объектов с настройками:
```js
‘replaceData’: {
    tags: {
        match: ‘_html’,
        data: ‘.html’
    }
}
```
или
```js
‘replaceData’: {
    tags: [{
        match: ‘_index_’,
        data: ‘INDEX-‘
    }, {
        match: ‘_post_’,
        data: ‘POST-‘
    }]
}
```

`match` - может быть строкой или regexp
`data` - может быть строкой или функцией, возвращающей строку

Конфигурирование каждой из секции возможно двумя способами.

### Способ первый
```js
‘replaceData’: {
    tags: {
        match: ‘_html’,
        data: ‘.html’
    }
}
```
В данном случаи мы ищем все совпадения в тегах по тексту `_html` и заменяем его на `.html`

Это самый простой способ заменить данные или удалить (если в атрибут data передать пустую строку).

### Способ второй
```js
‘replaceData’: {
    headers: {
        match: ‘Macintosh’,
        data: function (data, libs) {
            return ‘Windows ‘ + libs._.VERSION;
        }
    }
}
```
В данном случаи мы ищем все совпадения в заголовках по тексту `Macintosh` и заменяем  его на  `Windows 3.4.0`.

Обратите внимание на аргументы `data` и `libs`, передаваемые в функцию.
`data` - это полная строка, которая подходит под правило «match».
`libs` - это объект с библиотеками, помогающими модифицировать запросы. Какие библиотеки доступны, можно посмотреть далее в документации.

### Libs
* `libs._` - [lodash](https://lodash.com)
* `libs.chance` - [chance](http://chancejs.com) - отличная библиотека, для рандомизации данных


**Больше примеров конфигурационный файлов можно найти в папке `examplesConfigs` текущего проекта**

## Установка

Для работы `har2ammo` требуются [nodejs](http://nodejs.org/) и [npm](https://npmjs.org).

Установка:

`npm install -g har2ammo`

## Лицензия
[The MIT License (MIT)](LICENSE)



[travis-img]: https://travis-ci.org/banzalik/har2ammo.svg?branch=master
[travis-url]: https://travis-ci.org/banzalik/har2ammo
[downloads-img]: https://img.shields.io/npm/dm/har2ammo.svg
[downloads-url]: https://npmjs.org/package/har2ammo
[license-img]: https://img.shields.io/npm/l/har2ammo.svg
[license-url]: LICENSE
