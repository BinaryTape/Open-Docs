---
title: Android 作用域
---

## 處理 Android 生命週期

Android 組件主要由其生命週期管理：我們無法直接實例化 Activity 或 Fragment。系統為我們執行所有建立和管理，並在方法中進行回呼：`onCreate`、`onStart` 等。

這就是為什麼我們無法在 Koin 模組中描述我們的 Activity/Fragment/Service。因此，我們需要將依賴注入到屬性中，並同時尊重生命週期：與 UI 部分相關的組件在我們不再需要它們時必須立即釋放。

然後我們有：

*   長生命週期組件 (服務、資料儲存庫等) - 被多個螢幕使用，永不丟棄
*   中生命週期組件 (使用者會話等) - 被多個螢幕使用，必須在一段時間後丟棄
*   短生命週期組件 (視圖) - 僅被一個螢幕使用，並且必須在螢幕結束時丟棄

長生命週期組件可以很容易地描述為 `single` 定義。對於中生命週期和短生命週期組件，我們可以使用多種方法。

在 MVP 架構風格中，`Presenter` 是一個短生命週期組件，用於幫助/支援 UI。`Presenter` 必須在螢幕顯示時建立，並在螢幕消失後丟棄。

每次都會建立一個新的 Presenter

```kotlin
class DetailActivity : AppCompatActivity() {

    // injected Presenter
    override val presenter : Presenter by inject()
```

我們可以在模組中描述它：

*   作為 `factory` - 每次呼叫 `by inject()` 或 `get()` 時產生一個新實例

```kotlin
val androidModule = module {

    // Factory instance of Presenter
    factory { Presenter() }
}
```

*   作為 `scope` - 產生一個綁定到作用域的實例

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
大多數 Android 記憶體洩漏都來自於從非 Android 組件參照 UI/Android 組件。系統會保留對其的參照，因此無法通過垃圾回收 (garbage collection) 完全丟棄它。
:::

## Android 組件的作用域 (自 3.2.1 版起)

### 宣告 Android 作用域

要為 Android 組件設定依賴作用域，您必須使用 `scope` 區塊宣告一個作用域部分，如下所示：

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // Declare scope for MyActivity
  scope<MyActivity> {
   // get MyPresenter instance from current scope 
   scoped { MyAdapter(get()) }
   scoped { MyPresenter() }
  }
 
  // 或
  activityScope {
   scoped { MyAdapter(get()) }
   scoped { MyPresenter() }
  }
}
```

### Android 作用域類別

Koin 提供了 `ScopeActivity`、`RetainedScopeActivity` 和 `ScopeFragment` 類別，讓您可以直接為 Activity 或 Fragment 使用宣告的作用域：

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenter is resolved from MyActivity's scope 
    val presenter : MyPresenter by inject()
}
```

在底層，Android 作用域需要與 `AndroidScopeComponent` 介面一起使用，以實作 `scope` 欄位，如下所示：

```kotlin
abstract class ScopeActivity(
    @LayoutRes contentLayoutId: Int = 0,
) : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        checkNotNull(scope)
    }
}
```

我們需要使用 `AndroidScopeComponent` 介面並實作 `scope` 屬性。這將設定您的類別所使用的預設作用域。

### Android 作用域 API

要建立一個綁定到 Android 組件的 Koin 作用域，只需使用以下函數：
- `createActivityScope()` - 為當前 Activity 建立作用域 (必須宣告作用域部分)
- `createActivityRetainedScope()` - 為當前 Activity 建立一個保留的作用域 (由 ViewModel 生命周期支援) (必須宣告作用域部分)
- `createFragmentScope()` - 為當前 Fragment 建立作用域並連結到父 Activity 作用域

這些函數作為委派 (delegate) 提供，以實作不同類型的作用域：

- `activityScope()` - 為當前 Activity 建立作用域 (必須宣告作用域部分)
- `activityRetainedScope()` - 為當前 Activity 建立一個保留的作用域 (由 ViewModel 生命周期支援) (必須宣告作用域部分)
- `fragmentScope()` - 為當前 Fragment 建立作用域並連結到父 Activity 作用域

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

我們還可以透過以下方式設定一個保留的作用域 (由 ViewModel 生命周期支援)：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
如果您不想使用 Android 作用域類別，您可以使用自己的類別並將 `AndroidScopeComponent` 與作用域建立 API 一起使用。
:::

### AndroidScopeComponent 和作用域關閉處理

