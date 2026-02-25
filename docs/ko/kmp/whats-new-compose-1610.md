[//]: # (title: Compose Multiplatform 1.6.10의 새로운 기능)

이번 기능 릴리스의 주요 하이라이트는 다음과 같습니다:

* [중대한 변경 사항: 새로운 Compose 컴파일러 Gradle 플러그인](#breaking-change-new-compose-compiler-gradle-plugin)
* [Compose Multiplatform 리소스를 사용하는 멀티모듈 프로젝트 지원](#support-for-multimodule-projects-with-compose-multiplatform-resources)
* [실험적 내비게이션 라이브러리](#experimental-navigation-library)
* [실험적 공통 ViewModel을 포함한 Lifecycle 라이브러리](#lifecycle-library)
* [알려진 문제: MissingResourceException](#known-issue-missingresourceexception)

이번 릴리스의 전체 변경 사항 목록은 [GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-may-2024)에서 확인하실 수 있습니다.

## 종속성(Dependencies)

* Gradle 플러그인 `org.jetbrains.compose`, 버전 1.6.10. 다음 Jetpack Compose 라이브러리를 기반으로 합니다:
  * [Compiler 1.5.14](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.14)
  * [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
  * [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
  * [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
  * [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
  * [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
* Lifecycle 라이브러리 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0`. [Jetpack Lifecycle 2.8.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0)을 기반으로 합니다.
* Navigation 라이브러리 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha07`. [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)을 기반으로 합니다.

## 중대한 변경 사항: 새로운 Compose 컴파일러 Gradle 플러그인

Kotlin 2.0.0부터 Compose Multiplatform은 새로운 Compose 컴파일러 Gradle 플러그인을 사용해야 합니다.
자세한 내용은 [마이그레이션 가이드](compose-compiler.md#migrating-a-compose-multiplatform-project)를 참조하세요.

## 모든 플랫폼 공통

### 리소스(Resources)

#### 안정적인 리소스 라이브러리

[리소스 라이브러리 API](compose-multiplatform-resources.md)의 대부분이 이제 안정된(stable) 것으로 간주됩니다.

#### Compose Multiplatform 리소스를 사용하는 멀티모듈 프로젝트 지원

Compose Multiplatform 1.6.10부터 모든 Gradle 모듈과 소스 세트(source set)에 리소스를 저장할 수 있으며, 리소스가 포함된 프로젝트 및 라이브러리를 배포할 수 있습니다.

멀티모듈 지원을 활성화하려면 프로젝트를 Kotlin 버전 2.0.0 이상 및 Gradle 7.6 이상으로 업데이트하세요.

#### 멀티플랫폼 리소스를 위한 구성 DSL

이제 프로젝트에서 `Res` 클래스 생성을 세밀하게 조정할 수 있습니다. 클래스의 가시성(modality)과 할당된 패키지를 변경할 수 있으며, 생성 조건(항상 생성, 생성 안 함, 또는 리소스 라이브러리에 명시적 의존성이 있는 경우에만 생성)을 선택할 수 있습니다.

자세한 내용은 [문서 섹션](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)을 참조하세요.

#### 리소스 URI 생성을 위한 공개 함수

새로운 `getUri()` 함수를 사용하면 리소스의 플랫폼 종속 URI를 외부 라이브러리에 전달하여 파일에 직접 접근할 수 있게 할 수 있습니다.
자세한 내용은 [문서](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)를 참조하세요.

#### 문자열 리소스의 복수형(Plurals)

이제 다른 멀티플랫폼 문자열 리소스와 함께 복수형(quantity strings)을 정의할 수 있습니다.
자세한 내용은 [문서](compose-multiplatform-resources-usage.md#plurals)를 참조하세요.

#### 3자리 로케일 지원

[언어 한정자(Language qualifiers)](compose-multiplatform-resources-setup.md#language-and-regional-qualifiers)가 이제 로케일에 대해 alpha-3 (ISO 639-2) 코드를 지원합니다.

#### 이미지 및 폰트를 위한 실험적 바이트 배열 함수

폰트와 이미지를 바이트 배열로 가져올 수 있는 두 가지 함수 `getDrawableResourceBytes()`와 `getFontResourceBytes()`를 사용해 볼 수 있습니다.
이 함수들은 서드파티 라이브러리에서 멀티플랫폼 리소스에 접근하는 것을 돕기 위해 만들어졌습니다.

자세한 내용은 [풀 리퀘스트](https://github.com/JetBrains/compose-multiplatform/pull/4651)를 확인하세요.

### 실험적 내비게이션 라이브러리

Jetpack Compose를 기반으로 하는 공통(common) 내비게이션 라이브러리를 이제 사용할 수 있습니다.
자세한 내용은 [문서](compose-navigation-routing.md)를 참조하세요.

이 버전의 주요 제한 사항은 다음과 같습니다:
* [딥 링크(Deep links)](https://developer.android.com/guide/navigation/design/deep-link)(처리 또는 팔로잉)는 아직 지원되지 않습니다.
* [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) 함수와 [예측 뒤로 가기 제스처(predictive back gestures)](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)는 Android에서만 지원됩니다.

### Lifecycle 라이브러리

Jetpack Lifecycle을 기반으로 하는 공통 lifecycle 라이브러리를 이제 사용할 수 있습니다. 자세한 내용은 [문서](compose-lifecycle.md)를 참조하세요.

이 라이브러리는 주로 공통 내비게이션 기능을 지원하기 위해 도입되었지만, 실험적인 크로스 플랫폼 `ViewModel` 구현을 제공하며 프로젝트에서 구현할 수 있는 공통 `LifecycleOwner` 인터페이스를 포함합니다.

Compose Multiplatform은 일반적인 `ViewModelStoreOwner` 구현도 제공합니다.

### Kotlin 2.0.0 지원

Kotlin 2.0.0이 Compose 컴파일러를 위한 새로운 Gradle 플러그인과 함께 출시되었습니다.
최신 컴파일러 버전과 함께 Compose Multiplatform을 사용하려면 프로젝트의 모듈에 해당 플러그인을 적용하세요(자세한 내용은 [마이그레이션 가이드](compose-compiler.md#migrating-a-compose-multiplatform-project) 참조).

## 데스크톱(Desktop)

### BasicTextField2 기본 지원

`BasicTextField2` Compose 컴포넌트가 이제 데스크톱 타겟에서 기본 수준으로 지원됩니다.
프로젝트에서 반드시 필요하거나 테스트해 보려는 경우에 사용하세요. 다만, 아직 해결되지 않은 예외 상황이 있을 수 있음을 유의하시기 바랍니다.
예를 들어, `BasicTextField2`는 현재 IME 이벤트를 지원하지 않으므로 한국어, 중국어 또는 일본어 가상 키보드를 사용할 수 없습니다.

해당 컴포넌트에 대한 전체 지원 및 기타 플랫폼 지원은 Compose Multiplatform 1.7.0 릴리스에서 계획되어 있습니다.

### DialogWindow를 위한 alwaysOnTop 플래그

대화 상자 창이 가려지는 것을 방지하기 위해 이제 `DialogWindow` 컴포저블에서 `alwaysOnTop` 플래그를 사용할 수 있습니다.

자세한 내용은 [풀 리퀘스트](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)를 확인하세요.

## iOS

### 접근성(Accessibility) 지원 개선

이번 릴리스에서 변경된 사항:

* 대화 상자(dialogs) 및 팝업이 접근성 기능과 적절하게 통합되었습니다.
* `UIKitView` 및 `UIKitViewController`를 사용하여 생성된 상호 운용 뷰(interop views)를 이제 접근성 서비스에서 접근할 수 있습니다.
* `LiveRegion` 시맨틱이 접근성 API에 의해 지원됩니다.
* [접근성 스크롤(accessibility scrolling)](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)이 지원됩니다.
* `HapticFeedback`이 지원됩니다.

### iOS 17 이상을 위한 선택 컨테이너 돋보기

iOS의 Compose Multiplatform 선택 컨테이너(selection containers)는 이제 네이티브 돋보기 도구를 에뮬레이트합니다.

![텍스트 돋보기가 활성화된 iPhone 채팅 앱 스크린샷](compose-1610-ios-magnifier.png){width=390}

### Dialog 중앙 정렬을 위한 소프트웨어 키보드 인셋

`Dialog` 컴포저블의 동작이 이제 Android와 일치합니다. 화면에 소프트웨어 키보드가 나타날 때, 대화 상자는 애플리케이션 창의 유효 높이를 고려하여 중앙에 배치됩니다.
`DialogProperties.useSoftwareKeyboardInset` 속성을 사용하여 이 기능을 비활성화할 수 있습니다.

## 웹(Web)

### 알파 단계의 Kotlin/Wasm 지원

실험적인 Compose Multiplatform for Web이 이제 알파(Alpha) 단계에 진입했습니다.

* 대부분의 웹 기능이 Compose Multiplatform for Desktop과 유사합니다.
* 팀은 웹 플랫폼을 정식 릴리스하기 위해 최선을 다하고 있습니다.
* 다음 단계는 대부분의 컴포넌트에 대한 철저한 브라우저 최적화입니다.

UI 코드를 공유하는 웹 앱을 설정하고 실행하는 방법은 [첫 번째 앱 튜토리얼](quickstart.md)을 참조하세요.

### 기본 IME 키보드 지원

Compose Multiplatform의 웹 타겟에서 이제 가상(IME) 키보드를 기본적으로 지원합니다.

## Gradle 플러그인

### macOS 최소 버전 수정 기능

이전 버전에서는 Intel 버전을 포함하지 않고 App Store에 macOS 앱을 업로드할 수 없었습니다.
이제 플랫폼별 Compose Multiplatform 옵션을 통해 앱의 최소 macOS 버전을 설정할 수 있습니다.

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                minimumSystemVersion = "12.0"
            }
        }
    }
}
```

자세한 내용은 [풀 리퀘스트](https://github.com/JetBrains/compose-multiplatform/pull/4271)를 확인하세요.

### ProGuard 지원이 포함된 uber JAR 생성 옵션

이제 ProGuard Gradle 태스크를 사용하여 uber JAR(애플리케이션과 모든 종속성의 JAR를 포함하는 복합 패키지)를 생성할 수 있습니다.

자세한 내용은 [축소 및 난독화(minification and obfuscation)](compose-native-distribution.md#minification-and-obfuscation) 가이드를 참조하세요.

### 알려진 문제: MissingResourceException

Kotlin 1.9.x에서 2.0.0으로(또는 그 반대로) 전환한 후 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` 오류가 발생할 수 있습니다.
이 문제를 해결하려면 프로젝트의 모든 `build` 디렉토리를 삭제하세요.
여기에는 프로젝트의 루트 및 모듈 디렉토리에 있는 디렉토리가 포함됩니다.