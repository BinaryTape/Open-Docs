[//]: # (title: 수명 주기)

Compose Multiplatform 구성 요소의 수명 주기는 Jetpack Compose의 [수명 주기](https://developer.android.com/topic/libraries/architecture/lifecycle) 개념에서 채택되었습니다. 수명 주기를 인식하는 구성 요소는 다른 구성 요소의 수명 주기 상태 변경에 반응할 수 있으며, 더 잘 구성되고, 종종 더 가볍고, 유지보수하기 쉬운 코드를 작성하는 데 도움이 됩니다.

Compose Multiplatform은 공통 `LifecycleOwner` 구현을 제공합니다. 이는 Jetpack Compose의 원래 기능을 다른 플랫폼으로 확장하며 공통 코드에서 수명 주기 상태를 관찰하는 데 도움이 됩니다.

멀티플랫폼 `Lifecycle` 구현을 사용하려면 `commonMain` 소스 세트에 다음 종속성을 추가합니다.

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

> 멀티플랫폼 Lifecycle 구현의 변경 사항은 [새로운 소식](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)에서 확인하거나 [Compose Multiplatform 변경 로그](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)에서 특정 EAP 릴리스를 추적할 수 있습니다.
>
{style="tip"}

## 상태 및 이벤트

수명 주기 상태 및 이벤트의 흐름은 다음과 같습니다.
([Jetpack 수명 주기](https://developer.android.com/topic/libraries/architecture/lifecycle)와 동일합니다):

![수명 주기 다이어그램](lifecycle-states.svg){width="700"}

## 수명 주기 구현

컴포저블은 일반적으로 고유한 수명 주기가 필요하지 않습니다. 공통 `LifecycleOwner`는 모든 상호 연결된 엔티티에 수명 주기를 제공합니다. 기본적으로 Compose Multiplatform에 의해 생성된 모든 컴포저블은 동일한 수명 주기를 공유하며, 해당 이벤트에 구독하고, 수명 주기 상태를 참조하는 등 다양한 작업을 수행할 수 있습니다.

> `LifecycleOwner` 객체는 [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal)로 제공됩니다. 특정 컴포저블 서브트리에 대해 수명 주기를 개별적으로 관리하려면 [자체 `LifecycleOwner` 구현을 생성](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco)할 수 있습니다.
>
{style="tip"}

멀티플랫폼 수명 주기에서 코루틴을 사용할 때, `Lifecycle.coroutineScope` 값이 `Dispatchers.Main.immediate` 값에 연결되어 있으며, 이 값은 기본적으로 데스크톱 대상에서 사용할 수 없을 수 있음을 기억하십시오. Compose Multiplatform에서 수명 주기 내의 코루틴 및 Flow가 올바르게 작동하도록 하려면 프로젝트에 `kotlinx-coroutines-swing` 종속성을 추가해야 합니다. 자세한 내용은 [`Dispatchers.Main` 문서](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)를 참조하십시오.

*   탐색 구성 요소에서 수명 주기가 어떻게 작동하는지 [](compose-navigation-routing.md)에서 알아보세요.
*   멀티플랫폼 ViewModel 구현에 대해 [](compose-viewmodel.md) 페이지에서 자세히 알아보세요.

## Android 수명 주기를 다른 플랫폼에 매핑

### iOS

| 네이티브 이벤트 및&nbsp;알림    | 수명 주기 이벤트 | 수명 주기 상태 변경  |
|-----------------------------------------|-----------------|-------------------------|
| `viewDidDisappear`                      | `ON_STOP`       | `STARTED` → `CREATED`   |
| `viewWillAppear`                        | `ON_START`      | `CREATED` → `STARTED`   |
| `willResignActive`                      | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `didBecomeActive`                       | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `didEnterBackground`                    | `ON_STOP`       | `STARTED` → `CREATED`   |
| `willEnterForeground`                   | `ON_START`      | `CREATED` → `STARTED`   |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY`    | `CREATED` → `DESTROYED` |

### 웹

Wasm 대상의 한계로 인해, 수명 주기는 다음과 같습니다.
*   애플리케이션이 항상 페이지에 연결되어 있으므로 `CREATED` 상태를 건너뜁니다.
*   웹 페이지는 일반적으로 사용자가 탭을 닫을 때만 종료되므로 `DESTROYED` 상태에 도달하지 않습니다.

| 네이티브 이벤트 | 수명 주기 이벤트 | 수명 주기 상태 변경 |
|--------------|-----------------|------------------------|
| `blur`       | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `focus`      | `ON_RESUME`     | `STARTED` → `RESUMED`  |

### 데스크톱

| Swing 리스너 콜백 | 수명 주기 이벤트 | 수명 주기 상태 변경  |
|--------------------------|-----------------|-------------------------|
| `windowIconified`        | `ON_STOP`       | `STARTED` → `CREATED`   |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |