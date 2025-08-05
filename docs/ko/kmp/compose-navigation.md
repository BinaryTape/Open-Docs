[//]: # (title: Compose에서의 내비게이션)

[Android의 내비게이션 라이브러리](https://developer.android.com/guide/navigation)는 Jetpack Compose에서 내비게이션을 지원합니다. Compose Multiplatform 팀은 AndroidX 내비게이션 라이브러리에 멀티플랫폼 지원을 제공합니다.

앱 내 콘텐츠 간의 실제 내비게이션 외에도, 이 라이브러리는 다음과 같은 기본적인 내비게이션 문제를 해결합니다.

*   목적지 간에 데이터를 타입 안전하게 전달합니다.
*   명확하고 접근 가능한 내비게이션 기록을 유지하여 앱 내에서 사용자의 여정을 쉽게 추적할 수 있도록 합니다.
*   일반적인 워크플로우 외부에서 사용자를 앱의 특정 위치로 내비게이션할 수 있는 딥 링크(deep linking) 메커니즘을 지원합니다.
*   내비게이션 시 통일된 애니메이션과 전환을 지원하며, 최소한의 추가 작업으로 뒤로 가기(back) 제스처와 같은 일반적인 패턴을 허용합니다.

기본 사항에 충분히 익숙하다면, [](compose-navigation-routing.md)로 이동하여 크로스 플랫폼 프로젝트에서 내비게이션 라이브러리를 활용하는 방법을 알아보세요. 그렇지 않다면, 라이브러리가 사용하는 기본 개념에 대해 계속 읽어보세요.

> 내비게이션 라이브러리의 멀티플랫폼 버전 변경 사항은 [새로운 기능](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)에서 추적하거나 [Compose Multiplatform 변경 로그](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)에서 특정 EAP 릴리스를 확인할 수 있습니다.
>
{style="tip"}

## Compose 내비게이션의 기본 개념

내비게이션 라이브러리는 내비게이션 사용 사례를 매핑하기 위해 다음 개념을 사용합니다.

*   내비게이션 그래프(_navigation graph_)는 앱 내의 모든 가능한 목적지와 그들 간의 연결을 설명합니다. 내비게이션 그래프는 앱의 하위 흐름을 수용하기 위해 중첩될 수 있습니다.
*   목적지(_destination_)는 내비게이션할 수 있는 내비게이션 그래프의 노드입니다. 이는 컴포저블(composable), 중첩 내비게이션 그래프 또는 다이얼로그일 수 있습니다. 사용자가 목적지로 내비게이션하면 앱은 해당 콘텐츠를 표시합니다.
*   경로(_route_)는 목적지를 식별하고 해당 목적지로 내비게이션하는 데 필요한 인자를 정의하지만, UI를 설명하지는 않습니다. 이러한 방식으로 데이터는 표현과 분리되어 각 UI 구현 조각을 전체 앱 구조와 독립적으로 유지할 수 있습니다. 예를 들어, 이렇게 하면 프로젝트에서 컴포저블을 테스트하고 재배열하기가 더 쉬워집니다.

이러한 개념을 염두에 두고, 내비게이션 라이브러리는 내비게이션 아키텍처를 안내하기 위한 기본 규칙을 구현합니다.

<!--* There is a fixed _start destination_, the first screen a user **usually** sees when they launch the app.
  Conditional screens like initial setup or login should not be considered
  start destinations even if they are unavoidable for a new user, think about the primary workflow.-->
<!-- Android introduces this concept, but in our docs there is no use for it so far. Maybe later on. -->

*   앱은 사용자의 경로를 목적지 스택, 즉 뒤로 가기 스택(_back stack_)으로 나타냅니다. 기본적으로 사용자가 새로운 목적지로 내비게이션할 때마다 해당 목적지는 스택의 맨 위에 추가됩니다. 뒤로 가기 스택을 사용하여 내비게이션을 더 간단하게 만들 수 있습니다. 즉, 직접 앞뒤로 이동하는 대신 현재 목적지를 스택의 맨 위에서 팝(pop)하고 이전 목적지로 자동으로 돌아갈 수 있습니다.
*   각 목적지에는 딥 링크(_deep links_) 집합이 연결될 수 있습니다. 이는 앱이 운영 체제로부터 링크를 받을 때 해당 목적지로 연결되어야 하는 URI 패턴입니다.

## 기본 내비게이션 예시

내비게이션 라이브러리를 사용하려면 `commonMain` 소스 세트에 다음 종속성을 추가합니다.

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%"}

> Compose Multiplatform %org.jetbrains.compose%는 내비게이션 라이브러리 버전 %org.jetbrains.androidx.navigation%을 필요로 합니다.
>
{style="note"}

내비게이션을 설정하기 위해 필요한 단계를 처리하는 데는 순서가 있습니다.

1.  경로를 정의합니다. 해당 목적지에 필요한 인자를 담을 각 목적지별 [직렬화 가능(serializable)](https://kotlinlang.org/docs/serialization.html) 객체 또는 데이터 클래스를 생성합니다.
2.  모든 컴포저블이 접근할 수 있도록 컴포저블 계층 구조에서 충분히 높은 위치에 내비게이션 인터페이스가 될 `NavController`를 생성합니다. NavController는 앱의 뒤로 가기 스택을 보유하며 내비게이션 그래프 내에서 목적지 간에 전환하는 메서드를 제공합니다.
3.  경로 중 하나를 시작 목적지로 선택하여 내비게이션 그래프를 설계합니다. 이를 위해 내비게이션 그래프(모든 내비게이션 가능한 목적지를 설명함)를 보유하는 `NavHost` 컴포저블을 생성합니다.

다음은 앱 내 내비게이션을 위한 기본적인 기반 예시입니다.

```kotlin
// Creates routes
@Serializable
object Profile
@Serializable
object FriendsList

// Creates the NavController
val navController = rememberNavController()

// Creates the NavHost with the navigation graph consisting of supplied destinations
NavHost(navController = navController, startDestination = Profile) {
    composable<Profile> { ProfileScreen( /* ... */ ) }
    composable<FriendsList> { FriendsListScreen( /* ... */ ) }
    // You can add more destinations similarly
}
```

### 내비게이션 라이브러리의 주요 클래스

내비게이션 라이브러리는 다음 핵심 유형을 제공합니다.

*   `NavController`.
    목적지 간 전환, 딥 링크 처리, 뒤로 가기 스택 관리 등 핵심 내비게이션 기능을 위한 API를 제공합니다.
    <!--You should create the `NavController` high in your composable hierarchy, high enough that all the composables
    that need to reference it can do so.
    This way, you can use the `NavController` as the single source of truth for updating composables outside of your screens.
    [NB: This doesn't seem to be useful to people who are trying to cover the basics.]-->
*   `NavHost`. 내비게이션 그래프를 기반으로 현재 목적지의 콘텐츠를 표시하는 컴포저블입니다.
    각 NavHost에는 필수 `startDestination` 매개변수가 있습니다. 이는 사용자가 앱을 시작할 때 가장 먼저 보아야 할 화면에 해당하는 목적지입니다.
*   `NavGraph`.
    앱 내의 모든 가능한 목적지와 그들 간의 연결을 설명합니다.
    내비게이션 그래프는 일반적으로 `NavHost` 선언과 같이 `NavGraph`를 반환하는 빌더 람다로 정의됩니다.

핵심 유형 기능 외에도, 내비게이션 컴포넌트는 애니메이션 및 전환, 딥 링크 지원, 타입 안전성, `ViewModel` 지원 및 앱 내비게이션 처리를 위한 기타 편의 기능(quality-of-life features)을 제공합니다.

## 내비게이션 사용 사례

### 목적지로 이동

목적지로 내비게이션하려면 `NavController.navigate()` 함수를 호출합니다. 위 예시를 계속하면 다음과 같습니다.

```kotlin
Button(onClick = { navController.navigate(Profile) }) {
    Text("Go to profile")
}
```

### 목적지에 인자 전달

내비게이션 그래프를 설계할 때 다음과 같이 매개변수가 있는 데이터 클래스로 경로를 정의할 수 있습니다.

```kotlin
@Serializable
data class Profile(val name: String)
```

목적지에 인자를 전달하려면 목적지로 내비게이션할 때 해당 클래스 생성자에 인자를 전달합니다.

```kotlin
Button(onClick = { navController.navigate(Profile("Alice")) }) {
    Text("Go to profile")
}
```

그런 다음 목적지에서 데이터를 검색합니다.

```kotlin
composable<Profile> { backStackEntry ->
    val profile: Profile = backStackEntry.toRoute()
    
    // Use `profile.name` wherever a user's name is needed
}
```

### 내비게이션 시 복잡한 데이터 검색

목적지 간에 내비게이션할 때, 최소한의 필요한 정보만 전달하는 것을 고려하세요. 앱의 전반적인 상태를 반영하는 파일이나 복잡한 객체는 데이터 레이어에 저장되어야 합니다. 사용자가 목적지에 도달하면 UI는 단일 진실 소스에서 실제 데이터를 로드해야 합니다.

예를 들어:

*   전체 사용자 프로필을 전달하지 마세요. 대신 사용자 ID를 전달하여 목적지에서 프로필을 검색하세요.
*   이미지 객체를 전달하지 마세요. 대신 목적지에서 소스로부터 이미지를 로드할 수 있는 URI 또는 파일 이름을 전달하세요.
*   애플리케이션 상태나 ViewModels를 전달하지 마세요. 대신 목적지 화면이 작동하는 데 필요한 정보만 전달하세요.

이러한 접근 방식은 구성 변경 중 데이터 손실 및 참조된 객체가 업데이트되거나 변형될 때 발생할 수 있는 불일치를 방지하는 데 도움이 됩니다.

앱에 데이터 레이어를 올바르게 구현하는 방법에 대한 지침은 [Android의 데이터 레이어에 대한 아티클](https://developer.android.com/topic/architecture/data-layer)을 참조하세요.

### 뒤로 가기 스택 관리

뒤로 가기 스택은 `NavController` 클래스에 의해 제어됩니다. 다른 스택과 마찬가지로 `NavController`는 스택의 맨 위에 새 항목을 푸시하고 맨 위에서 팝합니다.

*   앱이 실행되면 뒤로 가기 스택에 나타나는 첫 번째 항목은 NavHost에 정의된 시작 목적지입니다.
*   각 `NavController.navigate()` 호출은 기본적으로 주어진 목적지를 스택의 맨 위로 푸시합니다.
*   뒤로 가기 제스처, 뒤로 가기 버튼 또는 `NavController.popBackStack()` 메서드를 사용하면 현재 목적지를 스택에서 팝(pop)하고 사용자를 이전 목적지로 되돌립니다. 사용자가 딥 링크를 통해 현재 목적지로 이동한 경우, 스택을 팝하면 이전 앱으로 돌아갑니다. 또는 `NavController.navigateUp()` 함수는 `NavController`의 컨텍스트 내에서 앱 내에서만 사용자를 내비게이션합니다.

내비게이션 라이브러리는 뒤로 가기 스택 처리에 유연성을 제공합니다. 다음을 수행할 수 있습니다.

*   뒤로 가기 스택에서 특정 목적지를 지정하고 해당 목적지로 이동하여, 해당 목적지 위에 있는 (그 이후에 온) 모든 항목을 스택에서 팝할 수 있습니다.
*   ( `.navigate()` 호출에 `popUpTo()` 인자를 추가하여) 목적지 Y까지 뒤로 가기 스택을 동시에 팝하면서 목적지 X로 이동할 수 있습니다.
*   비어 있는 뒤로 가기 스택 팝(pop)을 처리할 수 있습니다. (이 경우 사용자는 빈 화면에 도달하게 됩니다.)
*   앱의 여러 부분에 대해 여러 뒤로 가기 스택을 유지할 수 있습니다. 예를 들어, 하단 내비게이션이 있는 앱의 경우 각 탭에 대해 별도의 중첩 그래프를 유지하면서 탭 전환 시 내비게이션 상태를 저장하고 복원할 수 있습니다. 또는 각 탭에 대해 별도의 NavHost를 생성할 수도 있는데, 이는 설정이 다소 복잡하지만 어떤 경우에는 추적하기 더 쉬울 수 있습니다.

자세한 내용과 사용 사례는 [Jetpack Compose의 뒤로 가기 스택에 대한 문서](https://developer.android.com/guide/navigation/backstack)를 참조하세요.

### 딥 링크

내비게이션 라이브러리를 사용하면 특정 URI, 작업 또는 MIME 유형을 목적지와 연결할 수 있습니다. 이 연결을 딥 링크(_deep link_)라고 합니다.

기본적으로 딥 링크는 외부 앱에 노출되지 않습니다. 각 대상 배포에 대해 운영 체제에 적절한 URI 스키마를 등록해야 합니다.

딥 링크 생성, 등록 및 처리에 대한 자세한 내용은 [](compose-navigation-deep-links.md)를 참조하세요.

### 뒤로 가기 제스처

멀티플랫폼 내비게이션 라이브러리는 각 플랫폼에서 뒤로 가기 제스처를 이전 화면으로 내비게이션하는 것으로 변환합니다(예: iOS에서는 간단한 뒤로 스와이프, 데스크톱에서는 <shortcut>Esc</shortcut> 키).

기본적으로 iOS에서 뒤로 가기 제스처는 다른 화면으로 스와이프 전환되는 네이티브와 유사한 애니메이션을 트리거합니다. `enterTransition` 또는 `exitTransition` 인자를 사용하여 NavHost 애니메이션을 사용자 정의하면 기본 애니메이션이 트리거되지 않습니다.

```kotlin
NavHost(
    navController = navController,
    startDestination = Profile,
    // Explicitly specifying transitions turns off default animations
    // in favor of the selected ones 
    enterTransition = { slideInHorizontally() },
    exitTransition = { slideOutVertically() }
) { ... }
```

Android에서는 [매니페스트 파일](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-predictive)에서 뒤로 가기 제스처 핸들러를 활성화하거나 비활성화할 수 있습니다.

iOS에서는 핸들러가 기본적으로 활성화되어 있습니다. 이를 비활성화하려면 ViewController 구성에서 다음 플래그를 설정합니다.

```kotlin
ComposeUIViewController(
    configure = { enableBackGesture = false }
) {
    App()
}
```

## 대체 내비게이션 솔루션

Compose 기반 내비게이션 구현이 적합하지 않다면, 평가해 볼 수 있는 타사 대안이 있습니다.

| 이름                                                | 설명                                                                                                                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Voyager](https://voyager.adriel.cafe)              | 내비게이션에 대한 실용적인 접근 방식                                                                                                                              |
| [Decompose](https://arkivanov.github.io/Decompose/) | 전체 라이프사이클 및 모든 잠재적인 의존성 주입을 다루는 내비게이션에 대한 고급 접근 방식                                                                                                                      |
| [Circuit](https://slackhq.github.io/circuit/)       | 내비게이션 및 고급 상태 관리를 갖춘 코틀린 애플리케이션을 위한 Compose 기반 아키텍처                                                                                           |
| [Appyx](https://bumble-tech.github.io/appyx/)       | 제스처 제어 기능이 있는 모델 기반 내비게이션                                                                                                                    |
| [PreCompose](https://tlaster.github.io/PreCompose/) | Jetpack Lifecycle, ViewModel, LiveData 및 Navigation에서 영감을 받은 내비게이션 및 뷰 모델                                                                  |

## 다음 단계

Compose 내비게이션은 Android 개발자 포털에서 심층적으로 다뤄집니다. 이 문서에 Android 전용 예제가 사용되는 경우가 있지만, 기본 지침과 내비게이션 원칙은 Multiplatform에서도 동일합니다.

*   [Compose를 사용한 내비게이션 개요](https://developer.android.com/develop/ui/compose/navigation).
*   내비게이션 그래프, 이동 방법 및 기타 내비게이션 사용 사례에 대한 하위 페이지가 있는 [Jetpack 내비게이션 시작 페이지](https://developer.android.com/guide/navigation).