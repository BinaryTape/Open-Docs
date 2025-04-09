---
title: FAQ
description: "Kotlin은 JetBrains에서 개발한 간결한 멀티 플랫폼 프로그래밍 언어입니다."
---
### Kotlin이란 무엇입니까?

Kotlin은 JVM, Android, JavaScript, Wasm 및 Native를 대상으로 하는 오픈 소스 정적 타입 프로그래밍 언어입니다.
[JetBrains](https://www.jetbrains.com/)에서 개발되었습니다. 이 프로젝트는 2010년에 시작되었으며 초기부터 오픈 소스로 진행되었습니다.
최초 공식 1.0 릴리스는 2016년 2월에 있었습니다.

### Kotlin의 현재 버전은 무엇입니까?

현재 릴리스된 버전은 2025년 3월 20일에 게시된 2.1.20입니다.
자세한 내용은 [GitHub](https://github.com/jetbrains/kotlin)에서 확인할 수 있습니다.

### Kotlin은 무료인가요?

예. Kotlin은 무료였고 앞으로도 무료로 유지됩니다. Apache 2.0 라이선스에 따라 개발되었으며 소스 코드는
[GitHub](https://github.com/jetbrains/kotlin)에서 사용할 수 있습니다.

### Kotlin은 객체 지향 언어인가요, 아니면 함수형 언어인가요?

Kotlin은 객체 지향 구문과 함수형 구문을 모두 가지고 있습니다. OO 및 FP 스타일 모두에서 사용할 수 있으며 두 가지 요소를 혼합할 수도 있습니다.
고차 함수, 함수 타입 및 람다와 같은 기능을 기본적으로 지원하는 Kotlin은 훌륭한 선택입니다.
함수형 프로그래밍을 수행하거나 탐색하는 경우에 적합합니다.

### Java 프로그래밍 언어에 비해 Kotlin이 제공하는 장점은 무엇인가요?

Kotlin은 더 간결합니다. 대략적인 추정치에 따르면 코드 줄 수가 약 40% 감소합니다.
또한 더 타입 안전성이 높습니다. 예를 들어 null이 허용되지 않는 타입에 대한 지원을 통해 애플리케이션이 NPE에 덜 취약해집니다.
스마트 캐스팅, 고차 함수, 확장 함수 및 수신기가 있는 람다를 포함한 다른 기능을 통해 표현력이 풍부한 코드를 작성할 수 있을 뿐만 아니라 DSL 생성을 용이하게 합니다.

### Kotlin은 Java 프로그래밍 언어와 호환되나요?

예. Kotlin은 Java 프로그래밍 언어와 100% 상호 운용 가능하며 기존 코드베이스가 Kotlin과 제대로 상호 작용할 수 있도록 하는 데 중점을 두었습니다.
[Java에서 Kotlin 코드를 쉽게 호출](java-to-kotlin-interop)하고 [Kotlin에서 Java 코드를](java-interop) 호출할 수 있습니다.
이렇게 하면 채택이 훨씬 쉽고 위험이 줄어듭니다. 자동화된 [Java-to-Kotlin 변환기가 IDE에 내장](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)되어 있어 기존 코드의 마이그레이션을 단순화합니다.

### Kotlin은 무엇에 사용할 수 있나요?

Kotlin은 서버 측, 클라이언트 측 웹, Android 또는 멀티 플랫폼 라이브러리를 포함한 모든 종류의 개발에 사용할 수 있습니다.
현재 진행 중인 Kotlin/Native를 사용하면 임베디드 시스템, macOS 및 iOS와 같은 다른 플랫폼에 대한 지원이 가능합니다.
사람들은 모바일 및 서버 측 애플리케이션, JavaScript 또는 JavaFX를 사용하는 클라이언트 측, 데이터 과학 등에 Kotlin을 사용하고 있습니다.

### Android 개발에 Kotlin을 사용할 수 있나요?

예. Kotlin은 Android에서 일급 언어로 지원됩니다. Basecamp, Pinterest 등 Android용 Kotlin을 이미 사용하고 있는 수백 개의 애플리케이션이 있습니다.
자세한 내용은 [Android 개발 리소스](android-overview)를 확인하세요.

### 서버 측 개발에 Kotlin을 사용할 수 있나요?

예. Kotlin은 JVM과 100% 호환되므로 Spring Boot, vert.x 또는 JSF와 같은 기존 프레임워크를 사용할 수 있습니다.
또한 [Ktor](https://github.com/kotlin/ktor)와 같이 Kotlin으로 작성된 특정 프레임워크도 있습니다.
자세한 내용은 [서버 측 개발 리소스](server-overview)를 확인하세요.

### 웹 개발에 Kotlin을 사용할 수 있나요?

예. 백엔드 웹 개발의 경우 Kotlin은 [Ktor](https://ktor.io/) 및 [Spring](https://spring.io/)과 같은 프레임워크와 잘 작동하여 서버 측 애플리케이션을 효율적으로 구축할 수 있습니다.
또한 클라이언트 측 웹 개발에 Kotlin/Wasm을 사용할 수 있습니다.
[Kotlin/Wasm 시작하기](wasm-get-started)를 참조하세요.

### 데스크톱 개발에 Kotlin을 사용할 수 있나요?

예. JavaFx, Swing 등과 같은 모든 Java UI 프레임워크를 사용할 수 있습니다.
또한 [TornadoFX](https://github.com/edvin/tornadofx)와 같은 Kotlin 전용 프레임워크도 있습니다.

### 네이티브 개발에 Kotlin을 사용할 수 있나요?

예. Kotlin/Native는 Kotlin의 일부로 사용할 수 있습니다. Kotlin을 VM 없이 실행할 수 있는 네이티브 코드로 컴파일합니다.
인기 있는 데스크톱 및 모바일 플랫폼은 물론 일부 IoT 장치에서도 사용해 볼 수 있습니다.
자세한 내용은 [Kotlin/Native 설명서](native-overview)를 확인하세요.

### 어떤 IDE가 Kotlin을 지원하나요?

Kotlin은 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 및
[Android Studio](https://developer.android.com/kotlin/get-started)에서 즉시 사용 가능한 완벽한 지원을 제공합니다.
JetBrains에서 개발한 공식 Kotlin 플러그인이 포함되어 있습니다.

다른 IDE 및 코드 편집기에는 Kotlin 커뮤니티 지원 플러그인만 있습니다.

브라우저에서 Kotlin 코드를 작성, 실행 및 공유하려면 [Kotlin Playground](https://play.kotlinlang.org)를 사용해 볼 수도 있습니다.

또한 애플리케이션 컴파일 및 실행을 위한 간단한 지원을 제공하는 [명령줄 컴파일러](command-line)를 사용할 수 있습니다.

### 어떤 빌드 도구가 Kotlin을 지원하나요?

JVM 측면에서는 주요 빌드 도구에 [Gradle](gradle), [Maven](maven),
[Ant](ant) 및 [Kobalt](https://beust.com/kobalt/home/index.html)가 포함됩니다. 클라이언트 측 JavaScript를 대상으로 하는 일부 빌드 도구도 있습니다.

### Kotlin은 무엇으로 컴파일되나요?

JVM을 대상으로 할 때 Kotlin은 Java 호환 바이트 코드를 생성합니다.

JavaScript를 대상으로 할 때 Kotlin은 ES5.1로 트랜스파일되며
AMD 및 CommonJS를 포함한 모듈 시스템과 호환되는 코드를 생성합니다.

네이티브를 대상으로 할 때 Kotlin은 플랫폼별 코드(LLVM을 통해)를 생성합니다.

### Kotlin은 어떤 버전의 JVM을 대상으로 하나요?

Kotlin을 사용하면 실행할 JVM 버전을 선택할 수 있습니다. 기본적으로 Kotlin/JVM 컴파일러는 Java 8 호환 바이트 코드를 생성합니다.
최신 버전의 Java에서 사용할 수 있는 최적화를 사용하려면 대상 Java
버전을 9에서 23으로 명시적으로 지정할 수 있습니다. 이 경우 결과 바이트 코드가 하위 버전에서 실행되지 않을 수 있습니다.
[Kotlin 1.5](whatsnew15#new-default-jvm-target-1-8)부터 컴파일러는 8 미만의 Java 버전과 호환되는 바이트 코드 생성을 지원하지 않습니다.

### Kotlin은 어렵나요?

Kotlin은 Java, C#, JavaScript, Scala 및 Groovy와 같은 기존 언어에서 영감을 받았습니다. 우리는 Kotlin이 배우기 쉽도록 노력했으며, 이를 통해 사람들이 며칠 만에 Kotlin을 쉽게 읽고 쓸 수 있습니다.
관용적인 Kotlin을 배우고 더 많은 고급 기능을 사용하는 데는 시간이 좀 더 걸릴 수 있지만 전반적으로 복잡한 언어는 아닙니다.
자세한 내용은 [학습 자료](learning-materials-overview)를 확인하세요.

### 어떤 회사들이 Kotlin을 사용하고 있나요?

Kotlin을 사용하는 회사는 너무 많아서 모두 나열할 수 없지만 블로그 게시물, GitHub 리포지토리 또는 강연을 통해 Kotlin 사용을 공개적으로 선언한 더 유명한 회사로는
[Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17), [Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI),
[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/) 및 [Corda](https://corda.net/blog/kotlin/)가 있습니다.

### 누가 Kotlin을 개발하나요?

Kotlin은 [JetBrains의 엔지니어 팀(현재 팀 규모는 100명 이상)](https://www.jetbrains.com/)에서 개발합니다.
수석 언어 설계자는 Michail Zarečenskij입니다. 핵심 팀 외에도 GitHub에 250명 이상의 외부 기여자가 있습니다.

### Kotlin에 대해 자세히 알아보려면 어디에서 알아볼 수 있나요?

가장 먼저 시작하기 좋은 곳은 [저희 웹사이트](https://kotlinlang.org)입니다.
Kotlin을 시작하려면 [공식 IDE](kotlin-ide) 중 하나를 설치하거나 [온라인에서 사용해](https://play.kotlinlang.org) 볼 수 있습니다.

### Kotlin에 대한 책이 있나요?

Kotlin에 사용할 수 있는 책은 여러 권이 있습니다. 그중 일부는 검토했으며 시작하기 위해 추천할 수 있습니다. [도서](books) 페이지에 나열되어 있습니다. 더 많은 책을 보려면 커뮤니티에서 관리하는 [kotlin.link](https://kotlin.link/) 목록을 참조하세요.

### Kotlin에 사용할 수 있는 온라인 강좌가 있나요?

JetBrains Academy의 [Kotlin Core 트랙](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)을 사용하여 작동하는 애플리케이션을 만들면서 모든 Kotlin 필수 요소를 배울 수 있습니다.

수강할 수 있는 다른 강좌는 다음과 같습니다.
* Kevin Jones의 [Pluralsight 강좌: Kotlin 시작하기](https://www.pluralsight.com/courses/kotlin-getting-started)
* Hadi Hariri의 [O'Reilly 강좌: Kotlin 프로그래밍 소개](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/)
* Peter Sommerhoff의 [Udemy 강좌: 초보자를 위한 10개의 Kotlin 자습서](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/)

[YouTube 채널](https://www.youtube.com/c/Kotlin)에서 다른 자습서 및 콘텐츠를 확인할 수도 있습니다.

### Kotlin에 커뮤니티가 있나요?

예! Kotlin에는 매우 활발한 커뮤니티가 있습니다. Kotlin 개발자는 [Kotlin 포럼](https://discuss.kotlinlang.org),
[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin) 및 [Kotlin Slack](https://slack.kotlinlang.org)에서 더 활발하게 활동합니다.
(2020년 4월 현재 거의 30000명의 회원이 있습니다).

### Kotlin 이벤트가 있나요?

예! 현재 Kotlin에만 집중하는 많은 사용자 그룹과 모임이 있습니다. [웹사이트에서 목록을 찾을 수 있습니다](https://kotlinlang.org/user-groups/user-group-list.html).
또한 전 세계에서 커뮤니티가 조직한 [Kotlin Nights](https://kotlinlang.org/community/events.html) 이벤트가 있습니다.

### Kotlin 컨퍼런스가 있나요?

예! [KotlinConf](https://kotlinconf.com/)는 JetBrains에서 주최하는 연례 컨퍼런스로, 전 세계의 개발자, 애호가 및 전문가가 모여 Kotlin에 대한 지식과 경험을 공유합니다.

기술 강연 및 워크숍 외에도 KotlinConf는 네트워킹 기회, 커뮤니티 상호 작용 및 참석자가 동료 Kotliner와 연결하고 아이디어를 교환할 수 있는 소셜 이벤트를 제공합니다.
Kotlin 생태계 내에서 협업과 커뮤니티 구축을 촉진하기 위한 플랫폼 역할을 합니다.

Kotlin은 전 세계의 여러 컨퍼런스에서도 다루어지고 있습니다.
[웹사이트에서 예정된 강연 목록](https://kotlinlang.org/community/talks.html?time=upcoming)을 확인할 수 있습니다.

### Kotlin이 소셜 미디어에 있나요?

예.
[Kotlin YouTube 채널](https://www.youtube.com/c/Kotlin)을 구독하고 [Twitter](https://twitter.com/kotlin) 또는 [Bluesky](https://bsky.app/profile/kotlinlang.org)에서 Kotlin을 팔로우하세요.

### 다른 온라인 Kotlin 리소스가 있나요?

웹사이트에는 커뮤니티 회원들의 [Kotlin Digest](https://kotlin.link),
[뉴스레터](http://kotlinweekly.net), [팟캐스트](https://talkingkotlin.com) 등을 포함한 다양한 [온라인 리소스](https://kotlinlang.org/community/)가 있습니다.

### HD Kotlin 로고는 어디에서 얻을 수 있나요?

로고는 [여기](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip)에서 다운로드할 수 있습니다.
로고를 사용할 때는 아카이브 내부의 `guidelines.pdf`와 [Kotlin 브랜드 사용 지침](https://kotlinfoundation.org/guidelines/)의 간단한 규칙을 따르세요.

자세한 내용은 [Kotlin 브랜드 에셋](kotlin-brand-assets) 페이지를 확인하세요.