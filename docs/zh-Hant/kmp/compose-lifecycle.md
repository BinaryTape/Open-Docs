[//]: # (title: 生命週期)

Compose Multiplatform 中的元件生命週期採用自 Jetpack Compose 的 [生命週期](https://developer.android.com/topic/libraries/architecture/lifecycle) 概念。
生命週期感知元件能夠回應其他元件的生命週期狀態變化，協助您產出組織更良好、通常也更輕量且更容易維護的程式碼。

Compose Multiplatform 提供通用的 `LifecycleOwner` 實作，它將原始 Jetpack Compose 功能擴展到其他平台，並協助在通用程式碼中觀察生命週期狀態。

若要使用多平台 `Lifecycle` 實作，請將以下依賴項新增至您的 `commonMain` 來源集：

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

> 您可以在我們的 [最新消息](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html) 中追蹤多平台 Lifecycle 實作的變更，或在 [Compose Multiplatform 變更日誌](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md) 中關注特定的 EAP 發布。
>
{style="tip"}

## 狀態與事件

生命週期狀態與事件的流程（與 [Jetpack lifecycle](https://developer.android.com/topic/libraries/architecture/lifecycle) 相同）：

![Lifecycle diagram](lifecycle-states.svg){width="700"}

## 生命週期實作

可組合項通常不需要獨特的生命週期：通用的 `LifecycleOwner` 為所有相互連接的實體提供一個生命週期。預設情況下，Compose Multiplatform 建立的所有可組合項都共用相同的生命週期 – 它們可以訂閱其事件、參考生命週期狀態等等。

> `LifecycleOwner` 物件以 [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal) 的形式提供。
> 若您想為特定的可組合項子樹獨立管理生命週期，您可以 [建立您自己的](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco) `LifecycleOwner` 實作。
>
{style="tip"}

當在多平台生命週期中使用協程時，請記住 `Lifecycle.coroutineScope` 值綁定到 `Dispatchers.Main.immediate` 值，這在桌面目標上預設情況下可能不可用。
為了讓生命週期中的協程和流在 Compose Multiplatform 中正常運作，請將 `kotlinx-coroutines-swing` 依賴項新增到您的專案。
請參閱 [`Dispatchers.Main` 文件](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html) 以了解詳情。

* 了解導航元件中的生命週期如何運作，請參閱 [](compose-navigation-routing.md)。
* 在 [](compose-viewmodel.md) 頁面了解更多關於多平台 ViewModel 實作的資訊。

## 將 Android 生命週期對應到其他平台

### iOS

| 原生事件與&nbsp;通知    | 生命週期事件 | 生命週期狀態變化  |
|-----------------------------------------|-----------------|-------------------------|
| `viewDidDisappear`                      | `ON_STOP`       | `STARTED` → `CREATED`   |
| `viewWillAppear`                        | `ON_START`      | `CREATED` → `STARTED`   |
| `willResignActive`                      | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `didBecomeActive`                       | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `didEnterBackground`                    | `ON_STOP`       | `STARTED` → `CREATED`   |
| `willEnterForeground`                   | `ON_START`      | `CREATED` → `STARTED`   |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY`    | `CREATED` → `DESTROYED` |

### Web

由於 Wasm 目標的限制，生命週期：

* 跳過 `CREATED` 狀態，因為應用程式始終附加到頁面。
* 從不達到 `DESTROYED` 狀態，因為網頁通常只有在使用者關閉分頁時才會終止。

| 原生事件 | 生命週期事件 | 生命週期狀態變化 |
|--------------|-----------------|------------------------|
| `blur`       | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `focus`      | `ON_RESUME`     | `STARTED` → `RESUMED`  |

### 桌面

| Swing 監聽器回呼 | 生命週期事件 | 生命週期狀態變化  |
|--------------------------|-----------------|-------------------------|
| `windowIconified`        | `ON_STOP`       | `STARTED` → `CREATED`   |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |