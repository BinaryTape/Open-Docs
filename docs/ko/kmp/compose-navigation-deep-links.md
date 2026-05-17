[//]: # (title: 딥 링크 (Deep links))

딥 링크(Deep linking)는 운영 체제가 사용자 지정 링크를 처리하여 사용자를 해당 앱의 특정 데스티네이션(destination)으로 이동시킬 수 있도록 하는 내비게이션 메커니즘입니다.

딥 링크는 앱 링크(Android에서의 명칭) 또는 유니버설 링크(iOS에서의 명칭)의 보다 일반적인 형태입니다. 이들은 앱과 특정 웹 주소 간의 검증된 연결입니다. 이에 대해 구체적으로 알아보려면 [Android 앱 링크(App Links)](https://developer.android.com/training/app-links) 및 [iOS 유니버설 링크(Universal links)](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content/) 문서를 참조하세요.

딥 링크는 예를 들어 OAuth 인증과 같이 앱 외부 입력을 받는 데에도 유용합니다. 사용자를 시각적으로 이동시킬 필요 없이 딥 링크를 파싱하여 OAuth 토큰을 가져올 수 있습니다.

> 외부 입력은 악의적일 수 있으므로, [보안 가이드라인](https://developer.android.com/privacy-and-security/risks/unsafe-use-of-deeplinks)을 따라 원시(raw) 딥 링크 URI 처리와 관련된 위험을 적절히 완화해야 합니다.
> 
{style="warning"}

Compose Multiplatform에서 딥 링크를 구현하려면 다음 단계를 따르세요:

1. [앱 구성에 딥 링크 스키마 등록](#register-deep-links-schemas-in-the-operating-system)
2. [내비게이션 그래프의 데스티네이션에 특정 딥 링크 할당](#assign-deep-links-to-destinations)
3. [앱에서 수신한 딥 링크 처리](#handle-received-deep-links)

## 설정 (Setup)

Compose Multiplatform에서 딥 링크를 사용하려면 다음과 같이 의존성을 설정하세요.

Gradle 카탈로그(`libs.versions.toml`)에 다음 버전, 라이브러리 및 플러그인을 나열합니다:

```ini
[versions]
compose-multiplatform = "%org.jetbrains.compose%"
agp = "8.9.0"

# 딥 링크를 지원하는 멀티플랫폼 Navigation 라이브러리 버전
androidx-navigation = "%org.jetbrains.androidx.navigation%"

# Compose Multiplatform 1.8.0과 함께 사용할 최소 Kotlin 버전
kotlin = "2.1.0"

# 타입 안전한 루트(route)를 구현하는 데 필요한 Serialization 라이브러리
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

공유 모듈(shared module)의 `build.gradle.kts`에 추가 의존성을 추가합니다:

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

각 운영 체제마다 딥 링크를 처리하는 고유한 방식이 있습니다. 특정 타겟 플랫폼의 문서를 참조하는 것이 가장 확실합니다:

* Android 앱의 경우, 딥 링크 스키마는 `AndroidManifest.xml` 파일에 인텐트 필터(intent filter)로 선언됩니다. 인텐트 필터를 올바르게 설정하는 방법은 [Android 문서](https://developer.android.com/training/app-links/deep-linking?hl=en#adding-filters)를 참조하세요.
* iOS 및 macOS 앱의 경우, 딥 링크 스키마는 `Info.plist` 파일의 [CFBundleURLTypes](https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleurltypes) 키에 선언됩니다.

    > Compose Multiplatform은 macOS 앱의 `Info.plist`에 값을 추가할 수 있는 [Gradle DSL을 제공](compose-native-distribution.md#information-property-list-on-macos)합니다. iOS의 경우 KMP 프로젝트에서 파일을 직접 편집하거나 [Xcode GUI를 사용하여 스키마를 등록](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app#Register-your-URL-scheme)할 수 있습니다.
    >
    {style="note"}
* Windows 앱의 경우, [Windows 레지스트리에 필요한 정보가 포함된 키를 추가](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa767914(v=vs.85))하거나(Windows 8 및 이전 버전), [패키지 매니페스트에 확장을 지정](https://learn.microsoft.com/en-us/windows/apps/develop/launch/handle-uri-activation)하여(Windows 10 및 11) 딥 링크 스키마를 선언할 수 있습니다. 이는 설치 스크립트나 [Hydraulic Conveyor](https://conveyor.hydraulic.dev/)와 같은 서드파티 배포 패키지 생성기를 통해 수행할 수 있습니다. Compose Multiplatform은 프로젝트 내에서 직접 이 설정을 구성하는 것을 지원하지 않습니다.
    
    > [Windows에서 예약된 스키마](https://learn.microsoft.com/en-us/windows/apps/develop/launch/reserved-uri-scheme-names#reserved-uri-scheme-names)를 사용하고 있지 않은지 확인하세요.
    >
    {style="tip"}
* Linux의 경우, 배포판에 포함된 `.desktop` 파일에 딥 링크 스키마를 등록할 수 있습니다.

## 데스티네이션에 딥 링크 할당

내비게이션 그래프의 일부로 선언된 데스티네이션은 선택적으로 `deepLinks` 매개변수를 가질 수 있으며, 여기에는 해당되는 `NavDeepLink` 객체 목록이 포함될 수 있습니다. 각 `NavDeepLink`는 데스티네이션과 일치해야 하는 URI 패턴을 기술합니다. 동일한 화면으로 연결되는 여러 URI 패턴을 정의할 수 있습니다.

루트(route)에 대해 정의할 수 있는 딥 링크 수에는 제한이 없습니다.

### 일반적인 딥 링크용 URI 패턴

일반적인 URI 패턴은 전체 URI와 일치해야 합니다. 플레이스홀더(placeholder)를 매개변수로 사용하여 데스티네이션 내에서 수신된 URI로부터 값을 추출할 수 있습니다.

일반 URI 패턴의 규칙:

* 스키마가 없는 URI는 `http://` 또는 `https://`로 시작하는 것으로 간주됩니다. 따라서 `uriPattern = "example.com"`은 `http://example.com` 및 `https://example.com`과 일치합니다.
* `{placeholder}`는 하나 이상의 문자와 일치합니다 (`example.com/name={name}`은 `https://example.com/name=Bob`과 일치). 0개 이상의 문자와 일치시키려면 `.*` 와일드카드를 사용하세요 (`example.com/name={.*}`은 `https://example.com/name=` 뿐만 아니라 `name`의 모든 값과 일치함).
* 경로 플레이스홀더(path placeholders)를 위한 매개변수는 필수인 반면, 쿼리 플레이스홀더(query placeholders) 매칭은 선택 사항입니다. 예를 들어, `example.com/users/{id}?arg1={arg1}&arg2={arg2}` 패턴의 경우:
    * `http://www.example.com/users?arg1=one&arg2=two`와는 일치하지 않습니다. 경로의 필수 부분인 `id`가 누락되었기 때문입니다.
    * `http://www.example.com/users/4?arg2=two` 및 `http://www.example.com/users/4?arg1=one` 모두와 일치합니다.
    * 또한 `http://www.example.com/users/4?other=random`과도 일치합니다. 관련 없는 쿼리 매개변수는 매칭에 영향을 주지 않기 때문입니다.
* 여러 컴포저블(composable)이 수신된 URI와 일치하는 `navDeepLink`를 가지고 있는 경우, 동작은 정해져 있지 않습니다. 딥 링크 패턴이 서로 겹치지 않도록 주의하세요. 여러 컴포저블이 동일한 딥 링크 패턴을 처리해야 하는 경우, 경로 또는 쿼리 매개변수를 추가하거나 중간 데스티네이션을 사용하여 사용자를 예측 가능하게 라우팅하는 것을 고려하세요.

### 루트 타입에 대한 생성된 URI 패턴

URI 패턴을 완전히 직접 작성하는 것을 피할 수 있습니다. Navigation 라이브러리는 루트의 매개변수를 기반으로 URI 패턴을 자동으로 생성할 수 있습니다.

이 접근 방식을 사용하려면 다음과 같이 딥 링크를 정의하세요:

```kotlin
composable<PlantDetail>(
    deepLinks = listOf(
        navDeepLink<PlantDetail>(basePath = "demo://example.com/plant")
    )
) { ... }
```

여기서 `PlantDetail`은 데스티네이션에 사용 중인 루트 타입이고, `basePath`의 "plant"는 `PlantDetail` 데이터 클래스의 직렬화 이름(serial name)입니다.

나머지 URI 패턴은 다음과 같이 생성됩니다:

* 필수 매개변수는 경로 매개변수로 추가됩니다 (예: `/{id}`)
* 기본값이 있는 매개변수(선택적 매개변수)는 쿼리 매개변수로 추가됩니다 (예: `?name={name}`)
* 컬렉션은 쿼리 매개변수로 추가됩니다 (예: `?items={value1}&items={value2}`)
* 매개변수의 순서는 루트 정의에 있는 필드의 순서와 일치합니다.

예를 들어, 다음과 같은 루트 타입이 있다고 가정해 보겠습니다:

```kotlin
@Serializable data class PlantDetail(
  val id: String,
  val name: String,
  val colors: List<String>,
  val latinName: String? = null,
)
```

라이브러리에 의해 생성되는 URI 패턴은 다음과 같습니다:

```none
<basePath>/{id}/{name}/?colors={color1}&colors={color2}&latinName={latinName}
```

### 데스티네이션에 딥 링크를 추가하는 예제

이 예제에서는 데스티네이션에 여러 딥 링크를 할당한 다음, 수신된 URI에서 매개변수 값을 추출합니다:

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
            // 이 컴포저블은 demo://example1.org 및 demo://example2.org에 대한 링크를 모두 처리해야 함
            navDeepLink { uriPattern = "$firstBasePath?name={name}" },
            navDeepLink { uriPattern = "demo://example2.org/name={name}" },
            // 생성된 패턴은 매개변수만 처리하므로,
            // 루트 타입에 대한 직렬화 이름을 추가함
            navDeepLink<DeepLinkScreen>(basePath = "$firstBasePath/dlscreen"),
        )
    ) {
        // 앱이 `demo://example1.org/dlscreen/Jane/` URI를 수신하면,
        // 생성된 URI 패턴과 일치하며 (name은 필수 매개변수이고 경로에 제공됨),
        // 자동으로 루트 타입으로 매핑할 수 있음
        val deeplink: DeepLinkScreen = backStackEntry.toRoute()
        val nameGenerated = deeplink.name
        
        // 앱이 `demo://example1.com/?name=Jane`과 같이 일반 패턴에만 일치하는
        // URI를 수신하는 경우, URI를 직접 파싱해야 함
        val nameGeneral = backStackEntry.arguments?.read { getStringOrNull("name") }
        
        // 컴포저블 콘텐츠
    }
}
```

웹의 경우 딥 링크는 약간 다르게 작동합니다. Compose Multiplatform for Web은 싱글 페이지 앱(Single-page apps)을 만들기 때문에, 딥 링크 URI 패턴의 모든 매개변수를 URL 프래그먼트(`#` 문자 이후)에 넣어야 하며 모든 매개변수가 URL 인코딩되었는지 확인해야 합니다.

URL 프래그먼트가 URI 패턴 규칙을 준수한다면 여전히 `backStackEntry.toRoute()` 메서드를 사용하여 매개변수를 파싱할 수 있습니다. 웹 앱에서 URL에 액세스하고 파싱하는 방법과 브라우저 내비게이션의 세부 사항에 대해서는 [웹 앱에서의 브라우저 내비게이션 지원](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps)을 참조하세요.

```kotlin
composable<DeepLinkScreen>(
        deepLinks = listOf(
            // 기본 Compose Multiplatform 설정의 경우, localhost:8080은
            // wasmJsBrowserDevelopmentRun Gradle 태스크로 실행되는 로컬 개발 엔드포인트임
            navDeepLink { uriPattern = "localhost:8080/#dlscreen%2F{name}" },
        )
    ) { ... }
```

> 다른 싱글 페이지 웹 앱과 마찬가지로, 웹에서 URL 프래그먼트 사용을 피할 수 있습니다. 그렇게 하려면 웹 서버가 적절한 요청을 앱으로 리다이렉션하도록 구성하고, [브라우저 주소에 대한 내비게이션 루트의 기본 매핑](compose-navigation-routing.md#full-url-customization)을 재작성해야 합니다.
>
{style="tip"}

## 수신된 딥 링크 처리

Android에서 앱으로 전송된 딥 링크 URI는 딥 링크를 트리거한 `Intent`의 일부로 사용할 수 있습니다. 크로스 플랫폼 구현에서는 딥 링크를 수신 대기하는 범용적인 방법이 필요합니다.

간단한 구현을 만들어 보겠습니다:

1. 외부 URI를 수신 대기하고 URI를 저장 및 캐싱하기 위한 싱글톤(singleton)을 공통 코드에 선언합니다.
2. 필요한 경우 운영 체제로부터 수신한 URI를 전달하는 플랫폼별 호출을 구현합니다.
3. 메인 컴포저블에서 새로운 딥 링크에 대한 리스너를 설정합니다.

### URI 리스너를 포함한 싱글톤 선언

`commonMain`의 최상위 레벨에 싱글톤 객체를 선언합니다:

```kotlin
object ExternalUriHandler {
    // 리스너가 설정되기 전에 URI가 도착할 경우를 위한 저장소
    private var cached: String? = null
    
    var listener: ((uri: String) -> Unit)? = null
        set(value) {
            field = value
            if (value != null) {
                // 리스너가 설정되었고 `cached`가 비어 있지 않으면,
                // 즉시 캐싱된 URI로 리스너를 호출함
                cached?.let { value.invoke(it) }
                cached = null
            }
        }

    // 새로운 URI가 도착하면 캐싱함.
    // 리스너가 이미 설정되어 있다면, 즉시 리스너를 호출하고 캐시를 비움.
    fun onNewUri(uri: String) {
        cached = uri
        listener?.let {
            it.invoke(uri)
            cached = null
        }
    }
}
```

### 싱글톤에 대한 플랫폼별 호출 구현

데스크톱 JVM과 iOS 모두 시스템으로부터 수신된 URI를 명시적으로 전달해야 합니다.

`jvmMain/.../main.kt`에서 필요한 모든 운영 체제에 대해 명령줄 인수를 파싱하고 수신된 URI를 싱글톤으로 전달합니다:

```kotlin
// 싱글톤 임포트
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

iOS의 경우, Swift 코드에서 들어오는 URI를 처리하는 `application()` 변형을 추가합니다:

```swift
// 싱글톤에 액세스하기 위해 KMP 모듈을 임포트
import SharedUI

func application(
    _ application: UIApplication,
    open uri: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
) -> Bool {
    // 전체 URI를 싱글톤으로 전달
    ExternalUriHandler.shared.onNewUri(uri: uri.absoluteString)    
        return true
    }
```

> Swift에서 싱글톤에 액세스하기 위한 명명 규칙에 대해서는 [Kotlin/Native 문서](https://kotlinlang.org/docs/native-objc-interop.html#kotlin-singletons)를 참조하세요.
> 
{style="tip"}

### 리스너 설정

`DisposableEffect(Unit)`을 사용하여 리스너를 설정하고 컴포저블이 더 이상 활성 상태가 아닐 때 리스너를 정리할 수 있습니다. 예를 들어:

```kotlin
internal fun App(navController: NavHostController = rememberNavController()) = AppTheme {

    // `Unit`은 변경되지 않으므로 이 이펙트는 한 번만 생성됨
    DisposableEffect(Unit) {
        // 일치하는 `navDeepLink`가 나열된 컴포저블에 대해
        // `NavController.navigate()`를 호출하도록 리스너를 설정함
        ExternalUriHandler.listener = { uri ->
            navController.navigate(NavUri(uri))
        }
        // 컴포저블이 더 이상 활성 상태가 아닐 때 리스너를 제거함
        onDispose {
            ExternalUriHandler.listener = null
        }
    }

    // 이 문서의 앞부분 예제 재사용
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
            // 컴포저블 콘텐츠
        }
    }
}
```

## 결과

이제 전체 워크플로우를 확인할 수 있습니다:
사용자가 `demo://` URI를 열면 운영 체제는 이를 등록된 스키마와 일치시킵니다. 그런 다음:
  * 딥 링크를 처리하는 앱이 닫혀 있는 경우, 싱글톤이 URI를 수신하고 캐싱합니다. 메인 컴포저블 함수가 시작되면 싱글톤을 호출하고 캐싱된 URI와 일치하는 딥 링크로 이동합니다.
  * 딥 링크를 처리하는 앱이 열려 있는 경우, 리스너가 이미 설정되어 있으므로 싱글톤이 URI를 수신할 때 앱이 즉시 해당 링크로 이동합니다.

## 다음 단계

Compose Multiplatform 내비게이션 라이브러리가 실제로 작동하는 모습을 보여주는 다음 프로젝트들을 확인해 보세요:

* 기본 예제: [Navigate between screens with Compose](https://developer.android.com/codelabs/basic-android-kotlin-compose-navigation#0) Android 코드랩에서 변환된 [nav_cupcake 프로젝트](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/nav_cupcake).
* 심화 예제: 공식 [KotlinConf](https://github.com/JetBrains/kotlinconf-app) 애플리케이션.