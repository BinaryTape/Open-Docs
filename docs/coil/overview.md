![Coil](logo.svg)

一个适用于 [Android](https://www.android.com/) 和 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 的图像加载库。Coil 具有以下特点：

-   **快速**: Coil 执行多项优化，包括内存和磁盘缓存、图像下采样、自动暂停/取消请求等。
-   **轻量**: Coil 仅依赖 Kotlin、协程 (Coroutines) 和 Okio，并与 Google 的 R8 代码压缩器无缝协作。
-   **易用**: Coil 的 API 利用 Kotlin 的语言特性，实现简洁性和最少的样板代码。
-   **现代**: Coil 采用 Kotlin 优先 (Kotlin-first) 设计，并与 Compose、协程 (Coroutines)、Okio、OkHttp 和 Ktor 等现代库良好互操作。

Coil 是以下词语的首字母缩写：**Co**routine **I**mage **L**oader。

翻译版本：[日本語](README-ja.md), [한국어](README-ko.md), [Русский](README-ru.md), [Svenska](README-sv.md), [Türkçe](README-tr.md), [中文](README-zh.md), [پارسی](README-fa.md)

## 快速开始

导入 Compose 库和一个[网络库](https://coil-kt.github.io/coil/network/)：

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

要加载图像，请使用 `AsyncImage` 可组合函数：

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

查看 Coil 的[完整文档](https://coil-kt.github.io/coil/getting_started/)。

## 许可证

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