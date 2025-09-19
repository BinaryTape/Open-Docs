[//]: # (title: 내비게이션 및 라우팅)

내비게이션은 사용자가 애플리케이션의 여러 화면 사이를 이동할 수 있도록 해주는 UI 애플리케이션의 핵심 부분입니다.
Compose Multiplatform은 [Jetpack Compose의 내비게이션 접근 방식](https://developer.android.com/guide/navigation/design#frameworks)을 채택합니다.

## 설정

내비게이션 라이브러리를 사용하려면 `commonMain` 소스 세트에 다음 종속성을 추가합니다:

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%"}

## 샘플 프로젝트

Compose Multiplatform 내비게이션 라이브러리가 작동하는 것을 보려면, [Navigate between screens with Compose](https://developer.android.com/codelabs/basic-android-kotlin-compose-navigation#0) Android 코드랩에서 변환된 [nav_cupcake 프로젝트](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/nav_cupcake)를 확인해 보세요.

Jetpack Compose와 마찬가지로, 내비게이션을 구현하려면 다음을 수행해야 합니다.
1. 내비게이션 그래프에 포함되어야 할 [경로를 나열](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L50)합니다. 각 경로는 경로를 정의하는 고유한 문자열이어야 합니다.
2. 내비게이션을 관리하기 위해 기본 컴포저블 속성으로 [`NavHostController` 인스턴스를 생성](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L89)합니다.
3. 앱에 [`NavHost` 컴포저블을 추가](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L109)합니다.
    1. 이전에 정의한 경로 목록에서 시작 대상을 선택합니다.
    2. `NavHost`를 생성하는 일부로 직접 내비게이션 그래프를 생성하거나, `NavController.createGraph()` 함수를 사용하여 프로그래밍 방식으로 생성합니다.

각 백 스택 항목(그래프에 포함된 각 내비게이션 경로)은 `LifecycleOwner` 인터페이스를 구현합니다.
앱의 다른 화면 간에 전환하면 상태가 `RESUMED`에서 `STARTED`로, 그리고 다시 원래대로 변경됩니다.
`RESUMED`는 "정착됨"으로도 설명됩니다. 새 화면이 준비되고 활성화되면 내비게이션이 완료된 것으로 간주됩니다.
Compose Multiplatform의 현재 구현에 대한 자세한 내용은 [수명 주기](compose-lifecycle.md) 페이지를 참조하세요.

## 웹 앱에서의 브라우저 내비게이션 지원
<secondary-label ref="Experimental"/>

웹용 Compose Multiplatform은 일반 내비게이션 라이브러리 API를 완전히 지원하며,
그 외에도 앱이 브라우저로부터 내비게이션 입력을 받을 수 있도록 합니다.
사용자는 브라우저의 **뒤로 가기** 및 **앞으로 가기** 버튼을 사용하여 브라우저 히스토리에 반영된 내비게이션 경로 사이를 이동할 수 있으며,
주소 표시줄을 사용하여 현재 위치를 파악하고 대상(경로)으로 직접 이동할 수도 있습니다.

웹 앱을 공통 코드에 정의된 내비게이션 그래프에 바인딩하려면,
Kotlin/Wasm 코드에서 `NavController.bindToBrowserNavigation()` 메서드를 사용할 수 있습니다.
Kotlin/JS에서도 동일한 메서드를 사용할 수 있지만, Wasm 애플리케이션이 초기화되고 Skia가 그래픽을 렌더링할 준비가 되었는지 확인하기 위해 `onWasmReady {}` 블록으로 래핑해야 합니다.
다음은 이를 설정하는 방법의 예시입니다.

```kotlin
//commonMain 소스 세트
@Composable
fun App(
    onNavHostReady: suspend (NavController) -> Unit = {}
) {
    val navController = rememberNavController()
    NavHost(...) {
        //...
    }
    LaunchedEffect(navController) {
        onNavHostReady(navController)
    }
}

//wasmJsMain 소스 세트
@OptIn(ExperimentalComposeUiApi::class)
@ExperimentalBrowserHistoryApi
fun main() {
    val body = document.body ?: return
    ComposeViewport(body) {
        App(
          onNavHostReady = { it.bindToBrowserNavigation() }
        )
    }
}

//jsMain 소스 세트
@OptIn(ExperimentalComposeUiApi::class)
@ExperimentalBrowserHistoryApi
fun main() {
    onWasmReady {
        val body = document.body ?: return@onWasmReady
        ComposeViewport(body) {
            App(
                onNavHostReady = { it.bindToBrowserNavigation() }
            )
        }
    }
}
```

`navController.bindToBrowserNavigation()` 호출 후:
* 브라우저에 표시되는 URL은 현재 경로를 반영합니다(URL 프래그먼트, `#` 문자 뒤).
* 앱은 수동으로 입력된 URL을 파싱하여 앱 내의 대상으로 변환합니다.

기본적으로 타입 세이프 내비게이션을 사용할 때, 대상은 [`kotlinx.serialization` 기본값](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serial-name/)에 인수가 추가되어 URL 프래그먼트로 변환됩니다.
`<app package>.<serializable type>/<argument1>/<argument2>` 형식입니다.
예를 들어, `example.org#org.example.app.StartScreen/123/Alice%2520Smith`와 같습니다.

### 경로를 URL로 변환하고 다시 되돌리는 방식 사용자 정의

Compose Multiplatform 앱은 단일 페이지 앱이므로, 프레임워크는 일반적인 웹 내비게이션을 모방하기 위해 주소 표시줄을 조작합니다.
URL을 더 읽기 쉽게 만들고 구현을 URL 패턴과 분리하려면,
화면에 직접 이름을 할당하거나 대상 경로에 대한 완전히 사용자 정의된 처리를 개발할 수 있습니다.

* URL을 단순히 읽기 쉽게 만들려면 `@SerialName` 어노테이션을 사용하여
    직렬화 가능한 객체나 클래스에 대한 직렬화 이름을 명시적으로 설정합니다.

    ```kotlin
    // 앱 패키지와 객체 이름 대신
    // 이 경로는 URL로 단순히 "#start"로 변환됩니다.
    @Serializable @SerialName("start") data object StartScreen
    ```
* 모든 URL을 완전히 구성하려면 선택적 `getBackStackEntryRoute` 람다를 사용할 수 있습니다.

#### 전체 URL 사용자 정의

경로를 URL로 완전히 사용자 정의 변환을 구현하려면 다음을 수행합니다.

1. 필요할 때 경로가 URL 프래그먼트로 변환되는 방식을 지정하기 위해
    선택적 `getBackStackEntryRoute` 람다를 `navController.bindToBrowserNavigation()` 함수에 전달합니다.
2. 필요한 경우, 주소 표시줄의 URL 프래그먼트를 포착하고(누군가 앱의 URL을 클릭하거나 붙여넣을 때)
    URL을 경로로 변환하여 사용자를 적절히 내비게이션하는 코드를 추가합니다.

다음은 웹 코드 샘플과 함께 사용할 간단한 타입 세이프 내비게이션 그래프의 예시입니다.
(`commonMain/kotlin/org.example.app/App.kt`):

```kotlin
// 내비게이션 그래프의 경로 인수를 위한 직렬화 가능한 객체 및 클래스
@Serializable data object StartScreen
@Serializable data class Id(val id: Long)
@Serializable data class Patient(val name: String, val age: Long)

@Composable
internal fun App(
    onNavHostReady: suspend (NavController) -> Unit = {}
) = AppTheme {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = StartScreen
    ) {
        composable<StartScreen> {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text("Starting screen")
                // 적절한 매개변수로 'Id' 화면을 여는 버튼
                Button(onClick = { navController.navigate(Id(222)) }) {
                    Text("Pass 222 as a parameter to the ID screen")
                }
                // 적절한 매개변수로 'Patient' 화면을 여는 버튼
                Button(onClick = { navController.navigate(Patient( "Jane Smith-Baker", 33)) }) {
                    Text("Pass 'Jane Smith-Baker' and 33 to the Person screen")
                }
            }
        }
        composable<Id> {...}
        composable<Patient> {...}
    }
    LaunchedEffect(navController) {
        onNavHostReady(navController)
    }
}
```
{default-state="collapsed" collapsible="true" collapsed-title="NavHost(navController = navController, startDestination = StartScreen)"}

`wasmJsMain/kotlin/main.kt`에서 `.bindToBrowserNavigation()` 호출에 람다를 추가합니다:

```kotlin
@OptIn(
    ExperimentalComposeUiApi::class,
    ExperimentalBrowserHistoryApi::class,
    ExperimentalSerializationApi::class
)
fun main() {
    val body = document.body ?: return
    ComposeViewport(body) {
        App(
            onNavHostReady = { navController ->
                navController.bindToBrowserNavigation() { entry ->
                    val route = entry.destination.route.orEmpty()
                    when {
                        // 직렬화 디스크립터를 사용하여 경로를 식별합니다.
                        route.startsWith(StartScreen.serializer().descriptor.serialName) -> {
                            // 해당 URL 프래그먼트를 "#start"로 설정합니다.
                            // "#org.example.app.StartScreen" 대신
                            //
                            // 이 문자열은 항상 `#` 문자로 시작하여
                            // 프론트 엔드에서 처리가 이루어지도록 해야 합니다.
                            "#start"
                        }
                        route.startsWith(Id.serializer().descriptor.serialName) -> {
                            // 경로 인수에 접근합니다.
                            val args = entry.toRoute<Id>()

                            // 해당 URL 프래그먼트를 "#find_id_222"로 설정합니다.
                            // "#org.example.app.ID%2F222" 대신
                            "#find_id_${args.id}"
                        }
                        route.startsWith(Patient.serializer().descriptor.serialName) -> {
                            val args = entry.toRoute<Patient>()
                            // 해당 URL 프래그먼트를 "#patient_Jane%20Smith-Baker_33"으로 설정합니다.
                            // "#org.company.app.Patient%2FJane%2520Smith-Baker%2F33" 대신
                            "#patient_${args.name}_${args.age}"
                        }
                        // 다른 모든 경로에 대해서는 URL 프래그먼트를 설정하지 않습니다.
                        else -> ""
                    }
                }
            }
        )
    }
}
```
<!--{default-state="collapsed" collapsible="true" collapsed-title="navController.bindToBrowserNavigation() { entry ->"}-->

> 경로에 해당하는 모든 문자열이 `#` 문자로 시작하는지 확인하여 데이터가
> URL 프래그먼트 내에 유지되도록 하세요.
> 그렇지 않으면, 사용자가 URL을 복사하여 붙여넣을 때 브라우저는 앱에 제어권을 넘기지 않고
> 잘못된 엔드포인트에 접근하려고 시도할 것입니다.
>
{style="note"}

