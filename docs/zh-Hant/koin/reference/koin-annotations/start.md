---
title: Koin 註解使用入門
---

Koin 註解專案的目標是幫助您以非常快速且直觀的方式宣告 Koin 定義，並為您生成所有底層的 Koin DSL。其目標是借助 Kotlin 編譯器，幫助開發者體驗實現擴展並快速開發 🚀。

## 入門

不熟悉 Koin？請先查看 [Koin 入門指南](https://insert-koin.io/docs/quickstart/kotlin)

使用定義與模組註解標記您的元件，並使用慣用的 Koin API。

```kotlin
// 標記您的元件以宣告定義
@Single
class MyComponent
```

```kotlin
// 宣告模組並掃描註解
@Module
@ComponentScan
class MyModule
```

請按照以下方式使用 `org.koin.ksp.generated.*` 導入，以便能夠使用生成的程式碼：

```kotlin
// 使用 Koin 生成
import org.koin.ksp.generated.*

fun main() {
    val koin = startKoin {
        printLogger()
        modules(
          // 在此使用您的模組，搭配 Module 類別上生成的 ".module" 擴充功能
          MyModule().module
        )
    }

    // 像往常一樣使用您的 Koin API
    koin.get<MyComponent>()
}
```

就是這樣，您可以使用 [慣用的 Koin API](https://insert-koin.io/docs/reference/introduction) 在 Koin 中使用您的新定義。

## KSP 選項

Koin 編譯器提供了一些配置選項。根據官方文件，您可以將以下選項添加到您的專案中：[KSP 快速入門文件](https://kotlinlang.org/docs/ksp-quickstart.html#pass-options-to-processors)

### 編譯安全 - 在編譯時檢查您的 Koin 配置 (從 1.3.0 開始)

Koin 註解允許編譯器插件在編譯時驗證您的 Koin 配置。您可以透過將以下 KSP 選項添加到您的 Gradle 模組中來啟用此功能：

```groovy
// 在 build.gradle 或 build.gradle.kts

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

編譯器將檢查您配置中使用的所有依賴項是否已宣告，並且所有使用的模組都可被存取。

### 使用 @Provided 繞過編譯安全 (從 1.4.0 開始)

除了編譯器中忽略的類型 (Android 常見類型) 之外，編譯器插件可以驗證您的 Koin 配置。如果您想排除某個參數不被檢查，可以在參數上使用 `@Provided` 來指示此類型是從目前的 Koin 註解配置外部提供的。

以下表示 `MyProvidedComponent` 已在 Koin 中宣告：

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### 停用預設模組 (從 1.3.0 開始)

預設情況下，Koin 編譯器會檢測任何未綁定到模組的定義，並將其放入一個「預設模組」中，該模組是生成在您專案根目錄的 Koin 模組。您可以使用以下選項停用預設模組的使用和生成：

```groovy
// 在 build.gradle 或 build.gradle.kts

ksp {
    arg("KOIN_DEFAULT_MODULE","false")
}
```

### Kotlin KMP 設定

請按照官方文件所述的 KSP 設定：[KSP 與 Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

您也可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 專案，其中包含 Koin 註解的基本設定。