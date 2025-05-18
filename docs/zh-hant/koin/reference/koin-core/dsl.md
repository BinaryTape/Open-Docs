---
title: "Koin DSL"
---
多虧了 Kotlin 語言的強大功能，Koin 提供了一種 DSL（Domain Specific Language，領域特定語言），可幫助您描述您的應用程式，而無需對其進行註解或生成程式碼。 憑藉其 Kotlin DSL，Koin 提供了一個智慧型函數式 API，以實現準備您的依賴注入。

## 應用程式 & 模組 DSL

Koin 提供了幾個關鍵字，讓您可以描述 Koin 應用程式（Koin Application）的元素：

- 應用程式 DSL（Application DSL），用於描述 Koin 容器配置
- 模組 DSL（Module DSL），用於描述必須注入的元件

## 應用程式 DSL

`KoinApplication` 實例是一個 Koin 容器實例配置。 這將讓您配置日誌記錄、屬性載入和模組。

要構建一個新的 `KoinApplication`，請使用以下函數：

* `koinApplication { }` - 創建一個 `KoinApplication` 容器配置
* `startKoin { }` - 創建一個 `KoinApplication` 容器配置，並將其註冊到 `GlobalContext` 中，以允許使用全域上下文 API（GlobalContext API）

要配置您的 `KoinApplication` 實例，您可以使用以下任何函數：

* `logger( )` - 描述要使用的日誌級別和 Logger 實作（預設使用 EmptyLogger）
* `modules( )` - 設定要在容器中載入的 Koin 模組列表（列表或變長參數列表）
* `properties()` - 將 HashMap 屬性載入到 Koin 容器中
* `fileProperties( )` - 從給定檔案將屬性載入到 Koin 容器中
* `environmentProperties( )` - 從作業系統環境（OS environment）將屬性載入到 Koin 容器中
* `createEagerInstances()` - 建立預先實例 (標記為 `createdAtStart` 的 Single 定義)

## KoinApplication 實例：全域 vs 區域

如您在上面看到的，我們可以通過 2 種方式描述 Koin 容器配置： `koinApplication` 或 `startKoin` 函數。

- `koinApplication` 描述一個 Koin 容器實例
- `startKoin` 描述一個 Koin 容器實例，並將其註冊到 Koin `GlobalContext` 中

通過將您的容器配置註冊到 `GlobalContext` 中，全域 API 可以直接使用它。 任何 `KoinComponent` 都引用一個 `Koin` 實例。 預設情況下，我們使用來自 `GlobalContext` 的實例。

有關更多資訊，請查看有關自訂 Koin 實例的章節。

## 啟動 Koin

啟動 Koin 意味著在 `GlobalContext` 中執行 `KoinApplication` 實例。

要使用模組啟動 Koin 容器，我們可以像這樣使用 `startKoin` 函數：

```kotlin
// start a KoinApplication in Global context
startKoin {
    // declare used logger
    logger()
    // declare used modules
    modules(coffeeAppModule)
}
```

## 模組 DSL

一個 Koin 模組收集您將為您的應用程式注入/組合的定義（definitions）。 要創建一個新模組，只需使用以下函數：

* `module { // module content }` - 創建一個 Koin 模組

要在模組中描述您的內容，您可以使用以下函數：

* `factory { //definition }` - 提供一個 factory bean 定義
* `single { //definition  }` - 提供一個 singleton bean 定義（也別名為 `bean`）
* `get()` - 解析一個元件依賴（也可以使用名稱、作用域或參數）
* `bind()` - 為給定的 bean 定義添加要綁定的類型
* `binds()` - 為給定的 bean 定義添加類型陣列
* `scope { // scope group }` - 為 `scoped` 定義定義一個邏輯組
* `scoped { //definition }`- 提供一個 bean 定義，它只存在於一個作用域中

注意： `named()` 函數允許您通過字串、枚舉或類型給出一個限定符（qualifier）。 它用於命名您的定義。

### 編寫一個模組

一個 Koin 模組是*聲明所有元件的空間*。 使用 `module` 函數來聲明一個 Koin 模組：

```kotlin
val myModule = module {
   // your dependencies here
}
```

在這個模組中，您可以聲明如下所述的元件。

### withOptions - DSL 選項（自 3.2 起）

與新的 [Constructor DSL](./dsl-update.md) 定義一樣，您可以使用 `withOptions` 運算符在「常規」定義上指定定義選項：

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

在這個選項 lambda 中，您可以指定以下選項：

* `named("a_qualifier")` - 給定義一個字串限定符（String qualifier）
* `named<MyType>()` - 給定義一個類型限定符（Type qualifier）
* `bind<MyInterface>()` - 為給定的 bean 定義添加要綁定的類型
* `binds(arrayOf(...))` - 為給定的 bean 定義添加類型陣列
* `createdAtStart()` - 在 Koin 啟動時創建單例實例