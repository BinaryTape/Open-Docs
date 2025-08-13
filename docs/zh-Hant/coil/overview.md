![Coil](logo.svg)

一個用於 [Android](https://www.android.com/) 和 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 的圖片載入函式庫。Coil 具有以下特點：

- **快速**: Coil 執行多項最佳化，包括記憶體和磁碟快取、圖片降採樣、自動暫停/取消請求等。
- **輕量**: Coil 僅依賴於 Kotlin、Coroutines 和 Okio，並與 Google 的 R8 程式碼壓縮工具無縫協作。
- **易於使用**: Coil 的 API 利用 Kotlin 的語言特性，實現簡潔性和最小化的樣板程式碼。
- **現代**: Coil 是 Kotlin 優先的函式庫，並與 Compose、Coroutines、Okio、OkHttp 和 Ktor 等現代函式庫互通。

Coil 是 **Co**routine **I**mage **L**oader 的縮寫。

翻譯版本: [日本語](README-ja.md), [한국어](README-ko.md), [Русский](README-ru.md), [Svenska](README-sv.md), [Türkçe](README-tr.md), [中文](README-zh.md), [پارسی](README-fa.md)

## 快速開始

導入 Compose 函式庫和 [網路函式庫](https://coil-kt.github.io/coil/network/)：

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

若要載入圖片，請使用 `AsyncImage` 可組合函式：

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

請在此處查看 Coil 的[完整文件](https://coil-kt.github.io/coil/getting_started/)。

## 授權條款

    Copyright 2025 Coil Contributors

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.