URL에 사용자 정의 서식이 있는 경우, 수동으로 입력된 URL을 대상 경로에 일치시키기 위한 역처리를 추가해야 합니다.
일치 작업을 수행하는 코드는 `navController.bindToBrowserNavigation()` 호출이
`window.location`을 내비게이션 그래프에 바인딩하기 전에 실행되어야 합니다.

<Tabs>
    <TabItem title="Kotlin/Wasm">
        <code-block lang="Kotlin" code="        @OptIn(&#10;            ExperimentalComposeUiApi::class,&#10;            ExperimentalBrowserHistoryApi::class,&#10;            ExperimentalSerializationApi::class&#10;        )&#10;        fun main() {&#10;            val body = document.body ?: return&#10;            ComposeViewport(body) {&#10;                App(&#10;                    onNavHostReady = { navController -&gt;&#10;                        // 현재 URL의 프래그먼트 부분 문자열에 접근합니다.&#10;                        val initRoute = window.location.hash.substringAfter('#', &quot;&quot;)&#10;                        when {&#10;                            // 해당 경로를 식별하고 그 경로로 내비게이션합니다.&#10;                            initRoute.startsWith(&quot;start&quot;) -&gt; {&#10;                                navController.navigate(StartScreen)&#10;                            }&#10;                            initRoute.startsWith(&quot;find_id&quot;) -&gt; {&#10;                                // 문자열을 파싱하여 경로 매개변수를 추출한 다음 해당 경로로 내비게이션합니다.&#10;                                val id = initRoute.substringAfter(&quot;find_id_&quot;).toLong()&#10;                                navController.navigate(Id(id))&#10;                            }&#10;                            initRoute.startsWith(&quot;patient&quot;) -&gt; {&#10;                                val name = initRoute.substringAfter(&quot;patient_&quot;).substringBefore(&quot;_&quot;)&#10;                                val id = initRoute.substringAfter(&quot;patient_&quot;).substringAfter(&quot;_&quot;).toLong()&#10;                                navController.navigate(Patient(name, id))&#10;                            }&#10;                        }&#10;                        navController.bindToBrowserNavigation() { ... }&#10;                    }&#10;                )&#10;            }&#10;        }"/>
    </TabItem>
    <TabItem title="Kotlin/JS">
        <code-block lang="kotlin" code="        @OptIn(&#10;            ExperimentalComposeUiApi::class,&#10;            ExperimentalBrowserHistoryApi::class,&#10;            ExperimentalSerializationApi::class&#10;        )&#10;        fun main() {&#10;            onWasmReady {&#10;                val body = document.body ?: return@onWasmReady&#10;                ComposeViewport(body) {&#10;                    App(&#10;                        onNavHostReady = { navController -&gt;&#10;                            // 현재 URL의 프래그먼트 부분 문자열에 접근합니다.&#10;                            val initRoute = window.location.hash.substringAfter('#', &quot;&quot;)&#10;                            when {&#10;                                // 해당 경로를 식별하고 그 경로로 내비게이션합니다.&#10;                                initRoute.startsWith(&quot;start&quot;) -&gt; {&#10;                                    navController.navigate(StartScreen)&#10;                                }&#10;                                initRoute.startsWith(&quot;find_id&quot;) -&gt; {&#10;                                    // 문자열을 파싱하여 경로 매개변수를 추출한 다음 해당 경로로 내비게이션합니다.&#10;                                    val id = initRoute.substringAfter(&quot;find_id_&quot;).toLong()&#10;                                    navController.navigate(Id(id))&#10;                                }&#10;                                initRoute.startsWith(&quot;patient&quot;) -&gt; {&#10;                                    val name = initRoute.substringAfter(&quot;patient_&quot;).substringBefore(&quot;_&quot;)&#10;                                    val id = initRoute.substringAfter(&quot;patient_&quot;).substringAfter(&quot;_&quot;).toLong()&#10;                                    navController.navigate(Patient(name, id))&#10;                                }&#10;                            }&#10;                            navController.bindToBrowserNavigation() { ... }&#10;                        }&#10;                    )&#10;                }&#10;            }&#10;        }"/>
    </TabItem>
</Tabs>