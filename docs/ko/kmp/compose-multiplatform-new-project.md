[//]: # (title: 나만의 애플리케이션 만들기)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>   
    <p>이 튜토리얼은 <strong>공유 로직과 UI를 사용하여 Compose Multiplatform 앱 만들기</strong> 튜토리얼의 마지막 부분입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">Compose Multiplatform 앱 만들기</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="Second step"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the second part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">컴포저블 코드 살펴보기</Links><br/>
       <img src="icon-3-done.svg" width="20" alt="Third step"/> <Links href="/kmp/compose-multiplatform-modify-project" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the third part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">프로젝트 수정하기</Links><br/>
       <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>나만의 애플리케이션 만들기</strong><br/>
    </p>
</tldr>

이제 마법사가 생성한 샘플 프로젝트를 탐색하고 개선했으니, 이미 알고 있는 개념을 사용하고 새로운 개념을 도입하여 처음부터 자신만의 애플리케이션을 만들 수 있습니다.

사용자가 국가와 도시를 입력하면 해당 국가의 수도 시간을 표시하는 "현지 시간 애플리케이션"을 만들 것입니다. Compose Multiplatform 앱의 모든 기능은 멀티플랫폼 라이브러리를 사용하여 공통 코드에 구현됩니다. 드롭다운 메뉴 내에서 이미지를 로드하고 표시하며, 이벤트, 스타일, 테마, 수정자(modifier), 레이아웃을 사용하게 될 것입니다.

각 단계에서 세 가지 플랫폼(iOS, Android, 데스크톱) 모두에서 애플리케이션을 실행하거나, 필요에 가장 적합한 특정 플랫폼에 집중할 수 있습니다.

> 프로젝트의 최종 상태는 [GitHub 저장소](https://github.com/kotlin-hands-on/get-started-with-cm/)에서 찾을 수 있습니다.
>
{style="note"}

## 기본 틀 마련하기

시작하려면 새로운 `App` 컴포저블을 구현하세요.

1.  `composeApp/src/commonMain/kotlin`에서 `App.kt` 파일을 열고 코드를 다음 `App` 컴포저블로 대체하세요.

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var timeAtLocation by remember { mutableStateOf("No location selected") }
   
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(timeAtLocation)
                Button(onClick = { timeAtLocation = "13:30" }) {
                    Text("Show Time At Location")
                }
            }
        }
    }
    ```

   * 레이아웃은 두 개의 컴포저블을 포함하는 열입니다. 첫 번째는 `Text` 컴포저블이고, 두 번째는 `Button`입니다.
   * 두 컴포저블은 `timeAtLocation` 속성이라는 단일 공유 상태로 연결됩니다. `Text` 컴포저블은 이 상태의 옵저버입니다.
   * `Button` 컴포저블은 `onClick` 이벤트 핸들러를 사용하여 상태를 변경합니다.

2. Android 및 iOS에서 애플리케이션을 실행하세요.

   ![Android 및 iOS의 새 Compose Multiplatform 앱](first-compose-project-on-android-ios-3.png){width=500}

   애플리케이션을 실행하고 버튼을 클릭하면 하드코딩된 시간이 표시됩니다.

3. [Compose Hot Reload](compose-hot-reload.md)를 사용하여 데스크톱에서 애플리케이션을 실행합니다.
   1. `composeApp/src/jvmMain/kotlin/main.kt` 파일에서 거터(gutter)의 **실행** 아이콘을 클릭하세요.
   2. **'composeApp [jvm]'을 Compose Hot Reload (베타)로 실행**을 선택하세요.
   ![거터에서 Compose Hot Reload 실행](compose-hot-reload-gutter-run.png){width=350}

   앱은 작동하지만, UI에 비해 창이 너무 큽니다.

   ![데스크톱의 새 Compose Multiplatform 앱](first-compose-project-on-desktop-3.png){width=400}

4. 이를 해결하려면 `main.kt` 파일을 다음과 같이 업데이트하세요.

    ```kotlin
   fun main() = application {
       val state = rememberWindowState(
           size = DpSize(400.dp, 250.dp),
           position = WindowPosition(300.dp, 300.dp)
       )
       Window(
           title = "Local Time App", 
           onCloseRequest = ::exitApplication, 
           state = state,
           alwaysOnTop = true
       ) {
           App()
       }
   }
    ```

    여기서는 창의 제목을 설정하고 `WindowState` 타입을 사용하여 창의 초기 크기와 화면에서의 위치를 지정합니다.

5. IDE의 지침에 따라 누락된 의존성을 임포트하세요.

6. 앱이 자동으로 업데이트되는 것을 보려면 수정된 파일(<shortcut>⌘ S</shortcut> / <shortcut>Ctrl+S</shortcut>)을 저장하세요. 모양이 개선될 것입니다.

   ![데스크톱 Compose Multiplatform 앱의 개선된 모양](first-compose-project-on-desktop-4.png){width=350}

   ![Compose Hot Reload](compose-hot-reload-resize.gif)

## 사용자 입력 지원

이제 사용자가 도시 이름을 입력하여 해당 위치의 시간을 확인할 수 있도록 합니다. 이를 달성하는 가장 간단한 방법은 `TextField` 컴포저블을 추가하는 것입니다.

1. `App`의 현재 구현을 아래 코드로 대체하세요.

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var location by remember { mutableStateOf("Europe/Paris") }
            var timeAtLocation by remember { mutableStateOf("No location selected") }
    
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(timeAtLocation)
                TextField(value = location, onValueChange = { location = it })
                Button(onClick = { timeAtLocation = "13:30" }) {
                    Text("Show Time At Location")
                }
            }
        }
    }
    ```

    새 코드는 `TextField`와 `location` 속성을 모두 추가합니다. 사용자가 텍스트 필드에 입력할 때, `onValueChange` 이벤트 핸들러를 사용하여 속성 값이 점진적으로 업데이트됩니다.

