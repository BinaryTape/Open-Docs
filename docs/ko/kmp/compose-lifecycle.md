[//]: # (title: 생명 주기)

컴포즈 멀티플랫폼(Compose Multiplatform) 컴포넌트의 생명 주기는 Jetpack Compose의 [생명 주기](https://developer.android.com/topic/libraries/architecture/lifecycle) 개념에서 채택되었습니다.
생명 주기를 인식하는 컴포넌트는 다른 컴포넌트의 생명 주기 상태 변화에 반응할 수 있으며, 더 잘 정리되고 종종 더 가벼우며 유지보수하기 쉬운 코드를 만드는 데 도움을 줍니다.

컴포즈 멀티플랫폼은 공통 `LifecycleOwner` 구현체를 제공하며, 이는 원본 Jetpack Compose 기능을 다른 플랫폼으로 확장하고 공통 코드에서 생명 주기 상태를 관찰하는 데 도움을 줍니다.

멀티플랫폼 `Lifecycle` 구현을 사용하려면 `commonMain` 소스 세트에 다음 종속성을 추가하십시오:

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

> 멀티플랫폼 생명 주기 구현체의 변경 사항은 [새로운 소식](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)에서 확인하거나
> [컴포즈 멀티플랫폼 변경 로그](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)에서 특정 EAP 릴리스를 추적할 수 있습니다.
>
{style="tip"}

## 상태 및 이벤트

생명 주기 상태 및 이벤트의 흐름(이는 [Jetpack 생명 주기](https://developer.android.com/topic/libraries/architecture/lifecycle)와 동일합니다):

![Lifecycle diagram](lifecycle-states.svg){width="700"}

## 생명 주기 구현

컴포저블은 일반적으로 고유한 생명 주기를 필요로 하지 않습니다. 공통 `LifecycleOwner`가 모든 상호 연결된 엔티티에 생명 주기를 제공합니다. 기본적으로 컴포즈 멀티플랫폼으로 생성된 모든 컴포저블은 동일한 생명 주기를 공유하며, 해당 이벤트에 구독하고, 생명 주기 상태를 참조하는 등의 작업을 수행할 수 있습니다.

> `LifecycleOwner` 객체는 [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal)로 제공됩니다.
> 특정 컴포저블 서브트리에 대해 생명 주기를 개별적으로 관리하고 싶다면, 자신만의 `LifecycleOwner` 구현체를 [생성할 수 있습니다](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco).
>
{style="tip"}

멀티플랫폼 생명 주기에서 코루틴을 사용할 때, `Lifecycle.coroutineScope` 값이 `Dispatchers.Main.immediate` 값에 연결되어 있음을 기억하십시오. 이 값은 기본적으로 데스크톱 타겟에서는 사용하지 못할 수 있습니다.
컴포즈 멀티플랫폼에서 생명 주기 내의 코루틴과 플로우가 올바르게 작동하도록 하려면, 프로젝트에 `kotlinx-coroutines-swing` 종속성을 추가하십시오.
자세한 내용은 [`Dispatchers.Main` 문서](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)를 참조하십시오.

*   [탐색 및 라우팅](compose-navigation-routing.md)에서 탐색 컴포넌트의 생명 주기가 어떻게 작동하는지 알아보십시오.
*   [공통 ViewModel](compose-viewmodel.md) 페이지에서 멀티플랫폼 ViewModel 구현에 대해 자세히 알아보십시오.

## Android 생명 주기를 다른 플랫폼에 매핑하기

### iOS

| 네이티브 이벤트 및 알림                  | 생명 주기 이벤트 | 생명 주기 상태 변경  |
|-----------------------------------------|-----------------|-------------------------|
| `viewDidDisappear`                      | `ON_STOP`       | `STARTED` → `CREATED`   |
| `viewWillAppear`                        | `ON_START`      | `CREATED` → `STARTED`   |
| `willResignActive`                      | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `didBecomeActive`                       | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `didEnterBackground`                    | `ON_STOP`       | `STARTED` → `CREATED`   |
| `willEnterForeground`                   | `ON_START`      | `CREATED` → `STARTED`   |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY`    | `CREATED` → `DESTROYED` |

### 웹

Wasm 타겟의 제약 사항으로 인해, 생명 주기는 다음과 같습니다:

*   애플리케이션이 항상 페이지에 연결되어 있으므로 `CREATED` 상태를 건너뜁니다.
*   웹 페이지는 일반적으로 사용자가 탭을 닫을 때만 종료되므로 `DESTROYED` 상태에 도달하지 않습니다.

| 네이티브 이벤트                             | 생명 주기 이벤트 | 생명 주기 상태 변경 |
|------------------------------------------|-----------------|------------------------|
| `visibilitychange` (becomes visible)     | `ON_START`      | `CREATED` → `STARTED`  |
| `focus`                                  | `ON_RESUME`     | `STARTED` → `RESUMED`  |
| `blur`                                   | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `visibilitychange` (stops being visible) | `ON_STOP`       | `STARTED` → `CREATED`  |

### 데스크톱

| Swing 리스너 콜백 | 생명 주기 이벤트 | 생명 주기 상태 변경  |
|--------------------------|-----------------|-------------------------|
| `windowIconified`        | `ON_STOP`       | `CREATED` → `STARTED`   |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |