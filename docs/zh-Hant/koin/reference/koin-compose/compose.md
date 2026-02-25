---
title: 用於 Jetpack Compose 與 Compose Multiplatform 的 Koin
---

本頁面說明如何為您的 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 或 [Multiplaform Compose](https://www.jetbrains.com/lp/compose-mpp/) 應用程式注入相依性。

## Koin Compose Multiplatform vs Koin Android Jetpack Compose

自 2024 年中期以來，Compose 應用程式已可使用 Koin Multiplatform API 進行開發。Koin Jetpack Compose (`koin-androidx-compose`) 與 Koin Compose Multiplatform (`koin-compose`) 之間的所有 API 皆完全相同。

### 該為 Compose 選用哪個 Koin 軟件包？

對於僅使用 Android Jetpack Compose API 的純 Android 應用程式，請使用以下軟件包：
- `koin-androidx-compose` - 解鎖 Compose 基礎 API + Compose ViewModel API
- `koin-androidx-compose-navigation` - 整合了 Navigation API 的 Compose ViewModel API

對於 Android/Multiplatform 應用程式，請使用以下軟件包：
- `koin-compose` - Compose 基礎 API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - 整合了 Navigation API 的 Compose ViewModel API

## 在現有的 Koin 上下文中啟動

透過在 Compose 應用程式之前使用 `startKoin` 函式，您的應用程式即可準備好迎接 Koin 注入。無需再進行任何額外設定即可在 Compose 中配置您的 Koin 上下文。

:::note
`KoinContext` 與 `KoinAndroidContext` 已被棄用
:::

## 搭配 Compose 應用程式啟動 Koin - KoinApplication
如果您無法存取執行 `startKoin` 函式的空間，您可以依賴 Compose 與 Koin 來啟動您的 Koin 配置。

`KoinApplication` 這個 compose 函式有助於建立一個 Koin 應用程式執行個體，將其作為 Composable 使用：

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // 您的螢幕放在這裡 ...
        MyScreen()
    }
}
```

`KoinApplication` 函式將根據 Compose 上下文的生命週期來處理 Koin 上下文的啟動與停止。此函式會啟動並停止一個全新的 Koin 應用程式上下文。

:::info
在 Android 應用程式中，`KoinApplication` 會針對配置變更或 Activity 的卸載，自動處理任何停止/重新啟動 Koin 上下文的需求。
:::

:::note
(實驗性 API)
您可以使用 `KoinMultiplatformApplication` 來替換多平台入口點：它與 `KoinApplication` 相同，但會自動為您注入 `androidContext` 與 `androidLogger`。
:::

## 使用 KoinApplicationPreview 進行 Compose 預覽

`KoinApplicationPreview` compose 函式專門用於預覽 Composable：

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

在撰寫您的 composable 函式時，您可以存取以下 Koin API：`koinInject()`，用以從 Koin 容器中注入執行個體。

對於宣告 'MyService' 組件的模組：

```kotlin
val androidModule = module {
    single { MyService() }
    // 或建構函式 DSL
    singleOf(::MyService)
}
```

我們可以像這樣取得您的執行個體：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

為了與 Jetpack Compose 的函式化特性保持一致，最佳的編寫方式是將執行個體直接注入到函式參數中。這種方式允許使用 Koin 的預設實作，同時保持可依需求注入執行個體的彈性。

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### 注入參數到 @Composable 中

當您從 Koin 請求新的相依性時，可能需要注入參數。為此，您可以使用 `koinInject` 函式的 `parameters` 參數，並配合 `parametersOf()` 函式，如下所示：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
您可以使用 lambda 注入參數，例如 `koinInject<MyService>{ parametersOf("a_string") }`，但如果周圍有大量的重組 (recomposing)，這可能會對效能產生影響。此 lambda 版本需要在呼叫時展開您的參數，以協助避免記住您的參數。

從 Koin 4.0.2 版本開始，引入了 `koinInject(Qualifier,Scope,ParametersHolder)`，讓您能以最有效率的方式使用參數。
:::

## @Composable 的 ViewModel

如同您可以存取傳統的 single/factory 執行個體，您也可以存取以下 Koin ViewModel API：

* `koinViewModel()` - 注入 ViewModel 執行個體
* `koinNavViewModel()` - 注入 ViewModel 執行個體 + Navigation 引數資料（如果您使用的是 `Navigation` API）

對於宣告 'MyViewModel' 組件的模組：

```kotlin
module {
    viewModel { MyViewModel() }
    // 或建構函式 DSL
    viewModelOf(::MyViewModel)
}
```

我們可以像這樣取得您的執行個體：

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

我們可以在函式參數中取得您的執行個體：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Jetpack Compose 的更新不支援延遲 (Lazy) API
:::

### 共享 Activity ViewModel (4.1 - Android)

您現在可以使用 `koinActivityViewModel()` 從同一個 ViewModel 宿主 (Activity) 注入 ViewModel。

```kotlin
@Composable
fun App() {
    // 在 Activity 層級持有 ViewModel 執行個體
    val vm = koinActivityViewModel<MyViewModel>()
}
```

### @Composable 的 ViewModel 與 SavedStateHandle

您可以擁有一個 `SavedStateHandle` 建構函式參數，它將根據 Compose 環境（Navigation BackStack 或 ViewModel）進行注入。
它既可以透過 ViewModel `CreationExtras` 注入，也可以透過 Navigation `BackStackEntry` 注入：

```kotlin
// 在 Navhost 中設定 objectId 引數
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

// 在 ViewModel 中注入引數
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

### 共享 ViewModel 與 Navigation (實驗性)

Koin Compose Navigation 現在具備 `NavBackEntry.sharedKoinViewModel()` 函式，可用於擷取已儲存在目前 `NavBackEntry` 中的 ViewModel。在您的導覽部分中，只需使用 `sharedKoinViewModel`：

```kotlin
navigation<Route.BookGraph>(
                startDestination = Route.BookList
            ) {
                composable<Route.BookList>(
                    exitTransition = { slideOutHorizontally() },
                    popEnterTransition = { slideInHorizontally() }
                ) {
                    // 在這裡使用 SharedViewModel ...

                    val selectedBookViewModel =
                        it.sharedKoinViewModel<SelectedBookViewModel>(navController)
```

## 與 Composable 繫結的模組載入與卸載

Koin 提供了一種為特定 Composable 函式載入特定模組的方法。`rememberKoinModules` 函式會載入 Koin 模組並在目前的 Composable 中記住它們：

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // 在首次呼叫此組件時載入模組
    rememberKoinModules(myModule)
}
```

您可以使用其中一個放棄 (abandon) 函式，從兩個面向卸載模組：
- onForgotten - 在組合 (composition) 被捨棄後
- onAbandoned - 組合失敗後

為此，請為 `rememberKoinModules` 使用 `unloadOnForgotten` 或 `unloadOnAbandoned` 引數。

## 使用 Composable 建立 Koin 作用域

Composable 函式 `rememberKoinScope` 與 `KoinScope` 允許在 Composable 中處理 Koin 作用域，並在 Composable 結束後跟進關閉作用域。

:::info
此 API 目前仍不穩定
:::