2. IDE의 지침에 따라 누락된 의존성을 임포트하세요.
3. 타겟팅하는 각 플랫폼에서 애플리케이션을 실행하세요.

<Tabs>
    <TabItem id="mobile-user-input" title="Android 및 iOS">
        <img src="first-compose-project-on-android-ios-4.png" alt="Android 및 iOS의 Compose Multiplatform 앱 사용자 입력" width="500"/>
    </TabItem>
    <TabItem id="desktop-user-input" title="데스크톱">
        <img src="first-compose-project-on-desktop-5.png" alt="데스크톱 Compose Multiplatform 앱 사용자 입력" width="350"/>
    </TabItem>
</Tabs>

## 시간 계산

다음 단계는 주어진 입력을 사용하여 시간을 계산하는 것입니다. 이를 위해 `currentTimeAt()` 함수를 생성하세요.

1. `App.kt` 파일로 돌아가 다음 함수를 추가하세요.

    ```kotlin
    fun currentTimeAt(location: String): String? {
        fun LocalTime.formatted() = "$hour:$minute:$second"

        return try {
            val time = Clock.System.now()
            val zone = TimeZone.of(location)
            val localTime = time.toLocalDateTime(zone).time
            "The time in $location is ${localTime.formatted()}"
        } catch (ex: IllegalTimeZoneException) {
            null
        }
    }
    ```

    이 함수는 이전에 만들었지만 더 이상 필요하지 않은 `todaysDate()`와 유사합니다.

2. IDE의 지침에 따라 누락된 의존성을 임포트하세요.
3. `currentTimeAt()`를 호출하도록 `App` 컴포저블을 조정하세요.

    ```kotlin
   @Composable
   @Preview
   fun App() {
   MaterialTheme { 
       var location by remember { mutableStateOf("Europe/Paris") }
       var timeAtLocation by remember { mutableStateOf("No location selected") }
   
       Column(
           modifier = Modifier
               .safeContentPadding()
               .fillMaxSize()
           ) {
               Text(timeAtLocation)
               TextField(value = location, onValueChange = { location = it })
               Button(onClick = { timeAtLocation = currentTimeAt(location) ?: "Invalid Location" }) {
                   Text("Show Time At Location")
               }
           }
       }
   }
    ```

4. 애플리케이션을 다시 실행하고 유효한 타임존(timezone)을 입력하세요.
5. 버튼을 클릭하세요. 올바른 시간이 표시될 것입니다.

<Tabs>
    <TabItem id="mobile-time-display" title="Android 및 iOS">
        <img src="first-compose-project-on-android-ios-5.png" alt="Android 및 iOS의 Compose Multiplatform 앱 시간 표시" width="500"/>
    </TabItem>
    <TabItem id="desktop-time-display" title="데스크톱">
        <img src="first-compose-project-on-desktop-6.png" alt="데스크톱 Compose Multiplatform 앱 시간 표시" width="350"/>
    </TabItem>
