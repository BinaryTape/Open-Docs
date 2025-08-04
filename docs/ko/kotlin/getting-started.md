[//]: # (title: Kotlin 시작하기)

<tldr>
<p>최신 Kotlin 릴리스:<b> <a href="%kotlinLatestWhatsnew%">%kotlinVersion%</a></b></p>
</tldr>

Kotlin은 개발자들을 더 행복하게 만들도록 설계된 현대적이지만 이미 성숙한 프로그래밍 언어입니다. 간결하고 안전하며 Java 및 다른 언어들과 상호 운용 가능하며, 생산적인 프로그래밍을 위해 여러 플랫폼 간에 코드를 재사용할 수 있는 다양한 방법을 제공합니다.

시작하려면, Kotlin 둘러보기를 시작해 보는 건 어떨까요? 이 둘러보기는 Kotlin 프로그래밍 언어의 기본 사항을 다루며, 전적으로 브라우저에서 완료할 수 있습니다.

<a href="kotlin-tour-welcome.md"><img src="start-kotlin-tour.svg" width="700" alt="Kotlin 둘러보기 시작하기" style="block"/></a>

## Kotlin 설치

Kotlin은 각 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 및 [Android Studio](https://developer.android.com/studio) 릴리스에 포함되어 있습니다. 이 IDE 중 하나를 다운로드하여 설치하면 Kotlin을 사용할 수 있습니다.

## Kotlin 사용 사례 선택
 
<tabs>

<tab id="console" title="콘솔">

여기서는 Kotlin으로 콘솔 애플리케이션을 개발하고 단위 테스트를 생성하는 방법을 배웁니다.

1. **[IntelliJ IDEA 프로젝트 마법사로 기본 JVM 애플리케이션 생성](jvm-get-started.md).**

2. **[첫 단위 테스트 작성](jvm-test-using-junit.md).**

</tab>

<tab id="backend" title="백엔드">

여기서는 Kotlin 서버 측으로 백엔드 애플리케이션을 개발하는 방법을 배웁니다.

1. **첫 백엔드 애플리케이션 생성:**

     * [Spring Boot로 RESTful 웹 서비스 생성](jvm-get-started-spring-boot.md)
     * [Ktor로 HTTP API 생성](https://ktor.io/docs/creating-http-apis.html)

2. **[애플리케이션에서 Kotlin과 Java 코드 혼합 방법 학습](mixing-java-kotlin-intellij.md).**

</tab>

<tab id="cross-platform-mobile" title="크로스 플랫폼">

여기서는 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)을 사용하여 크로스 플랫폼 애플리케이션을 개발하는 방법을 배웁니다.

1. **[크로스 플랫폼 개발을 위한 환경 설정](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html).**

2. **iOS 및 Android용 첫 애플리케이션 생성:**

   * 크로스 플랫폼 애플리케이션을 처음부터 생성하고 다음을 수행합니다.
     * [UI를 네이티브로 유지하면서 비즈니스 로직 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
     * [비즈니스 로직 및 UI 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
   * [기존 Android 애플리케이션이 iOS에서 작동하도록 만들기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)
   * [Ktor 및 SQLdelight를 사용하여 크로스 플랫폼 애플리케이션 생성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html)

3. **[샘플 프로젝트](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html) 살펴보기**.

</tab>

<tab id="android" title="Android">

Android 개발에 Kotlin을 사용하기 시작하려면 [Android에서 Kotlin 시작에 대한 Google의 권장 사항](https://developer.android.com/kotlin/get-started)을 읽어보세요.

</tab>

<tab id="data-analysis" title="데이터 분석">

데이터 파이프라인 구축부터 머신러닝 모델 프로덕션화에 이르기까지, Kotlin은 데이터를 다루고 최대한 활용하는 데 탁월한 선택입니다.

1. **IDE 내에서 원활하게 노트북 생성 및 편집:**

   * [Kotlin Notebook 시작하기](get-started-with-kotlin-notebooks.md)

2. **데이터 탐색 및 실험:**

   * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – 데이터 분석 및 조작을 위한 라이브러리.
   * [Kandy](https://kotlin.github.io/kandy/welcome.html) – 데이터 시각화를 위한 플로팅 도구.

3. **Twitter에서 Kotlin For Data Analysis 팔로우:** [KotlinForData](http://twitter.com/KotlinForData).

</tab>

</tabs>

## Kotlin 커뮤니티에 참여하세요

Kotlin 생태계의 최신 소식을 파악하고 경험을 공유하세요.

* 다음에서 함께하세요:
  * ![Slack](slack.svg){width=25}{type="joined"} Slack: [초대받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
  * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 태그를 구독하세요.
* 다음에서 Kotlin을 팔로우하세요. ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin), ![Bluesky](bsky.svg){width=18}{type="joined"} [Bluesky](https://bsky.app/profile/kotlinlang.org), 및 ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/).
* [Kotlin 뉴스](https://info.jetbrains.com/kotlin-communication-center.html)를 구독하세요.

어려움이나 문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/issues/KT)에 이슈를 보고하세요.

## 빠진 것이 있나요?

이 페이지에 빠진 내용이 있거나 혼란스러워 보이는 부분이 있다면 [의견을 공유해주세요](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df).