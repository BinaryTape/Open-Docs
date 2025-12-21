[//]: # (title: Compose Multiplatform의 Navigation 3)
<primary-label ref="alpha"/>

[Android의 Navigation 라이브러리](https://developer.android.com/guide/navigation)가 Navigation 3으로 업그레이드되어, Compose와 함께 작동하고 이전 버전 라이브러리에 대한 피드백을 반영하는 재설계된 내비게이션 접근 방식을 도입했습니다. 버전 1.10부터 Compose Multiplatform은 Android, iOS, 데스크톱, 웹을 포함한 모든 지원 플랫폼에서 멀티플랫폼 프로젝트에 Navigation 3 채택을 지원합니다.

## 주요 변경 사항

Navigation 3은 라이브러리의 새 버전에 그치지 않고, 여러 면에서 완전히 새로운 라이브러리입니다. 이 재설계의 배경 철학에 대해 자세히 알아보려면 [Android 개발자 블로그 게시물](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)을 참조하세요.

Navigation 3의 주요 변경 사항은 다음과 같습니다.

*   **사용자 소유의 백 스택 (User-owned back stack)**. 단일 라이브러리 백 스택을 운영하는 대신, 상태의 `SnapshotStateList`를 생성하고 관리하며 UI가 이를 직접 관찰합니다.
*   **저수준 빌딩 블록 (Low-level building blocks)**. Compose와의 긴밀한 통합 덕분에, 이 라이브러리는 자체 내비게이션 구성 요소 및 동작을 구현하는 데 더 많은 유연성을 제공합니다.
*   **적응형 레이아웃 시스템 (Adaptive layout system)**. 적응형 설계를 통해 여러 대상을 동시에 표시하고 레이아웃 간을 원활하게 전환할 수 있습니다.

Navigation 3의 일반적인 설계에 대해 자세히 알아보려면 [Android 문서](https://developer.android.com/guide/navigation/navigation-3)를 참조하세요.

## 종속성 설정

Navigation 3의 멀티플랫폼 구현을 사용해 보려면 다음 종속성을 버전 카탈로그에 추가하세요.

```text
[versions]
multiplatform-nav3-ui = "1.0.0-alpha05"

[libraries]
jetbrains-navigation3-ui = { module = "org.jetbrains.androidx.navigation3:navigation3-ui", version.ref = "multiplatform-nav3-ui" }
```

> Navigation 3은 두 가지 아티팩트인 `navigation3:navigation3-ui`와 `navigation3:navigation3-common`으로 출시되지만,
> `navigation-ui`만 별도의 Compose Multiplatform 구현이 필요합니다.
> `navigation3-common`에 대한 종속성은 전이적으로 추가됩니다.
>
{style="note"}

Material 3 Adaptive 및 ViewModel 라이브러리를 사용하는 프로젝트의 경우, 다음 내비게이션 지원 아티팩트도 추가하세요.
```text
[versions]
compose-multiplatform-adaptive = "1.3.0-alpha02"
compose-multiplatform-lifecycle = "2.10.0-alpha05"

[libraries]
jetbrains-material3-adaptiveNavigation3 = { module = "org.jetbrains.compose.material3.adaptive:adaptive-navigation3", version.ref = "compose-multiplatform-adaptive" }
jetbrains-lifecycle-viewmodelNavigation3 = { module = "org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3", version.ref = "compose-multiplatform-lifecycle" }
```

마지막으로, JetBrains 엔지니어가 만든 [개념 증명(proof-of-concept) 라이브러리](https://github.com/terrakok/navigation3-browser)를 사용해 볼 수 있습니다. 이 라이브러리는 멀티플랫폼 Navigation 3을 웹 브라우저 기록 내비게이션과 통합합니다.

```text
[versions]
compose-multiplatform-navigation3-browser = "0.2.0"

[libraries]
navigation3-browser = { module = "com.github.terrakok:navigation3-browser", version.ref = "compose-multiplatform-navigation3-browser" }
```

브라우저 기록 내비게이션은 버전 1.1.0에서 기본 멀티플랫폼 Navigation 3 라이브러리에 의해 지원될 것으로 예상됩니다.

## 멀티플랫폼 지원

Navigation 3은 Compose와 밀접하게 연동되어 있어, 최소한의 변경으로 Android 내비게이션 구현이 공통 Compose Multiplatform 코드에서 작동할 수 있습니다. 웹 및 iOS와 같은 비JVM 플랫폼을 지원하려면 [대상 키를 위한 다형성 직렬화 (Polymorphic serialization for destination keys)](#polymorphic-serialization-for-destination-keys)를 구현하기만 하면 됩니다.

Navigation 3을 사용하는 Android 전용 및 멀티플랫폼 앱의 광범위한 예시를 GitHub에서 비교할 수 있습니다.
*   [Navigation 3 레시피가 포함된 원본 Android 저장소](https://github.com/android/nav3-recipes)
*   [대부분 동일한 레시피가 포함된 Compose Multiplatform 프로젝트](https://github.com/terrakok/nav3-recipes)

### 대상 키를 위한 다형성 직렬화 (Polymorphic serialization for destination keys)

Android에서 Navigation 3은 리플렉션 기반 직렬화에 의존하며, 이는 iOS와 같은 비JVM 플랫폼을 대상으로 할 때는 사용할 수 없습니다. 이를 고려하여, 이 라이브러리는 `rememberNavBackStack()` 함수에 두 가지 오버로드를 제공합니다.

*   [첫 번째 오버로드](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(kotlin.Array))는 `NavKey` 참조 집합만 사용하며 리플렉션 기반 직렬 변환기가 필요합니다.
*   [두 번째 오버로드](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(androidx.savedstate.serialization.SavedStateConfiguration,kotlin.Array))는 `SavedStateConfiguration` 매개변수도 사용하며, 이를 통해 `SerializersModule`을 제공하고 모든 플랫폼에서 개방형 다형성을 올바르게 처리할 수 있습니다.

Navigation 3 멀티플랫폼 예시에서 다형성 직렬화는 [다음과 같을 수 있습니다](https://github.com/terrakok/nav3-recipes/blob/8ff455499877225b638d5fcd82b232834f819422/sharedUI/src/commonMain/kotlin/com/example/nav3recipes/basicdsl/BasicDslActivity.kt#L40).

```kotlin
@Serializable
private data object RouteA : NavKey

@Serializable
private data class RouteB(val id: String) : NavKey

// 개방형 다형성을 위한 필수 직렬화 구성 생성
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
    // 직렬화 구성 사용
    val backStack = rememberNavBackStack(config, RouteA)

    NavDisplay(
        backStack = backStack,
        //...
    )
}
```

## 다음 단계

Navigation 3은 Android 개발자 포털에서 심층적으로 다루어집니다. 일부 문서에서 Android 고유의 예시를 사용하지만, 핵심 개념과 내비게이션 원칙은 모든 플랫폼에서 일관되게 유지됩니다.

*   [Navigation 3 개요](https://developer.android.com/guide/navigation/navigation-3) (상태 관리, 내비게이션 코드 모듈화, 애니메이션에 대한 조언 포함).
*   [Navigation 2에서 Navigation 3으로의 마이그레이션](https://developer.android.com/guide/navigation/navigation-3/migration-guide). Navigation 3은 기존 라이브러리의 새 버전보다는 새로운 라이브러리로 보는 것이 더 쉽기 때문에, 마이그레이션이라기보다는 재작성에 가깝습니다. 하지만 이 가이드는 취해야 할 일반적인 단계를 제시합니다.