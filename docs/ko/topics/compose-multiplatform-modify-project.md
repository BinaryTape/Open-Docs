[//]: # (title: 프로젝트 수정)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이 문서는 **공유 로직 및 UI를 사용하여 Compose Multiplatform 앱 만들기** 튜토리얼의 세 번째 파트입니다. 계속하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="compose-multiplatform-create-first-app.md">Compose Multiplatform 앱 만들기</a><br/>
       <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="compose-multiplatform-explore-composables.md">컴포저블 코드 살펴보기</a><br/>
       <img src="icon-3.svg" width="20" alt="Third step"/> <strong>프로젝트 수정</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 나만의 애플리케이션 만들기<br/>
    </p>
</tldr>

Kotlin Multiplatform 위저드가 생성한 코드를 수정하고 `App` 컴포저블 내에 현재 날짜를 표시해 봅시다. 이를 위해 프로젝트에 새 종속성을 추가하고, UI를 개선하며, 각 플랫폼에서 애플리케이션을 다시 실행할 것입니다.

## 새 종속성 추가

플랫폼별 라이브러리와 [expect/actual 선언](multiplatform-expect-actual.md)을 사용하여 날짜를 가져올 수 있습니다. 그러나 이 접근 방식은 Kotlin Multiplatform 라이브러리를 사용할 수 없을 때만 사용하는 것을 권장합니다. 이 경우 [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) 라이브러리를 사용할 수 있습니다.

> 대상 플랫폼에서 사용 가능한 Kotlin Multiplatform 라이브러리는 JetBrains의 실험적인 다중 플랫폼 라이브러리 검색 서비스인 [klibs.io](https://klibs.io/)에서 찾아볼 수 있습니다.
>
{style="tip"}

`kotlinx-datetime` 라이브러리를 사용하려면:

1. `composeApp/build.gradle.kts` 파일을 열고 프로젝트에 종속성으로 추가합니다.

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

    * 주요 종속성은 공통 코드 소스셋(source set)을 구성하는 섹션에 추가됩니다.
    * 간단함을 위해 버전 번호는 버전 카탈로그에 추가하는 대신 직접 포함됩니다.
    * 웹 타겟에서 시간대를 지원하기 위해 필요한 npm 패키지 참조가 `wasmJsMain` 종속성에 포함됩니다.

2. 종속성이 추가되면 프로젝트를 다시 동기화하라는 메시지가 나타납니다. **Sync Gradle Changes** 버튼을 클릭하여 Gradle 파일을 동기화하세요: ![Synchronize Gradle files](gradle-sync.png){width=50}

3. **Terminal** 도구 창에서 다음 명령어를 실행합니다:

    ```shell
    ./gradlew kotlinUpgradeYarnLock
    ```

   이 Gradle 작업은 `yarn.lock` 파일이 최신 종속성 버전으로 업데이트되도록 합니다.

## 사용자 인터페이스 개선

1. `composeApp/src/commonMain/kotlin/App.kt` 파일을 열고 현재 날짜를 포함하는 문자열을 반환하는 다음 함수를 추가합니다:

   ```kotlin
   fun todaysDate(): String {
       fun LocalDateTime.format() = toString().substringBefore('T')

       val now = Clock.System.now()
       val zone = TimeZone.currentSystemDefault()
       return now.toLocalDateTime(zone).format()
   }
   ```

2. 같은 파일에서, 이 함수를 호출하고 결과를 표시하는 `Text()` 컴포저블을 포함하도록 `App()` 컴포저블을 수정합니다:
   
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

3. IDE의 제안에 따라 누락된 종속성을 임포트합니다.
   `todaysDate()` 함수에 대한 누락된 종속성을 `kotlin.time` 패키지가 **아닌** `kotlinx.datetime` 패키지에서 모두 임포트해야 합니다.

   ![Unresolved references](compose-unresolved-references.png)

4. 웹 앱이 컨테이너로 `Element`를 사용하는 대신 외부에서 지정된 `id`를 가진 HTML 요소를 사용하도록 변경합니다:

    1. `composeApp/src/wasmJsMain/resources/index.html` 파일에서 `<body>` 내에 이름이 지정된 요소를 추가합니다:

        ```html
        <body>
        <div id="composeApplication" style="width:400px; height: 600px;"></div>
        </body>
        ```
    2. `composeApp/src/wasmJsMain/kotlin/main.kt` 파일에서, `ComposeViewport` 호출을 HTML 파일에 지정한 ID를 가리키는 `String` 변형으로 변경합니다:

        ```kotlin
        @OptIn(ExperimentalComposeUiApi::class)
        fun main() {
            ComposeViewport(viewportContainerId = "composeApplication") {
                App()
            }
        }
        ```

## 애플리케이션 다시 실행

이제 Android, iOS, 데스크톱, 웹에 대해 동일한 실행 구성을 사용하여 애플리케이션을 다시 실행할 수 있습니다:

<tabs>
    <tab id="mobile-app" title="Android 및 iOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="Android 및 iOS에서 첫 번째 Compose Multiplatform 앱" width="500"/>
    </tab>
    <tab id="desktop-app" title="데스크톱">
        <img src="first-compose-project-on-desktop-2.png" alt="데스크톱에서 첫 번째 Compose Multiplatform 앱" width="400"/>
    </tab>
    <tab id="web-app" title="웹">
        <img src="first-compose-project-on-web-2.png" alt="웹에서 첫 번째 Compose Multiplatform 앱" width="400"/>
    </tab>
</tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage1).
>
{style="tip"}
-->

## 다음 단계

튜토리얼의 다음 부분에서는 새로운 Compose Multiplatform 개념을 배우고 처음부터 자신만의 애플리케이션을 만들 것입니다.

**[다음 파트로 진행](compose-multiplatform-new-project.md)**

## 도움받기

* **Kotlin Slack**. [초대장을 받고](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
* **Kotlin 이슈 트래커**. [새로운 이슈를 보고하세요](https://youtrack.jetbrains.com/newIssue?project=KT).