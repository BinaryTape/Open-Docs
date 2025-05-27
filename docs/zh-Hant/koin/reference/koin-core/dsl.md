---
title: Koin DSL
---

憑藉 Kotlin 語言的強大功能，Koin 提供了一個 DSL，幫助您描述應用程式，而不是透過註解或產生程式碼來實現。透過其 Kotlin DSL，Koin 提供了一個智慧型函式式 API，用於準備您的依賴注入。

## 應用程式與模組 DSL

Koin 提供了幾個關鍵字，讓您可以描述 Koin 應用程式中的元素：

*   應用程式 DSL，用於描述 Koin 容器組態
*   模組 DSL，用於描述需要注入的元件

## 應用程式 DSL

一個 `KoinApplication` 實例就是一個 Koin 容器實例組態。這將讓您配置日誌記錄、載入屬性以及模組。

若要建立新的 `KoinApplication`，請使用以下函式：

*   `koinApplication { }` - 建立一個 `KoinApplication` 容器組態
*   `startKoin { }` - 建立一個 `KoinApplication` 容器組態並將其註冊到 `GlobalContext` 中，以允許使用 GlobalContext API

若要配置您的 `KoinApplication` 實例，您可以使用以下任何函式：

*   `logger( )` - 指定要使用的日誌級別和 Logger 實作 (預設使用 EmptyLogger)
*   `modules( )` - 設定要載入到容器中的 Koin 模組列表 (列表或可變引數列表)
*   `properties()` - 將 HashMap 屬性載入到 Koin 容器中
*   `fileProperties( )` - 從指定檔案載入屬性到 Koin 容器中
*   `environmentProperties( )` - 從作業系統環境載入屬性到 Koin 容器中
*   `createEagerInstances()` - 建立即時實例 (標記為 `createdAtStart` 的單例定義)

## KoinApplication 實例：全域與局部

如您所見，我們可以用兩種方式描述 Koin 容器組態：`koinApplication` 或 `startKoin` 函式。

*   `koinApplication` 描述一個 Koin 容器實例
*   `startKoin` 描述一個 Koin 容器實例並將其註冊到 Koin `GlobalContext` 中

透過將您的容器組態註冊到 `GlobalContext` 中，全域 API 可以直接使用它。任何 `KoinComponent` 都會參考一個 `Koin` 實例。預設情況下，我們使用 `GlobalContext` 中的實例。

有關更多資訊，請查閱關於自訂 Koin 實例的章節。

## 啟動 Koin

啟動 Koin 意味著在 `GlobalContext` 中執行一個 `KoinApplication` 實例。

若要使用模組啟動 Koin 容器，我們只需像這樣使用 `startKoin` 函式：

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

一個 Koin 模組集合了您將為應用程式注入/組合的定義。若要建立新模組，只需使用以下函式：

*   `module { // module content }` - 建立一個 Koin 模組

若要在模組中描述您的內容，您可以使用以下函式：

*   `factory { //definition }` - 提供一個工廠 bean 定義
*   `single { //definition }` - 提供一個單例 bean 定義 (亦可別名為 `bean`)
*   `get()` - 解析元件依賴 (亦可使用名稱、作用域或參數)
*   `bind()` - 為給定的 bean 定義添加要綁定的類型
*   `binds()` - 為給定的 bean 定義添加類型陣列
*   `scope { // scope group }` - 定義 `scoped` 定義的邏輯群組
*   `scoped { //definition }`- 提供一個僅存在於一個作用域內的 bean 定義

注意：`named()` 函式允許您透過字串、列舉或類型來提供限定詞。它用於為您的定義命名。

### 編寫模組

Koin 模組是您*宣告所有元件的空間*。使用 `module` 函式來宣告一個 Koin 模組：

```kotlin
val myModule = module {
   // your dependencies here
}
```

在此模組中，您可以按照下方描述來宣告元件。

### withOptions - DSL 選項 (自 3.2 版起)

與新的 [Constructor DSL](./dsl-update.md) 定義一樣，您可以使用 `withOptions` 運算子在「常規」定義上指定定義選項：

```kotlin
module {
    single { ClassA(get()) } withOptions { 
        named("qualifier")
        createdAtStart()
    }
}
```

在此選項 lambda 中，您可以指定以下選項：

*   `named("a_qualifier")` - 為定義提供一個字串限定詞
*   `named<MyType>()` - 為定義提供一個類型限定詞
*   `bind<MyInterface>()` - 為給定的 bean 定義添加要綁定的類型
*   `binds(arrayOf(...))` - 為給定的 bean 定義添加類型陣列
*   `createdAtStart()` - 在 Koin 啟動時建立單例實例