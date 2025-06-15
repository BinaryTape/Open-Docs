---
title: 適用於 Jetpack Compose 與 Compose Multiplatform 的 Koin
---

本頁面說明您如何為您的 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 或您的 [Multiplatform Compose](https://www.jetbrains.com/lp/compose-mpp/) 應用程式注入依賴項。

## Koin Compose Multiplatform 對比 Koin Android Jetpack Compose

自 2024 年年中起，Compose 應用程式可使用 Koin Multiplatform API 進行開發。所有 API 在 Koin Jetpack Compose (koin-androidx-compose) 和 Koin Compose Multiplatform (koin-compose) 之間都是相同的。

### Compose 應使用哪個 Koin 套件？

對於僅使用 Android Jetpack Compose API 的純 Android 應用程式，請使用以下套件：
- `koin-androidx-compose` - 用於解鎖 Compose 基礎 API + Compose ViewModel API
- `koin-androidx-compose-navigation` - 帶有導航 API 整合的 Compose ViewModel API

對於 Android/Multiplatform 應用程式，請使用以下套件：
- `koin-compose` - Compose 基礎 API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - 帶有導航 API 整合的 Compose ViewModel API

## 沿用現有 Koin 上下文

透過在您的 Compose 應用程式之前使用 `startKoin` 函式，您的應用程式已準備好迎接 Koin 注入。不再需要進行任何設定來配置您的 Compose Koin 上下文。

:::note
`KoinContext` 和 `KoinAndroidContext` 已棄用。
:::

## 使用 Compose 應用程式啟動 Koin - KoinApplication

如果您無法存取可以執行 `startKoin` 函式的空間，您可以依賴 Compose 和 Koin 來啟動您的 Koin 配置。

`KoinApplication` 可組合函式有助於建立 Koin 應用程式實例，作為一個 Composable：

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // 您的畫面在此 ...
        MyScreen()
    }
}
```

`KoinApplication` 函式將根據 Compose 上下文的生命週期來處理 Koin 上下文的啟動與停止。此函式會啟動和停止一個新的 Koin 應用程式上下文。

:::info
在 Android 應用程式中，`KoinApplication` 將根據配置更改或 Activity 的丟棄來處理任何需要停止/重新啟動 Koin 上下文的需求。
:::

:::note
(實驗性 API)
您可以使用 `KoinMultiplatformApplication` 來取代多平台進入點：它與 `KoinApplication` 相同，但會自動為您注入 `androidContext` 和 `androidLogger`。
:::

## 使用 KoinApplicationPreview 進行 Compose 預覽

`KoinApplicationPreview` 可組合函式專門用於預覽 Composable：

```kotlin
@Preview(name = "1 - Pixel 2 XL", device = Devices.PIXEL_2_XL, locale = "en")
@Preview(name = "2 - Pixel 5", device = Devices.PIXEL_5, locale = "en", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Preview(name = "3 - Pixel 7 ", device = Devices.PIXEL_7, locale = "ru", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Composable
fun previewVMComposable(){
    KoinApplicationPreview(application = { modules(appModule) }) {
        ViewModelComposable()
    }
}
```

## 注入到 @Composable 中

在編寫您的可組合函式時，您可以存取以下 Koin API：`koinInject()`，用於從 Koin 容器中注入實例。

對於聲明了 'MyService' 組件的模組：

```kotlin
val androidModule = module {
    single { MyService() }
    // 或 constructor DSL
    singleOf(::MyService)
}
```

我們可以像這樣取得您的實例：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

為了與 Jetpack Compose 的函式式方面保持一致，最佳的編寫方法是將實例直接注入到函式參數中。這種方式允許使用 Koin 進行預設實作，但保留了開放性，讓您可以根據需要注入實例。

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### 注入帶參數的 @Composable

當您從 Koin 請求新的依賴項時，您可能需要注入參數。為此，您可以使用 `koinInject` 函式的 `parameters` 參數，配合 `parametersOf()` 函式，如下所示：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
您可以使用帶有 lambda 注入的參數，例如 `koinInject<MyService>{ parametersOf("a_string") }`，但如果您的 Composable 頻繁重新組合，這可能會對效能產生影響。此帶有 lambda 的版本需要在呼叫時解開您的參數，以幫助避免記憶您的參數。

從 Koin 4.0.2 版本開始，引入了 `koinInject(Qualifier,Scope,ParametersHolder)`，讓您可以以最有效率的方式使用參數。
:::

## 適用於 @Composable 的 ViewModel

同樣地，您可以存取經典的單例/工廠實例，您也可以存取以下 Koin ViewModel API：

*   `koinViewModel()` - 注入 ViewModel 實例
*   `koinNavViewModel()` - 注入 ViewModel 實例 + 導航參數資料 (如果您正在使用 `Navigation` API)

對於聲明了 'MyViewModel' 組件的模組：

```kotlin
module {
    viewModel { MyViewModel() }
    // 或 constructor DSL
    viewModelOf(::MyViewModel)
}
```

我們可以像這樣取得您的實例：

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

我們可以在函式參數中取得您的實例：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Lazy API 不支援 Jetpack Compose 的更新。
:::

### 共享 Activity ViewModel (4.1 - Android)

您現在可以使用 `koinActivityViewModel()` 從相同的 ViewModel 宿主：Activity 中注入 ViewModel。

```kotlin
@Composable
fun App() {
    // 將 ViewModel 實例保留在 Activity 層級
    val vm = koinActivityViewModel<MyViewModel>()
}
```

### ViewModel 與 SavedStateHandle 適用於 @Composable

您可以有一個 `SavedStateHandle` 建構函式參數，它將根據 Compose 環境（導航返回堆疊或 ViewModel）進行注入。
它會透過 ViewModel `CreationExtras` 或透過導航 `BackStackEntry` 注入：

```kotlin
// 在 Navhost 中設定 objectId 參數
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

// 在 ViewModel 中注入參數
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    init {
        println("$this - objectId: ${savedStateHandle.get<String>("objectId")}")
    }
}
```

:::note
關於 SavedStateHandle 注入差異的更多詳細資訊：https://github.com/InsertKoinIO/koin/issues/1935#issuecomment-2362335705
:::

### 共享 ViewModel 與導航 (實驗性)

Koin Compose Navigation 現在有一個 `NavBackEntry.sharedKoinViewModel()` 函式，用於檢索已儲存在當前 `NavBackEntry` 中的 ViewModel。在您的導航部分，只需使用 `sharedKoinViewModel`：

```kotlin
navigation<Route.BookGraph>(
                startDestination = Route.BookList
            ) {
                composable<Route.BookList>(
                    exitTransition = { slideOutHorizontally() },
                    popEnterTransition = { slideInHorizontally() }
                ) {
                    // 在此使用 SharedViewModel ...

                    val selectedBookViewModel =
                        it.sharedKoinViewModel<SelectedBookViewModel>(navController)
```

## 模組載入與卸載與 Composable 綁定

Koin 提供了一種為給定的 Composable 函式載入特定模組的方式。`rememberKoinModules` 函式會在當前的 Composable 上載入並記憶 Koin 模組：

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // 在此組件首次呼叫時載入模組
    rememberKoinModules(myModule)
}
```

您可以使用其中一個放棄函式，在兩個方面卸載模組：
- `onForgotten` - 在組合被丟棄後
- `onAbandoned` - 組合失敗後

為此，請為 `rememberKoinModules` 使用 `unloadOnForgotten` 或 `unloadOnAbandoned` 參數。

## 使用 Composable 建立 Koin 作用域

可組合函式 `rememberKoinScope` 和 `KoinScope` 允許在 Composable 中處理 Koin 作用域，並在 Composable 結束後跟隨當前作用域以關閉它。

:::info
此 API 目前仍不穩定
:::