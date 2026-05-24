[//]: # (title: 更新 Compose 編譯器)

Compose 編譯器由 Gradle 外掛程式補充，這簡化了設定並提供更輕鬆存取編譯器選項的方式。
當與 Android Gradle 外掛程式 (AGP) 一起使用時，此 Compose 編譯器外掛程式將覆蓋 AGP 自動提供的 Compose 編譯器座標。

自 Kotlin 2.0.0 起，Compose 編譯器已合併到 Kotlin 存儲庫中。
這有助於將您的專案平滑遷移至 Kotlin 2.0.0 及更高版本，因為 Compose 編譯器與 Kotlin 同步發布，並且始終與相同版本的 Kotlin 相容。

> 強烈建議您將使用 Kotlin 2.0.0 建立的 Compose Multiplatform 應用程式更新至 2.0.10 或更高版本。Compose 編譯器 2.0.0 存在一個問題，即在具有非 JVM 目標的多平台專案中，有時會錯誤地推論型別的穩定性，這可能導致不必要的（甚至無窮的）重組。
>
> 如果您的應用程式是使用 Compose 編譯器 2.0.10 或更高版本建置，但使用的相依性是使用 Compose 編譯器 2.0.0 建置的，這些舊的相依性可能仍會導致重組問題。
> 為了防止這種情況，請將您的相依性更新為與您的應用程式使用相同 Compose 編譯器建置的版本。
>
{style="warning"}

要在您的專案中使用新的 Compose 編譯器外掛程式，請為每個使用 Compose 的模組套用它。
請閱讀下文以了解有關如何 [遷移 Compose Multiplatform 專案](#migrating-a-compose-multiplatform-project) 的詳細資訊。對於 Jetpack Compose 專案，請參閱 [遷移指南](https://kotlinlang.org/docs/compose-compiler-migration-guide.html#migrating-a-jetpack-compose-project)。

## 遷移 Compose Multiplatform 專案

從 Compose Multiplatform 1.6.10 開始，您應該將 `org.jetbrains.kotlin.plugin.compose` Gradle 外掛程式套用到每個使用 `org.jetbrains.compose` 外掛程式的模組：

1. 將 Compose 編譯器 Gradle 外掛程式新增到 [Gradle 版本目錄](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)：

    ```toml
    [versions]
    # ...
    kotlin = "%kotlinVersion%"
    compose-plugin = "%org.jetbrains.compose%"
 
    [plugins]
    # ...
    jetbrainsCompose = { id = "org.jetbrains.compose", version.ref = "compose-plugin" }
    kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
    compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
    ```

2. 將 Gradle 外掛程式新增至根目錄的 `build.gradle.kts` 檔案：

    ```kotlin
    plugins {
     // ...
     alias(libs.plugins.jetbrainsCompose) apply false
     alias(libs.plugins.compose.compiler) apply false
    }
    ```

3. 將外掛程式套用到每個使用 Compose Multiplatform 的模組：

    ```kotlin
    plugins { 
        // ...
        alias(libs.plugins.jetbrainsCompose)
        alias(libs.plugins.compose.compiler)
    }
    ```

4. 如果您正在為 Jetpack Compose 編譯器使用編譯器選項，請在 `composeCompiler {}` 區塊中設定它們。
   請參閱 [Compose 編譯器選項 DSL](https://kotlinlang.org/docs/compose-compiler-options.html) 以取得參考。

#### 可能的問題：「Missing resource with path」

當從 Kotlin 1.9.0 切換到 2.0.0，或從 2.0.0 切換到 1.9.0 時，您可能會遇到以下錯誤：

```
org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...
```

要解決此問題，請刪除所有 `build` 目錄：包括專案根目錄以及每個模組中的目錄。

## 接續步驟

* 請參閱 [Google 的公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)，了解有關 Compose 編譯器移至 Kotlin 存儲庫的資訊。
* 請參閱 [Compose 編譯器選項 DSL](https://kotlinlang.org/docs/compose-compiler-options.html) 以取得參考。
* 要遷移 Jetpack Compose 應用程式，請查看 [Compose 編譯器文件](https://kotlinlang.org/docs/compose-compiler-migration-guide.html)。