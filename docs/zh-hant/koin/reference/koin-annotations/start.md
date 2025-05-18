---
title: "開始使用 Koin Annotations"
---
Koin Annotations 專案的目標是以非常快速且直觀的方式宣告 Koin 定義，並為您產生所有底層的 Koin DSL（Domain Specific Language，領域特定語言）。 我們的目標是藉由 Kotlin 編譯器來幫助開發者提升開發體驗，讓開發速度🚀更快。

## 快速開始 (Getting Started)

不熟悉 Koin 嗎？ 首先看看 [Koin 快速入門](https://insert-koin.io/docs/quickstart/kotlin)

使用定義與模組註解來標記您的元件，並使用常規的 Koin API（Application Programming Interface，應用程式介面）。

```kotlin
// 標記您的元件以宣告定義
@Single
class MyComponent
```

```kotlin
// 宣告一個模組並掃描註解
@Module
@ComponentScan
class MyModule
```

使用 `org.koin.ksp.generated.*` 匯入，以便使用產生的程式碼：

```kotlin
// 使用 Koin Generation
import org.koin.ksp.generated.*

fun main() {
    val koin = startKoin {
        printLogger()
        modules(
          // 在此處使用您的模組，在 Module 類別上使用產生的 ".module" 擴展
          MyModule().module
        )
    }

    // 像平常一樣使用您的 Koin API
    koin.get<MyComponent>()
}
```

就是這樣，您可以在 Koin 中使用您的新定義以及 [常規 Koin API](https://insert-koin.io/docs/reference/introduction)

## KSP 選項 (Options)

Koin 編譯器提供了一些選項來進行配置。 按照官方文件，您可以將以下選項新增到您的專案中：[Ksp 快速入門文件](https://kotlinlang.org/docs/ksp-quickstart.html)

### 編譯安全 - 在編譯時檢查您的 Koin 配置 (自 1.3.0 起)

Koin Annotations 允許編譯器外掛程式在編譯時驗證您的 Koin 配置。 可以使用以下 Ksp 選項啟用此功能，以新增到您的 Gradle 模組：

```groovy
// in build.gradle 或 build.gradle.kts

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

編譯器將檢查您的配置中使用的所有依賴項是否已宣告，以及所有使用的模組是否可存取。

### 使用 @Provided 繞過編譯安全 (自 1.4.0 起)

在編譯器忽略的類型（Android 常見類型）中，編譯器外掛程式可以驗證您的 Koin 配置在編譯時。 如果您想排除對參數的檢查，您可以在參數上使用 `@Provided` 來表示此類型是在當前 Koin Annotations 配置之外提供的。

以下表示 `MyProvidedComponent` 已經在 Koin 中宣告：

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### 禁用預設模組 (Default Module) (自 1.3.0 起)

預設情況下，Koin 編譯器會檢測任何未繫結到模組的定義，並將其放入「預設模組」中，這是一個在您專案根目錄產生的 Koin 模組。 您可以使用以下選項禁用預設模組的使用和生成：

```groovy
// in build.gradle 或 build.gradle.kts

ksp {
    arg("KOIN_DEFAULT_MODULE","false")
}
```

### Kotlin KMP 設定

請按照官方文件中描述的 KSP 設定進行操作：[KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

您還可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 專案，其中包含 Koin Annotations 的基本設定。