[//]: # (title: 소개)

Dokka는 Kotlin용 API 문서 생성 엔진입니다.

Kotlin 자체와 마찬가지로 Dokka는 혼합 언어 프로젝트를 지원합니다. Dokka는 Kotlin의
[KDoc 주석](https://kotlinlang.org/docs/kotlin-doc.html#kdoc-syntax)과 Java의
[Javadoc 주석](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)을 이해합니다.

Dokka는 자체의 현대적인 [HTML 형식](dokka-html.md), Java의 [Javadoc HTML](dokka-javadoc.md)을 포함한 여러 형식으로 문서를 생성할 수 있으며,
마크다운의 [GFM](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-gfm/README.md) 및
[Jekyll](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-jekyll/README.md) 변형으로도 생성할 수 있습니다.

다음은 Dokka를 API 참조 문서에 사용하는 몇 가지 라이브러리입니다:

*   [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
*   [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
*   [Hexagon](https://hexagontk.com/stable/api/)
*   [Ktor](https://api.ktor.io/)
*   [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)

Dokka는 [Gradle](dokka-gradle.md), [Maven](dokka-maven.md) 또는 [명령줄](dokka-cli.md)을 사용하여 실행할 수 있습니다. 또한
[플러그인 확장성이 뛰어납니다](dokka-plugins.md).

Dokka 사용을 시작하려면 [Dokka 시작하기](dokka-get-started.md)를 참조하세요.

## 커뮤니티

Dokka는 [Kotlin 커뮤니티 Slack](https://kotl.in/slack)에 전용 `#dokka` 채널을 운영하고 있으며,
이곳에서 Dokka, 플러그인 및 개발 방법에 대해 이야기하고 관리자와 연락할 수 있습니다.