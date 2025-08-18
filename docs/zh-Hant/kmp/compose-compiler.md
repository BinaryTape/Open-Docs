[//]: # (title: 更新 Compose 編譯器)

Compose 編譯器由一個 Gradle 外掛程式輔助，該外掛程式簡化了設定並提供了更方便的編譯器選項存取。
當與 Android Gradle plugin (AGP) 一同應用時，這個 Compose 編譯器外掛程式將覆寫由 AGP 自動提供的 Compose 編譯器座標。

從 Kotlin 2.0.0 開始，Compose 編譯器已合併到 Kotlin 儲存庫中。
這有助於您將專案順利遷移到 Kotlin 2.0.0 及更高版本，因為 Compose 編譯器與 Kotlin 同步發佈，並且始終與相同版本的 Kotlin 相容。

> 強烈建議您將使用 Kotlin 2.0.0 建立的 Compose Multiplatform 應用程式更新至 2.0.10 或更高版本。Compose 編譯器 2.0.0 有一個問題，它有時會錯誤地推斷具有非 JVM 目標的多平台專案中類型的穩定性，這可能導致不必要（甚至無限）的重新組合 (recomposition)。
>
> 如果您的應用程式是使用 Compose 編譯器 2.0.10 或更高版本構建的，但使用了使用 Compose 編譯器 2.0.0 構建的依賴項，這些舊的依賴項仍可能導致重新組合問題。
> 為防止此情況，請將您的依賴項更新到與您的應用程式使用相同 Compose 編譯器構建的版本。
>
{style="warning"}

若要在專案中使用新的 Compose 編譯器外掛程式，請為每個使用 Compose 的模組應用它。
請繼續閱讀有關如何 [遷移 Compose Multiplatform 專案](#migrating-a-compose-multiplatform-project) 的詳細資訊。對於 Jetpack Compose 專案，請參考 [遷移指南](https://kotlinlang.org/docs/compose-compiler-migration-guide.html#migrating-a-jetpack-compose-project)。

## 遷移 Compose Multiplatform 專案

從 Compose Multiplatform 1.6.10 開始，您應該將 `org.jetbrains.kotlin.plugin.compose` Gradle 外掛程式應用於每個使用 `org.jetbrains.compose` 外掛程式的模組：

1. 將 Compose 編譯器 Gradle 外掛程式新增到 [Gradle 版本目錄](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml) 中：

    ```
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

2. 將 Gradle 外掛程式新增到根 `build.gradle.kts` 檔案中：

    ```kotlin
    plugins {
     // ...
     alias(libs.plugins.jetbrainsCompose) apply false
     alias(libs.plugins.compose.compiler) apply false
    }
    ```

3. 將外掛程式應用於每個使用 Compose Multiplatform 的模組：

    ```kotlin
    plugins { 
        // ...
        alias(libs.plugins.jetbrainsCompose)
        alias(libs.plugins.compose.compiler)
    }
    ```

4. 如果您正在使用 Jetpack Compose 編譯器的編譯器選項，請在 `composeCompiler {}` 區塊中設定它們。
   請參考 [Compose 編譯器選項 DSL](https://kotlinlang.org/docs/compose-compiler-options.html)。

#### 可能的問題：「缺少路徑資源」

當從 Kotlin 1.9.0 切換到 2.0.0，或從 2.0.0 切換到 1.9.0 時，您可能會遇到以下錯誤：

```
org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...
```

若要解決此問題，請刪除所有 `build` 目錄：在您的專案根目錄和每個模組中。

## 後續步驟

* 請參閱 [Google 的公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)，了解 Compose 編譯器將遷移至 Kotlin 儲存庫的資訊。
* 請參考 [Compose 編譯器選項 DSL](https://kotlinlang.org/docs/compose-compiler-options.html)。
* 若要遷移 Jetpack Compose 應用程式，請查看 [Compose 編譯器文件](https://kotlinlang.org/docs/compose-compiler-migration-guide.html)。