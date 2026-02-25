[//]: # (title: Compose Multiplatform의 Navigation 3)
<primary-label ref="alpha"/>

[Android의 네비게이션(Navigation) 라이브러리](https://developer.android.com/guide/navigation)가 네비게이션 3로 업그레이드되었습니다. 이번 업그레이드에서는 컴포즈(Compose)와 연동되며 이전 버전의 라이브러리에 대한 피드백을 반영하여 재설계된 네비게이션 접근 방식을 도입했습니다.
버전 1.10부터 Compose Multiplatform은 Android, iOS, 데스크톱 및 웹 등 지원되는 모든 멀티플랫폼 프로젝트에서 네비게이션 3 도입을 지원합니다.

## 주요 변경 사항

네비게이션 3는 단순히 라이브러리의 새로운 버전 그 이상이며, 여러 면에서 완전히 새로운 라이브러리라고 할 수 있습니다.
이러한 재설계의 이면에 있는 철학에 대해 자세히 알아보려면 [Android 개발자 블로그 포스트](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)를 참조하세요.

네비게이션 3의 주요 변경 사항은 다음과 같습니다:

* **사용자 소유의 백 스택(Back stack)**. 단일 라이브러리 백 스택을 조작하는 대신, UI가 직접 관찰하는 상태의 `SnapshotStateList`를 생성하고 관리합니다.
* **저수준 빌딩 블록(Low-level building blocks)**. 컴포즈와의 긴밀한 통합 덕분에, 라이브러리는 자신만의 네비게이션 컴포넌트와 동작을 구현하는 데 더 많은 유연성을 제공합니다.
* **적응형 레이아웃(Adaptive layout) 시스템**. 적응형 디자인을 통해 동시에 여러 대상(destination)을 표시하고 레이아웃 간을 원활하게 전환할 수 있습니다. 

네비게이션 3의 전반적인 설계에 대한 자세한 내용은 [Android 문서](https://developer.android.com/guide/navigation/navigation-3)에서 확인하세요.

## 의존성 설정

네비게이션 3의 멀티플랫폼 구현을 사용해 보려면 버전 카탈로그에 다음 의존성을 추가하세요:

```text
[versions]
multiplatform-nav3-ui = "1.0.0-alpha05"

[libraries]
jetbrains-navigation3-ui = { module = "org.jetbrains.androidx.navigation3:navigation3-ui", version.ref = "multiplatform-nav3-ui" }
```

> 네비게이션 3는 `navigation3:navigation3-ui`와 `navigation3:navigation3-common` 두 개의 아티팩트로 출시되지만, `navigation3-ui`만 별도의 Compose Multiplatform 구현을 가지고 있습니다.
> `navigation3-common`에 대한 의존성은 전이적으로(transitively) 추가됩니다.
>
{style="note"}

Material 3 Adaptive 및 ViewModel 라이브러리를 사용하는 프로젝트의 경우, 다음 네비게이션 지원 아티팩트도 추가하세요:
```text
[versions]
compose-multiplatform-adaptive = "1.3.0-alpha02"
compose-multiplatform-lifecycle = "2.10.0-alpha05"

[libraries]
jetbrains-material3-adaptiveNavigation3 = { module = "org.jetbrains.compose.material3.adaptive:adaptive-navigation3", version.ref = "compose-multiplatform-adaptive" }
jetbrains-lifecycle-viewmodelNavigation3 = { module = "org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3", version.ref = "compose-multiplatform-lifecycle" }
```

마지막으로, JetBrains 엔지니어가 만든 [개념 증명(proof-of-concept) 라이브러리](https://github.com/terrakok/navigation3-browser)를 사용해 볼 수 있습니다. 이 라이브러리는 멀티플랫폼 네비게이션 3를 웹의 브라우저 기록 네비게이션과 통합합니다:

```text
[versions]
compose-multiplatform-navigation3-browser = "0.2.0"

[libraries]
navigation3-browser = { module = "com.github.terrakok:navigation3-browser", version.ref = "compose-multiplatform-navigation3-browser" }
```

브라우저 기록 네비게이션은 버전 1.1.0에서 기본 멀티플랫폼 네비게이션 3 라이브러리에 의해 지원될 예정입니다.

## 멀티플랫폼 지원

네비게이션 3는 컴포즈와 밀접하게 연계되어 있어, Android 네비게이션 구현이 최소한의 변경만으로 공통 Compose Multiplatform 코드에서 작동할 수 있도록 해줍니다.
웹 및 iOS와 같은 비 JVM 플랫폼을 지원하기 위해 필요한 유일한 작업은 [대상 키(destination keys)에 대한 다형성 직렬화(polymorphic serialization)](#polymorphic-serialization-for-destination-keys)를 구현하는 것입니다. 

GitHub에서 네비게이션 3를 사용하는 Android 전용 앱과 멀티플랫폼 앱의 방대한 예시를 비교해 볼 수 있습니다:
* [네비게이션 3 레시피가 포함된 원본 Android 저장소](https://github.com/android/nav3-recipes)
* [대부분 동일한 레시피가 포함된 Compose Multiplatform 프로젝트](https://github.com/terrakok/nav3-recipes)

### 대상 키에 대한 다형성 직렬화

Android에서 네비게이션 3는 리플렉션(reflection) 기반 직렬화에 의존하지만, 이는 iOS와 같은 비 JVM 플랫폼을 대상으로 할 때는 사용할 수 없습니다.
이를 고려하여 라이브러리에는 `rememberNavBackStack()` 함수에 대한 두 가지 오버로드가 있습니다:

* [첫 번째 오버로드](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(kotlin.Array))는 `NavKey` 참조 세트만 받으며 리플렉션 기반 직렬화 도구가 필요합니다.
* [두 번째 오버로드](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(androidx.savedstate.serialization.SavedStateConfiguration,kotlin.Array))는 `SavedStateConfiguration` 파라미터도 함께 받으므로, `SerializersModule`을 제공하고 모든 플랫폼에서 개방형 다형성(open polymorphism)을 올바르게 처리할 수 있게 해줍니다.

네비게이션 3 멀티플랫폼 예시에서 다형성 직렬화는 [이와 같이](https://github.com/terrakok/nav3-recipes/blob/8ff455499877225b638d5fcd82b232834f819422/sharedUI/src/commonMain/kotlin/com/example/nav3recipes/basicdsl/BasicDslActivity.kt#L40) 구성할 수 있습니다:

```kotlin
@Serializable
private data object RouteA : NavKey

@Serializable
private data class RouteB(val id: String) : NavKey

// 개방형 다형성을 위해 필요한 직렬화 구성 생성
private val config = SavedStateConfiguration {
    serializersModule = SerializersModule {
        polymorphic(NavKey::class) {
            subclass(RouteA::class, RouteA.serializer())
            subclass(RouteB::class, RouteB.serializer())
        }
    }
}

@Composable
fun BasicDslActivity() {
    // 직렬화 구성을 사용
    val backStack = rememberNavBackStack(config, RouteA)

    NavDisplay(
        backStack = backStack,
        //...
    )
}
```

## 다음 단계

네비게이션 3에 대해서는 Android 개발자 포털에서 심도 있게 다루고 있습니다.
일부 문서는 Android 전용 예시를 사용하지만, 핵심 개념과 네비게이션 원칙은 모든 플랫폼에서 동일하게 유지됩니다:

* [네비게이션 3 개요](https://developer.android.com/guide/navigation/navigation-3): 상태 관리, 네비게이션 코드 모듈화 및 애니메이션에 대한 조언이 포함되어 있습니다.
* [네비게이션 2에서 네비게이션 3로 마이그레이션](https://developer.android.com/guide/navigation/navigation-3/migration-guide). 네비게이션 3는 기존 라이브러리의 새 버전이라기보다 새로운 라이브러리로 보는 것이 더 쉬우므로, 마이그레이션이라기보다는 재작성에 가깝습니다. 하지만 이 가이드는 취해야 할 일반적인 단계들을 안내합니다.