[//]: # (title: 딥 링크)

딥 링크는 운영 체제가 사용자 지정 링크를 처리하여 해당 앱 내의 특정 목적지로 사용자를 이동시키는 탐색 메커니즘입니다.

딥 링크는 앱 링크(Android 용어) 또는 유니버설 링크(iOS 용어)의 더 일반적인 경우입니다. 이들은 앱과 특정 웹 주소 간의 검증된 연결입니다. 이에 대해 자세히 알아보려면 [Android 앱 링크](https://developer.android.com/training/app-links) 및 [iOS 유니버설 링크](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content/) 문서를 참조하세요.

딥 링크는 앱으로 외부 입력을 가져오는 데에도 유용할 수 있습니다. 예를 들어 OAuth 인증의 경우, 딥 링크를 파싱하여 OAuth 토큰을 얻을 수 있으며, 사용자를 시각적으로 탐색시키지 않아도 됩니다.

> 외부 입력은 악성일 수 있으므로, 원시 딥 링크 URI 처리와 관련된 위험을 적절히 완화하려면 [보안 지침](https://developer.android.com/privacy-and-security/risks/unsafe-use-of-deeplinks)을 반드시 따르세요.
>
{style="warning"}

Compose Multiplatform에서 딥 링크를 구현하려면:

1.  [앱 구성에 딥 링크 스키마 등록](#register-deep-links-schemas-in-the-operating-system)
2.  [탐색 그래프의 목적지에 특정 딥 링크 할당](#assign-deep-links-to-destinations)
3.  [앱에서 수신한 딥 링크 처리](#handle-received-deep-links)

## 설정

Compose Multiplatform에서 딥 링크를 사용하려면 다음과 같이 종속성을 설정하세요.

Gradle 카탈로그에 다음 버전, 라이브러리 및 플러그인을 나열하세요:

```ini
[versions]
compose-multiplatform = "%org.jetbrains.compose%"
agp = "8.9.0"

# The multiplatform Navigation library version with deep link support 
androidx-navigation = "%org.jetbrains.androidx.navigation%"

# Minimum Kotlin version to use with Compose Multiplatform 1.8.0
kotlin = "2.1.0"

# Serialization library necessary to implement type-safe routes
kotlinx-serialization = "1.7.3"

[libraries]
navigation-compose = { module = "org.jetbrains.androidx.navigation:navigation-compose", version.ref = "androidx-navigation" }
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "kotlinx-serialization" }

[plugins]
multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
compose = { id = "org.jetbrains.compose", version.ref = "compose-multiplatform" }
kotlinx-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
android-application = { id = "com.android.application", version.ref = "agp" }
```

공유 모듈의 `build.gradle.kts`에 추가 종속성을 추가하세요:

```kotlin
plugins {
    // ...
    alias(libs.plugins.kotlinx.serialization)
}

// ...

kotlin {
    // ...
    sourceSets {
        commonMain.dependencies {
            // ...
            implementation(libs.androidx.navigation.compose)
            implementation(libs.kotlinx.serialization.json)
        }
    }
}
```

## 운영 체제에 딥 링크 스키마 등록

각 운영 체제는 딥 링크를 처리하는 고유한 방식을 가지고 있습니다. 특정 대상에 대한 문서를 참조하는 것이 더 확실합니다:

*   Android 앱의 경우, 딥 링크 스키마는 `AndroidManifest.xml` 파일에 인텐트 필터로 선언됩니다. 인텐트 필터를 올바르게 설정하는 방법에 대해 알아보려면 [Android 문서](https://developer.android.com/training/app-links/deep-linking?hl=en#adding-filters)를 참조하세요.
*   iOS 및 macOS 앱의 경우, 딥 링크 스키마는 `Info.plist` 파일의 [CFBundleURLTypes](https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleurltypes) 키에 선언됩니다.

    > Compose Multiplatform은 macOS 앱의 `Info.plist`에 값을 추가하는 [Gradle DSL](compose-native-distribution.md#information-property-list-on-macos)을 제공합니다. iOS의 경우, KMP 프로젝트에서 파일을 직접 편집하거나 [Xcode GUI를 사용하여 스키마를 등록](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app#Register-your-URL-scheme)할 수 있습니다.
    >
    {style="note"}
*   Windows 앱의 경우, 딥 링크 스키마는 Windows 8 이하의 경우 [필요한 정보가 있는 키를 Windows 레지스트리에 추가](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa767914(v=vs.85))하거나 Windows 10 및 11의 경우 [패키지 매니페스트에 확장자를 지정](https://learn.microsoft.com/en-us/windows/apps/develop/launch/handle-uri-activation)하여 선언할 수 있습니다. 이는 설치 스크립트나 [Hydraulic Conveyor](https://conveyor.hydraulic.dev/)와 같은 타사 배포 패키지 생성기를 통해 수행할 수 있습니다. Compose Multiplatform은 프로젝트 내에서 이를 구성하는 것을 지원하지 않습니다.

    > [Windows에서 예약된 스키마](https://learn.microsoft.com/en-us/windows/apps/develop/launch/reserved-uri-scheme-names#reserved-uri-scheme-names) 중 하나를 사용하지 않는지 확인하세요.
    >
    {style="tip"}
*   Linux의 경우, 딥 링크 스키마는 배포판에 포함된 `.desktop` 파일에 등록할 수 있습니다.

## 목적지에 딥 링크 할당

탐색 그래프의 일부로 선언된 목적지는 해당 `NavDeepLink` 객체 목록을 포함할 수 있는 선택적 `deepLinks` 매개변수를 가집니다. 각 `NavDeepLink`는 목적지와 일치해야 하는 URI 패턴을 설명합니다. 동일한 화면으로 연결되어야 하는 여러 URI 패턴을 정의할 수 있습니다.

경로에 정의할 수 있는 딥 링크 수에는 제한이 없습니다.

### 딥 링크를 위한 일반 URI 패턴

일반 URI 패턴은 전체 URI와 일치해야 합니다. 플레이스홀더를 사용하여 수신된 URI에서 매개변수를 추출하여 목적지 내에서 사용할 수 있습니다.

일반 URI 패턴 규칙:

*   스키마가 없는 URI는 `http://` 또는 `https://`로 시작한다고 가정합니다. 따라서 `uriPattern = "example.com"`은 `http://example.com` 및 `https://example.com`과 일치합니다.
*   `{placeholder}`는 하나 이상의 문자와 일치합니다 (`example.com/name={name}`은 `https://example.com/name=Bob`과 일치). 0개 이상의 문자와 일치시키려면 `.*` 와일드카드(`example.com/name={.*}`은 `https://example.com/name=`과 `name`의 모든 값과 일치)를 사용하세요.
*   경로 플레이스홀더에 대한 매개변수는 필수이며, 쿼리 플레이스홀더는 선택 사항입니다. 예를 들어, 패턴 `example.com/users/{id}?arg1={arg1}&arg2={arg2}`는 다음과 같습니다:
    *   필수 경로 부분(`id`)이 없기 때문에 `http://www.example.com/users?arg1=one&arg2=two`와 일치하지 않습니다.
    *   `http://www.example.com/users/4?arg2=two`와 `http://www.example.com/users/4?arg1=one` 모두와 일치합니다.
    *   `http://www.example.com/users/4?other=random`과도 일치합니다. 왜냐하면 불필요한 쿼리 매개변수는 일치에 영향을 미치지 않기 때문입니다.
*   여러 컴포저블이 수신된 URI와 일치하는 `navDeepLink`를 가지고 있다면 동작은 불확실합니다. 딥 링크 패턴이 서로 교차하지 않도록 하세요. 여러 컴포저블이 동일한 딥 링크 패턴을 처리해야 하는 경우, 경로 또는 쿼리 매개변수를 추가하거나, 중간 목적지를 사용하여 사용자를 예측 가능하게 라우팅하는 것을 고려하세요.

### 경로 타입에 대한 생성된 URI 패턴

URI 패턴을 완전히 작성하는 것을 피할 수 있습니다. 탐색 라이브러리는 경로의 매개변수를 기반으로 URI 패턴을 자동으로 생성할 수 있습니다.

이 접근 방식을 사용하려면 다음과 같이 딥 링크를 정의하세요:

```kotlin
composable<PlantDetail>(
    deepLinks = listOf(
        navDeepLink<PlantDetail>(basePath = "demo://example.com/plant")
    )
) { ... }
```

여기서 `PlantDetail`은 목적지에 사용하는 경로 타입이며, `basePath`의 "plant"는 `PlantDetail` 데이터 클래스의 직렬화 이름입니다.

URI 패턴의 나머지는 다음과 같이 생성됩니다:

*   필수 매개변수는 경로 매개변수로 추가됩니다 (예: `/{id}`)
*   기본값이 있는 매개변수 (선택적 매개변수)는 쿼리 매개변수로 추가됩니다 (예: `?name={name}`)
*   컬렉션은 쿼리 매개변수로 추가됩니다 (예: `?items={value1}&items={value2}`)
*   매개변수 순서는 경로 정의의 필드 순서와 일치합니다.

따라서 예를 들어, 이 경로 타입은 다음과 같습니다:

```kotlin
@Serializable data class PlantDetail(
  val id: String,
  val name: String,
  val colors: List<String>,
  val latinName: String? = null,
)
```

라이브러리에 의해 다음과 같은 생성된 URI 패턴을 가집니다:

```none
<basePath>/{id}/{name}/?colors={color1}&colors={color2}&latinName={latinName}
```

### 목적지에 딥 링크 추가 예시

이 예시에서는 목적지에 여러 딥 링크를 할당한 다음, 수신된 URI에서 매개변수 값을 추출합니다:

```kotlin
@Serializable @SerialName("dlscreen") data class DeepLinkScreen(val name: String)

// ...

val firstBasePath = "demo://example1.org"

NavHost(
    navController = navController,
    startDestination = FirstScreen
) {
    // ...
    
    composable<DeepLinkScreen>(
        deepLinks = listOf(
            // This composable should handle links both for demo://example1.org and demo://example2.org
            navDeepLink { uriPattern = "$firstBasePath?name={name}" },
            navDeepLink { uriPattern = "demo://example2.org/name={name}" },
            // The generated pattern only handles the parameters,
            // so we add the serial name for the route type
            navDeepLink<DeepLinkScreen>(basePath = "$firstBasePath/dlscreen"),
        )
    ) {
        // If the app receives the URI `demo://example1.org/dlscreen/Jane/`,
        // it matches the generated URI pattern (name is a required parameter and is given in the path),
        // and you can map it to the route type automatically
        val deeplink: DeepLinkScreen = backStackEntry.toRoute()
        val nameGenerated = deeplink.name
        
        // If the app receives a URI matching only a general pattern,
        // like `demo://example1.com/?name=Jane`
        // you need to parse the URI directly
        val nameGeneral = backStackEntry.arguments?.read { getStringOrNull("name") }
        
        // Composable content
    }
}
```

웹의 경우, 딥 링크는 약간 다르게 작동합니다. Compose Multiplatform for Web은 단일 페이지 앱을 만들기 때문에, 딥 링크 URI 패턴의 모든 매개변수를 URL 프래그먼트( `#` 문자 뒤)에 넣어야 하며, 모든 매개변수가 URL 인코딩되었는지 확인해야 합니다.

URL 프래그먼트가 URI 패턴 규칙을 준수하면 `backStackEntry.toRoute()` 메서드를 사용하여 매개변수를 파싱할 수 있습니다. 웹 앱에서 URL에 액세스하고 파싱하는 방법에 대한 자세한 내용과 브라우저 탐색에 대한 세부 사항은 [undefined](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps)를 참조하세요.

```kotlin
composable<DeepLinkScreen>(
        deepLinks = listOf(
            // For the default Compose Multiplatform setup, localhost:8080
            // is the local dev endpoint that runs with the wasmJsBrowserDevelopmentRun Gradle task
            navDeepLink { uriPattern = "localhost:8080/#dlscreen%2F{name}" },
        )
    ) { ... }
```

> 다른 단일 페이지 웹 앱과 마찬가지로, 웹에서 URL 프래그먼트를 사용하지 않을 수 있습니다. 이를 위해 웹 서버를 구성하여 적절한 요청을 앱으로 리디렉션하고 [탐색 경로와 브라우저 주소의 기본 매핑](compose-navigation-routing.md#full-url-customization)을 다시 작성해야 합니다.
>
{style="tip"}

## 수신된 딥 링크 처리

Android에서는 앱으로 전송된 딥 링크 URI가 딥 링크를 트리거한 `Intent`의 일부로 제공됩니다. 크로스 플랫폼 구현에는 딥 링크를 수신 대기하는 범용적인 방법이 필요합니다.

간단한 구현을 만들어 봅시다:

1.  외부 URI를 위한 리스너와 함께 URI를 저장하고 캐시하는 싱글톤을 공통 코드에 선언합니다.
2.  필요한 경우, 운영 체제에서 수신된 URI를 보내는 플랫폼별 호출을 구현합니다.
3.  메인 컴포저블에서 새 딥 링크에 대한 리스너를 설정합니다.

### URI 리스너를 사용하여 싱글톤 선언

`commonMain`에 최상위 싱글톤 객체를 선언합니다:

```kotlin
object ExternalUriHandler {
    // Storage for when a URI arrives before the listener is set up
    private var cached: String? = null
    
    var listener: ((uri: String) -> Unit)? = null
        set(value) {
            field = value
            if (value != null) {
                // When a listener is set and `cached` is not empty,
                // immediately invoke the listener with the cached URI
                cached?.let { value.invoke(it) }
                cached = null
            }
        }

    // When a new URI arrives, cache it.
    // If the listener is already set, invoke it and clear the cache immediately.
    fun onNewUri(uri: String) {
        cached = uri
        listener?.let {
            it.invoke(uri)
            cached = null
        }
    }
}
```

### 싱글톤에 플랫폼별 호출 구현

데스크톱 JVM과 iOS 모두 시스템으로부터 수신된 URI를 명시적으로 전달해야 합니다.

`jvmMain/.../main.kt`에서 필요한 모든 운영 체제에 대한 명령줄 인수를 파싱하고 수신된 URI를 싱글톤에 전달합니다:

```kotlin
// Import the singleton
import org.company.app.ExternalUriHandler

fun main() {
    if(System.getProperty("os.name").indexOf("Mac") > -1) {
        Desktop.getDesktop().setOpenURIHandler { uri ->
            ExternalUriHandler.onNewUri(uri.uri.toString())
        }
    }
    else {
        ExternalUriHandler.onNewUri(args.getOrNull(0).toString())
    }

    application {
         // ...
    }
}
```

iOS의 경우, Swift 코드에 들어오는 URI를 처리하는 `application()` 변형을 추가합니다:

```swift
// Imports the KMP module to access the singleton
import ComposeApp

func application(
    _ application: UIApplication,
    open uri: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
) -> Bool {
    // Sends the full URI on to the singleton
    ExternalUriHandler.shared.onNewUri(uri: uri.absoluteString)    
        return true
    }
```

> Swift에서 싱글톤에 접근하기 위한 명명 규칙은 [Kotlin/Native 문서](https://kotlinlang.org/docs/native-objc-interop.html#kotlin-singletons)를 참조하세요.
>
{style="tip"}

### 리스너 설정

`DisposableEffect(Unit)`를 사용하여 리스너를 설정하고 컴포저블이 더 이상 활성화되지 않을 때 정리할 수 있습니다. 예를 들어:

```kotlin
internal fun App(navController: NavHostController = rememberNavController()) = AppTheme {

    // The effect is produced only once, as `Unit` never changes
    DisposableEffect(Unit) {
        // Sets up the listener to call `NavController.navigate()`
        // for the composable that has a matching `navDeepLink` listed
        ExternalUriHandler.listener = { uri ->
            navController.navigate(NavUri(uri))
        }
        // Removes the listener when the composable is no longer active
        onDispose {
            ExternalUriHandler.listener = null
        }
    }

    // Reusing the example from earlier in this article
    NavHost(
        navController = navController,
        startDestination = FirstScreen
    ) {
        // ...

        composable<DeepLinkScreen>(
            deepLinks = listOf(
                navDeepLink { uriPattern = "$firstBasePath?name={name}" },
                navDeepLink { uriPattern = "demo://example2.com/name={name}" },
            )
        ) {
            // Composable content
        }
    }
}
```

## 결과

이제 전체 워크플로를 확인할 수 있습니다: 사용자가 `demo://` URI를 열면 운영 체제가 이를 등록된 스키마와 일치시킵니다. 그러면:
*   딥 링크를 처리하는 앱이 닫혀 있는 경우, 싱글톤이 URI를 수신하여 캐시합니다. 메인 컴포저블 함수가 시작될 때, 싱글톤을 호출하고 캐시된 URI와 일치하는 딥 링크로 이동합니다.
*   딥 링크를 처리하는 앱이 열려 있는 경우, 리스너가 이미 설정되어 있으므로 싱글톤이 URI를 수신하면 앱이 즉시 해당 URI로 이동합니다.