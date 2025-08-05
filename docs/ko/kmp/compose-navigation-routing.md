[//]: # (title: 탐색 및 라우팅)

탐색은 사용자가 다양한 애플리케이션 화면 사이를 이동할 수 있게 하는 UI 애플리케이션의 핵심 부분입니다.
Compose Multiplatform은 [Jetpack Compose의 탐색 접근 방식](https://developer.android.com/guide/navigation/design#frameworks)을 채택합니다.

> 탐색 라이브러리는 현재 [베타](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 단계입니다.
> Compose Multiplatform 프로젝트에서 사용해 보시길 권장합니다.
> [YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP)에 피드백을 주시면 감사하겠습니다.
>
{style="tip"}

## 설정

Navigation 라이브러리를 사용하려면 `commonMain` 소스 세트에 다음 종속성을 추가하세요.

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

> Compose Multiplatform %org.jetbrains.compose%는 Navigation 라이브러리 버전 %org.jetbrains.androidx.navigation%을(를) 필요로 합니다.
>
{style="note"}

## 샘플 프로젝트

Compose Multiplatform 탐색 라이브러리의 작동 모습을 확인하려면 [Navigate between screens with Compose](https://developer.android.com/codelabs/basic-android-kotlin-compose-navigation#0) Android 코드랩에서 변환된 [nav_cupcake 프로젝트](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/nav_cupcake)를 살펴보세요.

Jetpack Compose와 마찬가지로, 탐색을 구현하려면 다음을 수행해야 합니다.
1.  탐색 그래프에 포함되어야 하는 [경로를 나열하세요](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L50). 각 경로는 경로를 정의하는 고유한 문자열이어야 합니다.
2.  탐색을 관리하기 위한 주요 컴포저블 속성으로 [NavHostController 인스턴스를 생성하세요](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L89).
3.  앱에 [NavHost 컴포저블을 추가하세요](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L109):
    1.  이전에 정의한 경로 목록에서 시작 대상을 선택합니다.
    2.  직접적으로, 즉 `NavHost`를 생성하는 일부로서 또는 `NavController.createGraph()` 함수를 사용하여 프로그래밍 방식으로 탐색 그래프를 생성합니다.

각 백 스택 엔트리(그래프에 포함된 각 탐색 경로)는 `LifecycleOwner` 인터페이스를 구현합니다.
앱의 다른 화면 간 전환은 상태를 `RESUMED`에서 `STARTED`로, 그리고 다시 `RESUMED`로 변경하게 합니다.
`RESUMED`는 "정착된"("settled")으로 설명되기도 합니다. 새 화면이 준비되고 활성화되면 탐색이 완료된 것으로 간주됩니다.
Compose Multiplatform의 현재 구현에 대한 자세한 내용은 [](compose-lifecycle.md) 페이지를 참조하세요.

## 웹 앱에서의 브라우저 탐색 지원
<secondary-label ref="Experimental"/>

웹용 Compose Multiplatform은 공통 Navigation 라이브러리 API를 전적으로 지원하며, 그 외에도 앱이 브라우저로부터 탐색 입력을 받을 수 있도록 합니다.
사용자는 브라우저의 **뒤로** 및 **앞으로** 버튼을 사용하여 브라우저 기록에 반영된 탐색 경로 사이를 이동할 수 있으며, 주소 표시줄을 사용하여 현재 위치를 파악하고 대상으로 직접 이동할 수 있습니다.

웹 앱을 공통 코드에 정의된 탐색 그래프에 바인딩하려면 Kotlin/Wasm 코드에서 `window.bindToNavigation()` 메서드를 사용할 수 있습니다.
Kotlin/JS에서도 동일한 메서드를 사용할 수 있지만, Wasm 애플리케이션이 초기화되고 Skia가 그래픽을 렌더링할 준비가 되었는지 확인하기 위해 `onWasmReady {}` 블록으로 감싸야 합니다.
설정 방법의 예시는 다음과 같습니다.

```kotlin
//commonMain source set
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

//wasmJsMain source set
@OptIn(ExperimentalComposeUiApi::class)
@ExperimentalBrowserHistoryApi
fun main() {
    val body = document.body ?: return
    ComposeViewport(body) {
        App(
          onNavHostReady = { window.bindToNavigation(it) }
        )
    }
}

//jsMain source set
@OptIn(ExperimentalComposeUiApi::class)
@ExperimentalBrowserHistoryApi
fun main() {
    onWasmReady {
        val body = document.body ?: return@onWasmReady
        ComposeViewport(body) {
            App(
                onNavHostReady = { window.bindToNavigation(it) }
            )
        }
    }
}
```

`window.bindToNavigation(navController)` 호출 후:
*   브라우저에 표시되는 URL은 현재 경로를 반영합니다(URL 프래그먼트에서 `#` 문자 뒤).
*   앱은 수동으로 입력된 URL을 구문 분석하여 앱 내의 대상으로 변환합니다.

기본적으로 타입-세이프 탐색을 사용할 때 대상은 [`kotlinx.serialization` 기본값](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serial-name/)에 따라 인수가 추가되어 URL 프래그먼트로 변환됩니다.
`<app package>.<serializable type>/<argument1>/<argument2>`.
예시: `example.org#org.example.app.StartScreen/123/Alice%2520Smith`.

### 경로를 URL로, 다시 URL을 경로로 변환 사용자 지정

Compose Multiplatform 앱은 단일 페이지 앱이므로 프레임워크는 일반적인 웹 탐색을 모방하기 위해 주소 표시줄을 조작합니다.
URL을 더 읽기 쉽게 만들고 URL 패턴에서 구현을 분리하고 싶다면 화면에 이름을 직접 할당하거나 대상 경로에 대한 완전히 사용자 지정된 처리를 개발할 수 있습니다.

*   단순히 URL을 읽기 쉽게 만들려면 `@SerialName` 어노테이션을 사용하여 직렬화 가능한 객체 또는 클래스에 대한 직렬 이름을 명시적으로 설정하세요.

    ```kotlin
    // 앱 패키지 및 객체 이름 대신,
    // 이 경로는 URL로 단순히 "#start"로 변환됩니다.
    @Serializable @SerialName("start") data object StartScreen
    ```
*   모든 URL을 완전히 구성하려면 선택적 `getBackStackEntryRoute` 람다를 사용할 수 있습니다.

#### 전체 URL 사용자 지정

완전히 사용자 지정된 경로-URL 변환을 구현하려면:

1.  필요할 때 경로가 URL 프래그먼트로 어떻게 변환되어야 하는지 지정하기 위해 선택적 `getBackStackEntryRoute` 람다를 `window.bindToNavigation()` 함수에 전달하세요.
2.  필요한 경우, 주소 표시줄의 URL 프래그먼트(누군가 앱의 URL을 클릭하거나 붙여넣을 때)를 포착하고 URL을 경로로 변환하여 사용자를 그에 따라 탐색시키는 코드를 추가하세요.

다음 웹 코드 샘플(`commonMain/kotlin/org.example.app/App.kt`)과 함께 사용할 간단한 타입-세이프 탐색 그래프의 예시는 다음과 같습니다.

```kotlin
// 탐색 그래프의 경로 인수를 위한 직렬화 가능한 객체 및 클래스
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
                    Text("ID 화면에 222를 매개변수로 전달")
                }
                // 적절한 매개변수로 'Patient' 화면을 여는 버튼
                Button(onClick = { navController.navigate(Patient( "Jane Smith-Baker", 33)) }) {
                    Text("Person 화면에 'Jane Smith-Baker'와 33을 전달")
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

`wasmJsMain/kotlin/main.kt`에서 `.bindToNavigation()` 호출에 람다를 추가하세요.

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
                window.bindToNavigation(navController) { entry ->
                    val route = entry.destination.route.orEmpty()
                    when {
                        // 직렬 디스크립터를 사용하여 경로 식별
                        route.startsWith(StartScreen.serializer().descriptor.serialName) -> {
                            // 해당 URL 프래그먼트를 "#org.example.app.StartScreen" 대신
                            // "#start"로 설정합니다.
                            //
                            // 이 문자열은 항상 `#` 문자로 시작해야
                            // 프런트엔드에서 처리를 유지할 수 있습니다.
                            "#start"
                        }
                        route.startsWith(Id.serializer().descriptor.serialName) -> {
                            // 경로 인수 액세스
                            val args = entry.toRoute<Id>()

                            // 해당 URL 프래그먼트를 "#org.example.app.ID%2F222" 대신
                            // "#find_id_222"로 설정합니다.
                            "#find_id_${args.id}"
                        }
                        route.startsWith(Patient.serializer().descriptor.serialName) -> {
                            val args = entry.toRoute<Patient>()
                            // 해당 URL 프래그먼트를 "#org.company.app.Patient%2FJane%2520Smith-Baker%2F33" 대신
                            // "#patient_Jane%20Smith-Baker_33"로 설정합니다.
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
<!--{default-state="collapsed" collapsible="true" collapsed-title="window.bindToNavigation(navController) { entry ->"}-->

> 경로에 해당하는 모든 문자열이 `#` 문자로 시작하여 데이터를 URL 프래그먼트 내에 유지하는지 확인하세요.
> 그렇지 않으면 사용자가 URL을 복사하여 붙여넣을 때 브라우저는 앱에 제어권을 전달하는 대신 잘못된 엔드포인트에 액세스하려고 시도할 것입니다.
>
{style="note"}

URL에 사용자 지정 형식이 있는 경우, 수동으로 입력된 URL을 대상 경로에 일치시키기 위한 역처리를 추가해야 합니다.
일치시키는 코드는 `window.bindToNavigation()` 호출이 `window.location`을 탐색 그래프에 바인딩하기 전에 실행되어야 합니다.

<tabs>
    <tab title="Kotlin/Wasm">
        <code-block lang="Kotlin">
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
                        // 현재 URL의 프래그먼트 부분 문자열에 액세스합니다.
                        val initRoute = window.location.hash.substringAfter('#', "")
                        when {
                            // 해당 경로를 식별하고 해당 경로로 이동합니다.
                            initRoute.startsWith("start") -> {
                                navController.navigate(StartScreen)
                            }
                            initRoute.startsWith("find_id") -> {
                                // 경로로 이동하기 전에 문자열을 구문 분석하여 경로 매개변수를 추출합니다.
                                val id = initRoute.substringAfter("find_id_").toLong()
                                navController.navigate(Id(id))
                            }
                            initRoute.startsWith("patient") -> {
                                val name = initRoute.substringAfter("patient_").substringBefore("_")
                                val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                navController.navigate(Patient(name, id))
                            }
                        }
                        window.bindToNavigation(navController) { ... }
                    }
                )
            }
        }
        </code-block>
    </tab>
    <tab title="Kotlin/JS">
        <code-block lang="kotlin">
        @OptIn(
            ExperimentalComposeUiApi::class,
            ExperimentalBrowserHistoryApi::class,
            ExperimentalSerializationApi::class
        )
        fun main() {
            onWasmReady {
                val body = document.body ?: return@onWasmReady
                ComposeViewport(body) {
                    App(
                        onNavHostReady = { navController ->
                            // 현재 URL의 프래그먼트 부분 문자열에 액세스합니다.
                            val initRoute = window.location.hash.substringAfter('#', "")
                            when {
                                // 해당 경로를 식별하고 해당 경로로 이동합니다.
                                initRoute.startsWith("start") -> {
                                    navController.navigate(StartScreen)
                                }
                                initRoute.startsWith("find_id") -> {
                                    // 경로로 이동하기 전에 문자열을 구문 분석하여 경로 매개변수를 추출합니다.
                                    val id = initRoute.substringAfter("find_id_").toLong()
                                    navController.navigate(Id(id))
                                }
                                initRoute.startsWith("patient") -> {
                                    val name = initRoute.substringAfter("patient_").substringBefore("_")
                                    val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                    navController.navigate(Patient(name, id))
                                }
                            }
                            window.bindToNavigation(navController) { ... }
                        }
                    )
                }
            }
        }
        </code-block>
    </tab>
</tabs>