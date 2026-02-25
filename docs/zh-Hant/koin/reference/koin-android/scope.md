---
title: Android 作用域
---

## 處理 Android 生命週期

Android 組件主要由其生命週期管理：我們無法直接具現化（instantiate）一個 `Activity` 或 `Fragment`。系統會為我們處理所有的建立與管理，並在特定方法上進行回呼（callbacks）：`onCreate`、`onStart` 等。

這就是為什麼我們不能在 Koin 模組中描述我們的 `Activity`/`Fragment`/`Service`。因此，我們需要將相依性注入到屬性中，同時也要遵守生命週期：與 UI 部分相關的組件必須在不再需要時立即釋放。

於是我們有：

* 長期存續組件（Services、Data Repository ...）- 由多個畫面使用，永不卸載
* 中期存續組件（使用者工作階段 ...）- 由多個畫面使用，必須在一段時間後卸載
* 短期存續組件（views）- 僅由一個畫面使用，且必須在畫面結束時卸載

長期存續組件可以輕易地被描述為 `single` 定義。對於中期與短期存續組件，我們可以有幾種做法。

在 MVP 架構模式的情況下，`Presenter` 是一個用來協助／支援 UI 的短期存續組件。`Presenter` 必須在每次畫面顯示時建立，並在畫面消失時卸載。

每次都會建立一個新的 `Presenter`：

```kotlin
class DetailActivity : AppCompatActivity() {

    // 注入的 Presenter
    override val presenter : Presenter by inject()
```

我們可以在模組中按以下方式描述：

* 作為 `factory` - 每次呼叫 `by inject()` 或 `get()` 時都會產生一個新的執行個體

```kotlin
val androidModule = module {

    // Presenter 的 Factory 執行個體
    factory { Presenter() }
}
```

* 作為 `scope` - 產生一個繫結到作用域的執行個體

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
大多數 Android 記憶體洩漏源於從非 Android 組件參照 UI/Android 組件。系統會保持對其參照，且無法透過垃圾收集將其完全卸載。
:::

## Android 組件的作用域 (自 3.2.1)

### 宣告 Android 作用域

若要將相依性限定在 Android 組件的作用域內，您必須使用 `scope` 區塊宣告作用域部分，如下所示：

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // 為 MyActivity 宣告作用域
  scope<MyActivity> {
   // 從目前作用域取得 MyPresenter 執行個體 
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

Koin 提供 `ScopeActivity`、`RetainedScopeActivity` 與 `ScopeFragment` 類別，讓您直接在 `Activity` 或 `Fragment` 中使用宣告的作用域：

```kotlin
class MyActivity : ScopeActivity() {
    
    // 從 MyActivity 的作用域解析 MyPresenter 
    val presenter : MyPresenter by inject()
}
```

在底層，Android 作用域需要搭配 `AndroidScopeComponent` 介面來實作 `scope` 欄位，如下所示：

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

我們需要使用 `AndroidScopeComponent` 介面並實作 `scope` 屬性。這將設定您類別所使用的預設作用域。

### Android 作用域 API

要建立繫結至 Android 組件的 Koin 作用域，只需使用以下函式：
- `createActivityScope()` - 為目前的 `Activity` 建立作用域（必須宣告作用域部分）
- `createActivityRetainedScope()` - 為目前的 `Activity` 建立保留作用域（由 `ViewModel` 生命週期支援）（必須宣告作用域部分）
- `createFragmentScope()` - 為目前的 `Fragment` 建立作用域，並連結到父級 `Activity` 作用域

這些函式可作為委託使用，用以實作不同種類的作用域：

- `activityScope()` - 為目前的 `Activity` 建立作用域（必須宣告作用域部分）
- `activityRetainedScope()` - 為目前的 `Activity` 建立保留作用域（由 `ViewModel` 生命週期支援）（必須宣告作用域部分）
- `fragmentScope()` - 為目前的 `Fragment` 建立作用域，並連結到父級 `Activity` 作用域

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

我們也可以透過以下方式設定保留作用域（由 `ViewModel` 生命週期支援）：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
如果您不想使用 Android 作用域類別，您可以處理自己的類別，並將 `AndroidScopeComponent` 與作用域建立 API 搭配使用。
:::

### AndroidScopeComponent 與處理作用域關閉

您可以透過覆寫 `AndroidScopeComponent` 的 `onCloseScope` 函式，在 Koin 作用域被銷毀前執行程式碼：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // 在關閉作用域前呼叫
    }
}
```

:::note
如果您嘗試從 `onDestroy()` 函式存取作用域，該作用域將已經關閉。
:::

### 作用域原型 (4.1.0)

作為一項新功能，您現在可以透過 **原型 (archetype)** 宣告作用域：您不需要針對特定型別定義作用域，而是針對「原型」（一種作用域類別）。您可以為 "Activity"、"Fragment" 或 "ViewModel" 宣告作用域。
您現在可以使用以下 DSL 區塊：

```kotlin
module {
 activityScope {
  // 為 activity 提供的作用域執行個體
 }

 activityRetainedScope {
  // 為 activity 提供的作用域執行個體，保留作用域
 }

 fragmentScope {
  // 為 Fragment 提供的作用域執行個體
 }

 viewModelScope {
  // 為 ViewModel 提供的作用域執行個體
 }
}
```

這可以更輕鬆地在作用域之間重複使用定義。除非您需要在精確的物件上設定作用域，否則不需要使用像 `scope<>{ }` 這樣的特定型別。

:::info
請參閱 [Android 作用域 API](#android-scope-api) 以了解如何使用 `by activityScope()`、`by activityRetainedScope()` 和 `by fragmentScope()` 函式來啟動您的 Android 作用域。這些函式將會觸發作用域原型。
:::

例如，使用作用域原型，您可以輕易地將定義限定在一個 activity 的作用域內，如下所示：

```kotlin
// 在 Activity 作用域中宣告 Class Session
module {
 activityScope {
    scopedOf(::Session)
 }
}