</Tabs>

## 스타일 개선

애플리케이션은 작동하지만, 외관에 문제가 있습니다. 컴포저블 간의 간격이 더 잘 조정될 수 있으며, 시간 메시지는 더 눈에 띄게 표시될 수 있습니다.

1. 이러한 문제를 해결하려면 다음 버전의 `App` 컴포저블을 사용하세요.

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var location by remember { mutableStateOf("Europe/Paris") }
            var timeAtLocation by remember { mutableStateOf("No location selected") }
   
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(
                    timeAtLocation,
                    style = TextStyle(fontSize = 20.sp),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().align(Alignment.CenterHorizontally)
                )
                TextField(
                    value = location,
                    onValueChange = { location = it },
                    modifier = Modifier.padding(top = 10.dp)
                )
                Button(
                    onClick = { timeAtLocation = currentTimeAt(location) ?: "Invalid Location" },
                    modifier = Modifier.padding(top = 10.dp)
                ) {
                    Text("Show Time")
                }
            }
        }
    }
    ```

    * `modifier` 매개변수는 `Column` 주변에, 그리고 `Button`과 `TextField`의 상단에 패딩을 추가합니다.
    * `Text` 컴포저블은 사용 가능한 수평 공간을 채우고 내용을 중앙에 정렬합니다.
    * `style` 매개변수는 `Text`의 모양을 사용자 정의합니다.

2. IDE의 지침에 따라 누락된 의존성을 임포트하세요.
    `Alignment`의 경우 `androidx.compose.ui` 버전을 사용하세요.

3. 애플리케이션을 실행하여 모양이 어떻게 개선되었는지 확인하세요.

<Tabs>
    <TabItem id="mobile-improved-style" title="Android 및 iOS">
        <img src="first-compose-project-on-android-ios-6.png" alt="Android 및 iOS의 Compose Multiplatform 앱 개선된 스타일" width="500"/>
    </TabItem>
    <TabItem id="desktop-improved-style" title="데스크톱">
        <img src="first-compose-project-on-desktop-7.png" alt="데스크톱 Compose Multiplatform 앱 개선된 스타일" width="350"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage2).
>
{style="tip"}
-->

## 디자인 리팩터링

애플리케이션은 작동하지만, 오타에 취약합니다. 예를 들어, 사용자가 "France" 대신 "Franse"를 입력하면 앱은 해당 입력을 처리할 수 없습니다. 사용자에게 미리 정의된 목록에서 국가를 선택하도록 요청하는 것이 더 좋습니다.

1. 이를 달성하려면 `App` 컴포저블에서 디자인을 변경하세요.

    ```kotlin
    data class Country(val name: String, val zone: TimeZone)
    
    fun currentTimeAt(location: String, zone: TimeZone): String {
        fun LocalTime.formatted() = "$hour:$minute:$second"
    
        val time = Clock.System.now()
        val localTime = time.toLocalDateTime(zone).time
    
        return "The time in $location is ${localTime.formatted()}"
    }
    
    fun countries() = listOf(
        Country("Japan", TimeZone.of("Asia/Tokyo")),
        Country("France", TimeZone.of("Europe/Paris")),
        Country("Mexico", TimeZone.of("America/Mexico_City")),
        Country("Indonesia", TimeZone.of("Asia/Jakarta")),
        Country("Egypt", TimeZone.of("Africa/Cairo")),
    )
    
    @Composable
    @Preview
    fun App(countries: List<Country> = countries()) {
        MaterialTheme {
            var showCountries by remember { mutableStateOf(false) }
            var timeAtLocation by remember { mutableStateOf("No location selected") }
    
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(
                    timeAtLocation,
                    style = TextStyle(fontSize = 20.sp),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().align(Alignment.CenterHorizontally)
                )
                Row(modifier = Modifier.padding(start = 20.dp, top = 10.dp)) {
                    DropdownMenu(
                        expanded = showCountries,
                        onDismissRequest = { showCountries = false }
                    ) {
                        countries().forEach { (name, zone) ->
                            DropdownMenuItem(
                                text = {   Text(name)},
                                onClick = {
                                    timeAtLocation = currentTimeAt(name, zone)
                                    showCountries = false
                                }
                            )
                        }
                    }
                }
    
                Button(modifier = Modifier.padding(start = 20.dp, top = 10.dp),
                    onClick = { showCountries = !showCountries }) {
                    Text("Select Location")
                }
            }
        }
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true"  collapsed-title="data class Country(val name: String, val zone: TimeZone) 데이터 클래스"}

   * `Country` 타입은 이름과 타임존(timezone)으로 구성됩니다.
   * `currentTimeAt()` 함수는 두 번째 매개변수로 `TimeZone`을 받습니다.
   * 이제 `App`은 국가 목록을 매개변수로 요구합니다. `countries()` 함수가 이 목록을 제공합니다.
   * `DropdownMenu`가 `TextField`를 대체했습니다. `showCountries` 속성 값은 `DropdownMenu`의 가시성을 결정합니다. 각 국가에 대한 `DropdownMenuItem`이 있습니다.

