[//]: # (title: 프로젝트 수정하기)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 동일하게 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이 문서는 <strong>공통 로직과 UI를 갖춘 Compose Multiplatform 앱 만들기</strong> 튜토리얼의 세 번째 부분입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다. 이 문서는 공통 로직과 UI를 갖춘 Compose Multiplatform 앱 만들기 튜토리얼의 첫 번째 부분입니다. Compose Multiplatform 앱 만들기, Composable 코드 살펴보기, 프로젝트 수정하기, 나만의 애플리케이션 만들기를 다룹니다.">Compose Multiplatform 앱 만들기</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="Second step"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다. 이 문서는 공통 로직과 UI를 갖춘 Compose Multiplatform 앱 만들기 튜토리얼의 두 번째 부분입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요. Compose Multiplatform 앱 만들기, Composable 코드 살펴보기, 프로젝트 수정하기, 나만의 애플리케이션 만들기를 다룹니다.">Composable 코드 살펴보기</Links><br/>
       <img src="icon-3.svg" width="20" alt="Third step"/> <strong>프로젝트 수정하기</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 나만의 애플리케이션 만들기<br/>
    </p>
</tldr>

Kotlin Multiplatform 마법사로 생성된 코드를 수정하여 `App` composable 내에 현재 날짜를 표시해 보겠습니다. 이를 위해 프로젝트에 새로운 의존성을 추가하고, UI를 개선하고, 각 플랫폼에서 애플리케이션을 다시 실행합니다.

## 새로운 의존성 추가하기

플랫폼별 라이브러리와 [expect/actual 선언](multiplatform-expect-actual.md)을 사용하여 날짜를 가져올 수도 있습니다. 하지만 Kotlin Multiplatform 라이브러리를 사용할 수 없는 경우에만 이 방식을 사용하는 것을 권장합니다. 이 예제에서는 [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) 라이브러리를 사용할 수 있습니다.

> JetBrains에서 제공하는 실험적인 멀티플랫폼 라이브러리 검색 서비스인 [klibs.io](https://klibs.io/)에서 타겟 플랫폼에 사용할 수 있는 Kotlin Multiplatform 라이브러리를 찾아볼 수 있습니다.
>
{style="tip"}

`kotlinx-datetime` 라이브러리를 사용하려면 다음 단계를 따르세요:

1. `composeApp/build.gradle.kts` 파일을 열고 프로젝트에 의존성을 추가합니다:

    * 공통 코드 소스 세트(common code source set)를 설정하는 섹션에 메인 `kotlinx-datetime` 의존성을 추가합니다. 편의상 버전 카탈로그에 추가하는 대신 버전 번호를 직접 포함할 수 있습니다.
    * 웹 타겟의 경우, 시간대(timezone) 지원을 위해 `js-joda` 라이브러리가 필요합니다. `webMain` 의존성에 `js-joda` npm 패키지에 대한 참조를 추가합니다.
      
    ```kotlin
    kotlin {
        // ...
        sourceSets {
            // ...
            commonMain.dependencies {
                // ...
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%")
            }
            webMain.dependencies {
                implementation(npm("@js-joda/timezone", "2.22.0"))
            }
        }
    }
    
    ```
    
2. 의존성이 추가되면 프로젝트를 다시 동기화하라는 메시지가 표시됩니다. **Sync Gradle Changes** 버튼을 클릭하여 Gradle 파일을 동기화합니다: ![Gradle 파일 동기화](gradle-sync.png){width=50}

3. **Terminal** 도구 창에서 다음 명령어를 실행합니다:

    ```shell
    ./gradlew kotlinUpgradeYarnLock kotlinWasmUpgradeYarnLock
    ```

   이 Gradle 태스크는 `yarn.lock` 파일이 최신 의존성 버전으로 업데이트되도록 합니다.
 
4. `webMain` 소스 세트에서 `@JsModule` 어노테이션을 사용하여 `js-joda` npm 패키지를 임포트합니다: 

    ```kotlin
    import androidx.compose.ui.ExperimentalComposeUiApi
    import androidx.compose.ui.window.ComposeViewport
    import kotlin.js.ExperimentalWasmJsInterop
    import kotlin.js.JsModule

    @OptIn(ExperimentalWasmJsInterop::class)
    @JsModule("@js-joda/timezone")
    external object JsJodaTimeZoneModule
    
    private val jsJodaTz = JsJodaTimeZoneModule
    
    @OptIn(ExperimentalComposeUiApi::class)
    fun main() {
        ComposeViewport {
            App()
        }
    }
    ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title='@JsModule("@js-joda/timezone")'}

## 사용자 인터페이스 개선하기

1. `composeApp/src/commonMain/kotlin/App.kt` 파일을 열고 현재 날짜를 포함하는 문자열을 반환하는 다음 함수를 추가합니다:

   ```kotlin
   fun todaysDate(): String {
       fun LocalDateTime.format() = toString().substringBefore('T')

       val now = Clock.System.now()
       val zone = TimeZone.currentSystemDefault()
       return now.toLocalDateTime(zone).format()
   }
   ```
2. IDE에서 제안하는 임포트를 추가합니다. `kotlinx.datetime`이 **아닌** `kotlin.time`에서 `Clock` 클래스를 임포트해야 합니다. 
3. 같은 파일에서 `App()` composable을 수정하여 이 함수를 호출하고 결과를 표시하는 `Text()` composable을 포함합니다:
   
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

4. IDE의 제안에 따라 누락된 의존성을 임포트합니다.
   업데이트된 패키지에서 `todaysDate()` 함수에 필요한 모든 누락된 의존성을 임포트하고, IDE에서 요청하면 opt-in을 수락합니다.

   ![미해결 참조](compose-unresolved-references.png)

## 애플리케이션 다시 실행하기

이제 Android, iOS, 데스크톱 및 웹에 대해 동일한 실행 구성을 사용하여 [애플리케이션을 다시 실행](compose-multiplatform-create-first-app.md#run-your-application)할 수 있습니다:

<Tabs>
    <TabItem id="mobile-app" title="Android 및 iOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="Android 및 iOS에서의 첫 Compose Multiplatform 앱" width="500"/>
    </TabItem>
    <TabItem id="desktop-app" title="Desktop">
        <img src="first-compose-project-on-desktop-2.png" alt="데스크톱에서의 첫 Compose Multiplatform 앱" width="400"/>
    </TabItem>
    <TabItem id="web-app" title="Web">
        <img src="first-compose-project-on-web-2.png" alt="웹에서의 첫 Compose Multiplatform 앱" width="400"/>
    </TabItem>
</Tabs>

## 다음 단계

튜토리얼의 다음 부분에서는 새로운 Compose Multiplatform 개념을 배우고 나만의 애플리케이션을 처음부터 만들어 봅니다.

**[다음 단계로 진행하기](compose-multiplatform-new-project.md)**

## 도움 받기

* **Kotlin Slack**. [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받고 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 가입하세요.
* **Kotlin 이슈 트래커**. [새로운 이슈를 제보](https://youtrack.jetbrains.com/newIssue?project=KT)하세요.