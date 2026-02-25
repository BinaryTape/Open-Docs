[//]: # (title: 生命週期)

Compose Multiplatform 中的元件生命週期採用了 Jetpack Compose 的 [生命週期](https://developer.android.com/topic/libraries/architecture/lifecycle) 概念。
生命週期感知元件可以對其他元件的生命週期狀態變化做出反應，這有助於您編寫組織更良好、通常更輕量且更易於維護的程式碼。

Compose Multiplatform 提供了一個通用的 `LifecycleOwner` 實作，它將原始的 Jetpack Compose 功能擴充到其他平台，並有助於在共享程式碼中觀察生命週期狀態。

若要使用多平台 `Lifecycle` 實作，請將以下相依性新增至您的 `commonMain` 原始碼集：

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

> 您可以在我們的 [新功能](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html) 中追蹤多平台 Lifecycle 實作的變更，或在 [Compose Multiplatform 變更日誌](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md) 中關注特定的 EAP 版本。
>
{style="tip"}

## 狀態與事件

生命週期狀態與事件的流程（與 [Jetpack 生命週期](https://developer.android.com/topic/libraries/architecture/lifecycle) 相同）：

![生命週期圖示](lifecycle-states.svg){width="700"}

## 生命週期實作

Composable 通常不需要唯一的生命週期：一個通用的 `LifecycleOwner` 為所有互連的實體提供生命週期。預設情況下，Compose Multiplatform 建立的所有 Composable 都共用相同的生命週期 —— 它們可以訂閱其事件、參照生命週期狀態等等。

> `LifecycleOwner` 物件是以 [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal) 的形式提供的。如果您想為特定的 Composable 子樹單獨管理生命週期，可以 [建立自己的](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco) `LifecycleOwner` 實作。
>
{style="tip"}

在多平台生命週期中使用協同程式時，請記住 `Lifecycle.coroutineScope` 的值與 `Dispatchers.Main.immediate` 的值綁定在一起，而這在桌面目標上預設可能無法使用。
若要讓生命週期中的協同程式和 flow 在 Compose Multiplatform 中正常運作，請將 `kotlinx-coroutines-swing` 相依性新增至您的專案。
詳情請參閱 [`Dispatchers.Main` 文件](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)。

* 在 [導覽與路由](compose-navigation-routing.md) 中了解生命週期在導覽元件中是如何運作的。
* 在 [通用 ViewModel](compose-viewmodel.md) 頁面中進一步了解多平台 ViewModel 實作。

## 將 Android 生命週期對應到其他平台

### iOS

| 原生事件與通知                                   | 生命週期事件          | 生命週期狀態變更                |
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
* 永遠不會達到 `DESTROYED` 狀態，因為 Web 頁面通常只有在使用者關閉分頁時才會終止。

| 原生事件                                     | 生命週期事件          | 生命週期狀態變更               |
|------------------------------------------|-----------------|------------------------|
| `visibilitychange` (變為可見)                 | `ON_START`      | `CREATED` → `STARTED`  |
| `focus`                                  | `ON_RESUME`     | `STARTED` → `RESUMED`  |
| `blur`                                   | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `visibilitychange` (停止可見)                 | `ON_STOP`       | `STARTED` → `CREATED`  |

### 桌面

| Swing 接聽程式回呼           | 生命週期事件          | 生命週期狀態變更                |
|--------------------------|-----------------|-------------------------|
| `windowIconified`        | `ON_STOP`       | `STARTED` → `CREATED`   |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |