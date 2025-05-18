---
title: "為什麼選擇 Koin？"
---
Koin 提供了一個簡單而有效的方式，將依賴注入（Dependency Injection）整合到任何 Kotlin 應用程式中 (多平台、Android、後端...)

Koin 的目標是：
- 使用智慧 API 簡化您的依賴注入基礎架構
- Kotlin DSL 易於閱讀、易於使用，讓您可以編寫任何類型的應用程式
- 提供來自 Android 生態系統的不同種類的整合，以滿足更多後端需求，如 Ktor
- 允許與註解（annotations）一起使用

## Koin 簡介

### 讓您的 Kotlin 開發變得輕鬆高效

Koin 是一個智慧的 Kotlin 依賴注入函式庫，讓您專注於您的應用程式，而不是工具。

```kotlin

class MyRepository()
class MyPresenter(val repository : MyRepository) 

// 宣告即可
val myModule = module { 
  singleOf(::MyPresenter)
  singleOf(::MyRepository)
}
```

Koin 為您提供簡單的工具和 API，讓您可以構建、組裝 Kotlin 相關技術到您的應用程式中，並讓您輕鬆擴展您的業務。

```kotlin
fun main() { 
  
  // 啟動 Koin 即可
  startKoin {
    modules(myModule)
  }
} 
```

### 準備好用於 Android

感謝 Kotlin 語言，Koin 擴展了 Android 平台，並提供了作為原始平台一部分的新功能。

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

Koin 提供了簡單而強大的 API，只需使用 `by inject()` 或 `by viewModel()` 即可在 Android 元件中的任何位置檢索您的依賴項。

```kotlin
class MyActivity : AppCompatActivity() {

  val myPresenter : MyPresenter by inject()

} 
```

### 為 Kotlin 多平台提供動力

在行動平台之間共享程式碼是 Kotlin Multiplatform 的主要用例之一。 使用 Kotlin Multiplatform Mobile，您可以構建跨平台的行動應用程式，並在 Android 和 iOS 之間共享通用程式碼。

Koin 提供了多平台依賴注入，並幫助在您的原生行動應用程式和 Web/後端應用程式中構建您的元件。

### 效能和生產力

Koin 是一個純 Kotlin 框架，旨在直接使用和執行。 它易於使用，並且不會影響您的編譯時間，也不需要任何額外的外掛程式配置。

## Koin：一個依賴注入框架

Koin 是一個流行的 Kotlin 依賴注入 (DI) 框架，提供現代且輕量級的解決方案，以最少的樣板程式碼管理應用程式的依賴項。

### 依賴注入 vs. 服務定位器

雖然 Koin 可能看起來與服務定位器（Service Locator）模式相似，但它們之間存在一些關鍵差異：

- 服務定位器：服務定位器本質上是一個可用服務的註冊表，您可以在需要時請求服務的實例。 它負責創建和管理這些實例，通常使用靜態的、全域的註冊表。

- 依賴注入：相反，Koin 是一個純粹的依賴注入框架。 使用 Koin，您可以在模組中宣告您的依賴項，而 Koin 負責物件的創建和連接。 它允許創建多個具有自己作用域的獨立模組，從而使依賴管理更加模組化並避免潛在的衝突。

### Koin 的方法：靈活性和最佳實踐的融合

Koin 同時支援 DI 和服務定位器模式，為開發人員提供靈活性。 但是，它強烈鼓勵使用 DI，特別是建構函式注入（constructor injection），其中依賴項作為建構函式參數傳遞。 這種方法可以提高可測試性，並使您的程式碼更易於理解。

Koin 的設計理念以簡單性和易於設定為中心，同時允許在必要時進行複雜的配置。 透過使用 Koin，開發人員可以有效地管理依賴項，其中 DI 是大多數情況下推薦和首選的方法。

### 透明度和設計概述

Koin 旨在成為一個通用的控制反轉 (Inversion of Control, IoC) 容器，支援依賴注入 (Dependency Injection, DI) 和服務定位器 (Service Locator, SL) 模式。 為了清楚地了解 Koin 的運作方式並指導您有效地使用它，讓我們探討以下幾個方面：

#### Koin 如何平衡 DI 和 SL

Koin 結合了 DI 和 SL 的元素，這可能會影響您使用該框架的方式：

1. **全域上下文使用：** 預設情況下，Koin 提供了一個全域可訪問的元件，該元件的作用類似於服務定位器。 這使您可以使用 `KoinComponent` 或 `inject` 函數從中央註冊表中檢索依賴項。

2. **隔離元件：** 儘管 Koin 鼓勵使用依賴注入，特別是建構函式注入，但它也允許使用隔離元件。 這種靈活性意味著您可以配置您的應用程式以在最合理的地方使用 DI，同時仍然可以利用 SL 處理特定情況。

3. **Android 元件中的 SL：** 在 Android 開發中，Koin 通常在 `Application` 和 `Activity` 等元件中內部使用 SL，以便於設定。 從這一點開始，Koin 建議使用 DI，尤其是建構函式注入，以更結構化的方式管理依賴項。 但是，這不是強制性的，開發人員可以靈活地在需要時使用 SL。

#### 這對您來說為什麼重要

了解 DI 和 SL 之間的區別有助於有效地管理應用程式的依賴項：

- **依賴注入：** Koin 鼓勵使用 DI，因為它在可測試性和可維護性方面具有優勢。 優先使用建構函式注入，因為它可以使依賴項更加明確並提高程式碼的清晰度。

- **服務定位器：** 儘管 Koin 支援 SL 以提供便利性，尤其是在 Android 元件中，但僅僅依賴 SL 可能會導致更緊密的耦合和降低可測試性。 Koin 的設計提供了一種平衡的方法，允許您在實用的情況下使用 SL，但提倡 DI 作為最佳實踐。

#### 充分利用 Koin

為了有效地使用 Koin：

- **遵循最佳實踐：** 盡可能使用建構函式注入，以符合依賴項管理中的最佳實踐。 這種方法可以提高可測試性和可維護性。

- **利用 Koin 的靈活性：** 在簡化設定的情況下，利用 Koin 對 SL 的支援，但目標是依賴 DI 來管理核心應用程式依賴項。

- **參考文件和範例：** 查看 Koin 的文件和範例，以了解如何根據您的專案需求適當地配置和使用 DI 和 SL。

- **可視化依賴項管理：** 圖表和範例可以幫助說明 Koin 如何解析依賴項並在不同上下文中管理它們。 這些視覺輔助工具有助於更清楚地了解 Koin 的內部運作方式。

> 透過提供此指導，我們旨在幫助您有效地瀏覽 Koin 的功能和設計選擇，確保您可以充分利用其潛力，同時遵守依賴項管理中的最佳實踐。