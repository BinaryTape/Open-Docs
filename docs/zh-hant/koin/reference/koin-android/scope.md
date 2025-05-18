---
title: "管理 Android 作用域 (Scopes)"
---
## 使用 Android 生命週期

Android 元件主要由它們的生命週期 (lifecycle) 管理：我們不能直接實例化一個 Activity 或 Fragment。系統
會為我們完成所有的建立和管理工作，並在方法上進行回呼 (callbacks)：onCreate、onStart...

這就是為什麼我們不能在 Koin 模組中描述我們的 Activity/Fragment/Service。然後，我們需要將依賴注入到屬性中，並且還要
遵守生命週期：與 UI 部分相關的元件必須在我們不再需要它們時立即釋放。

然後我們有：

* 長生命週期元件（Services、Data Repository ...）- 被多個畫面使用，永遠不會被丟棄
* 中等生命週期元件（使用者 Session ...）- 被多個畫面使用，必須在一段時間後丟棄
* 短生命週期元件（views）- 僅被一個畫面使用，並且必須在畫面結束時丟棄

長生命週期元件可以很容易地描述為 `single` 定義。對於中等和短生命週期元件，我們有幾種方法。

在 MVP 架構風格的情況下，`Presenter` 是一個短生命週期元件，用於幫助/支援 UI。Presenter 必須在每次顯示畫面時建立，
並在畫面消失後丟棄。

每次都會建立一個新的 Presenter

```kotlin
class DetailActivity : AppCompatActivity() {

    // 注入的 Presenter
    override val presenter : Presenter by inject()
```

我們可以在模組中描述它：

* 作為 `factory` - 每次呼叫 `by inject()` 或 `get()` 時都會產生一個新實例

```kotlin
val androidModule = module {

    // Presenter 的 Factory 實例
    factory { Presenter() }
}
```

* 作為 `scope` - 產生一個與作用域 (scope) 綁定的實例

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
大多數 Android 記憶體洩漏來自於從非 Android 元件引用 UI/Android 元件。系統會保持對它的引用，並且無法透過垃圾回收完全丟棄它。
:::

## Android 元件的作用域 (Scope)（自 3.2.1 起）

### 宣告 Android 作用域

要將依賴項的作用域限定於 Android 元件，您必須使用 `scope` 程式碼區塊宣告一個作用域區段，如下所示：

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // 宣告 MyActivity 的作用域
  scope<MyActivity> {
    // 從目前作用域取得 MyPresenter 實例
    scoped { MyAdapter(get()) }
    scoped { MyPresenter() }
  }
}
```

### Android 作用域類別

Koin 提供 `ScopeActivity`、`RetainedScopeActivity` 和 `ScopeFragment` 類別，讓您可以直接使用為 Activity 或 Fragment 宣告的作用域：

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenter 從 MyActivity 的作用域解析
    val presenter : MyPresenter by inject()
}
```

在底層，Android 作用域需要與 `AndroidScopeComponent` 介面一起使用才能實作 `scope` 欄位，如下所示：

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

我們需要使用 `AndroidScopeComponent` 介面並實作 `scope` 屬性。這將設定您的類別使用的預設作用域。

### Android 作用域 API

要建立一個繫結到 Android 元件的 Koin 作用域，只需使用以下函數：
- `createActivityScope()` - 為目前的 Activity 建立作用域（必須宣告作用域區段）
- `createActivityRetainedScope()` - 為目前的 Activity 建立保留的作用域（由 ViewModel 生命週期支援）（必須宣告作用域區段）
- `createFragmentScope()` - 為目前的 Fragment 建立作用域並連結到父 Activity 作用域

這些函數可用作委託，以實作不同種類的作用域：

- `activityScope()` - 為目前的 Activity 建立作用域（必須宣告作用域區段）
- `activityRetainedScope()` - 為目前的 Activity 建立保留的作用域（由 ViewModel 生命週期支援）（必須宣告作用域區段）
- `fragmentScope()` - 為目前的 Fragment 建立作用域並連結到父 Activity 作用域

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

