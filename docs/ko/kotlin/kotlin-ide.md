---
title: "Kotlin 개발을 위한 IDE"
description: "JetBrains는 IntelliJ IDEA 및 Android Studio에 대한 공식 Kotlin IDE 지원을 제공합니다."
---
JetBrains는 다음 IDE 및 코드 편집기에 대한 공식 Kotlin 지원을 제공합니다.
[IntelliJ IDEA](#intellij-idea) 및 [Android Studio](#android-studio).

다른 IDE 및 코드 편집기는 Kotlin 커뮤니티에서 지원하는 플러그인만 있습니다.

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/)는 Kotlin 및 Java와 같은 JVM 언어용으로 설계된 IDE로,
개발자 생산성을 극대화합니다.
IntelliJ IDEA는 지능적인 코드 완성, 정적 코드 분석 및 리팩토링을 제공하여 일상적이고 반복적인 작업을 대신 처리합니다.
이를 통해 소프트웨어 개발의 밝은 면에 집중할 수 있어 생산적일 뿐만 아니라 즐거운 경험을 선사합니다.

Kotlin 플러그인은 각 IntelliJ IDEA 릴리스에 번들로 제공됩니다.
각 IDEA 릴리스는 IDE에서 Kotlin 개발자의 경험을 향상시키는 새로운 기능과 업그레이드를 제공합니다.
Kotlin에 대한 최신 업데이트 및 개선 사항은 [IntelliJ IDEA의 새로운 기능](https://www.jetbrains.com/idea/whatsnew/)을 참조하세요.

IntelliJ IDEA에 대한 자세한 내용은 [공식 문서](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)를 참조하세요.

## Android Studio

[Android Studio](https://developer.android.com/studio)는 [IntelliJ IDEA](https://www.jetbrains.com/idea/)를 기반으로 하는 Android 앱 개발을 위한 공식 IDE입니다.
IntelliJ의 강력한 코드 편집기 및 개발자 도구 외에도 Android Studio는 Android 앱을 빌드할 때 생산성을 향상시키는 더 많은 기능을 제공합니다.

Kotlin 플러그인은 각 Android Studio 릴리스에 번들로 제공됩니다.

Android Studio에 대한 자세한 내용은 [공식 문서](https://developer.android.com/studio/intro)를 참조하세요.

## Eclipse

[Eclipse](https://eclipseide.org/release/)를 사용하면 개발자가 Kotlin을 포함한 다양한 프로그래밍 언어로 애플리케이션을 작성할 수 있습니다. 또한 Kotlin 플러그인도 있습니다. 원래 JetBrains에서 개발했지만,
현재 Kotlin 플러그인은 Kotlin 커뮤니티 기여자들에 의해 지원됩니다.

[마켓플레이스에서 Kotlin 플러그인을 수동으로 설치](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse)할 수 있습니다.

Kotlin 팀은 Eclipse용 Kotlin 플러그인에 대한 개발 및 기여 프로세스를 관리합니다.
플러그인에 기여하려면 [GitHub의 리포지토리](https://github.com/Kotlin/kotlin-eclipse)로 풀 요청을 보내세요.

## Kotlin 언어 버전과의 호환성

IntelliJ IDEA 및 Android Studio의 경우 Kotlin 플러그인은 각 릴리스에 번들로 제공됩니다.
새로운 Kotlin 버전이 릴리스되면 이러한 도구는 Kotlin을 최신 버전으로 자동 업데이트하도록 제안합니다.
최신 지원 언어 버전은 [Kotlin 릴리스](releases#ide-support)에서 확인하세요.

## 다른 IDE 지원

JetBrains는 다른 IDE에 대한 Kotlin 플러그인을 제공하지 않습니다.
그러나 Eclipse, Visual Studio Code 및 Atom과 같은 다른 IDE 및 소스 편집기 중 일부는 Kotlin 커뮤니티에서 지원하는 자체 Kotlin 플러그인을 가지고 있습니다.

텍스트 편집기에서 Kotlin 코드를 작성할 수 있지만 코드 포맷팅, 디버깅 도구 등과 같은 IDE 관련 기능은 사용할 수 없습니다.
텍스트 편집기에서 Kotlin을 사용하려면 Kotlin [GitHub 릴리스](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)에서 최신 Kotlin 명령줄 컴파일러(`kotlin-compiler-2.1.20.zip`)를 다운로드하여 [수동으로 설치](command-line#manual-install)할 수 있습니다.
또한 [Homebrew](command-line#homebrew), [SDKMAN!](command-line#sdkman) 및 [Snap package](command-line#snap-package)와 같은 패키지 관리자를 사용할 수도 있습니다.

## 다음 단계

* [IntelliJ IDEA IDE를 사용하여 첫 번째 프로젝트 시작](jvm-get-started)
* [Android Studio를 사용하여 첫 번째 크로스 플랫폼 모바일 앱 만들기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
  ```