[//]: # (title: 수명 주기)

컴포즈 멀티플랫폼(Compose Multiplatform) 구성 요소의 수명 주기는 젯팩 컴포즈(Jetpack Compose)의 [수명 주기(lifecycle)](https://developer.android.com/topic/libraries/architecture/lifecycle) 개념을 채택했습니다.
수명 주기 인식 구성 요소는 다른 구성 요소의 수명 주기 상태 변화에 반응할 수 있으며, 더 잘 구조화되고 대개 더 가벼우며 유지 관리가 쉬운 코드를 작성하는 데 도움이 됩니다.

컴포즈 멀티플랫폼은 공통 `LifecycleOwner` 구현을 제공합니다. 이는 원래의 젯팩 컴포즈 기능을 다른 플랫폼으로 확장하고 공통 코드(common code)에서 수명 주기 상태를 관찰할 수 있도록 돕습니다.

멀티플랫폼 `Lifecycle` 구현을 사용하려면 `commonMain` 소스 세트에 다음 종속성을 추가하세요:

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

> 멀티플랫폼 수명 주기 구현의 변경 사항은 [새로운 기능(What's new)](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)에서 확인하거나, [컴포즈 멀티플랫폼 변경 로그(Compose Multiplatform changelog)](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)에서 특정 EAP 릴리스를 팔로우하여 확인할 수 있습니다.
>
{style="tip"}

## 상태 및 이벤트

수명 주기 상태 및 이벤트의 흐름은 다음과 같습니다([젯팩 수명 주기](https://developer.android.com/topic/libraries/architecture/lifecycle)와 동일):

![수명 주기 다이어그램](lifecycle-states.svg){width="700"}

## 수명 주기 구현

컴포저블(Composable)은 대개 고유한 수명 주기가 필요하지 않습니다. 공통 `LifecycleOwner`가 서로 연결된 모든 엔티티에 수명 주기를 제공합니다. 기본적으로 컴포즈 멀티플랫폼에서 생성된 모든 컴포저블은 동일한 수명 주기를 공유하며, 해당 이벤트에 구독하거나 수명 주기 상태를 참조하는 등의 작업을 수행할 수 있습니다.

> `LifecycleOwner` 객체는 [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal)로 제공됩니다. 특정 컴포저블 하위 트리에 대해 수명 주기를 별도로 관리하고 싶다면, [자체적인 `LifecycleOwner` 구현을 생성](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco)할 수 있습니다.
>
{style="tip"}

멀티플랫폼 수명 주기에서 코루틴을 사용할 때, `Lifecycle.coroutineScope` 값은 `Dispatchers.Main.immediate` 값과 연결되어 있음을 기억하세요. 이 값은 기본적으로 데스크톱 타겟에서 사용하지 못할 수도 있습니다.
수명 주기 내의 코루틴과 플로우(flow)가 컴포즈 멀티플랫폼에서 올바르게 작동하도록 하려면 프로젝트에 `kotlinx-coroutines-swing` 종속성을 추가하세요.
자세한 내용은 [`Dispatchers.Main` 문서](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)를 참조하세요.

* 내비게이션 구성 요소에서 수명 주기가 어떻게 작동하는지는 [내비게이션 및 라우팅](compose-navigation-routing.md)에서 알아보세요.
* 멀티플랫폼 ViewModel 구현에 대한 자세한 내용은 [공통 ViewModel](compose-viewmodel.md) 페이지를 참조하세요.

## 안드로이드 수명 주기를 다른 플랫폼에 매핑하기

### iOS

| 네이티브 이벤트 및 알림 | 수명 주기 이벤트 | 수명 주기 상태 변경 |
|-----------------------------------------|-----------------|-------------------------|
| `viewDidDisappear`                      | `ON_STOP`       | `STARTED` → `CREATED`   |
| `viewWillAppear`                        | `ON_START`      | `CREATED` → `STARTED`   |
| `willResignActive`                      | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `didBecomeActive`                       | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `didEnterBackground`                    | `ON_STOP`       | `STARTED` → `CREATED`   |
| `willEnterForeground`                   | `ON_START`      | `CREATED` → `STARTED`   |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY`    | `CREATED` → `DESTROYED` |

### 웹(Web)

Wasm 타겟의 제한 사항으로 인해 수명 주기는 다음과 같이 동작합니다:

* 애플리케이션이 항상 페이지에 부착되어 있으므로 `CREATED` 상태를 건너뜁니다.
* 웹 페이지는 대개 사용자가 탭을 닫을 때만 종료되므로 `DESTROYED` 상태에 도달하지 않습니다.

| 네이티브 이벤트 | 수명 주기 이벤트 | 수명 주기 상태 변경 |
|------------------------------------------|-----------------|------------------------|
| `visibilitychange` (보이는 상태가 됨) | `ON_START`      | `CREATED` → `STARTED`  |
| `focus`                                  | `ON_RESUME`     | `STARTED` → `RESUMED`  |
| `blur`                                   | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `visibilitychange` (보이지 않게 됨) | `ON_STOP`       | `STARTED` → `CREATED`  |

### 데스크톱(Desktop)

| Swing 리스너 콜백 | 수명 주기 이벤트 | 수명 주기 상태 변경 |
|--------------------------|-----------------|-------------------------|
| `windowIconified`        | `ON_STOP`       | `STARTED` → `CREATED`   |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |