---
title: 為何選擇 Koin？
---

Koin 提供了一種簡便高效的方式，將依賴注入 (Dependency Injection) 整合到任何 Kotlin 應用程式中（多平台、Android、後端等）。

Koin 的目標是：
- 透過智慧型 API 簡化您的依賴注入基礎設施
- Kotlin DSL 易於閱讀、易於使用，讓您能夠編寫任何類型的應用程式
- 提供多種整合方式，從 Android 生態系統到 Ktor 等後端需求
- 支援使用註解 (annotations)

## Koin 簡而言之

### 讓您的 Kotlin 開發變得簡單高效

Koin 是一個智慧型的 Kotlin 依賴注入函式庫，讓您專注於應用程式本身，而非工具。

```kotlin

class MyRepository()
class MyPresenter(val repository : MyRepository)

// just declare it
val myModule = module {
  singleOf(::MyPresenter)
  singleOf(::MyRepository)
}
```

Koin 為您提供簡單的工具和 API，讓您能夠建構、組裝 Kotlin 相關技術到您的應用程式中，並輕鬆擴展您的業務。

```kotlin
fun main() {

  // Just start Koin
  startKoin {
    modules(myModule)
  }
}
```

### 為 Android 做好準備

歸功於 Kotlin 語言，Koin 擴展了 Android 平台，並作為原始平台的一部分提供了新功能。

```kotlin
class MyApplication : Application() {
  override fun onCreate() {
    super.onCreate()

    startKoin {
      modules(myModule)
    }
  }
}
```

Koin 提供簡單而強大的 API，讓您只需使用 `by inject()` 或 `by viewModel()` 即可在 Android 元件中的任何位置檢索您的依賴。

```kotlin
class MyActivity : AppCompatActivity() {

  val myPresenter : MyPresenter by inject()

}
```

### 驅動 Kotlin 多平台

在行動平台之間共享程式碼是 Kotlin 多平台 (Kotlin Multiplatform) 的主要用例之一。透過 Kotlin Multiplatform Mobile，您可以建構跨平台行動應用程式，並在 Android 和 iOS 之間共享通用程式碼。

Koin 提供多平台依賴注入，並幫助您在原生行動應用程式以及網路/後端應用程式中建構您的元件。

### 效能與生產力

Koin 是一個純 Kotlin 框架，在使用和執行方面都設計得直接了當。它易於使用，不會影響您的編譯時間，也不需要任何額外的外掛程式配置。

## Koin：一個依賴注入框架

Koin 是一個受歡迎的 Kotlin 依賴注入 (DI) 框架，它提供了一個現代且輕量級的解決方案，用於管理應用程式的依賴，且只需最少的樣板程式碼。

### 依賴注入 vs. 服務定位器

雖然 Koin 可能看起來與服務定位器 (Service Locator) 模式相似，但它有一些關鍵區別：

- 服務定位器：服務定位器本質上是一個可用服務的註冊表，您可以在需要時請求服務的實例。它負責建立和管理這些實例，通常使用靜態的全域註冊表。

- 依賴注入：相反，Koin 是一個純粹的依賴注入框架。透過 Koin，您可以在模組中宣告您的依賴，Koin 則處理物件的建立和連結。它允許建立多個獨立模組，每個模組都有自己的作用域 (scopes)，從而使依賴管理更具模組化，並避免潛在的衝突。

### Koin 的方法：彈性與最佳實踐的結合

Koin 支援 DI 和服務定位器模式，為開發人員提供了彈性。然而，它強烈鼓勵使用 DI，特別是建構子注入 (constructor injection)，其中依賴作為建構子參數傳遞。這種方法提升了可測試性 (testability)，並使您的程式碼更容易理解。

Koin 的設計理念以簡潔和易於設定為中心，同時在必要時允許複雜的配置。透過使用 Koin，開發人員可以有效地管理依賴，其中 DI 是大多數情境下推薦且首選的方法。

### 透明度與設計概述

Koin 被設計為一個多功能的控制反轉 (Inversion of Control, IoC) 容器，同時支援依賴注入 (DI) 和服務定位器 (SL) 模式。為了讓您清晰地理解 Koin 的運作方式並指導您有效地使用它，讓我們探討以下幾個方面：

#### Koin 如何平衡 DI 和 SL

Koin 結合了 DI 和 SL 的元素，這可能會影響您使用該框架的方式：

1.  **全域上下文使用：** 預設情況下，Koin 提供一個全域可存取的元件，其作用類似於服務定位器。這讓您可以使用 `KoinComponent` 或 `inject` 函數從中央註冊表中檢索依賴。

2.  **獨立元件：** 儘管 Koin 鼓勵使用依賴注入，特別是建構子注入，但它也允許獨立元件。這種彈性意味著您可以將應用程式配置為在最有意義的地方使用 DI，同時仍可利用 SL 處理特定情境。

3.  **Android 元件中的 SL：** 在 Android 開發中，Koin 為了方便設定，經常在 `Application` 和 `Activity` 等元件內部使用 SL。從這一點來看，Koin 推薦使用 DI，特別是建構子注入，以更結構化的方式管理依賴。然而，這並非強制性，開發人員仍可根據需要靈活使用 SL。

#### 這對您為何重要

理解 DI 和 SL 之間的區別有助於有效管理應用程式的依賴：

-   **依賴注入：** Koin 鼓勵使用它，因為它在可測試性和可維護性方面具有優勢。建構子注入是首選，因為它使依賴關係明確，並增強程式碼清晰度。

-   **服務定位器：** 雖然 Koin 支援 SL 以提供便利性，尤其是在 Android 元件中，但僅依賴 SL 可能會導致更緊密的耦合和可測試性降低。Koin 的設計提供了一種平衡的方法，允許您在實用時使用 SL，但將 DI 推廣為最佳實踐。

#### 充分利用 Koin

為了有效使用 Koin：

-   **遵循最佳實踐：** 在可能的情況下使用建構子注入，以符合依賴管理的最佳實踐。這種方法可以提高可測試性和可維護性。

-   **利用 Koin 的彈性：** 在簡化設定的情境中利用 Koin 對 SL 的支援，但應以 DI 為核心應用程式依賴的管理方式。

-   **參考文件與範例：** 查閱 Koin 的文件和範例，了解如何根據專案需求適當地配置和使用 DI 和 SL。

-   **視覺化依賴管理：** 圖表和範例可以幫助闡明 Koin 如何解析依賴並在不同上下文中管理它們。這些視覺輔助工具可以提供對 Koin 內部運作方式更清晰的理解。

> 透過提供這些指導，我們旨在幫助您有效掌握 Koin 的功能和設計選擇，確保您能充分發揮其潛力，同時遵循依賴管理的最佳實踐。