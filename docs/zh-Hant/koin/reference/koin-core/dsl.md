---
title: Koin DSL
---

得益於 Kotlin 語言的強大功能，Koin 提供了一個 DSL 來幫助您描述應用程式，而不是對其進行標註 (annotate) 或為其產生程式碼。透過其 Kotlin DSL，Koin 提供了智慧化的函式式 API 來完成相依注入的準備工作。

## Application & Module DSL

Koin 提供了多個關鍵字，讓您可以描述 Koin 應用程式的元素：

- Application DSL：用於描述 Koin 容器配置
- Module DSL：用於描述必須被注入的元件

## Application DSL

一個 `KoinApplication` 執行個體是一個 Koin 容器執行個體配置。這將讓您配置記錄 (logging)、屬性載入和模組。

要組建一個新的 `KoinApplication`，請使用以下函式：

* `koinApplication { }` - 建立一個 `KoinApplication` 容器配置
* `startKoin { }` - 建立一個 `KoinApplication` 容器配置，並將其註冊到 `GlobalContext` 中，以允許使用 GlobalContext API

要配置您的 `KoinApplication` 執行個體，您可以使用以下任一函式：

* `logger( )` - 描述要使用的級別和 Logger 實作（預設使用 EmptyLogger）
* `modules( )` - 設定要載入到容器中的 Koin 模組列表（列表或 vararg 列表）
* `properties()` - 將 HashMap 屬性載入到 Koin 容器中
* `fileProperties( )` - 從給定檔案中將屬性載入到 Koin 容器中
* `environmentProperties( )` - 從作業系統環境中將屬性載入到 Koin 容器中
* `createEagerInstances()` - 建立預先載入執行個體（標記為 `createdAtStart` 的 single 定義）

## KoinApplication 執行個體：全域 vs 區域

如上所述，我們可以用兩種方式描述 Koin 容器配置：`koinApplication` 或 `startKoin` 函式。

- `koinApplication` 描述一個 Koin 容器執行個體
- `startKoin` 描述一個 Koin 容器執行個體，並將其註冊在 Koin `GlobalContext` 中

透過將您的容器配置註冊到 `GlobalContext` 中，全域 API 可以直接使用它。任何 `KoinComponent` 都指向一個 `Koin` 執行個體。預設情況下，我們使用來自 `GlobalContext` 的執行個體。

請參閱關於自訂 Koin 執行個體的章節以了解更多資訊。

## 啟動 Koin

啟動 Koin 意味著在 `GlobalContext` 中執行一個 `KoinApplication` 執行個體。

要啟動帶有模組的 Koin 容器，我們可以像這樣使用 `startKoin` 函式：

```kotlin
// start a KoinApplication in Global context
startKoin {
    // declare used logger
    logger()
    // declare used modules
    modules(coffeeAppModule)
}
```

## Module DSL

Koin 模組收集您將為應用程式注入／組合的定義。要建立一個新模組，只需使用以下函式：

* `module { // module content }` - 建立一個 Koin 模組

要在模組中描述您的內容，您可以使用以下函式：

* `factory { //definition }` - 提供一個 factory bean 定義
* `single { //definition  }` - 提供一個 singleton bean 定義（也稱為 `bean`）
* `get()` - 解析元件相依性（也可以使用名稱、作用域或參數）
* `bind()` - 為給定的 bean 定義新增要繫結的型別
* `binds()` - 為給定的 bean 定義新增型別陣列
* `scope { // scope group }` - 為 `scoped` 定義定義一個邏輯群組
* `scoped { //definition }`- 提供一個僅存在於作用域中的 bean 定義

注意：`named()` 函式允許您透過字串、列舉或型別提供限定詞。它用於命名您的定義。

### 撰寫一個模組

Koin 模組是*宣告所有元件的空間*。使用 `module` 函式來宣告一個 Koin 模組：

```kotlin
val myModule = module {
   // your dependencies here
}
```

在此模組中，您可以依照下述方式宣告元件。

### withOptions - DSL 選項 (自 3.2 起)

與新的 [建構函式 DSL](./dsl-update.md) 定義一樣，您可以使用 `withOptions` 運算子在「常規」定義上指定定義選項：

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

在此選項 lambda 內，您可以指定以下選項：

* `named("a_qualifier")` - 為定義指定一個字串限定詞
* `named<MyType>()` - 為定義指定一個型別限定詞
* `bind<MyInterface>()` - 為給定的 bean 定義新增要繫結的型別
* `binds(arrayOf(...))` - 為給定的 bean 定義新增型別陣列
* `createdAtStart()` - 在 Koin 啟動時建立 single 執行個體