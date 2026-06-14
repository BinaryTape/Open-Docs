[//]: # (title: Compose에서의 내비게이션)

[Android의 Navigation 라이브러리](https://developer.android.com/guide/navigation)는 Jetpack Compose에서의 내비게이션을 지원합니다.
Compose Multiplatform 팀은 AndroidX Navigation 라이브러리에 멀티플랫폼 지원을 제공하고 있습니다.

이 라이브러리는 앱 내 콘텐츠 조각들 사이의 실제 내비게이션 외에도 다음과 같은 기본적인 내비게이션 문제들을 해결합니다:

* 목적지 간에 데이터를 타입 안정성(type-safe)이 보장되는 방식으로 전달합니다.
* 명확하고 접근 가능한 내비게이션 히스토리를 유지하여 사용자의 앱 내 여정을 쉽게 추적할 수 있게 합니다.
* 일반적인 워크플로 밖에서 사용자를 앱의 특정 위치로 이동시킬 수 있는 딥 링크(deep linking) 메커니즘을 지원합니다.
* 내비게이션 시 일관된 애니메이션과 전환을 지원하며, 최소한의 추가 작업으로 뒤로 가기 제스처와 같은 일반적인 패턴을 허용합니다.

기초 지식이 충분하다면 [내비게이션 및 라우팅](compose-navigation-routing.md)으로 넘어가 크로스 플랫폼 프로젝트에서 Navigation 라이브러리를 활용하는 방법을 알아보세요.
그렇지 않다면, 라이브러리가 작동하는 기본 개념에 대해 계속 읽어보시기 바랍니다.

> Navigation 라이브러리의 멀티플랫폼 버전 변경 사항은 [새로운 소식](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)에서 확인하거나, [Compose Multiplatform 변경 로그](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)에서 특정 EAP 릴리스를 팔로우할 수 있습니다.
>
{style="tip"}

## Compose 내비게이션의 기본 개념

Navigation 라이브러리는 내비게이션 유스케이스를 매핑하기 위해 다음 개념들을 사용합니다:

* **내비게이션 그래프(navigation graph)**는 앱 내의 모든 가능한 목적지(destination)와 그들 사이의 연결을 설명합니다. 내비게이션 그래프는 앱의 하위 흐름을 수용하기 위해 중첩될 수 있습니다.
* **목적지(destination)**는 내비게이션 그래프에서 이동할 수 있는 노드입니다. 이는 컴포저블(composable), 중첩된 내비게이션 그래프 또는 대화 상자(dialog)가 될 수 있습니다. 사용자가 목적지로 이동하면 앱은 해당 콘텐츠를 표시합니다.
* **루트(route)**는 목적지를 식별하고 이동에 필요한 인자(arguments)를 정의하지만, UI를 설명하는 역할은 하지 않습니다. 이렇게 하면 데이터가 표현 방식과 분리되어, 각 UI 구현 조각을 전체 앱 구조와 독립적으로 유지할 수 있습니다. 이는 예를 들어 프로젝트에서 컴포저블을 테스트하고 재배치하는 것을 더 쉽게 만들어 줍니다.

이러한 개념들을 염두에 두고, Navigation 라이브러리는 내비게이션 아키텍처를 안내하기 위한 기본 규칙을 구현합니다:

<!--* There is a fixed _start destination_, the first screen a user **usually** sees when they launch the app.
  Conditional screens like initial setup or login should not be considered
  start destinations even if they are unavoidable for a new user, think about the primary workflow.-->
<!-- Android introduces this concept, but in our docs there is no use for it so far. Maybe later on. -->

* 앱은 사용자의 경로를 목적지 스택, 즉 **백 스택(back stack)**으로 표현합니다. 기본적으로 사용자가 새로운 목적지로 이동할 때마다 해당 목적지가 스택의 맨 위에 추가됩니다. 백 스택을 사용하면 내비게이션을 더 직관적으로 만들 수 있습니다. 직접 앞뒤로 이동하는 대신 스택 맨 위에서 현재 목적지를 꺼내(pop) 자동으로 이전 목적지로 돌아갈 수 있습니다.
* 각 목적지는 연결된 **딥 링크(deep links)** 세트를 가질 수 있습니다. 이는 앱이 운영 체제로부터 링크를 받았을 때 해당 목적지로 연결되어야 하는 URI 패턴입니다.

## 기본 내비게이션 예제

Navigation 라이브러리를 사용하려면 `commonMain` 소스 세트에 다음 종속성을 추가하세요:

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

내비게이션 설정을 위해 필요한 단계들을 다음과 같은 순서로 진행하는 것이 합리적입니다:

1. 루트(routes)를 정의합니다. 각 목적지에 대해 해당 목적지가 필요로 하는 인자를 담을 수 있는 [직렬화 가능한(serializable)](https://kotlinlang.org/docs/serialization.html) 객체 또는 데이터 클래스를 생성합니다.
2. `NavController`를 생성합니다. 이는 내비게이션 인터페이스가 되며, 모든 컴포저블이 접근할 수 있도록 컴포저블 계층 구조에서 충분히 높은 위치에 둡니다. `NavController`는 앱의 백 스택을 보유하고 내비게이션 그래프 내에서 목적지 간 전환을 위한 메서드를 제공합니다.
3. 루트 중 하나를 시작 목적지(start destination)로 선택하여 내비게이션 그래프를 설계합니다. 이를 위해 내비게이션 그래프(이동 가능한 모든 목적지를 설명함)를 보유하는 `NavHost` 컴포저블을 생성합니다.

다음은 앱 내 내비게이션을 위한 기초적인 예제입니다:

```kotlin
// 루트 생성
@Serializable
object Profile
@Serializable
object FriendsList

// NavController 생성
val navController = rememberNavController()

// 제공된 목적지들로 구성된 내비게이션 그래프를 가진 NavHost 생성
NavHost(navController = navController, startDestination = Profile) {
    composable<Profile> { ProfileScreen( /* ... */ ) }
    composable<FriendsList> { FriendsListScreen( /* ... */ ) }
    // 비슷한 방식으로 더 많은 목적지를 추가할 수 있습니다
}
```

### Navigation 라이브러리의 주요 클래스

Navigation 라이브러리는 다음과 같은 핵심 타입을 제공합니다:

* `NavController`: 핵심 내비게이션 기능을 위한 API를 제공합니다. 목적지 간 전환, 딥 링크 처리, 백 스택 관리 등을 수행합니다.
    <!--You should create the `NavController` high in your composable hierarchy, high enough that all the composables
    that need to reference it can do so.
    This way, you can use the `NavController` as the single source of truth for updating composables outside of your screens.
    [NB: This doesn't seem to be useful to people who are trying to cover the basics.]-->
* `NavHost`: 내비게이션 그래프를 기반으로 현재 목적지의 콘텐츠를 표시하는 컴포저블입니다. 각 `NavHost`에는 필수 `startDestination` 파라미터가 있습니다. 이는 사용자가 앱을 시작할 때 가장 먼저 보게 되는 화면에 해당하는 목적지입니다.
* `NavGraph`: 앱 내의 모든 가능한 목적지와 그들 사이의 연결을 설명합니다. 내비게이션 그래프는 보통 `NavHost` 선언부 등에서 `NavGraph`를 반환하는 빌더 람다로 정의됩니다.

핵심 타입 기능 외에도, Navigation 컴포넌트는 애니메이션 및 전환, 딥 링크 지원, 타입 안정성, `ViewModel` 지원 및 앱 내 내비게이션 처리를 위한 기타 편의 기능들을 제공합니다.

## 내비게이션 유스케이스

### 목적지로 이동하기

목적지로 이동하려면 `NavController.navigate()` 함수를 호출합니다. 위의 예제를 이어가자면 다음과 같습니다:

```kotlin
Button(onClick = { navController.navigate(Profile) }) {
    Text("프로필로 이동")
}
```

### 목적지에 인자 전달하기

내비게이션 그래프를 설계할 때, 다음과 같이 루트를 파라미터가 있는 데이터 클래스로 정의할 수 있습니다:

```kotlin
@Serializable
data class Profile(val name: String)
```

목적지에 인자를 전달하려면, 목적지로 이동할 때 해당 클래스 생성자에 인자를 전달합니다.

```kotlin
Button(onClick = { navController.navigate(Profile("Alice")) }) {
    Text("프로필로 이동")
}
```

그런 다음 목적지에서 데이터를 검색합니다:

```kotlin
composable<Profile> { backStackEntry ->
    val profile: Profile = backStackEntry.toRoute()
    
    // 사용자 이름이 필요한 곳에 `profile.name`을 사용합니다
}
```

### 내비게이션 시 복잡한 데이터 조회하기

목적지 간에 이동할 때는 필요한 최소한의 정보만 전달하는 것을 고려하세요. 파일이나 앱의 전반적인 상태를 반영하는 복잡한 객체는 데이터 레이어에 저장되어야 합니다. 사용자가 목적지에 도달하면 UI는 단일 진실 공급원(single source of truth)으로부터 실제 데이터를 로드해야 합니다.

예를 들어:

* 사용자 프로필 전체를 전달하지 **마세요**. 대신 목적지에서 프로필을 조회할 수 있도록 사용자 ID를 **전달하세요**.
* 이미지 객체를 전달하지 **마세요**. 대신 목적지에서 소스로부터 이미지를 로드할 수 있도록 URI나 파일 이름을 **전달하세요**.
* 애플리케이션 상태나 ViewModel을 전달하지 **마세요**. 대신 목적지 화면이 작동하는 데 필요한 정보만 **전달하세요**.

이러한 접근 방식은 구성 변경(configuration changes) 동안 데이터 손실을 방지하고, 참조된 객체가 업데이트되거나 변경될 때 발생할 수 있는 불일치를 방지하는 데 도움이 됩니다.

앱에서 데이터 레이어를 적절하게 구현하는 방법은 [Android의 데이터 레이어 문서](https://developer.android.com/topic/architecture/data-layer)를 참조하세요.

### 백 스택 관리하기

백 스택은 `NavController` 클래스에 의해 제어됩니다. 다른 스택과 마찬가지로, `NavController`는 새로운 항목을 스택 맨 위에 밀어 넣고(push) 맨 위에서 꺼냅니다(pop):

* 앱이 시작될 때 백 스택에 나타나는 첫 번째 항목은 `NavHost`에 정의된 시작 목적지입니다.
* 각 `NavController.navigate()` 호출은 기본적으로 주어진 목적지를 스택 맨 위에 추가합니다.
* 뒤로 가기 제스처, 뒤로 가기 버튼 또는 `NavController.popBackStack()` 메서드를 사용하면 현재 목적지를 스택에서 꺼내고 사용자를 이전 목적지로 돌려보냅니다. 만약 사용자가 운영 체제로부터 딥 링크를 통해 현재 목적지에 도달했다면, 스택을 팝(pop)하면 이전 앱으로 돌아가게 됩니다. 반면, `NavController.navigateUp()` 함수는 오직 `NavController` 컨텍스트 내의 앱 안에서만 사용자를 이동시킵니다.

Navigation 라이브러리는 백 스택 처리에 있어 유연성을 제공합니다. 다음이 가능합니다:

* 백 스택의 특정 목적지를 지정하고 해당 위치로 이동하며, 그 목적지 위에 있는(그 이후에 추가된) 모든 스택 항목을 꺼냅니다.
* 목적지 X로 이동함과 동시에 목적지 Y까지의 백 스택을 꺼냅니다(`.navigate()` 호출에 `popUpTo()` 인자를 추가하여 수행).
* 비어 있는 백 스택을 꺼낼 때(사용자가 빈 화면에 도달하게 됨)의 처리를 수행합니다.
* 앱의 서로 다른 부분에 대해 여러 개의 백 스택을 유지합니다. 예를 들어, 하단 내비게이션이 있는 앱의 경우 각 탭 간을 전환할 때 내비게이션 상태를 저장하고 복원하면서 각 탭에 대해 별도의 중첩된 그래프를 유지할 수 있습니다. 또는 각 탭에 대해 별도의 NavHost를 생성할 수도 있는데, 이는 설정이 조금 더 복잡해질 수 있지만 경우에 따라 추적하기 더 쉬울 수 있습니다.

자세한 내용과 유스케이스는 [백 스택에 관한 Jetpack Compose 문서](https://developer.android.com/guide/navigation/backstack)를 참조하세요.

### 딥 링크

Navigation 라이브러리를 사용하면 특정 URI, 액션 또는 MIME 타입을 목적지와 연결할 수 있습니다. 이 연결을 **딥 링크(deep link)**라고 합니다.

기본적으로 딥 링크는 외부 앱에 노출되지 않습니다. 각 타겟 배포 플랫폼에 대해 운영 체제에 적절한 URI 스킴을 등록해야 합니다.

딥 링크 생성, 등록 및 처리에 대한 자세한 내용은 [딥 링크](compose-navigation-deep-links.md)를 참조하세요.

### 뒤로 가기 제스처

멀티플랫폼 Navigation 라이브러리는 각 플랫폼의 뒤로 가기 제스처를 이전 화면으로 이동하는 동작으로 변환합니다 (예를 들어, iOS에서는 간단한 백 스와이프, 데스크톱에서는 <shortcut>Esc</shortcut> 키).

기본적으로 iOS에서 뒤로 가기 제스처는 다른 화면으로의 스와이프 전환이라는 네이티브와 유사한 애니메이션을 트리거합니다. `enterTransition` 또는 `exitTransition` 인자를 사용하여 `NavHost` 애니메이션을 커스텀하면 기본 애니메이션은 작동하지 않습니다:

```kotlin
NavHost(
    navController = navController,
    startDestination = Profile,
    // 명시적으로 트랜지션을 지정하면 기본 애니메이션 대신
    // 선택한 애니메이션이 적용됩니다
    enterTransition = { slideInHorizontally() },
    exitTransition = { slideOutVertically() }
) { ... }
```

Android에서는 [매니페스트 파일에서](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-predictive) 뒤로 가기 제스처 핸들러를 활성화하거나 비활성화할 수 있습니다.

iOS에서는 핸들러가 기본적으로 활성화되어 있습니다. 이를 비활성화하려면 `ViewController` 설정에서 다음 플래그를 설정하세요:

```kotlin
ComposeUIViewController(
    configure = { enableBackGesture = false }
) {
    App()
}
```

## 대체 내비게이션 솔루션

Compose 기반의 내비게이션 구현이 적합하지 않은 경우, 검토해 볼 만한 서드파티 대안들이 있습니다:

| 이름 | 설명 |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Voyager](https://voyager.adriel.cafe)              | 내비게이션에 대한 실용적인 접근 방식 |
| [Decompose](https://arkivanov.github.io/Decompose/) | 전체 수명 주기와 잠재적인 의존성 주입을 모두 다루는 고급 내비게이션 접근 방식 |
| [Circuit](https://slackhq.github.io/circuit/)       | 내비게이션과 고급 상태 관리를 포함한 Kotlin 애플리케이션을 위한 Compose 기반 아키텍처 |
| [Appyx](https://bumble-tech.github.io/appyx/)       | 제스처 제어가 포함된 모델 기반 내비게이션 |
| [PreCompose](https://tlaster.github.io/PreCompose/) | Jetpack Lifecycle, ViewModel, LiveData 및 Navigation에서 영감을 받은 내비게이션 및 뷰 모델 |

iOS를 타겟팅하고 내비게이션 UI에서 [Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/liquid-glass)와 같은 시스템 렌더링 효과를 원하는 경우, 화면 콘텐츠에는 Compose를 계속 사용하면서 [내비게이션을 네이티브 SwiftUI로 마이그레이션](ios-liquid-glass.md)하는 것을 고려해 보세요.

## 다음 단계

Compose 내비게이션은 Android 개발자 포털에서 심도 있게 다뤄집니다. 해당 문서는 때때로 Android 전용 예제를 사용하지만, 기본적인 가이드와 내비게이션 원칙은 멀티플랫폼에서도 동일합니다:

* [Compose 내비게이션 개요](https://developer.android.com/develop/ui/compose/navigation).
* [Jetpack Navigation 시작 페이지](https://developer.android.com/guide/navigation) (내비게이션 그래프, 이동 방법 및 기타 내비게이션 유스케이스에 대한 하위 페이지 포함).