您可以透過覆寫 `AndroidScopeComponent` 中的 `onCloseScope` 函數，在 Koin 作用域被銷毀之前執行一些程式碼：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // Called before closing the Scope
    }
}
```

:::note
如果您嘗試從 `onDestroy()` 函數訪問作用域，作用域將已被關閉。
:::

### 作用域原型 (4.1.0)

作為一項新功能，您現在可以透過 **原型** 來宣告作用域：您不需要針對特定類型定義作用域，而是針對一個「原型」(一種作用域類別)。您可以為「Activity」、「Fragment」或「ViewModel」宣告作用域。
您現在可以使用以下 DSL 區塊：

```kotlin
module {
 activityScope {
  // 為一個 Activity 作用域化的實例
 }

 activityRetainedScope {
  // 為一個 Activity 作用域化的實例，保留作用域
 }

 fragmentScope {
  // 為 Fragment 作用域化的實例
 }

 viewModelScope {
  // 為 ViewModel 作用域化的實例
 }
}
```

這使得在不同作用域之間更容易重用定義。除了您需要在精確物件上作用域外，無需使用像 `scope<>{ }` 這樣的特定類型。

:::info
請參閱 [Android 作用域 API](#android-scope-api)，了解如何使用 `by activityScope()`、`by activityRetainedScope()` 和 `by fragmentScope()` 函數來啟用您的 Android 作用域。這些函數將觸發作用域原型。
:::

例如，您可以使用作用域原型輕鬆地將定義作用域到一個 Activity 中，如下所示：

```kotlin
// 在 Activity 作用域中宣告 Session 類別
module {
 activityScope {
    scopedOf(::Session)
 }
}

// 將作用域化的 Session 物件注入到 Activity 中：
class MyActivity : AppCompatActivity(), AndroidScopeComponent {
    
    // 建立 Activity 的作用域
    val scope: Scope by activityScope() 
    
    // 從上方作用域注入
    val session: Session by inject()
}
```

### ViewModel 作用域 (於 4.1.0 更新)

ViewModel 僅針對根作用域建立，以避免任何洩漏 (洩漏 Activity 或 Fragment 等)。這為可見性問題提供了保護，因為 ViewModel 可能會訪問不相容的作用域。

:::warn
ViewModel 無法訪問 Activity 或 Fragment 作用域。為什麼？因為 ViewModel 的生命週期比 Activity 和 Fragment 更長，因此它會將依賴項洩漏到適當作用域之外。
如果您需要從 ViewModel 作用域外部橋接 (bridge) 依賴項，您可以使用「注入參數」(injected parameters) 將一些物件傳遞給您的 ViewModel：`viewModel { p -> }`
:::

請依照以下方式宣告您的 ViewModel 作用域，將其綁定到您的 ViewModel 類別或使用 `viewModelScope` DSL 區塊：

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    // 僅用於 MyScopeViewModel 的作用域
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }
    // ViewModel 原型作用域 - 所有 ViewModel 的作用域
    viewModelScope {
        scopedOf(::Session)
    }
}
```

一旦您宣告了您的 ViewModel 和作用域化的組件，您可以_在以下選項中選擇_：
- 手動 API - 手動使用 `KoinScopeComponent` 和 `viewModelScope` 函數。這將處理您所建立的 ViewModel 作用域的建立和銷毀。但是，您將必須透過欄位注入您的作用域定義，因為您需要依賴 `scope` 屬性來注入您的作用域定義：
```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {
    
    // 建立 ViewModel 作用域
    override val scope: Scope = viewModelScope()
    
    // 使用上方作用域注入 session
    val session: Session by inject()
}
```
- 自動作用域建立
    - 啟用 `viewModelScopeFactory` 選項 (請參閱 [Koin 選項](../koin-core/start-koin.md#koin-options---feature-flagging)) 以在運行時自動建立 ViewModel 作用域。
    - 這允許使用建構函數注入
```kotlin
// 啟用 ViewModel 作用域工廠
startKoin {
    options(
        viewModelScopeFactory()
    )
}

// 作用域在工廠層級自動建立，在注入之前
class MyScopeViewModel(val session: Session) : ViewModel()
```

現在只需從您的 Activity 或 Fragment 呼叫您的 ViewModel：

```kotlin
class MyActivity : AppCompatActivity() {
    
    // 建立 MyScopeViewModel 實例，並分配 MyScopeViewModel 的作用域
    val vieModel: MyScopeViewModel by viewModel()
}
```

## 作用域連結

作用域連結允許在具有自訂作用域的組件之間共享實例。預設情況下，Fragment 的作用域會連結到父 Activity 作用域。

在更廣泛的用法中，您可以在組件之間使用 `Scope` 實例。例如，如果我們需要共享一個 `UserSession` 實例。

首先，宣告一個作用域定義：

```kotlin
module {
    // 共享使用者會話資料
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

當需要開始使用 `UserSession` 實例時，為其建立一個作用域：

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// 將 ourSession 作用域連結到當前 `scope`，來自 ScopeActivity 或 ScopeFragment
scope.linkTo(ourSession)
```

然後在您需要的任何地方使用它：

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // 將 ourSession 作用域連結到當前 `scope`，來自 ScopeActivity 或 ScopeFragment
        scope.linkTo(ourSession)

        // 將查看 MyActivity1 的作用域 + ourSession 作用域來解析
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // 將 ourSession 作用域連結到當前 `scope`，來自 ScopeActivity 或 ScopeFragment
        scope.linkTo(ourSession)

        // 將查看 MyActivity2 的作用域 + ourSession 作用域來解析
        val userSession = get<UserSession>()
    }
}
```