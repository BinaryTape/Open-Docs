---
title: Koin Embedded
custom_edit_url: null
---

Koin Embedded 是一個新的 Koin 專案，主要對象為 Android/Kotlin SDK 與程式庫開發人員。

此專案提供指令碼，協助以不同的套件名稱重新建置與封裝 Koin 專案。這對於 SDK 與程式庫開發非常有用，可避免嵌入式 Koin 版本與任何可能使用其他版本 Koin 的取用應用程式產生衝突。

有任何回饋或需要協助？請聯絡 [Koin Team](mailto:koin@kotzilla.io)。

:::info
此計畫目前處於 Beta 階段，我們正在徵求回饋意見
:::

## 嵌入式版本 (Beta)

以下是 Koin 嵌入式版本的範例：[Kotzilla 存儲庫](https://repository.kotzilla.io/#browse/browse:Koin-Embedded)
- 可用的套件：`embedded-koin-core`、`embedded-koin-android`
- 從 `org.koin.*` 重新定位至 `embedded.koin.*`

使用此 Maven 存儲庫來設定您的 Gradle 配置：
```kotlin
maven { 'https://repository.kotzilla.io/repository/kotzilla-platform/' }
```

## 重新定位指令碼 (Beta)

這裡提供一些指令碼，可協助針對指定的套件名稱重新建置 Koin，幫助將其嵌入並避免與常規使用的 Koin 架構產生衝突。

若要了解更多詳細資訊，請參閱 Koin [重新定位指令碼](https://github.com/InsertKoinIO/koin-embedded?tab=readme-ov-file#koin-relocation-scripts) 專案。