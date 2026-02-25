[//]: # (title: Compose 編譯器遷移指南)

Compose 編譯器由 Gradle 外掛程式提供補充，該外掛程式簡化了設定，並讓存取編譯器選項變得更輕鬆。當與 Android Gradle 外掛程式 (AGP) 一併套用時，此 Compose 編譯器外掛程式會覆蓋由 AGP 自動提供的 Compose 編譯器座標。

自 Kotlin 2.0.0 起，Compose 編譯器已併入 Kotlin 存儲庫。這有助於讓您的專案更順利地遷移至 Kotlin 2.0.0 及更新版本，因為 Compose 編譯器與 Kotlin 同步發佈，且始終與相同版本的 Kotlin 相容。

若要在您的專案中使用新的 Compose 編譯器外掛程式，請將其套用於每個使用 Compose 的模組。請閱讀下文以取得如何[遷移 Jetpack Compose 專案](#migrating-a-jetpack-compose-project)的詳細資訊。對於 Compose 多平台專案，請參閱[多平台遷移指南](https://kotlinlang.org/docs/multiplatform/compose-compiler.html#migrating-a-compose-multiplatform-project)。

## 遷移 Jetpack Compose 專案

從 1.9 遷移至 Kotlin 2.0.0 或更新版本時，您應根據處理 Compose 編譯器的方式調整專案配置。我們建議使用 Kotlin Gradle 外掛程式與 Compose 編譯器 Gradle 外掛程式來自動化配置管理。

### 使用 Gradle 外掛程式管理 Compose 編譯器

對於 Android 模組：

1. 將 Compose 編譯器 Gradle 外掛程式新增至 [Gradle 版本目錄 (version catalog)](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)：

 ```
 [versions]
 # ...
 kotlin = "%kotlinVersion%"
 
 [plugins]
 # ...
 org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
 compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
 ```

> 如果您使用的是 AGP 9.0.0 或更新版本，則不再需要 `org-jetbrains-kotlin-android` 外掛程式，因為 AGP 已內建 Kotlin 支援。
> 
{style ="note"}

2. 將 Gradle 外掛程式新增至根目錄的 `build.gradle.kts` 檔案：

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

4. 如果您正在為 Jetpack Compose 編譯器使用編譯器選項，請在 `composeCompiler {}` 區塊中進行設定。請參閱[編譯器選項清單](compose-compiler-options.md)以供參考。

5. 如果您直接參照 Compose 編譯器構件 (artifacts)，可以移除這些參照，並讓 Gradle 外掛程式來處理相關事宜。

### 不使用 Gradle 外掛程式使用 Compose 編譯器

如果您不使用 Gradle 外掛程式來管理 Compose 編譯器，請更新專案中指向舊 Maven 構件的任何直接參照：

* 將 `androidx.compose.compiler:compiler` 更改為 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`
* 將 `androidx.compose.compiler:compiler-hosted` 更改為 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin`

## 後續步驟

* 參閱 [Google 的公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)，瞭解關於 Compose 編譯器移至 Kotlin 存儲庫的資訊。
* 如果您正在使用 Jetpack Compose 建置 Android 應用程式，請查看[我們的指南，瞭解如何將其轉為多平台](https://kotlinlang.org/docs/multiplatform/multiplatform-integrate-in-existing-app.html)。