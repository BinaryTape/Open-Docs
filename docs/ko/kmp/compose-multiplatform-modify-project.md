[//]: # (title: 프로젝트 수정하기)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이 튜토리얼은 <strong>공유 로직 및 UI를 사용하는 Compose Multiplatform 앱 생성하기</strong> 튜토리얼의 세 번째 부분입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다. 이 튜토리얼은 공유 로직 및 UI를 사용하는 Compose Multiplatform 앱 생성하기 튜토리얼의 첫 번째 부분입니다. Compose Multiplatform 앱 생성하기 컴포저블 코드 살펴보기 프로젝트 수정하기 자신만의 애플리케이션 생성하기">Compose Multiplatform 앱 생성하기</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="두 번째 단계"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다. 이 튜토리얼은 공유 로직 및 UI를 사용하는 Compose Multiplatform 앱 생성하기 튜토리얼의 두 번째 부분입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요. Compose Multiplatform 앱 생성하기 컴포저블 코드 살펴보기 프로젝트 수정하기 자신만의 애플리케이션 생성하기">컴포저블 코드 살펴보기</Links><br/>
       <img src="icon-3.svg" width="20" alt="세 번째 단계"/> <strong>프로젝트 수정하기</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="네 번째 단계"/> 자신만의 애플리케이션 생성하기<br/>
    </p>
</tldr>

Kotlin Multiplatform 마법사가 생성한 코드를 수정하고 `App` 컴포저블 내에 현재 날짜를 표시해 보겠습니다. 이를 위해 프로젝트에 새 의존성을 추가하고, UI를 개선하며, 각 플랫폼에서 애플리케이션을 다시 실행합니다.

## 새 의존성 추가

플랫폼별 라이브러리와 [expect/actual 선언](multiplatform-expect-actual.md)을 사용하여 날짜를 가져올 수 있습니다. 하지만 Kotlin Multiplatform 라이브러리를 사용할 수 없을 때만 이 접근 방식을 사용하는 것이 좋습니다. 이 경우 [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) 라이브러리를 사용할 수 있습니다.

> JetBrains의 실험적인 검색 서비스인 [klibs.io](https://klibs.io/)에서 대상 플랫폼에 사용할 수 있는 Kotlin Multiplatform 라이브러리를 탐색할 수 있습니다.
>
{style="tip"}

`kotlinx-datetime` 라이브러리를 사용하려면:

1. `composeApp/build.gradle.kts` 파일을 열고 프로젝트에 의존성으로 추가합니다.

    ```kotlin
    kotlin {
        // ...
        sourceSets {
            // ...
            commonMain.dependencies {
                // ...
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%")
            }
            wasmJsMain.dependencies {
                implementation(npm("@js-joda/timezone", "2.22.0"))
            }
        }
    }
    
    ```

    * 주요 의존성은 공통 코드 소스 세트를 구성하는 섹션에 추가됩니다.
    * 단순화를 위해 버전 번호는 버전 카탈로그에 추가하는 대신 직접 포함됩니다.
    * 웹 타겟에서 시간대를 지원하기 위해 필요한 npm 패키지 참조가 `wasmJsMain` 의존성에 포함됩니다.

2. 의존성이 추가되면 프로젝트 동기화를 요청하는 메시지가 나타납니다. **Sync Gradle Changes** 버튼을 클릭하여 Gradle 파일을 동기화합니다. ![Gradle 파일 동기화](gradle-sync.png){width=50}

3. **터미널** 도구 창에서 다음 명령을 실행합니다.

    ```shell
    ./gradlew kotlinUpgradeYarnLock
    ```

   이 Gradle 작업은 `yarn.lock` 파일이 최신 의존성 버전으로 업데이트되도록 합니다.

## 사용자 인터페이스 개선

1. `composeApp/src/commonMain/kotlin/App.kt` 파일을 열고 현재 날짜를 포함하는 문자열을 반환하는 다음 함수를 추가합니다.

   ```kotlin
   fun todaysDate(): String {
       fun LocalDateTime.format() = toString().substringBefore('T')

       val now = Clock.System.now()
       val zone = TimeZone.currentSystemDefault()
       return now.toLocalDateTime(zone).format()
   }
   ```

2. 같은 파일에서 `App()` 컴포저블을 수정하여 이 함수를 호출하고 결과를 표시하는 `Text()` 컴포저블을 포함하도록 합니다.
   
    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var showContent by remember { mutableStateOf(false) }
            val greeting = remember { Greeting().greet() }
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Today's date is ${todaysDate()}",
                    modifier = Modifier.padding(20.dp),
                    fontSize = 24.sp,
                    textAlign = TextAlign.Center
                )
                Button(onClick = { showContent = !showContent }) {
                    Text("Click me!")
                }
                AnimatedVisibility(showContent) {
                    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                        Image(painterResource(Res.drawable.compose_multiplatform), null)
                        Text("Compose: $greeting")
                    }
                }
            }
        }
    }
    ```

3. IDE의 제안에 따라 누락된 의존성을 임포트합니다.
   `todaysDate()` 함수에 필요한 모든 누락된 의존성을 `kotlinx.datetime` 패키지에서 임포트해야 하며, `kotlin.time`에서 임포트하지 않도록 주의하세요.

   ![해결되지 않은 참조](compose-unresolved-references.png)

4. 웹 앱이 컨테이너로 `Element`를 사용하는 대신 외부에서 지정된 `id`를 가진 HTML 요소를 사용하도록 전환합니다.

    1. `composeApp/src/wasmJsMain/resources/index.html` 파일에서 `<body>` 내에 명명된 요소를 추가합니다.

        ```html
        <body>
        <div id="composeApplication" style="width:400px; height: 600px;"></div>
        </body>
        ```
    2. `composeApp/src/wasmJsMain/kotlin/main.kt` 파일에서 `ComposeViewport` 호출을 HTML 파일에 지정한 ID를 가리키는 `String` 변형으로 변경합니다.

        ```kotlin
        @OptIn(ExperimentalComposeUiApi::class)
        fun main() {
            ComposeViewport(viewportContainerId = "composeApplication") {
                App()
            }
        }
        ```

## 애플리케이션 다시 실행

이제 Android, iOS, 데스크톱 및 웹에 대해 동일한 실행 구성을 사용하여 애플리케이션을 다시 실행할 수 있습니다.

<Tabs>
    <TabItem id="mobile-app" title="Android 및 iOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="Android 및 iOS에서의 첫 Compose Multiplatform 앱" width="500"/>
    </TabItem>
    <TabItem id="desktop-app" title="데스크톱">
        <img src="first-compose-project-on-desktop-2.png" alt="데스크톱에서의 첫 Compose Multiplatform 앱" width="400"/>
    </TabItem>
    <TabItem id="web-app" title="웹">
        <img src="first-compose-project-on-web-2.png" alt="웹에서의 첫 Compose Multiplatform 앱" width="400"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage1).
>
{style="tip"}
-->

## 다음 단계

튜토리얼의 다음 부분에서는 새로운 Compose Multiplatform 개념을 배우고 자신만의 애플리케이션을 처음부터 생성합니다.

**[다음 파트로 진행](compose-multiplatform-new-project.md)**

## 도움말

* **Kotlin Slack**. [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받고 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
* **Kotlin 이슈 트래커**. [새 이슈 보고](https://youtrack.jetbrains.com/newIssue?project=KT).