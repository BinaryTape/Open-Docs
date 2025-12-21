[//]: # (title: 자주 묻는 질문)

<web-summary>Kotlin은 JetBrains에서 개발한 간결한 멀티플랫폼 프로그래밍 언어입니다.</web-summary>

### Kotlin이란 무엇인가요?

Kotlin은 JVM, Android, JavaScript, Wasm 및 Native를 대상으로 하는 오픈 소스 정적 타입 프로그래밍 언어입니다. [JetBrains](https://www.jetbrains.com)에서 개발했습니다. 이 프로젝트는 2010년에 시작되었으며, 아주 초기부터 오픈 소스로 공개되었습니다. 첫 공식 1.0 릴리스는 2016년 2월에 있었습니다.

### Kotlin의 현재 버전은 무엇인가요?

현재 릴리스된 버전은 %kotlinVersion%이며, %kotlinReleaseDate%에 게시되었습니다.
더 자세한 정보는 [GitHub](https://github.com/jetbrains/kotlin)에서 확인할 수 있습니다.

### Kotlin은 무료인가요?

네. Kotlin은 무료이며, 계속 무료로 제공될 것입니다. Apache 2.0 라이선스 하에 개발되었으며, 소스 코드는 [GitHub](https://github.com/jetbrains/kotlin)에서 확인할 수 있습니다.

### Kotlin은 객체 지향 언어인가요, 아니면 함수형 언어인가요?

Kotlin은 객체 지향 및 함수형 구성 요소를 모두 가지고 있습니다. OO(객체 지향) 및 FP(함수형) 스타일 모두로 사용하거나 두 가지 요소를 혼합하여 사용할 수 있습니다. 고차 함수(higher-order functions), 함수 타입(function types), 람다(lambdas)와 같은 기능에 대한 일급(first-class) 지원을 통해, 함수형 프로그래밍을 하거나 탐색 중이라면 Kotlin은 훌륭한 선택입니다.

### Kotlin은 Java 프로그래밍 언어에 비해 어떤 이점이 있나요?

Kotlin은 더 간결합니다. 대략적인 추정치에 따르면 코드 줄 수가 약 40% 감소합니다. 또한 더 타입 안전합니다. 예를 들어, 널 불가능(non-nullable) 타입 지원은 애플리케이션의 NPE(NullPointerException) 발생 가능성을 줄여줍니다. 스마트 캐스팅(smart casting), 고차 함수(higher-order functions), 확장 함수(extension functions), 수신자 있는 람다(lambdas with receivers)를 포함한 다른 기능들은 표현력 있는 코드를 작성할 수 있는 능력을 제공하며 DSL(Domain Specific Language) 생성을 용이하게 합니다.

### Kotlin은 Java 프로그래밍 언어와 호환되나요?

네. Kotlin은 Java 프로그래밍 언어와 100% 상호 운용 가능하며, 기존 코드베이스가 Kotlin과 제대로 상호 작용할 수 있도록 하는 데 중점을 두었습니다. [Java에서 Kotlin 코드 호출](java-to-kotlin-interop.md)과 [Kotlin에서 Java 코드 호출](java-interop.md)이 쉽습니다. 이로 인해 도입이 훨씬 쉽고 위험 부담이 줄어듭니다. 또한 IDE에 내장된 자동 [Java-Kotlin 변환기](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin)가 있어 기존 코드 마이그레이션을 간소화합니다.

### Kotlin을 어디에 사용할 수 있나요?

Kotlin은 서버 측, 클라이언트 측 웹, Android 또는 멀티플랫폼 라이브러리 등 모든 종류의 개발에 사용될 수 있습니다. 현재 개발 중인 Kotlin/Native를 통해 임베디드 시스템, macOS, iOS와 같은 다른 플랫폼도 지원합니다. 사람들은 모바일 및 서버 측 애플리케이션, JavaScript 또는 JavaFX를 사용한 클라이언트 측 개발, 데이터 과학 등 다양한 분야에서 Kotlin을 사용하고 있습니다.

### Kotlin을 Android 개발에 사용할 수 있나요?

네. Kotlin은 Android에서 일급(first-class) 언어로 지원됩니다. Basecamp, Pinterest 등을 포함하여 수백 개의 애플리케이션이 이미 Android용 Kotlin을 사용하고 있습니다. 더 자세한 정보는 [Android 개발 리소스](android-overview.md)를 확인해 보세요.

### Kotlin을 서버 측 개발에 사용할 수 있나요?

네. Kotlin은 JVM과 100% 호환되며, 따라서 Spring Boot, vert.x 또는 JSF와 같은 기존 프레임워크를 사용할 수 있습니다. 또한 [Ktor](https://github.com/kotlin/ktor)와 같이 Kotlin으로 작성된 특정 프레임워크도 있습니다. 더 자세한 정보는 [서버 측 개발 리소스](server-overview.md)를 확인해 보세요.

### Kotlin을 웹 개발에 사용할 수 있나요?

네. 백엔드 웹 개발의 경우 Kotlin은 [Ktor](https://ktor.io/) 및 [Spring](https://spring.io/)과 같은 프레임워크와 잘 작동하여 서버 측 애플리케이션을 효율적으로 구축할 수 있게 해줍니다. 또한, 클라이언트 측 웹 개발에는 Kotlin/Wasm을 사용할 수 있습니다. [Kotlin/Wasm 시작하기](wasm-get-started.md)를 통해 알아보세요.

### Kotlin을 데스크톱 개발에 사용할 수 있나요?

네. JavaFx, Swing 등 모든 Java UI 프레임워크를 사용할 수 있습니다. 또한 [TornadoFX](https://github.com/edvin/tornadofx)와 같은 Kotlin 전용 프레임워크도 있습니다.

### Kotlin을 네이티브 개발에 사용할 수 있나요?

네. Kotlin/Native는 Kotlin의 일부로 제공됩니다. Kotlin 코드를 VM(가상 머신) 없이 실행할 수 있는 네이티브 코드로 컴파일합니다. 인기 있는 데스크톱 및 모바일 플랫폼, 심지어 일부 IoT 장치에서도 사용할 수 있습니다. 더 자세한 정보는 [Kotlin/Native 문서](native-overview.md)를 확인해 보세요.

### 어떤 IDE가 Kotlin을 지원하나요?

Kotlin은 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 및 [Android Studio](https://developer.android.com/kotlin/get-started)에서 JetBrains에서 개발한 공식 Kotlin 플러그인과 함께 완전한 기본 지원을 제공합니다.

다른 IDE 및 코드 에디터는 Kotlin 커뮤니티 지원 플러그인만 제공합니다.

또한 [Kotlin Playground](https://play.kotlinlang.org)에서 브라우저에서 Kotlin 코드를 작성, 실행, 공유해 볼 수도 있습니다.

그 외에도 [명령줄 컴파일러](command-line.md)를 사용할 수 있으며, 이는 애플리케이션 컴파일 및 실행을 위한 간편한 지원을 제공합니다.

### 어떤 빌드 도구가 Kotlin을 지원하나요?

JVM 측면에서는 주요 빌드 도구로 [Gradle](gradle.md)과 [Maven](maven.md)이 있습니다. 클라이언트 측 JavaScript를 대상으로 하는 빌드 도구도 있습니다.

### Kotlin은 무엇으로 컴파일되나요?

JVM을 대상으로 할 때 Kotlin은 Java 호환 바이트코드(bytecode)를 생성합니다.

JavaScript를 대상으로 할 때 Kotlin은 ES5.1로 트랜스파일(transpile)되며 AMD 및 CommonJS를 포함한 모듈 시스템과 호환되는 코드를 생성합니다.

네이티브를 대상으로 할 때 Kotlin은 (LLVM을 통해) 플랫폼별 코드를 생성합니다.

### Kotlin은 어떤 JVM 버전을 대상으로 하나요?

Kotlin은 실행을 위한 JVM 버전을 선택할 수 있게 해줍니다. 기본적으로 Kotlin/JVM 컴파일러는 Java 8 호환 바이트코드를 생성합니다. 새로운 Java 버전에서 사용할 수 있는 최적화를 활용하고 싶다면 대상 Java 버전을 9부터 25까지 명시적으로 지정할 수 있습니다. 이 경우 결과 바이트코드가 하위 버전에서는 실행되지 않을 수 있습니다. [Kotlin 1.5](whatsnew15.md#new-default-jvm-target-1-8)부터 컴파일러는 Java 8 미만 버전과 호환되는 바이트코드 생성을 지원하지 않습니다.

### Kotlin은 배우기 어려운가요?

Kotlin은 Java, C#, JavaScript, Scala, Groovy 등 기존 언어에서 영감을 받았습니다. 배우기 쉽도록 노력했기 때문에, 사람들이 며칠 만에 Kotlin을 쉽게 시작하여 읽고 쓸 수 있습니다. 관용적인(idiomatic) Kotlin을 배우고 고급 기능을 더 사용하는 데는 시간이 조금 더 걸릴 수 있지만, 전반적으로 복잡한 언어는 아닙니다. 더 자세한 정보는 [학습 자료](learning-materials-overview.md)를 확인해 보세요.

### 어떤 회사들이 Kotlin을 사용하고 있나요?

Kotlin을 사용하는 회사가 너무 많아 모두 나열하기 어렵습니다. 하지만 블로그 게시물, GitHub 저장소 또는 강연을 통해 Kotlin 사용을 공개적으로 선언한 눈에 띄는 회사로는 [Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17), [Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI), [Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/) 등이 있습니다.

### 누가 Kotlin을 개발하나요?

Kotlin은 [JetBrains](https://www.jetbrains.com)의 엔지니어 팀(현재 100명 이상)이 개발합니다. 수석 언어 디자이너는 Michail Zarečenskij입니다. 코어 팀 외에도 250명 이상의 외부 기여자들도 GitHub에서 활동하고 있습니다.

### Kotlin에 대해 더 자세히 알아볼 수 있는 곳은 어디인가요?

가장 좋은 시작점은 [저희 웹사이트](https://kotlinlang.org)입니다. Kotlin을 시작하려면 [공식 IDE](kotlin-ide.md) 중 하나를 설치하거나 [온라인으로 사용해 볼](https://play.kotlinlang.org) 수 있습니다.

### Kotlin 관련 서적이 있나요?

Kotlin 관련 서적이 많이 있습니다. 그중 일부는 저희가 검토했으며 시작하기에 추천할 만합니다. 이 서적들은 [서적](books.md) 페이지에 나열되어 있습니다. 더 많은 서적은 [kotlin.link](https://kotlin.link/)에서 커뮤니티가 관리하는 목록을 참조하세요.

### Kotlin 관련 온라인 강좌가 있나요?

JetBrains Academy의 [Kotlin Core 트랙](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)을 통해 작동하는 애플리케이션을 만들면서 Kotlin의 모든 필수 요소를 배울 수 있습니다.

수강할 수 있는 다른 강좌는 다음과 같습니다:
* Kevin Jones의 [Pluralsight 강좌: Kotlin 시작하기](https://www.pluralsight.com/courses/kotlin-getting-started)
* Hadi Hariri의 [O'Reilly 강좌: Kotlin 프로그래밍 소개](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/)
* Peter Sommerhoff의 [Udemy 강좌: 초보자를 위한 Kotlin 튜토리얼 10가지](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/)

또한 [YouTube 채널](https://www.youtube.com/c/Kotlin)에서 다른 튜토리얼 및 콘텐츠를 확인할 수 있습니다.

### Kotlin 커뮤니티가 있나요?

네! Kotlin은 매우 활발한 커뮤니티를 가지고 있습니다. Kotlin 개발자들은 [Kotlin 포럼](https://discuss.kotlinlang.org), [StackOverflow](https://stackoverflow.com/questions/tagged/kotlin)에서 활동하며, 특히 [Kotlin Slack](https://slack.kotlinlang.org)에서 더 활발하게 활동합니다(2020년 4월 기준 약 30,000명에 달하는 멤버).

### Kotlin 이벤트가 있나요?

네! 현재 Kotlin에만 집중하는 많은 사용자 그룹과 Meetup이 있습니다. [웹사이트](https://kotlinlang.org/user-groups/user-group-list.html)에서 목록을 확인할 수 있습니다. 또한 전 세계적으로 커뮤니티에서 주최하는 [Kotlin Nights](https://kotlinlang.org/community/events.html) 이벤트도 있습니다.

### Kotlin 컨퍼런스가 있나요?

네! [KotlinConf](https://kotlinconf.com/)는 JetBrains에서 주최하는 연례 컨퍼런스로, 전 세계의 개발자, 열정적인 사용자, 전문가들을 한자리에 모아 Kotlin에 대한 지식과 경험을 공유합니다.

기술 강연 및 워크숍 외에도 KotlinConf는 네트워킹 기회, 커뮤니티 교류, 사교 행사를 제공하여 참석자들이 다른 Kotlin 사용자들과 교류하고 아이디어를 나눌 수 있습니다. Kotlin 생태계 내에서 협업과 커뮤니티 구축을 촉진하는 플랫폼 역할을 합니다.

Kotlin은 전 세계 다양한 컨퍼런스에서 다루어지고 있습니다. [웹사이트](https://kotlinlang.org/community/talks.html?time=upcoming)에서 [예정된 강연] 목록을 확인할 수 있습니다.

### Kotlin은 소셜 미디어에 있나요?

네.
[Kotlin YouTube 채널](https://www.youtube.com/c/Kotlin)을 구독하고 [Twitter](https://twitter.com/kotlin) 또는 [Bluesky](https://bsky.app/profile/kotlinlang.org)에서 Kotlin을 팔로우하세요.

### 다른 온라인 Kotlin 리소스가 있나요?

웹사이트에는 커뮤니티 회원이 작성한 [Kotlin Digests](https://kotlin.link), [뉴스레터](http://kotlinweekly.net), [팟캐스트](https://talkingkotlin.com) 등을 포함하여 다양한 [온라인 리소스](https://kotlinlang.org/community/)가 있습니다.

### HD Kotlin 로고는 어디서 받을 수 있나요?

로고는 [여기](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip)에서 다운로드할 수 있습니다. 로고를 사용할 때는 아카이브 내의 `guidelines.pdf` 파일과 [Kotlin 브랜드 사용 가이드라인](https://kotlinfoundation.org/guidelines/)의 간단한 규칙을 따라주세요.

더 자세한 정보는 [Kotlin 브랜드 자산](kotlin-brand-assets.md) 페이지를 확인해 보세요.