// 將限定作用域的 Session 物件注入到 activity：
class MyActivity : AppCompatActivity(), AndroidScopeComponent {
    
    // 建立 Activity 的作用域
    val scope: Scope by activityScope() 
    
    // 從上方作用域注入
    val session: Session by inject()
}
```

### ViewModel 作用域 (4.1.0 更新)

`ViewModel` 僅針對根作用域建立，以避免任何洩漏（洩漏 `Activity` 或 `Fragment` ...）。這防止了可見性問題，即 `ViewModel` 可能會存取到不相容的作用域。

:::warn
`ViewModel` 無法存取 `Activity` 或 `Fragment` 作用域。原因為何？因為 `ViewModel` 的存續時間比 `Activity` 和 `Fragment` 長，這樣做會導致相依性洩漏到正確的作用域之外。
如果您需要從 `ViewModel` 作用域外部橋接相依性，您可以使用「注入參數」將某些物件傳遞給您的 `ViewModel`：`viewModel { p -> }`
:::

宣告您的 `ViewModel` 作用域如下，可以繫結至您的 `ViewModel` 類別或使用 `viewModelScope` DSL 區塊：

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    // 僅針對 MyScopeViewModel 的作用域
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }
    // ViewModel 原型作用域 - 所有 ViewModel 的作用域 
    viewModelScope {
        scopedOf(::Session)
    }
}
```

一旦您宣告了 `ViewModel` 及其限定作用域的組件，您可以 _擇一使用_：
- 手動 API - 手動使用 `KoinScopeComponent` 和 `viewModelScope` 函式。這將處理您所建立之 `ViewModel` 作用域的建立與銷毀。但您必須透過欄位注入限定作用域的定義，因為您需要依賴 `scope` 屬性來注入您的定義：
```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {
    
    // 建立 ViewModel 作用域
    override val scope: Scope = viewModelScope()
    
    // 使用上方作用域注入 session
    val session: Session by inject()
}
```
- 自動作用域建立
    - 啟動 `viewModelScopeFactory` 選項（請參閱 [Koin 選項](../koin-core/start-koin.md#koin-options---feature-flagging)）以即時自動建立 `ViewModel` 作用域。
    - 這允許使用建構函式注入
```kotlin
// 啟動 ViewModel 作用域 factory
startKoin {
    options(
        viewModelScopeFactory()
    )
}

// 作用域在 factory 層級建立，在注入前自動完成
class MyScopeViewModel(val session: Session) : ViewModel()
```

現在只需從您的 `Activity` 或 `Fragment` 呼叫您的 `ViewModel`：

```kotlin
class MyActivity : AppCompatActivity() {
    
    // 建立 MyScopeViewModel 執行個體，並分配 MyScopeViewModel 的作用域
    val vieModel: MyScopeViewModel by viewModel()
}
```

## 作用域連結

作用域連結允許在具有自訂作用域的組件之間共享執行個體。預設情況下，`Fragment` 的作用域會連結到父級 `Activity` 作用域。

在更擴展的用法中，您可以跨組件使用 `Scope` 執行個體。例如，如果我們需要共享一個 `UserSession` 執行個體。

首先，宣告一個作用域定義：

```kotlin
module {
    // 共享的使用者工作階段資料
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

當需要開始使用 `UserSession` 執行個體時，為其建立一個作用域：

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// 將 ourSession 作用域連結到目前來自 ScopeActivity 或 ScopeFragment 的 `scope`
scope.linkTo(ourSession)
```

然後在您需要的任何地方使用它：

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // 將 ourSession 作用域連結到目前來自 ScopeActivity 或 ScopeFragment 的 `scope`
        scope.linkTo(ourSession)

        // 將查看 MyActivity1 的作用域 + ourSession 作用域來進行解析
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // 將 ourSession 作用域連結到目前來自 ScopeActivity 或 ScopeFragment 的 `scope`
        scope.linkTo(ourSession)

        // 將查看 MyActivity2 的作用域 + ourSession 作用域來進行解析
        val userSession = get<UserSession>()
    }
}