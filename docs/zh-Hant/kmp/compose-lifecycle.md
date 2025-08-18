[//]: # (title: 生命週期)

Compose Multiplatform 中元件的生命週期概念，是借鑑自 Jetpack Compose 的[生命週期](https://developer.android.com/topic/libraries/architecture/lifecycle)概念。
具備生命週期感知能力的元件能夠回應其他元件生命週期狀態的變化，幫助您產生組織更良好且通常更輕量的程式碼，這些程式碼也更容易維護。

Compose Multiplatform 提供了一個通用的 `LifecycleOwner` 實作，它將原始 Jetpack Compose 功能擴展到其他平台，並有助於在通用程式碼中觀察生命週期狀態。

若要使用多平台 `Lifecycle` 實作，請將以下依賴項新增至您的 `commonMain` 原始碼集：

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.lifecycle:lifecycle-runtime-compose:%org.jetbrains.androidx.lifecycle%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.lifecycle:lifecycle-runtime-compose:%org.jetbrains.androidx.lifecycle%"}

> 您可以在我們的[最新消息](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)中追蹤多平台 Lifecycle 實作的變更，或在 [Compose Multiplatform 變更日誌](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)中關注特定的 EAP 版本。
>
{style="tip"}

## 狀態與事件

生命週期狀態與事件的流程（與 [Jetpack 生命週期](https://developer.android.com/topic/libraries/architecture/lifecycle)相同）：

![生命週期圖](lifecycle-states.svg){width="700"}

## 生命週期實作

`Composable` 通常不需要獨特的生命週期：一個通用的 `LifecycleOwner` 為所有相互連接的實體提供生命週期。預設情況下，Compose Multiplatform 建立的所有 `Composable` 都共享相同的生命週期 – 它們可以訂閱其事件、參照生命週期狀態等等。

> `LifecycleOwner` 物件以 [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal) 的形式提供。如果您想為特定的 `Composable` 子樹單獨管理生命週期，您可以[建立自己的](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco) `LifecycleOwner` 實作。
>
{style="tip"}

在多平台生命週期中處理協程時，請記住 `Lifecycle.coroutineScope` 值綁定至 `Dispatchers.Main.immediate` 值，而該值在桌面目標上可能預設不可用。
為了讓生命週期中的協程和流在 Compose Multiplatform 中正常運作，請將 `kotlinx-coroutines-swing` 依賴項新增至您的專案。
有關詳細資訊，請參閱 [`Dispatchers.Main` 文件](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)。

* 了解 [導航與路由](compose-navigation-routing.md) 中導航元件的生命週期運作方式。
* 在 [通用 ViewModel](compose-viewmodel.md) 頁面上了解有關多平台 ViewModel 實作的更多資訊。

## 將 Android 生命週期映射至其他平台

### iOS

| 原生事件與通知                  | 生命週期事件 | 生命週期狀態變更  |
|---------------------------------|--------------|-------------------|
| `viewDidDisappear`              | `ON_STOP`    | `STARTED` → `CREATED`   |
| `viewWillAppear`                | `ON_START`   | `CREATED` → `STARTED`   |
| `willResignActive`              | `ON_PAUSE`   | `RESUMED` → `STARTED`   |
| `didBecomeActive`               | `ON_RESUME`  | `STARTED` → `RESUMED`   |
| `didEnterBackground`            | `ON_STOP`    | `STARTED` → `CREATED`   |
| `willEnterForeground`           | `ON_START`   | `CREATED` → `STARTED`   |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY` | `CREATED` → `DESTROYED` |

### Web

由於 Wasm 目標的限制，生命週期：

* 會跳過 `CREATED` 狀態，因為應用程式總是附著在頁面上。
* 永遠不會達到 `DESTROYED` 狀態，因為網頁通常只會在使用者關閉分頁時終止。

| 原生事件 | 生命週期事件 | 生命週期狀態變更 |
|----------|--------------|------------------|
| `blur`       | `ON_PAUSE`   | `RESUMED` → `STARTED`  |
| `focus`      | `ON_RESUME`  | `STARTED` → `RESUMED`  |

### Desktop

| Swing 監聽器回呼 | 生命週期事件 | 生命週期狀態變更  |
|------------------|--------------|-------------------|
| `windowIconified`        | `ON_STOP`    | `STARTED` → `CREATED`   |
| `windowDeiconified`      | `ON_START`   | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`   | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`  | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY` | `CREATED` → `DESTROYED` |