我們也可以使用以下方法設定保留的作用域（由 ViewModel 生命週期支援）：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
如果您不想使用 Android 作用域類別，您可以使用您自己的類別並將 `AndroidScopeComponent` 與作用域建立 API 一起使用
:::

### AndroidScopeComponent 和作用域關閉處理

您可以在 Koin 作用域被銷毀之前執行一些程式碼，方法是覆寫 `AndroidScopeComponent` 中的 `onCloseScope` 函數：

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // 在關閉作用域之前呼叫
    }
}
```

:::note
如果您嘗試從 `onDestroy()` 函數存取作用域，則作用域將已關閉。
:::

### ViewModel 作用域 (Scope)（自 3.5.4 起）

ViewModel 僅針對根作用域建立，以避免任何洩漏（洩漏 Activity 或 Fragment ...）。這保護了可見性問題，其中 ViewModel 可能可以存取不相容的作用域。

:::warn
ViewModel 無法存取 Activity 或 Fragment 作用域。為什麼？因為 ViewModel 的持續時間比 Activity 和 Fragment 長，然後它會將依賴項洩漏到適當的作用域之外。
:::

:::note
如果您 _真的_ 需要橋接 ViewModel 作用域外部的依賴項，您可以使用「注入的參數」將一些物件傳遞到您的 ViewModel：`viewModel { p ->  }`
:::

`ScopeViewModel` 是一個新的類別，用於協助處理 ViewModel 作用域。這處理 ViewModel 的作用域建立，並提供 `scope` 屬性以允許使用 `by scope.inject()` 注入：

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }    
}

class MyScopeViewModel : ScopeViewModel() {

    // 在 onCleared 時，作用域會關閉
    
    // 從目前的 MyScopeViewModel 的作用域注入
    val session by scope.inject<Session>()

}
```

透過使用 `ScopeViewModel`，您還可以覆寫 `onCloseScope()` 函數，以在關閉作用域之前執行程式碼。

:::note
ViewModel 作用域內的所有實例都具有相同的可見性，並且將在 ViewModel 實例的生命週期內存在，直到呼叫 ViewModel 的 onCleared 函數
:::

例如，一旦 Activity 或 Fragment 建立了一個 ViewModel，就會建立相關聯的作用域：

```kotlin
class MyActivity : AppCompatActivity() {

    // 建立 ViewModel 及其作用域
    val myViewModel by viewModel<MyScopeViewModel>()

}
```

一旦建立您的 ViewModel，就可以建立和注入來自此作用域內的所有相關聯的依賴項。

要手動實作您的 ViewModel 作用域而不使用 `ScopeViewModel` 類別，請按如下方式進行：

```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {

    override val scope: Scope = createScope(this)

    // 注入您的依賴項
    val session by scope.inject<Session>()

    // 清除作用域
    override fun onCleared() {
        super.onCleared()
        scope.close()
    }
}
```

## 作用域連結 (Scope Links)

作用域連結允許在使用自定義作用域的元件之間共享實例。

在更廣泛的用法中，您可以在元件之間使用 `Scope` 實例。例如，如果我們需要共享一個 `UserSession` 實例。

首先宣告一個作用域定義：

```kotlin
module {
    // 共享使用者 Session 資料
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

當需要開始使用 `UserSession` 實例時，為它建立一個作用域：

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// 將 ourSession 作用域連結到目前的 `scope`，來自 ScopeActivity 或 ScopeFragment
scope.linkTo(ourSession)
```

然後在您需要的任何地方使用它：

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // 將 ourSession 作用域連結到目前的 `scope`，來自 ScopeActivity 或 ScopeFragment
        scope.linkTo(ourSession)

        // 將在 MyActivity1 的 Scope + ourSession 作用域中尋找以解析
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // 將 ourSession 作用域連結到目前的 `scope`，來自 ScopeActivity 或 ScopeFragment
        scope.linkTo(ourSession)

        // 將在 MyActivity2 的 Scope + ourSession 作用域中尋找以解析
        val userSession = get<UserSession>()
    }
}
```