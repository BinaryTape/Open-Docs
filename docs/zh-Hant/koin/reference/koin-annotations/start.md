---
title: Koin Annotations 入門
---

Koin Annotations 專案的目標是協助以快速且直覺的方式宣告 Koin 定義，並為您產生所有底層的 Koin DSL。其目標是透過 Kotlin 編譯器協助開發者體驗規模化並實現快速開發 🚀。

## 快速入門

對 Koin 不熟悉嗎？首先，請查看 [Koin 快速入門](https://insert-koin.io/docs/quickstart/kotlin/)

使用定義與模組註解標記您的組件，並使用常規的 Koin API。

```kotlin
// 標記您的組件以宣告定義
@Single
class MyComponent
```

### 基本模組設定

```kotlin
// 宣告模組並掃描註解
@Module
class MyModule
```

現在您可以使用 `@KoinApplication` 啟動您的 Koin 應用程式，並明確指定要使用的模組：

```kotlin
// 下方的匯入讓您可以存取產生的擴充函式
// 例如 MyModule.module 與 MyApp.startKoin() 
import org.koin.ksp.generated.*

@KoinApplication(modules = [MyModule::class])
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 像往常一樣使用您的 Koin API 即可
    KoinPlatform.getKoin().get<MyComponent>()
}
```

### 基於配置的模組設定

或者，您可以使用 `@Configuration` 來建立自動載入的模組：

```kotlin
// 帶有配置的模組 - 會自動包含在預設配置中
@Module
@Configuration
class MyModule
```

透過配置，您不需要明確指定模組：

```kotlin
// 下方的匯入讓您可以存取產生的擴充函式
// 此方法會自動載入所有標記為 @Configuration 的模組
import org.koin.ksp.generated.*

@KoinApplication
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 像往常一樣使用您的 Koin API 即可
    KoinPlatform.getKoin().get<MyComponent>()
}
```

就這樣，您可以在 Koin 中搭配 [常規 Koin API](https://insert-koin.io/docs/reference/introduction) 使用您的新定義。

## KSP 選項

Koin 編譯器提供了一些配置選項。參考官方文件，您可以將以下選項加入到您的專案中：[Ksp 快速入門文件](https://kotlinlang.org/docs/ksp-quickstart.html#pass-options-to-processors)

### 編譯安全 - 在編譯期檢查您的 Koin 配置（自 1.3.0 起）

Koin Annotations 允許編譯器外掛程式在編譯期驗證您的 Koin 配置。您可以透過以下 Ksp 選項來啟用此功能，並將其加入到您的 Gradle 模組中：

```groovy
// 在 build.gradle 或 build.gradle.kts 中

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

編譯器將檢查配置中使用的所有相依性是否已宣告，以及所有使用的模組是否可存取。

### 使用 @Provided 繞過編譯安全檢查（自 1.4.0 起）

在編譯器忽略的型別（Android 常見型別）中，編譯器外掛程式可以在編譯期驗證您的 Koin 配置。如果您想排除某個參數不被檢查，可以在參數上使用 `@Provided`，表示該型別是由目前的 Koin Annotations 配置之外提供的。

以下範例表示 `MyProvidedComponent` 已在 Koin 中宣告：

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### 預設模組（自 1.3.0 起已棄用）

:::warning
自 Annotations 1.3.0 起，已棄用預設模組方法。我們建議使用帶有 `@Module` 與 `@Configuration` 註解的明確模組，以獲得更好的組織性與清晰度。
:::

以前，Koin 編譯器會偵測任何未綁定到模組的定義，並將其放入「預設模組」中。現在已棄用此方法，改為使用 `@Configuration` 與 `@KoinApplication` 註解。

**已棄用的方法**（避免使用）：
```groovy
// 在 build.gradle 或 build.gradle.kts 中

ksp {
    arg("KOIN_DEFAULT_MODULE","true")
}
```

**推薦的方法**：使用如上述範例中所示的 `@Configuration` 與 `@KoinApplication` 來進行明確的模組組織。

### Kotlin KMP 設定

請按照官方文件所述的 KSP 設定進行操作：[KSP 與 Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

您也可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 專案，其中包含 Koin Annotations 的基本設定。

### Pro-Guard

如果您打算將 Koin Annotations 應用程式嵌入為 SDK，請參考這些 Pro-Guard 規則：

```
# 保留註解定義
-keep class org.koin.core.annotation.** { *; }

# 保留使用 Koin 註解標記的類別  
-keep @org.koin.core.annotation.* class * { *; }