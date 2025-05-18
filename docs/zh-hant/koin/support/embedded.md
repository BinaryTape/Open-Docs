---
title: "Koin Embedded"
custom_edit_url: null
---
Koin Embedded 是一個新的 Koin 專案，目標是 Android/Kotlin SDK & Library 開發人員。

此專案提出了腳本，以幫助使用不同的套件名稱重建和封裝 Koin 專案。 目的是為了 SDK & Library 開發，以避免嵌入式 Koin 版本與任何使用另一個 Koin 版本的應用程式發生衝突，這可能會造成衝突。

有任何意見或需要協助嗎？ 請聯絡 [Koin Team](mailto:koin@kotzilla.io)。

## 嵌入式版本 (Embedded Version)

以下是一個 Koin 嵌入式版本的範例：[Kotzilla Repository](https://repository.kotzilla.io/)
- 可用的套件：`embedded-koin-core`、`embedded-koin-android`
- 從 `org.koin.*` 重新定位到 `embedded.koin.*`

使用此 Maven 儲存庫設定您的 Gradle 配置：
```kotlin
maven { 'https://repository.kotzilla.io/repository/kotzilla-platform/' }
```

## 重新定位腳本 (Relocation Scripts)

這裡有一些腳本，可以幫助您為給定的套件名稱重建 Koin，從而幫助嵌入它並避免與 Koin 框架的常規使用發生衝突。

請關注 Koin [relocation scripts](https://github.com/InsertKoinIO/koin-embedded?tab=readme-ov-file) 專案以取得更多詳細資訊。
    ```