---
title: Koin 嵌入式版本
custom_edit_url: null
---

「Koin 嵌入式版本」是一個全新的 Koin 專案，專為 Android/Kotlin SDK 與函式庫開發者設計。

此專案提供了指令稿，協助使用不同的套件名稱來重新建置及打包 Koin 專案。其目的是為了 SDK 與函式庫的開發，以避免嵌入式 Koin 版本與任何使用 Koin 的應用程式之間發生衝突，因為該應用程式可能使用了不同版本的 Koin。

需要回饋或協助嗎？請聯絡 [Koin 團隊](mailto:koin@kotzilla.io)。

## 嵌入式版本

以下是 Koin 嵌入式版本的一個範例：[Kotzilla 儲存庫](https://repository.kotzilla.io/#browse/browse:Koin-Embedded)
- 可用的套件：`embedded-koin-core`、`embedded-koin-android`
- 從 `org.koin.*` 重新定位到 `embedded.koin.*`

在您的 Gradle 設定中加入此 Maven 儲存庫：
```kotlin
maven { 'https://repository.kotzilla.io/repository/kotzilla-platform/' }
```

## 重新定位指令稿

以下是一些指令稿，可協助您以指定的套件名稱重新建置 Koin，進而將其嵌入並避免與 Koin 框架的常規使用發生衝突。

請參考 Koin [重新定位指令稿](https://github.com/InsertKoinIO/koin-embedded?tab=readme-ov-file#koin-relocation-scripts) 專案以取得更多詳細資訊。