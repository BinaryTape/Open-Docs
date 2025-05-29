[//]: # (title: Compose 編譯器遷移指南)

Compose 編譯器由一個 Gradle 外掛程式補充，該外掛程式簡化了設定並提供了更方便的編譯器選項存取方式。
當與 Android Gradle 外掛程式 (AGP) 一同套用時，此 Compose 編譯器外掛程式將會覆寫 AGP 自動提供的 Compose 編譯器座標。

自 Kotlin 2.0.0 起，Compose 編譯器已合併到 Kotlin 儲存庫中。
這有助於您的專案順利遷移至 Kotlin 2.0.0 及更高版本，因為 Compose 編譯器與 Kotlin 同步發佈，並且將始終與相同版本的 Kotlin 相容。

要在您的專案中使用新的 Compose 編譯器外掛程式，請為每個使用 Compose 的模組套用它。
請繼續閱讀以了解如何[遷移 Jetpack Compose 專案](#migrating-a-jetpack-compose-project)的詳細資訊。對於 Compose 多平台專案，請參閱[多平台遷移指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html#migrating-a-compose-multiplatform-project)。

## 遷移 Jetpack Compose 專案

當從 1.9 版本遷移到 Kotlin 2.0.0 或更新版本時，您應該根據處理 Compose 編譯器的方式調整專案配置。我們建議使用 Kotlin Gradle 外掛程式和 Compose 編譯器 Gradle 外掛程式來自動化配置管理。

### 使用 Gradle 外掛程式管理 Compose 編譯器

對於 Android 模組：

1. 將 Compose 編譯器 Gradle 外掛程式加入到 [Gradle 版本目錄](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)中：

 ```
 [versions]
 # ...
 kotlin = "%kotlinVersion%"
 
 [plugins]
 # ...
 org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
 compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
 ```

2. 將 Gradle 外掛程式加入到根 `build.gradle.kts` 檔案中：

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler) apply false
 }
 ```

3. 將外掛程式套用於每個使用 Jetpack Compose 的模組：

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler)
 }
 ```

4. 如果您正在使用 Jetpack Compose 編譯器的編譯器選項，請在 `composeCompiler {}` 區塊中設定它們。
   請參閱[編譯器選項列表](compose-compiler-options.md)以供參考。

5. 如果您直接引用 Compose 編譯器 Artifacts，您可以移除這些引用並讓 Gradle 外掛程式處理。

### 不使用 Gradle 外掛程式的 Compose 編譯器

如果您不使用 Gradle 外掛程式管理 Compose 編譯器，請更新專案中對舊 Maven Artifacts 的任何直接引用：

* 將 `androidx.compose.compiler:compiler` 變更為 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`
* 將 `androidx.compose.compiler:compiler-hosted` 變更為 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin`

## 後續步驟

* 請參閱 [Google 關於 Compose 編譯器移至 Kotlin 儲存庫的公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
* 如果您正在使用 Jetpack Compose 建置 Android 應用程式，請查看[我們的指南，了解如何使其成為多平台應用程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)。