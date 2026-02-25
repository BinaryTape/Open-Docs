[//]: # (title: 권장 IDE 및 코드 에디터)

## IntelliJ IDEA 및 Android Studio

[IntelliJ IDEA](https://www.jetbrains.com/idea/)는 Kotlin Multiplatform에 대한 완전한 지원을 제공합니다.
[Android Studio](https://developer.android.com/studio)는 Kotlin Multiplatform을 위한 또 다른 안정적인 솔루션입니다.
두 도구 모두 IntelliJ 플랫폼을 기반으로 제작되었으므로 일반적으로 동일한 기능을 공유합니다.
하지만 특정 업데이트가 동시에 릴리스되지 않을 수 있습니다.

IntelliJ IDEA 2025.2.2 또는 Android Studio Otter 2025.2.1부터, iOS 앱을 위한 기본적인 실행 및 디버깅 기능, 프리플라이트 환경 검사(preflight environment checks), 기타 유용한 KMP 기능을 제공하는 [Kotlin Multiplatform IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)을 설치할 수 있습니다.

기본적인 Kotlin Multiplatform 기능 외에도, 이 플러그인은 Compose Multiplatform 라이브러리에 대한 지원을 제공하여 더욱 편리한 UI 개발을 가능하게 합니다.

* 멀티플랫폼 리소스를 위한 편의성(Quality-of-life) 자동화 기능.
* 공통(common) Compose 코드에서 작동하는 `@Preview` 어노테이션 지원.
* 핫 리로드(hot reload) 실행 구성 자동 감지, 로그 및 설정과의 IDE 통합, 그리고 전반적인 경험을 더욱 원활하게 해주는 맞춤형 IDE 액션 및 툴바를 포함한 [Compose Hot Reload](compose-hot-reload.md) 지원.

## Xcode

Kotlin Multiplatform 프로젝트에서 iOS를 타겟팅하는 경우, iOS 전용 코드를 작성하고 iOS 애플리케이션을 실행하려면 머신에 [Xcode](https://developer.apple.com/xcode/)가 설치되어 있어야 합니다.

App Store Connect에 앱을 업로드하려면 Xcode 16 이상 버전으로 빌드하세요.

## 기타 IDE 및 코드 에디터

기본적인 Kotlin Multiplatform 지원만으로 충분하다면, Kotlin을 지원하는 모든 IDE를 사용할 수 있습니다.