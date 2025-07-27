![Coil](logo.svg)

[Android](https://www.android.com/)および[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)向けの画像読み込みライブラリです。Coilは以下の特長があります：

-   **高速**: Coilは、メモリキャッシュとディスクキャッシュ、画像のダウンサンプリング、リクエストの自動一時停止/キャンセルなど、多数の最適化を実行します。
-   **軽量**: CoilはKotlin、Coroutines、Okioにのみ依存し、GoogleのR8コードシュリンカとシームレスに連携します。
-   **使いやすい**: CoilのAPIは、Kotlinの言語機能を活用しており、シンプルで定型コードが最小限に抑えられています。
-   **モダン**: CoilはKotlinを第一に考えられており、Compose、Coroutines、Okio、OkHttp、Ktorなどのモダンなライブラリと相互運用可能です。

Coilは「**Co**routine **I**mage **L**oader」の頭字語です。

翻訳: [日本語](README-ja.md), [한국어](README-ko.md), [Русский](README-ru.md), [Svenska](README-sv.md), [Türkçe](README-tr.md), [中文](README-zh.md), [پارسی](README-fa.md)

## クイックスタート

Composeライブラリと[ネットワーキングライブラリ](https://coil-kt.github.io/coil/network/)をインポートします：

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.3.0")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.3.0")
```

画像を読み込むには、`AsyncImage`コンポーザブルを使用します：

```kotlin
AsyncImage(
    model = "https://example.com/image.jpg",
    contentDescription = null,
)
```

Coilの[完全なドキュメントはこちら](https://coil-kt.github.io/coil/getting_started/)で確認できます。

## ライセンス

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