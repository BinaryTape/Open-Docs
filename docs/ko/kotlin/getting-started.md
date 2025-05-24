---
title: "Kotlin 시작하기"
slug: /
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin은 최신 프로그래밍 언어이지만 이미 성숙 단계에 접어들었으며 개발자의 만족도를 높이기 위해 설계되었습니다.
간결하고 안전하며 Java 및 기타 언어와 상호 운용이 가능하며, 생산적인 프로그래밍을 위해 여러 플랫폼 간에 코드를 재사용할 수 있는 다양한 방법을 제공합니다.

시작하기 전에 Kotlin 둘러보기를 살펴보는 것은 어떠신가요? 이 둘러보기에서는 Kotlin 프로그래밍 언어의 기본 사항을 다루며
브라우저 내에서 모든 과정을 완료할 수 있습니다.

<a href="kotlin-tour-welcome"><img src="/img/start-kotlin-tour.svg" width="700" alt="Start the Kotlin tour" /></a>

## Kotlin 설치

Kotlin은 각 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 및 [Android Studio](https://developer.android.com/studio) 릴리스에 포함되어 있습니다.
Kotlin을 사용하려면 이러한 IDE 중 하나를 다운로드하여 설치하세요.

## Kotlin 사용 사례 선택

<Tabs>

<TabItem value="console" label="Console">

여기에서는 Kotlin을 사용하여 콘솔 애플리케이션을 개발하고 단위 테스트를 생성하는 방법을 배울 수 있습니다.

1. **[IntelliJ IDEA 프로젝트 마법사로 기본 JVM 애플리케이션 만들기](jvm-get-started).**

2. **[첫 번째 단위 테스트 작성](jvm-test-using-junit).**

3. **Kotlin 커뮤니티에 참여하세요:**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow: ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 태그를 구독하세요.

4. **Kotlin 팔로우:**
   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

어려움이나 문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/issues/KT)에 문제를 보고하세요.

</TabItem>

<TabItem value="backend" label="Backend">

여기에서는 Kotlin 서버 측을 사용하여 백엔드 애플리케이션을 개발하는 방법을 배울 수 있습니다.

1. **첫 번째 백엔드 애플리케이션 만들기:**

     * [Spring Boot로 RESTful 웹 서비스 만들기](jvm-get-started-spring-boot)
     * [Ktor로 HTTP API 만들기](https://ktor.io/docs/creating-http-apis.html)

2. **[애플리케이션에서 Kotlin 및 Java 코드를 혼합하는 방법 알아보기](mixing-java-kotlin-intellij).**

3. **Kotlin 서버 측 커뮤니티에 참여하세요:**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow: ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 태그를 구독하세요.

4. **Kotlin 팔로우:**

   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

어려움이나 문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/issues/KT)에 문제를 보고하세요.

</TabItem>

<TabItem value="cross-platform-mobile" label="Cross-platform">

여기에서는 [Kotlin Multiplatform](multiplatform-intro)을 사용하여 크로스 플랫폼 애플리케이션을 개발하는 방법을 배울 수 있습니다.

1. **[크로스 플랫폼 개발을 위한 환경 설정](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html).**

2. **iOS 및 Android용 첫 번째 애플리케이션 만들기:**

   * 처음부터 크로스 플랫폼 애플리케이션을 만들고 다음을 수행합니다.
     * [UI를 네이티브로 유지하면서 비즈니스 로직 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
     * [비즈니스 로직 및 UI 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
   * [기존 Android 애플리케이션이 iOS에서 작동하도록 만들기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)
   * [Ktor 및 SQLdelight를 사용하여 크로스 플랫폼 애플리케이션 만들기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html)

3. **[샘플 프로젝트](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html) 살펴보기**.

4. **Kotlin Multiplatform 커뮤니티에 참여하세요:**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 및 [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) 및 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
   * <img src="/img/stackoverflow.svg" alt="StackOverflow" width="25" style={{verticalAlign: 'middle'}}/> StackOverflow: ["kotlin-multiplatform" 태그](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)를 구독하세요.

5. **Kotlin 팔로우:**

   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

어려움이나 문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/issues/KT)에 문제를 보고하세요.

</TabItem>

<TabItem value="android" label="Android">

Android 개발에 Kotlin을 사용하려면 [Android에서 Kotlin 시작하기에 대한 Google의 권장 사항](https://developer.android.com/kotlin/get-started)을 읽어보세요.

<img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack에서 Android 커뮤니티에 참여하세요. [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 및 [#android](https://kotlinlang.slack.com/archives/C0B8M7BUY) 채널에 참여하세요.

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin), <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org) 및 <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)에서 Kotlin을 팔로우하고 중요한 에코시스템 업데이트를 놓치지 마세요.

</TabItem>

<TabItem value="data-analysis" label="Data analysis">

데이터 파이프라인 구축부터 머신러닝 모델 프로덕션에 이르기까지 Kotlin은 데이터를 사용하고 최대한 활용하기 위한 훌륭한 선택입니다.

1. **IDE 내에서 원활하게 노트북을 만들고 편집합니다:**

   * [Kotlin Notebook 시작하기](get-started-with-kotlin-notebooks)

2. **데이터를 탐색하고 실험합니다:**

   * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – 데이터 분석 및 조작을 위한 라이브러리입니다.
   * [Kandy](https://kotlin.github.io/kandy/welcome.html) – 데이터 시각화를 위한 플로팅 도구입니다.

3. **데이터 분석을 위한 Kotlin에 대한 최신 업데이트를 받으세요:**

   * <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 및 [#datascience](https://kotlinlang.slack.com/archives/C4W52CFEZ) 채널에 참여하세요.
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> Twitter: [KotlinForData](http://twitter.com/KotlinForData)를 팔로우하세요.

4. **Kotlin 팔로우:**
   * <img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)
   * <img src="/img/twitter.svg" alt="Twitter" width="18" style={{verticalAlign: 'middle'}}/> [Twitter](https://twitter.com/kotlin)
   * <img src="/img/bsky.svg" alt="Bluesky" width="18" style={{verticalAlign: 'middle'}}/> [Bluesky](https://bsky.app/profile/kotlinlang.org)
   * <img src="/img/reddit.svg" alt="Reddit" width="25" style={{verticalAlign: 'middle'}}/> [Reddit](https://www.reddit.com/r/Kotlin/)

</TabItem>

</Tabs>

## 누락된 내용이 있나요?

이 페이지에서 누락되었거나 혼란스러운 부분이 있으면 [피드백을 공유해주세요](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df).