---
title: "Compose 編譯器遷移指南"
---
Compose 編譯器由 Gradle 外掛程式補充，這簡化了設定，並提供更輕鬆地存取編譯器選項。
當與 Android Gradle 外掛程式 (AGP) 一起應用時，此 Compose 編譯器外掛程式將覆寫 AGP 自動提供的 Compose 編譯器的座標。

自 Kotlin 2.0.0 以來，Compose 編譯器已合併到 Kotlin 儲存庫中。
這有助於簡化您的專案遷移到 Kotlin 2.0.0 及更高版本，因為 Compose 編譯器與 Kotlin 同時發布，並且始終與相同版本的 Kotlin 相容。

若要在您的專案中使用新的 Compose 編譯器外掛程式，請為每個使用 Compose 的模組套用它。
請繼續閱讀以瞭解如何[遷移 Jetpack Compose 專案](#migrating-a-jetpack-compose-project)。對於 Compose Multiplatform 專案，
請參閱[multiplatform 遷移指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html#migrating-a-compose-multiplatform-project)。

## 遷移 Jetpack Compose 專案

從 1.9 遷移到 Kotlin 2.0.0 或更高版本時，您應根據處理 Compose 編譯器的方式調整專案配置。我們建議使用 Kotlin Gradle 外掛程式和 Compose 編譯器 Gradle 外掛程式來自動化配置管理。

### 使用 Gradle 外掛程式管理 Compose 編譯器

對於 Android 模組：

1. 將 Compose 編譯器 Gradle 外掛程式新增至 [Gradle 版本目錄](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)：

 ```
 [versions]
 # ...
 kotlin = "2.1.20"
 
 [plugins]
 # ...
 org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
 compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
 ```

2. 將 Gradle 外掛程式新增至根 `build.gradle.kts` 檔案：

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler) apply false
 }
 ```

3. 將外掛程式套用至每個使用 Jetpack Compose 的模組：

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler)
 }
 ```

4. 如果您使用 Jetpack Compose 編譯器的編譯器選項，請在 `composeCompiler {}` 區塊中設定它們。
   請參閱[編譯器選項清單](compose-compiler-options)以供參考。

5. 如果您直接引用 Compose 編譯器構件，則可以移除這些引用，並讓 Gradle 外掛程式處理這些事情。

### 在沒有 Gradle 外掛程式的情況下使用 Compose 編譯器

如果您未使用 Gradle 外掛程式來管理 Compose 編譯器，請更新專案中對舊 Maven 構件的任何直接引用：

* 將 `androidx.compose.compiler:compiler` 變更為 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`
* 將 `androidx.compose.compiler:compiler-hosted` 變更為 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin`

## 接下來

* 請參閱 [Google 的公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html) 關於 Compose 編譯器移至 Kotlin 儲存庫。
* 如果您使用 Jetpack Compose 來建置 Android 應用程式，請查看[我們的指南，瞭解如何使其成為 multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)。