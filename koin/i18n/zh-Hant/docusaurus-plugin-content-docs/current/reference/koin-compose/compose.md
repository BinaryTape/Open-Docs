---
title: "用於 Jetpack Compose 和 Compose Multiplatform 的 Koin"
---
此頁面說明如何為您的 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 或 [Multiplaform Compose](https://www.jetbrains.com/lp/compose-mpp/) 應用程式注入依賴項 (dependencies)。

## Koin Compose Multiplatform vs Koin Android Jetpack Compose

自 2024 年中以來，Compose 應用程式可以使用 Koin Multiplatform API 完成。所有 API 在 Koin Jetpack Compose (koin-androidx-compose) 和 Koin Compose Multiplatform (koin-compose) 之間都是相同的。

### Compose 應該使用哪個 Koin 套件？

對於僅使用 Android Jetpack Compose API 的純 Android 應用程式，請使用以下套件：
- `koin-androidx-compose` - 解鎖 Compose 基礎 API + Compose ViewModel API
- `koin-androidx-compose-navigation` - 整合 Navigation API 的 Compose ViewModel API

對於 Android/Multiplatform 應用程式，請使用以下套件：
- `koin-compose` - Compose 基礎 API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - 整合 Navigation API 的 Compose ViewModel API

## 重新啟動現有的 Koin Context (Koin 已經啟動)

有時 `startKoin` 函數已在應用程式中使用，以便在您的應用程式中啟動 Koin (例如在 Android 主應用程式類別 Application class 中)。在這種情況下，您需要使用 `KoinContext` 或 `KoinAndroidContext` 將目前的 Koin Context 通知您的 Compose 應用程式。這些函數會重複使用目前的 Koin Context 並將其繫結到 Compose 應用程式。

```kotlin
@Composable
fun App() {
    // Set current Koin instance to Compose context
    KoinContext() {

        MyScreen()
    }
}
```

:::info
`KoinAndroidContext` 和 `KoinContext` 之間的區別：
- `KoinAndroidContext` 正在目前的 Android 應用程式 Context 中尋找 Koin 實例
- `KoinContext` 正在目前的 GlobalContext 中尋找 Koin 實例
:::

:::note
如果您從 Composable 收到 `ClosedScopeException`，請在您的 Composable 上使用 `KoinContext`，或確保具有適當的 Koin 啟動配置 [使用 Android Context](/reference/koin-android/start.md)
:::

## 使用 Compose App 啟動 Koin - KoinApplication

函數 `KoinApplication` 幫助建立 Koin 應用程式實例，作為一個 Composable：

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // your screens here ...
        MyScreen()
    }
}
```

`KoinApplication` 函數將處理 Koin Context 的啟動和停止，關於 Compose Context 的週期。此函數會啟動和停止一個新的 Koin 應用程式 Context。

:::info
在 Android 應用程式中，`KoinApplication` 將處理任何需要停止/重新啟動 Koin Context 的需求，關於配置更改或 Activities 的丟棄。
:::

:::note
這取代了使用傳統的 `startKoin` 應用程式函數。
:::

### 使用 Koin 進行 Compose 預覽

`KoinApplication` 函數可用於為預覽啟動專用 Context。這也可以用於幫助進行 Compose 預覽：

```kotlin
@Composable
@Preview
fun App() {
    KoinApplication(application = {
        // your preview config here
        modules(previewModule)
    }) {
        // Compose to preview with Koin
    }
}
```

## 注入到 @Composable 中

在編寫您的 composable 函數時，您可以存取以下 Koin API：`koinInject()`，以從 Koin 容器注入實例 (instance)。

對於宣告 'MyService' 元件的模組：

```kotlin
val androidModule = module {
    single { MyService() }
    // or constructor DSL
    singleOf(::MyService)
}
```

我們可以像這樣獲取您的實例：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

為了與 Jetpack Compose 的功能方面保持一致，最好的編寫方法是將實例直接注入到函數參數中。這種方式允許使用 Koin 進行預設實作，但保持開放以您想要的方式注入實例。

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### 將參數注入到 @Composable 中

當您從 Koin 請求新的依賴項時，您可能需要注入參數。為此，您可以使用 `koinInject` 函數的 `parameters` 參數，以及 `parametersOf()` 函數，如下所示：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
您可以使用帶有 lambda 注入的參數，例如 `koinInject<MyService>{ parametersOf("a_string") }`，但如果您的周圍進行大量重組 (recomposing)，這可能會對效能產生影響。此 lambda 版本需要在呼叫時解包您的參數，以幫助避免記住您的參數。

從 Koin 的 4.0.2 版本開始，引入了 koinInject(Qualifier,Scope,ParametersHolder) 讓您以最有效的方式使用參數
:::

## @Composable 的 ViewModel

與您可以存取經典的 single/factory 實例的方式相同，您可以存取以下 Koin ViewModel API：

* `koinViewModel()` - 注入 ViewModel 實例
* `koinNavViewModel()` - 注入 ViewModel 實例 + Navigation 參數資料 (如果您正在使用 `Navigation` API)

對於宣告 'MyViewModel' 元件的模組：

```kotlin
module {
    viewModel { MyViewModel() }
    // or constructor DSL
    viewModelOf(::MyViewModel)
}
```

我們可以像這樣獲取您的實例：

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

我們可以在函數參數中獲取您的實例：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Jetpack Compose 的更新不支援 Lazy API
:::

### @Composable 的 ViewModel 和 SavedStateHandle

您可以擁有一個 `SavedStateHandle` 建構子參數，它將根據 Compose 環境 (Navigation BackStack 或 ViewModel) 進行注入。它將透過 ViewModel `CreationExtras` 或透過 Navigation `BackStackEntry` 注入：

```kotlin
// Setting objectId argument in Navhost
NavHost(
    navController,
    startDestination = "list"
) {
    composable("list") { backStackEntry ->
        //...
    }
    composable("detail/{objectId}") { backStackEntry ->
        val objectId = backStackEntry.arguments?.getString("objectId")?.toInt()
        DetailScreen(navController, objectId!!)
    }
}

// Injected Argument in ViewModel
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    init {
        println("$this - objectId: ${savedStateHandle.get<String>("objectId")}")
    }
}
```

:::note
有關 SavedStateHandle 注入差異的更多詳細資訊：https://github.com/InsertKoinIO/koin/issues/1935#issuecomment-2362335705
:::

## 模組載入和卸載繫結到 Composable

Koin 為您提供了一種為給定的 Composable 函數載入特定模組的方式。`rememberKoinModules` 函數載入 Koin 模組並記住在目前的 Composable 上：

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // load module at first call of this component
    rememberKoinModules(myModule)
}
```

您可以使用其中一個 abandoned 函數，以在 2 個方面卸載模組：
- onForgotten - 在一個 composition 被刪除後
- onAbandoned - composition 失敗

為此，請為 `rememberKoinModules` 使用 `unloadOnForgotten` 或 `unloadOnAbandoned` 參數。

## 使用 Composable 建立 Koin Scope

composable 函數 `rememberKoinScope` 和 `KoinScope` 允許在 Composable 中處理 Koin Scope，並在 Composable 結束後持續追蹤以關閉 scope。

:::info
這個 API 目前仍不穩定
:::
```