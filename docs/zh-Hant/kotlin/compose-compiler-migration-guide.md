[//]: # (title: Compose 編譯器遷移指南)

Compose 編譯器由一個 Gradle 外掛程式輔助，該外掛程式可簡化設定並提供更方便的編譯器選項存取方式。
當與 Android Gradle 外掛程式 (AGP) 一同應用時，此 Compose 編譯器外掛程式將覆寫 AGP 自動提供的 Compose 編譯器座標。

自 Kotlin 2.0.0 起，Compose 編譯器已合併到 Kotlin 儲存庫。
這有助於簡化您的專案向 Kotlin 2.0.0 及更高版本的遷移，因為 Compose 編譯器與 Kotlin 同步發布，並且將始終與相同版本的 Kotlin 相容。

若要在您的專案中使用新的 Compose 編譯器外掛程式，請將其應用於每個使用 Compose 的模組。
繼續閱讀有關如何 [遷移 Jetpack Compose 專案](#migrating-a-jetpack-compose-project) 的詳細資訊。對於 Compose 多平台專案，請參閱 [多平台遷移指南](https://kotlinlang.org/docs/multiplatform/compose-compiler.html#migrating-a-compose-multiplatform-project)。

## 遷移 Jetpack Compose 專案

當您從 1.9 遷移到 Kotlin 2.0.0 或更新版本時，應根據您處理 Compose 編譯器的方式來調整專案組態。我們建議使用 Kotlin Gradle 外掛程式和 Compose 編譯器 Gradle 外掛程式來自動化組態管理。

### 使用 Gradle 外掛程式管理 Compose 編譯器

對於 Android 模組：

1. 將 Compose 編譯器 Gradle 外掛程式加入 [Gradle 版本目錄](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)：

 ```
 [versions]
 # ...
 kotlin = "%kotlinVersion%"
 
 [plugins]
 # ...
 org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
 compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
 ```

> 如果您正在使用 AGP 9.0.0 或更新版本，您不再需要 `org-jetbrains-kotlin-android` 外掛程式，因為 AGP 已內建 Kotlin 支援。
> 
{style ="note"}

2. 將 Gradle 外掛程式加入根 `build.gradle.kts` 檔案：

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler) apply false
 }
 ```

3. 將該外掛程式應用於每個使用 Jetpack Compose 的模組：

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler)
 }
 ```

4. 如果您正在使用 Jetpack Compose 編譯器的編譯器選項，請在 `composeCompiler {}` 區塊中設定它們。
   請參閱 [編譯器選項列表](compose-compiler-options.md) 以供參考。

5. 如果您直接引用 Compose 編譯器構件，您可以移除這些引用，並讓 Gradle 外掛程式處理相關事務。

### 不使用 Gradle 外掛程式的 Compose 編譯器

如果您沒有使用 Gradle 外掛程式來管理 Compose 編譯器，請更新專案中對舊 Maven 構件的任何直接引用：

* 將 `androidx.compose.compiler:compiler` 變更為 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`
* 將 `androidx.compose.compiler:compiler-hosted` 變更為 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin`

## 後續步驟

* 請參閱 [Google 關於 Compose 編譯器移至 Kotlin 儲存庫的公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
* 如果您正在使用 Jetpack Compose 建構 Android 應用程式，請查看 [我們關於如何使其多平台的指南](https://kotlinlang.org/docs/multiplatform/multiplatform-integrate-in-existing-app.html)。