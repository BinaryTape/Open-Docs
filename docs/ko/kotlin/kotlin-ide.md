[//]: # (title: Kotlin 개발을 위한 IDE)
[//]: # (description: JetBrains는 IntelliJ IDEA 및 Android Studio에 대한 공식 Kotlin IDE 지원을 제공합니다.)

JetBrains는 다음 IDE 및 코드 에디터에 대한 공식 Kotlin 지원을 제공합니다: [IntelliJ IDEA](#intellij-idea) 및 [Android Studio](#android-studio).

다른 IDE 및 코드 에디터는 Kotlin 커뮤니티에서 지원하는 플러그인만 제공합니다.

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/)는 Kotlin 및 Java와 같은 JVM 언어를 위해 설계된 IDE로, 개발자 생산성을 극대화합니다.
이 IDE는 똑똑한 코드 자동 완성, 정적 코드 분석, 리팩토링 기능을 제공하여 일상적이고 반복적인 작업을 대신 처리합니다. 이를 통해 소프트웨어 개발의 좋은 측면에 집중할 수 있게 하여, 생산적일 뿐만 아니라 즐거운 경험을 선사합니다.

Kotlin 플러그인은 각 IntelliJ IDEA 릴리스에 함께 제공됩니다.
각 IDEA 릴리스는 IDE에서 Kotlin 개발자를 위한 경험을 개선하는 새로운 기능과 업그레이드를 도입합니다.
Kotlin에 대한 최신 업데이트 및 개선 사항은 [IntelliJ IDEA의 새로운 기능](https://www.jetbrains.com/idea/whatsnew/)을 참조하세요.

[공식 문서](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)에서 IntelliJ IDEA에 대해 자세히 알아보세요.

## Android Studio

[Android Studio](https://developer.android.com/studio)는 [IntelliJ IDEA](https://www.jetbrains.com/idea/)를 기반으로 하는 Android 앱 개발을 위한 공식 IDE입니다.
Android Studio는 IntelliJ의 강력한 코드 에디터 및 개발자 도구 외에도, Android 앱을 빌드할 때 생산성을 더욱 향상시키는 기능을 제공합니다.

Kotlin 플러그인은 각 Android Studio 릴리스에 함께 제공됩니다.

[공식 문서](https://developer.android.com/studio/intro)에서 Android Studio에 대해 자세히 알아보세요.

## Eclipse

[Eclipse](https://eclipseide.org/release/)는 개발자가 Kotlin을 포함한 다양한 프로그래밍 언어로 애플리케이션을 작성할 수 있도록 합니다.
또한 Kotlin 플러그인도 있습니다. 이 플러그인은 JetBrains에서 원래 개발했지만, 현재는 Kotlin 커뮤니티 기여자들에 의해 지원되고 있습니다.

[마켓플레이스에서 Kotlin 플러그인을 수동으로 설치](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse)할 수 있습니다.

Kotlin 팀은 Eclipse용 Kotlin 플러그인에 대한 개발 및 기여 프로세스를 관리합니다.
플러그인에 기여하고 싶다면, 해당 [GitHub 저장소](https://github.com/Kotlin/kotlin-eclipse)로 풀 리퀘스트를 보내세요.

## Kotlin 언어 버전과의 호환성

IntelliJ IDEA 및 Android Studio의 경우, Kotlin 플러그인은 각 릴리스에 함께 제공됩니다.
새로운 Kotlin 버전이 릴리스되면, 이 도구들은 Kotlin을 최신 버전으로 자동으로 업데이트하도록 제안합니다.
[Kotlin 릴리스](releases.md#ide-support)에서 최신 지원 언어 버전을 확인하세요.

## 다른 IDE 지원

JetBrains는 다른 IDE에 대한 Kotlin 플러그인을 제공하지 않습니다.
하지만 Eclipse, Visual Studio Code, Atom과 같은 다른 IDE 및 소스 에디터 중 일부는 Kotlin 커뮤니티에서 지원하는 자체 Kotlin 플러그인을 가지고 있습니다.

어떤 텍스트 에디터로든 Kotlin 코드를 작성할 수 있지만, 코드 포맷팅, 디버깅 도구 등 IDE 관련 기능은 사용할 수 없습니다.
텍스트 에디터에서 Kotlin을 사용하려면, Kotlin [GitHub 릴리스](%kotlinLatestUrl%)에서 최신 Kotlin 명령줄 컴파일러(`kotlin-compiler-%kotlinVersion%.zip`)를 다운로드하여 [수동으로 설치](command-line.md#manual-install)할 수 있습니다.
또한, [Homebrew](command-line.md#homebrew), [SDKMAN!](command-line.md#sdkman), [Snap package](command-line.md#snap-package)와 같은 패키지 관리자를 사용할 수도 있습니다.

## 다음 단계는?

* [IntelliJ IDEA IDE를 사용하여 첫 프로젝트 시작하기](jvm-get-started.md)
* [Android Studio를 사용하여 첫 크로스 플랫폼 모바일 앱 만들기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)