2. IDE의 지침에 따라 누락된 의존성을 임포트하세요.
3. 애플리케이션을 실행하여 재설계된 버전을 확인하세요.

<Tabs>
    <TabItem id="mobile-country-list" title="Android 및 iOS">
        <img src="first-compose-project-on-android-ios-7.png" alt="Android 및 iOS의 Compose Multiplatform 앱 국가 목록" width="500"/>
    </TabItem>
    <TabItem id="desktop-country-list" title="데스크톱">
        <img src="first-compose-project-on-desktop-8.png" alt="데스크톱 Compose Multiplatform 앱 국가 목록" width="350"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage3).
>
{style="tip"}
-->

> [Koin](https://insert-koin.io/)과 같은 의존성 주입 프레임워크를 사용하여 위치 테이블을 구성하고 주입함으로써 디자인을 더욱 개선할 수 있습니다. 데이터가 외부에 저장된 경우, [Ktor](https://ktor.io/docs/create-client.html) 라이브러리를 사용하여 네트워크를 통해 데이터를 가져오거나 [SQLDelight](https://github.com/cashapp/sqldelight) 라이브러리를 사용하여 데이터베이스에서 데이터를 가져올 수 있습니다.
>
{style="note"}

## 이미지 도입

국가 이름 목록은 작동하지만, 시각적으로 매력적이지 않습니다. 이름을 국기 이미지로 대체하여 개선할 수 있습니다.

Compose Multiplatform은 모든 플랫폼에서 공통 코드를 통해 리소스에 접근할 수 있는 라이브러리를 제공합니다. Kotlin Multiplatform 마법사는 이미 이 라이브러리를 추가하고 구성했으므로, 빌드 파일을 수정할 필요 없이 리소스를 로드할 수 있습니다.

프로젝트에서 이미지를 지원하려면 이미지 파일을 다운로드하여 올바른 디렉터리에 저장하고, 이를 로드하고 표시하는 코드를 추가해야 합니다.

1. [Flag CDN](https://flagcdn.com/)과 같은 외부 리소스를 사용하여 이미 생성한 국가 목록과 일치하는 국기 이미지를 다운로드하세요. 이 경우 [일본](https://flagcdn.com/w320/jp.png), [프랑스](https://flagcdn.com/w320/fr.png), [멕시코](https://flagcdn.com/w320/mx.png), [인도네시아](https://flagcdn.com/w320/id.png), [이집트](https://flagcdn.com/w320/eg.png)입니다.

2. 동일한 국기 이미지를 모든 플랫폼에서 사용할 수 있도록 이미지를 `composeApp/src/commonMain/composeResources/drawable` 디렉터리로 이동하세요.

   ![Compose Multiplatform 리소스 프로젝트 구조](compose-resources-project-structure.png){width=300}

3. 추가된 리소스에 대한 접근자를 포함하는 `Res` 클래스를 생성하려면 애플리케이션을 빌드하거나 실행하세요.

4. `commonMain/kotlin/.../App.kt` 파일의 코드를 업데이트하여 이미지를 지원하세요.

    ```kotlin
    import compose.project.demo.generated.resources.eg
    import compose.project.demo.generated.resources.fr
    import compose.project.demo.generated.resources.id
    import compose.project.demo.generated.resources.jp
    import compose.project.demo.generated.resources.mx
   
   data class Country(val name: String, val zone: TimeZone, val image: DrawableResource)

    fun currentTimeAt(location: String, zone: TimeZone): String {
        fun LocalTime.formatted() = "$hour:$minute:$second"

        val time = Clock.System.now()
        val localTime = time.toLocalDateTime(zone).time

        return "The time in $location is ${localTime.formatted()}"
    }

    val defaultCountries = listOf(
        Country("Japan", TimeZone.of("Asia/Tokyo"), Res.drawable.jp),
        Country("France", TimeZone.of("Europe/Paris"), Res.drawable.fr),
        Country("Mexico", TimeZone.of("America/Mexico_City"), Res.drawable.mx),
        Country("Indonesia", TimeZone.of("Asia/Jakarta"), Res.drawable.id),
        Country("Egypt", TimeZone.of("Africa/Cairo"), Res.drawable.eg)
    )

    @Composable
    @Preview
    fun App(countries: List<Country> = defaultCountries) {
        MaterialTheme {
            var showCountries by remember { mutableStateOf(false) }
            var timeAtLocation by remember { mutableStateOf("No location selected") }

            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(
                    timeAtLocation,
                    style = TextStyle(fontSize = 20.sp),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().align(Alignment.CenterHorizontally)
                )
                Row(modifier = Modifier.padding(start = 20.dp, top = 10.dp)) {
                    DropdownMenu(
                        expanded = showCountries,
                        onDismissRequest = { showCountries = false }
                    ) {
                        countries.forEach { (name, zone, image) ->
                            DropdownMenuItem(
                                text = { Row(verticalAlignment = Alignment.CenterVertically) {
                                    Image(
                                        painterResource(image),
                                        modifier = Modifier.size(50.dp).padding(end = 10.dp),
                                        contentDescription = "$name flag"
                                    )
                                    Text(name)
                                } },
                                onClick = {
                                    timeAtLocation = currentTimeAt(name, zone)
                                    showCountries = false
                                }
                            )
                        }
                    }
                }

                Button(modifier = Modifier.padding(start = 20.dp, top = 10.dp),
                    onClick = { showCountries = !showCountries }) {
                    Text("Select Location")
                }
            }
        }
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true"  collapsed-title="data class Country(val name: String, val zone: TimeZone, val image: DrawableResource) 데이터 클래스"}

    * `Country` 타입은 관련 이미지의 경로를 저장합니다.
    * `App`에 전달된 국가 목록에는 이 경로들이 포함됩니다.
    * `App`은 각 `DropdownMenuItem`에 `Image`를 표시하고, 그 뒤에 국가 이름을 포함하는 `Text` 컴포저블을 표시합니다.
    * 각 `Image`는 데이터를 가져오기 위해 `Painter` 객체를 필요로 합니다.

5. IDE의 지침에 따라 누락된 의존성을 임포트하세요.
6. 애플리케이션을 실행하여 새로운 동작을 확인하세요.

<Tabs>
    <TabItem id="mobile-flags" title="Android 및 iOS">
        <img src="first-compose-project-on-android-ios-8.png" alt="Android 및 iOS의 Compose Multiplatform 앱 국기" width="500"/>
    </TabItem>
    <TabItem id="desktop-flags" title="데스크톱">
        <img src="first-compose-project-on-desktop-9.png" alt="데스크톱 Compose Multiplatform 앱 국기" width="350"/>
    </TabItem>
</Tabs>

> 프로젝트의 최종 상태는 [GitHub 저장소](https://github.com/kotlin-hands-on/get-started-with-cm/)에서 찾을 수 있습니다.
>
{style="note"}

## 다음 단계

멀티플랫폼 개발을 더 탐구하고 더 많은 프로젝트를 시도해 보시길 권장합니다.

*   [Android 앱을 크로스 플랫폼으로 만들기](multiplatform-integrate-in-existing-app.md)
*   [Ktor 및 SQLDelight를 사용하여 멀티플랫폼 앱 만들기](multiplatform-ktor-sqldelight.md)
*   [UI는 네이티브로 유지하면서 iOS와 Android 간에 비즈니스 로직 공유하기](multiplatform-create-first-app.md)
*   [Kotlin/Wasm을 사용하여 Compose Multiplatform 앱 만들기](https://kotlinlang.org/docs/wasm-get-started.html)
*   [엄선된 샘플 프로젝트 목록 보기](multiplatform-samples.md)

커뮤니티에 참여하세요:

*   ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**: [저장소](https://github.com/JetBrains/compose-multiplatform)에 스타(★)를 주고 기여하세요.
*   ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**: [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받아 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
*   ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**: ["kotlin-multiplatform" 태그](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)를 구독하세요.
*   ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube 채널**: 구독하고 [Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C)에 대한 비디오를 시청하세요.