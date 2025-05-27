---
title: 管理 Android 作用域
---

## 處理 Android 生命周期

Android 組件主要由其生命週期管理：我們無法直接實例化 Activity 或 Fragment。系統為我們執行所有建立和管理，並在方法中進行回呼 (callbacks)：`onCreate`、`onStart` 等。

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

### ViewModel 作用域 (自 3.5.4 版起)

ViewModel 僅針對根作用域建立，以避免任何洩漏 (洩漏 Activity 或 Fragment 等)。這為可見性問題提供了保護，因為 ViewModel 可能會訪問不相容的作用域。

:::warn
ViewModel 無法訪問 Activity 或 Fragment 作用域。為什麼？因為 ViewModel 的生命週期比 Activity 和 Fragment 更長，因此它會將依賴項洩漏到適當作用域之外。
:::

:::note
如果您**確實**需要從 ViewModel 作用域外部橋接 (bridge) 依賴項，您可以使用「注入參數」(injected parameters) 將一些物件傳遞給您的 ViewModel：`viewModel { p -> }`
:::

`ScopeViewModel` 是一個新的類別，用於幫助在 ViewModel 作用域上工作。它處理 ViewModel 作用域的建立，並提供 `scope` 屬性以允許使用 `by scope.inject()` 注入：

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }    
}

class MyScopeViewModel : ScopeViewModel() {

    // on onCleared, scope is closed
    
    // injected from current MyScopeViewModel's scope
    val session by scope.inject<Session>()

}
```

透過使用 `ScopeViewModel`，您還可以覆寫 `onCloseScope()` 函數，以便在作用域關閉之前執行程式碼。

:::note
ViewModel 作用域內的所有實例都具有相同的可見性，並將在 ViewModel 實例的生命週期內存在，直到呼叫 ViewModel 的 `onCleared` 函數。
:::

例如，一旦 Activity 或 fragment 建立了一個 ViewModel，就會建立關聯的作用域：

```kotlin
class MyActivity : AppCompatActivity() {

    // Create ViewModel and its scope
    val myViewModel by viewModel<MyScopeViewModel>()

}
```

一旦您的 ViewModel 被建立，此作用域內的所有相關依賴項都可以被建立和注入。

如果沒有 `ScopeViewModel` 類別，要手動實作您的 ViewModel 作用域，請按以下步驟操作：

```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {

    override val scope: Scope = createScope(this)

    // inject your dependency
    val session by scope.inject<Session>()

    // clear scope
    override fun onCleared() {
        super.onCleared()
        scope.close()
    }
}
```

## 作用域連結

作用域連結 (Scope Links) 允許在具有自訂作用域的組件之間共享實例。

在更廣泛的用法中，您可以在組件之間使用 `Scope` 實例。例如，如果我們需要共享一個 `UserSession` 實例。

首先宣告一個作用域定義：

```kotlin
module {
    // Shared user session data
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

當需要開始使用 `UserSession` 實例時，為其建立一個作用域：

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// link ourSession scope to current `scope`, from ScopeActivity or ScopeFragment
scope.linkTo(ourSession)
```

然後在您需要的任何地方使用它：

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // link ourSession scope to current `scope`, from ScopeActivity or ScopeFragment
        scope.linkTo(ourSession)

        // will look at MyActivity1's Scope + ourSession scope to resolve
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // link ourSession scope to current `scope`, from ScopeActivity or ScopeFragment
        scope.linkTo(ourSession)

        // will look at MyActivity2's Scope + ourSession scope to resolve
        val userSession = get<UserSession>()
    }
}