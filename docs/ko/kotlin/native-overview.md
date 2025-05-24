---
title: "Kotlin Native"
---
Kotlin/Native는 Kotlin 코드를 가상 머신 없이 실행할 수 있는 네이티브 바이너리로 컴파일하는 기술입니다.
Kotlin/Native는 Kotlin 컴파일러를 위한 [LLVM](https://llvm.org/)-기반 백엔드와 Kotlin 표준 라이브러리의 네이티브 구현을 포함합니다.

## Kotlin/Native를 사용하는 이유

Kotlin/Native는 주로 _가상 머신_이 바람직하지 않거나 임베디드 장치 또는 iOS와 같이 불가능한 플랫폼을 위해 컴파일할 수 있도록 설계되었습니다.
추가 런타임 또는 가상 머신이 필요 없는 독립 실행형 프로그램을 개발해야 하는 경우에 이상적입니다.

## 대상 플랫폼

Kotlin/Native는 다음 플랫폼을 지원합니다.
* macOS
* iOS, tvOS, watchOS
* Linux
* Windows (MinGW)
* Android NDK

:::note
Apple 대상 (macOS, iOS, tvOS, watchOS)을 컴파일하려면 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)와 해당 명령줄 도구가 설치되어 있어야 합니다.

:::

[지원되는 대상의 전체 목록을 확인하세요](native-target-support).

## 상호 운용성

Kotlin/Native는 다양한 운영 체제를 위한 네이티브 프로그래밍 언어와의 양방향 상호 운용성을 지원합니다.
컴파일러는 다음을 생성합니다.
* 많은 [플랫폼](#target-platforms)을 위한 실행 파일
* C/C++ 프로젝트를 위한 C 헤더가 있는 정적 라이브러리 또는 [동적](native-dynamic-libraries) 라이브러리
* Swift 및 Objective-C 프로젝트를 위한 [Apple 프레임워크](apple-framework)

Kotlin/Native는 Kotlin/Native에서 기존 라이브러리를 직접 사용하기 위한 상호 운용성을 지원합니다.
* 정적 또는 동적 [C 라이브러리](native-c-interop)
* C, [Swift, 및 Objective-C](native-objc-interop) 프레임워크

컴파일된 Kotlin 코드를 C, C++, Swift, Objective-C 및 기타 언어로 작성된 기존 프로젝트에 쉽게 포함할 수 있습니다.
기존 네이티브 코드, 정적 또는 동적 [C 라이브러리](native-c-interop), Swift/Objective-C [프레임워크](native-objc-interop),
그래픽 엔진 및 기타 모든 것을 Kotlin/Native에서 직접 쉽게 사용할 수 있습니다.

Kotlin/Native [플랫폼 라이브러리](native-platform-libs)는 프로젝트 간에 Kotlin 코드를 공유하는 데 도움이 됩니다.
POSIX, gzip, OpenGL, Metal, Foundation 및 기타 여러 인기 있는 라이브러리와 Apple 프레임워크는 미리 가져오기되어 컴파일러 패키지에 Kotlin/Native 라이브러리로 포함되어 있습니다.

## 플랫폼 간 코드 공유

[Kotlin Multiplatform](multiplatform-intro)은 Android, iOS, JVM, 웹 및 네이티브를 포함한 여러 플랫폼에서 공통 코드를 공유하는 데 도움이 됩니다. Multiplatform 라이브러리는 공통 Kotlin 코드에 필요한 API를 제공하고 프로젝트의 공유 부분을 Kotlin으로 한 곳에서 작성할 수 있도록 합니다.

[Kotlin Multiplatform 앱 만들기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) 튜토리얼을 사용하여 애플리케이션을 만들고 iOS와 Android 간에 비즈니스 로직을 공유할 수 있습니다. iOS, Android, 데스크톱 및 웹 간에 UI를 공유하려면 Kotlin 및 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 기반으로 하는 JetBrains의 선언적 UI 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)에 대한 튜토리얼을 완료하세요.

## 시작하는 방법

Kotlin을 처음 사용하십니까? [Kotlin 시작하기](getting-started)를 살펴보세요.

권장 문서:

* [Kotlin Multiplatform 소개](multiplatform-intro)
* [C와의 상호 운용성](native-c-interop)
* [Swift/Objective-C와의 상호 운용성](native-objc-interop)

권장 튜토리얼:

* [Kotlin/Native 시작하기](native-get-started)
* [Kotlin Multiplatform 앱 만들기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
* [C에서 기본 데이터 유형 매핑](mapping-primitive-data-types-from-c)
* [동적 라이브러리로서의 Kotlin/Native](native-dynamic-libraries)
* [Apple 프레임워크로서의 Kotlin/Native](apple-framework)