# 다중 플랫폼 Jetpack 라이브러리가 패키징되는 방식

Compose Multiplatform는 Jetpack Compose와 관련 AndroidX 라이브러리의 모든 기능을 Android 외 다른 플랫폼으로 가져옵니다.
[Android 개발자 웹사이트](https://developer.android.com/kotlin/multiplatform)에 나와 있듯이, 많은 Jetpack 라이브러리(예: `androidx.annotation`)는 Android 팀에 의해 완전한 다중 플랫폼으로 게시되어 KMP 프로젝트에서 그대로 사용할 수 있습니다.
Compose 자체, Navigation, Lifecycle, ViewModel과 같은 다른 라이브러리들은 공통 코드에서 작동하기 위해 추가적인 지원이 필요합니다.

JetBrains의 Compose Multiplatform 팀은 Android 외 플랫폼용 라이브러리에 대한 아티팩트(artifacts)를 생성한 다음, 원본 Android 아티팩트와 함께 단일 그룹 ID로 모두 게시합니다.
이런 방식으로, 공통 소스 세트(common source set)에 이러한 다중 플랫폼 종속성(dependency)을 추가하면, 앱의 Android 배포판은 Android 아티팩트를 사용합니다.
동시에, 다른 타겟(target)을 위한 배포판은 해당 플랫폼용으로 빌드된 아티팩트를 사용합니다.

다음은 이 과정의 개요입니다:

![](androidx-cmp-artifacts.svg)

예를 들어, "iOS용 Navigation 아티팩트"는 다음 다중 플랫폼 아티팩트의 모음을 의미합니다.
* `org.jetbrains.androidx.navigation.navigation-compose-uikitarm64`
* `org.jetbrains.androidx.navigation.navigation-compose-uikitsimarm64`
* `org.jetbrains.androidx.navigation.navigation-common-iosx64`
* `org.jetbrains.androidx.navigation.navigation-runtime-iossimulatorarm64`
* 기타 등등.

이 모든 아티팩트는 다른 플랫폼용 아티팩트와 원본 Android 라이브러리(`androidx.navigation.navigation-compose`)에 대한 참조와 함께 그룹으로 게시됩니다.
이들은 통합된 `org.jetbrains.androidx.navigation.navigation-compose` 종속성을 통해 접근할 수 있습니다.
Compose Multiplatform Gradle 플러그인은 플랫폼별 아티팩트를 배포판에 매핑하는 작업을 처리합니다.

이 접근 방식을 통해, 해당 종속성을 가진 Kotlin Multiplatform (KMP) 프로젝트로 생성된 Android 앱은 원본 Android Navigation 라이브러리를 사용합니다.
반면에 iOS 앱은 JetBrains에서 빌드한 해당 iOS 라이브러리를 사용합니다.

## 다중 플랫폼 프로젝트에서 사용 가능한 Compose 패키지

기본 Compose 라이브러리 중에서는 핵심 `androidx.compose.runtime`가 완전한 다중 플랫폼을 지원합니다.
([이전에 사용되던](whats-new-compose-190.md#multiplatform-targets-in-androidx-compose-runtime-runtime) `org.jetbrains.compose.runtime` 아티팩트는 이제 별칭으로 사용됩니다.)
또한 Compose Multiplatform는 다음을 구현합니다:
   * `androidx.compose.ui`와 `androidx.compose.foundation`의 다중 플랫폼 버전으로, Compose Multiplatform 프로젝트에서 각각 `org.jetbrains.compose.ui` 및 `org.jetbrains.compose.foundation`로 사용 가능합니다.
   * `androidx.compose.material3`와 `androidx.compose.material`의 다중 플랫폼 버전으로, 유사하게 패키징됩니다(`org.jetbrains.compose.material3` 및 `org.jetbrains.compose.material`).
     다른 라이브러리와 달리, Material 3 라이브러리는 Compose Multiplatform 버전과 결합되어 있지 않습니다.
     따라서 `material3` 별칭 대신 직접적인 종속성을 제공할 수 있습니다. 예를 들어, EAP 버전을 사용할 수도 있습니다.
   * 독립형 아티팩트(`org.jetbrains.compose.material3.adaptive:adaptive*`)로 제공되는 Material 3 adaptive 라이브러리

## 추가적인 다중 플랫폼 라이브러리

Compose 앱 구축에 필요한 일부 기능은 AndroidX의 범위 밖에 있으므로, JetBrains는 이를 Compose Multiplatform에 번들(bundled)된 다중 플랫폼 라이브러리로 구현합니다. 예를 들면 다음과 같습니다:

* Compose Multiplatform Gradle 플러그인은 다음을 제공합니다.
    * Compose Multiplatform 프로젝트 구성을 위한 Gradle DSL을 제공합니다.
    * 데스크톱 및 웹 타겟(target)용 배포 패키지 생성을 돕습니다.
    * 각 타겟(target)에 리소스(resource)를 올바르게 사용할 수 있도록 다중 플랫폼 리소스 라이브러리를 지원합니다.
* `org.jetbrains.compose.components.resources`는 [크로스 플랫폼 리소스](compose-multiplatform-resources.md)에 대한 지원을 제공합니다.
* `org.jetbrains.compose.components.uiToolingPreview`는 IntelliJ IDEA 및 Android Studio에서 공통 코드용 Compose UI 미리 보기(preview)를 지원합니다.
* `org.jetbrains.compose.components.animatedimage`는 애니메이션 이미지(animated image) 표시를 지원합니다.
* `org.jetbrains.compose.components.splitpane`는 Swing의 [JSplitPane](https://docs.oracle.com/javase/8/docs/api/javax/swing/JSplitPane.html)과 유사한 기능을 구현합니다.