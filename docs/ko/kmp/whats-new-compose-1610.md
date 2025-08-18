[//]: # (title: Compose Multiplatform 1.6.10의 새로운 기능)

이번 기능 릴리스의 주요 내용은 다음과 같습니다.

*   [호환성 변경: 새 Compose 컴파일러 Gradle 플러그인](#breaking-change-new-compose-compiler-gradle-plugin)
*   [Compose Multiplatform 리소스가 포함된 멀티모듈 프로젝트 지원](#support-for-multimodule-projects-with-compose-multiplatform-resources)
*   [실험적 내비게이션 라이브러리](#experimental-navigation-library)
*   [실험적 공통 ViewModel을 포함한 생명주기 라이브러리](#lifecycle-library)
*   [알려진 문제: MissingResourceException](#known-issue-missingresourceexception)

이 릴리스의 전체 변경 목록은 [GitHub에서 확인하세요](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-may-2024).

## 의존성

*   Gradle 플러그인 `org.jetbrains.compose`, 버전 1.6.10. Jetpack Compose 라이브러리 기반:
    *   [Compiler 1.5.14](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.14)
    *   [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
    *   [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
    *   [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
    *   [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
    *   [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
*   Lifecycle 라이브러리 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0`. [Jetpack Lifecycle 2.8.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0) 기반.
*   Navigation 라이브러리 `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha07`. [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7) 기반.

## 호환성 변경: 새 Compose 컴파일러 Gradle 플러그인

Kotlin 2.0.0부터 Compose Multiplatform은 새 Compose 컴파일러 Gradle 플러그인을 필요로 합니다.
자세한 내용은 [마이그레이션 가이드](compose-compiler.md#migrating-a-compose-multiplatform-project)를 참조하세요.

## 모든 플랫폼

### 리소스

#### 안정적인 리소스 라이브러리

[리소스 라이브러리 API](compose-multiplatform-resources.md)의 대부분은 이제 안정적이라고 간주됩니다.

#### Compose Multiplatform 리소스가 포함된 멀티모듈 프로젝트 지원

Compose Multiplatform 1.6.10부터
어떤 Gradle 모듈과 어떤 소스 세트에도 리소스를 저장할 수 있으며,
리소스를 포함한 프로젝트와 라이브러리를 게시할 수 있습니다.

멀티모듈 지원을 활성화하려면 프로젝트를 Kotlin 2.0.0 이상 버전과 Gradle 7.6 이상 버전으로 업데이트하세요.

#### 멀티플랫폼 리소스에 대한 구성 DSL

이제 프로젝트에서 `Res` 클래스 생성을 미세 조정할 수 있습니다: 클래스의 모달리티와 할당된 패키지를 변경하고,
항상, 절대 또는 리소스 라이브러리에 대한 명시적 의존성이 있을 때만 생성할지 여부와 같은
생성 조건을 선택할 수 있습니다.

자세한 내용은 [문서 섹션](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)을 참조하세요.

#### 리소스 URI 생성을 위한 공개 함수

새 `getUri()` 함수를 사용하면 플랫폼 종속적인 리소스 URI를 외부 라이브러리에 전달하여
파일에 직접 액세스할 수 있도록 합니다.
자세한 내용은 [문서](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)를 참조하세요.

#### 문자열 리소스 복수형

이제 다른 멀티플랫폼 문자열 리소스와 함께 복수형(수량 문자열)을 정의할 수 있습니다.
자세한 내용은 [문서](compose-multiplatform-resources-usage.md#plurals)를 참조하세요.

#### 세 글자 로케일 지원

[언어 한정자](compose-multiplatform-resources-setup.md#language-and-regional-qualifiers)는 이제 로케일에 대해 알파-3 (ISO 639-2)
코드를 지원합니다.

#### 이미지 및 폰트를 위한 실험적 바이트 배열 함수

폰트와 이미지를 바이트 배열로 가져오는 두 가지 함수를 시험해 볼 수 있습니다:
`getDrawableResourceBytes()` 및 `getFontResourceBytes()`.
이 함수들은 서드파티 라이브러리에서 멀티플랫폼 리소스에 액세스하는 데 도움이 되도록 고안되었습니다.

자세한 내용은 [풀 리퀘스트](https://github.com/JetBrains/compose-multiplatform/pull/4651)를 참조하세요.

### 실험적 내비게이션 라이브러리

Jetpack Compose 기반의 공통 내비게이션 라이브러리가 이제 사용할 수 있습니다.
자세한 내용은 [문서](compose-navigation-routing.md)를 참조하세요.

이 버전의 주요 제한 사항:
*   [딥 링크](https://developer.android.com/guide/navigation/design/deep-link)(처리 또는 추적)는 아직 지원되지 않습니다.
*   [`BackHandler` 함수](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button)
    및 [예측형 뒤로가기 제스처](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)는
    Android에서만 지원됩니다.

### 생명주기 라이브러리

Jetpack Lifecycle 기반의 공통 생명주기 라이브러리가 이제 사용할 수 있습니다. 자세한 내용은 [문서](compose-lifecycle.md)를 참조하세요.

이 라이브러리는 주로 공통 내비게이션 기능을 지원하기 위해 도입되었지만, 실험적인
크로스 플랫폼 `ViewModel` 구현도 제공하며, 프로젝트에 구현할 수 있는 공통 `LifecycleOwner` 인터페이스도 포함합니다.

Compose Multiplatform은 또한 일반적인 `ViewModelStoreOwner` 구현도 제공합니다.

### Kotlin 2.0.0 지원

Kotlin 2.0.0은 Compose 컴파일러의 새 Gradle 플러그인과 함께 출시되었습니다.
최신 컴파일러 버전과 함께 Compose Multiplatform을 사용하려면 프로젝트의 모듈에 플러그인을 적용하세요
(자세한 내용은 [마이그레이션 가이드](compose-compiler.md#migrating-a-compose-multiplatform-project)를 참조하세요).

## 데스크톱

### BasicTextField2의 기본 지원

`BasicTextField2` Compose 컴포넌트는 이제 데스크톱 대상에 대해 기본 수준에서 지원됩니다.
프로젝트에서 반드시 필요하거나 테스트를 위해 사용하되,
발견되지 않은 예외 상황이 있을 수 있다는 점을 명심하세요.
예를 들어, `BasicTextField2`는 현재 IME 이벤트를 지원하지 않으므로,
중국어, 일본어, 한국어에 대한 가상 키보드를 사용할 수 없습니다.

컴포넌트에 대한 전체 지원 및 다른 플랫폼 지원은 Compose Multiplatform 1.7.0 릴리스에 예정되어 있습니다.

### DialogWindow에 대한 alwaysOnTop 플래그

대화창이 덮어쓰여지는 것을 방지하기 위해 이제 `DialogWindow`
컴포저블에 `alwaysOnTop` 플래그를 사용할 수 있습니다.

자세한 내용은 [풀 리퀘스트](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)를 참조하세요.

## iOS

### 접근성 지원 개선 사항

이번 릴리스에서:

*   다이얼로그 및 팝업이 접근성 기능과 제대로 통합되었습니다.
*   `UIKitView` 및 `UIKitViewController`를 사용하여 생성된 상호 운용 뷰는 이제 접근성 서비스에서 접근 가능합니다.
*   `LiveRegion` 시맨틱이 접근성 API에서 지원됩니다.
*   [접근성 스크롤링](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)이 지원됩니다.
*   `HapticFeedback`이 지원됩니다.

### iOS 17 이상을 위한 선택 컨테이너 돋보기

iOS의 Compose Multiplatform 선택 컨테이너는 이제 네이티브 돋보기 도구를 에뮬레이트합니다.

![텍스트 돋보기가 활성화된 iPhone 채팅 앱 스크린샷](compose-1610-ios-magnifier.png){width=390}

### 다이얼로그 중앙 정렬을 위한 소프트웨어 키보드 인셋

`Dialog` 컴포저블의 동작이 이제 Android와 정렬됩니다: 소프트웨어 키보드가 화면에 나타날 때,
애플리케이션 창의 유효 높이를 고려하여 다이얼로그가 중앙에 정렬됩니다.
`DialogProperties.useSoftwareKeyboardInset` 속성을 사용하여 이 기능을 비활성화하는 옵션이 있습니다.

## 웹

### Kotlin/Wasm 알파 지원

웹용 실험적 Compose Multiplatform은 이제 알파 버전입니다:

*   대부분의 웹 기능은 데스크톱용 Compose Multiplatform을 미러링합니다.
*   팀은 웹 플랫폼을 릴리스하는 데 전념하고 있습니다.
*   다음 단계는 대부분의 컴포넌트에 대한 철저한 브라우저 적응입니다.

[첫 번째 앱 튜토리얼](quickstart.md)을 따라 공유 UI 코드로 웹 앱을 설정하고 실행하는 방법을 확인하세요.

### 기본 IME 키보드 지원

Compose Multiplatform의 웹 대상은 이제 가상 (IME) 키보드에 대한 기본 지원을 제공합니다.

## Gradle 플러그인

### macOS 최소 버전 수정 가능성

이전 버전에서는 Intel 버전을 포함하지 않고는 macOS 앱을 App Store에 업로드할 수 없었습니다.
이제 플랫폼별 Compose Multiplatform 옵션 중에서 앱의 최소 macOS 버전을 설정할 수 있습니다:

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

자세한 내용은 [풀 리퀘스트](https://github.com/JetBrains/compose-multiplatform/pull/4271)를 참조하세요.

### Proguard 지원을 통한 Uber JAR 생성 옵션

이제 ProGuard Gradle 태스크를 사용하여 Uber JAR (애플리케이션 및 모든 의존성의 JAR를 포함하는 복합 패키지)을 생성할 수 있습니다.

자세한 내용은 [축소 및 난독화](compose-native-distribution.md#minification-and-obfuscation) 가이드를 참조하세요.

### 알려진 문제: MissingResourceException

Kotlin 1.9.x에서 2.0.0으로 (또는 그 반대로) 전환한 후 `org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...`
오류가 발생할 수 있습니다.
이를 해결하려면 프로젝트의 모든 `build` 디렉터리를 삭제하세요.
여기에는 프로젝트의 루트 및 모듈 디렉터리에 있는 디렉터리가 포함됩니다.