[//]: # (title: 앱에서 멀티플랫폼 리소스 사용하기)

<show-structure depth="2"/>

[프로젝트에 리소스를 설정](compose-multiplatform-resources-setup.md)하면, 리소스에 접근할 수 있는 특별한 `Res` 클래스를 생성하기 위해 프로젝트를 빌드합니다. `Res` 클래스와 모든 리소스 접근자를 재생성하려면 프로젝트를 다시 빌드하거나 IDE에서 프로젝트를 다시 임포트하세요.

그 후, 생성된 클래스를 사용하여 코드 또는 외부 라이브러리에서 구성된 멀티플랫폼 리소스에 접근할 수 있습니다.

## 생성된 클래스 임포트하기

준비된 리소스를 사용하려면 생성된 클래스를 임포트합니다. 예를 들면 다음과 같습니다:

```kotlin
import project.composeapp.generated.resources.Res
import project.composeapp.generated.resources.example_image
```

여기서:
* `project`는 프로젝트 이름입니다.
* `composeapp`은 리소스 디렉터리를 배치한 모듈입니다.
* `Res`는 생성된 클래스의 기본 이름입니다.
* `example_image`는 `composeResources/drawable` 디렉터리에 있는 이미지 파일의 이름입니다(예: `example_image.png`).

## 접근자 클래스 생성 사용자 지정

Gradle 설정을 사용하여 필요에 맞게 생성된 `Res` 클래스를 사용자 지정할 수 있습니다.

`build.gradle.kts` 파일의 `compose.resources {}` 블록에서 프로젝트의 `Res` 클래스 생성 방식에 영향을 미치는 여러 설정을 지정할 수 있습니다.
다음은 구성 예시입니다:

```kotlin
compose.resources {
    publicResClass = false
    packageOfResClass = "me.sample.library.resources"
    generateResClass = auto
}
```

* `publicResClass`를 `true`로 설정하면 생성된 `Res` 클래스가 public이 됩니다. 기본적으로 생성된 클래스는 [internal](https://kotlinlang.org/docs/visibility-modifiers.html)(내부)입니다.
* `packageOfResClass`를 사용하면 생성된 `Res` 클래스를 특정 패키지에 할당할 수 있습니다 (코드 내 접근 및 최종 아티팩트 내 격리를 위해). 기본적으로 Compose Multiplatform은 `{group name}.{module name}.generated.resources` 패키지를 클래스에 할당합니다.
* `generateResClass`를 `always`로 설정하면 프로젝트가 무조건 `Res` 클래스를 생성합니다. 이는 리소스 라이브러리가 전이적으로만 사용 가능할 때 유용할 수 있습니다. 기본적으로 Compose Multiplatform은 `auto` 값을 사용하여 현재 프로젝트에 리소스 라이브러리에 대한 명시적인 `implementation` 또는 `api` 종속성이 있는 경우에만 `Res` 클래스를 생성합니다.

## 리소스 사용

### 이미지

드로어블 리소스는 간단한 이미지, 래스터화된 이미지 또는 XML 벡터로 접근할 수 있습니다.
SVG 이미지는 Android를 **제외한** 모든 플랫폼에서 지원됩니다.

* 드로어블 리소스를 `Painter` 이미지로 접근하려면 `painterResource()` 함수를 사용하세요:

  ```kotlin
  @Composable
  fun painterResource(resource: DrawableResource): Painter {...}
  ```

  `painterResource()` 함수는 리소스 경로를 취하고 `Painter` 값을 반환합니다. 이 함수는 웹을 제외한 모든 타겟에서 동기적으로 작동합니다. 웹 타겟의 경우, 첫 번째 리컴포지션에서는 빈 `Painter`를 반환하며, 이후의 리컴포지션에서 로드된 이미지로 대체됩니다.

  * `painterResource()`는 `.png`, `.jpg`, `.bmp`, `.webp`와 같은 래스터화된 이미지 형식의 경우 `BitmapPainter`를 로드하거나, Android XML 벡터 드로어블 형식의 경우 `VectorPainter`를 로드합니다.
  * XML 벡터 드로어블은 [Android](https://developer.android.com/reference/android/graphics/drawable/VectorDrawable)와 동일한 형식을 가지지만, Android 리소스에 대한 외부 참조는 지원하지 않습니다.

* 드로어블 리소스를 `ImageBitmap` 래스터화된 이미지로 접근하려면 `imageResource()` 함수를 사용하세요:

  ```kotlin
  @Composable
  fun imageResource(resource: DrawableResource): ImageBitmap {...}
  ```

* 드로어블 리소스를 `ImageVector` XML 벡터로 접근하려면 `vectorResource()` 함수를 사용하세요:

  ```kotlin
  @Composable
  fun vectorResource(resource: DrawableResource): ImageVector {...}
  ```

다음은 Compose Multiplatform 코드에서 이미지에 접근하는 방법의 예시입니다:

```kotlin
Image(
    painter = painterResource(Res.drawable.my_image),
    contentDescription = null
)
```

### 아이콘

Material Symbols 라이브러리에서 벡터 Android XML 아이콘을 사용할 수 있습니다:

1.  [Google Fonts Icons](https://fonts.google.com/icons) 갤러리를 열고 아이콘을 선택한 다음, Android 탭으로 이동하여 **다운로드**를 클릭하세요.

2.  다운로드한 XML 아이콘 파일을 멀티플랫폼 리소스의 `drawable` 디렉터리에 추가하세요.

3.  XML 아이콘 파일을 열고 `android:fillColor`를 `#000000`으로 설정하세요.
    `android:tint`와 같은 다른 Android 특정 색상 조정 속성은 제거하세요.

    Before:

    ```xml
    <vector xmlns:android="http://schemas.android.com/apk/res/android"
         android:width="24dp"
         android:height="24dp"
         android:viewportWidth="960"
         android:viewportHeight="960"
         android:tint="?attr/colorControlNormal">
         <path
             android:fillColor="@android:color/white"
             android:pathData="..."/>
     </vector>
    ```

    After:

    ```xml
    <vector xmlns:android="http://schemas.android.com/apk/res/android"
         android:width="24dp"
         android:height="24dp"
         android:viewportWidth="960"
         android:viewportHeight="960">
         <path
            android:fillColor="#000000"
            android:pathData="..."/>
    </vector>
    ```

4.  프로젝트를 빌드하여 리소스 접근자를 생성하거나, [Kotlin Multiplatform 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)이 자동으로 처리하도록 하세요.

다음은 Compose Multiplatform 코드에서 `colorFilter` 매개변수를 사용하여 아이콘에 접근하고 색상을 조정하는 방법의 예시입니다:

```kotlin
Image(
    painter = painterResource(Res.drawable.ic_sample_icon),
    contentDescription = "Sample icon",
    modifier = Modifier.size(24.dp),
    colorFilter = ColorFilter.tint(Color.Blue)
)
```

### 문자열

모든 문자열 리소스를 `composeResources/values` 디렉터리의 XML 파일에 저장하세요.
각 파일의 각 항목에 대해 정적 접근자가 생성됩니다.

다른 로케일에 대한 문자열을 지역화하는 방법에 대한 자세한 내용은 [문자열 지역화 가이드](compose-localize-strings.md)를 참조하세요.

#### 단순 문자열

단순 문자열을 저장하려면 XML에 `<string>` 요소를 추가하세요:

```XML
<resources>
    <string name="app_name">My awesome app</string>
    <string name="title">Some title</string>
</resources>
```

문자열 리소스를 `String`으로 가져오려면 다음 코드를 사용하세요:

<Tabs>
<TabItem title= "컴포저블 코드에서">

```kotlin
@Composable
fun stringResource(resource: StringResource): String {...}

@Composable
fun stringResource(resource: StringResource, vararg formatArgs: Any): String {...}
```

예를 들어:

```kotlin
Text(stringResource(Res.string.app_name))
```

</TabItem>
<TabItem title= "비컴포저블 코드에서">

```kotlin
suspend fun getString(resource: StringResource): String

suspend fun getString(resource: StringResource, vararg formatArgs: Any): String
```

예를 들어:

```kotlin
coroutineScope.launch {
    val appName = getString(Res.string.app_name)
}
```

</TabItem>
</Tabs>

문자열 리소스에 특수 기호를 사용할 수 있습니다:

* `
` – 새 줄
* `\t` – 탭 기호
* `\uXXXX` – 특정 유니코드 문자

Android 문자열에서처럼 "@" 또는 "?"와 같은 특수 XML 문자를 이스케이프할 필요가 없습니다.

#### 문자열 템플릿

현재 인수는 문자열 리소스에 대한 기본 지원을 제공합니다.
템플릿을 생성할 때, `%<number>` 형식을 사용하여 문자열 내에 인수를 배치하고 `$d` 또는 `$s` 접미사를 포함하여 변수 플레이스홀더이며 단순 텍스트가 아님을 나타내세요.
예를 들면:

```XML
<resources>
    <string name="str_template">Hello, %2$s! You have %1$d new messages.</string>
</resources>
```

문자열 템플릿 리소스를 생성하고 임포트한 후, 플레이스홀더에 대한 인수를 올바른 순서로 전달하면서 참조할 수 있습니다:

```kotlin
Text(stringResource(Res.string.str_template, 100, "User_name"))
```

`$s`와 `$d` 접미사 사이에는 차이가 없으며 다른 접미사는 지원되지 않습니다.
리소스 문자열에 `%1$s` 플레이스홀더를 넣고 이를 사용하여 예를 들어 소수점을 표시할 수 있습니다:

```kotlin
Text(stringResource(Res.string.str_template, "User_name", 100.1f))
```

#### 문자열 배열

관련 문자열을 배열로 그룹화하고 `List<String>` 객체로 자동 접근할 수 있습니다:

```XML
<resources>
    <string name="app_name">My awesome app</string>
    <string name="title">Some title</string>
    <string-array name="str_arr">
        <item>item \u2605</item>
        <item>item \u2318</item>
        <item>item \u00BD</item>
    </string-array>
</resources>
```

해당 목록을 얻으려면 다음 코드를 사용하세요:

<Tabs>
<TabItem title= "컴포저블 코드에서">

```kotlin
@Composable
fun stringArrayResource(resource: StringArrayResource): List<String> {...}
```

예를 들어:

```kotlin
val arr = stringArrayResource(Res.array.str_arr)
if (arr.isNotEmpty()) Text(arr[0])
```

</TabItem>
<TabItem title= "비컴포저블 코드에서">

```kotlin
suspend fun getStringArray(resource: StringArrayResource): List<String>
```

예를 들어:

```kotlin
coroutineScope.launch {
    val appName = getStringArray(Res.array.str_arr)
}
```

</TabItem>
</Tabs>

#### 복수형

UI가 어떤 것의 수량을 표시할 때, 동일한 것의 다른 수(하나의 _책_, 많은 _책_ 등)에 대한 문법적 일치를 프로그램적으로 관련 없는 문자열을 만들지 않고 지원하고 싶을 수 있습니다.

Compose Multiplatform의 개념과 기본 구현은 Android의 수량 문자열과 동일합니다.
프로젝트에서 복수형을 사용하는 모범 사례 및 뉘앙스에 대한 자세한 내용은 [Android 문서](https://developer.android.com/guide/topics/resources/string-resource#Plurals)를 참조하세요.

* 지원되는 변형은 `zero`, `one`, `two`, `few`, `many`, `other`입니다. 모든 언어에서 모든 변형이 고려되는 것은 아닙니다. 예를 들어, 영어에서는 `zero`가 1을 제외한 다른 복수형과 같기 때문에 무시됩니다. 언어가 실제로 주장하는 구별을 알기 위해 언어 전문가에게 의존하세요.
* 수량 문자열을 피하기 위해 "Books: 1"과 같이 수량 중립적인 표현을 사용하는 것이 종종 가능합니다. 이것이 사용자 경험을 악화시키지 않는다면,

복수형을 정의하려면 `composeResources/values` 디렉터리의 모든 `.xml` 파일에 `<plurals>` 요소를 추가하세요.
`plurals` 컬렉션은 name 속성을 사용하여 참조되는 단순 리소스입니다 (XML 파일의 이름이 아님).
따라서 `plurals` 리소스를 `<resources>` 요소 아래의 하나의 XML 파일에 다른 단순 리소스와 결합할 수 있습니다:

```xml
<resources>
    <string name="app_name">My awesome app</string>
    <string name="title">Some title</string>
    <plurals name="new_message">
        <item quantity="one">%1$d new message</item>
        <item quantity="other">%1$d new messages</item>
    </plurals>
</resources>
```

복수형을 `String`으로 접근하려면 다음 코드를 사용하세요:

<Tabs>
<TabItem title= "컴포저블 코드에서">

```kotlin
@Composable
fun pluralStringResource(resource: PluralStringResource, quantity: Int): String {...}

@Composable
fun pluralStringResource(resource: PluralStringResource, quantity: Int, vararg formatArgs: Any): String {...}
```

예를 들어:

```kotlin
Text(pluralStringResource(Res.plurals.new_message, 1, 1))
```

</TabItem>
<TabItem title= "비컴포저블 코드에서">

```kotlin
suspend fun getPluralString(resource: PluralStringResource, quantity: Int): String

suspend fun getPluralString(resource: PluralStringResource, quantity: Int, vararg formatArgs: Any): String
```

예를 들어:

```kotlin
coroutineScope.launch {
    val appName = getPluralString(Res.plurals.new_message, 1, 1)
}
```

</TabItem>
</Tabs>

### 글꼴

사용자 지정 글꼴은 `composeResources/font` 디렉터리에 `*.ttf` 또는 `*.otf` 파일로 저장하세요.

글꼴을 `Font` 타입으로 로드하려면 `Font()` 컴포저블 함수를 사용하세요:

```kotlin
@Composable
fun Font(
    resource: FontResource,
    weight: FontWeight = FontWeight.Normal,
    style: FontStyle = FontStyle.Normal
): Font
```

예를 들어:

```kotlin
@Composable
private fun InterTypography(): Typography {
    val interFont = FontFamily(
        Font(Res.font.Inter_24pt_Regular, FontWeight.Normal),
        Font(Res.font.Inter_24pt_SemiBold, FontWeight.Bold),
    )

    return with(MaterialTheme.typography) {
        copy(
            displayLarge = displayLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            displayMedium = displayMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            displaySmall = displaySmall.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            headlineLarge = headlineLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            headlineMedium = headlineMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            headlineSmall = headlineSmall.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            titleLarge = titleLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            titleMedium = titleMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            titleSmall = titleSmall.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            labelLarge = labelLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            labelMedium = labelMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            labelSmall = labelSmall.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            bodyLarge = bodyLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            bodyMedium = bodyMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            bodySmall = bodySmall.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
        )
    }
}
```

{initial-collapse-state="collapsed" collapsible="true" collapsed-title="@Composable private fun InterTypography(): Typography { val interFont = FontFamily("}

> `Font`가 컴포저블일 때, `TextStyle` 및 `Typography`와 같은 종속 컴포넌트도 컴포저블인지 확인하세요.
>
{style="note"}

웹 타겟에서 이모티콘이나 아랍어 스크립트와 같은 특수 문자를 지원하려면 해당 글꼴을 리소스에 추가하고 [Compose Multiplatform 사전 로드 API를 사용하여 리소스 사전 로드](#preload-resources-using-the-compose-multiplatform-preload-api)해야 합니다.

### 원시 파일

모든 원시 파일을 바이트 배열로 로드하려면 `Res.readBytes(path)` 함수를 사용하세요:

```kotlin
suspend fun readBytes(path: String): ByteArray
```

원시 파일을 `composeResources/files` 디렉터리에 배치하고 그 안에 어떤 계층 구조라도 만들 수 있습니다.

예를 들어, 원시 파일에 접근하려면 다음 코드를 사용하세요:

<Tabs>
<TabItem title= "컴포저블 코드에서">

```kotlin
var bytes by remember {
    mutableStateOf(ByteArray(0))
}
LaunchedEffect(Unit) {
    bytes = Res.readBytes("files/myDir/someFile.bin")
}
Text(bytes.decodeToString())
```

</TabItem>
<TabItem title= "비컴포저블 코드에서">

```kotlin
coroutineScope.launch {
    val bytes = Res.readBytes("files/myDir/someFile.bin")
}
```

</TabItem>
</Tabs>

#### 바이트 배열을 이미지로 변환하기

읽고 있는 파일이 비트맵(JPEG, PNG, BMP, WEBP) 또는 XML 벡터 이미지인 경우, 다음 함수를 사용하여 `Image()` 컴포저블에 적합한 `ImageBitmap` 또는 `ImageVector` 객체로 변환할 수 있습니다.

[원시 파일](#raw-files) 섹션에 표시된 대로 원시 파일에 접근한 다음, 결과를 컴포저블에 전달합니다:

```kotlin
// bytes = Res.readBytes("files/example.png")
Image(bytes.decodeToImageBitmap(), null)

// bytes = Res.readBytes("files/example.xml")
Image(bytes.decodeToImageVector(LocalDensity.current), null)
```

Android를 제외한 모든 플랫폼에서는 SVG 파일을 `Painter` 객체로 변환할 수도 있습니다:

```kotlin
// bytes = Res.readBytes("files/example.svg")
Image(bytes.decodeToSvgPainter(LocalDensity.current), null)
```

### 리소스 및 문자열 ID를 위한 생성된 맵

쉽게 접근할 수 있도록 Compose Multiplatform은 문자열 ID를 사용하여 리소스도 매핑합니다. 파일 이름을 키로 사용하여 접근할 수 있습니다:

```kotlin
val Res.allDrawableResources: Map<String, DrawableResource>
val Res.allStringResources: Map<String, StringResource>
val Res.allStringArrayResources: Map<String, StringArrayResource>
val Res.allPluralStringResources: Map<String, PluralStringResource>
val Res.allFontResources: Map<String, FontResource>
```

매핑된 리소스를 컴포저블에 전달하는 예시:

```kotlin
Image(painterResource(Res.allDrawableResources["compose_multiplatform"]!!), null)
```

### Android 애셋으로서의 Compose Multiplatform 리소스

Compose Multiplatform 1.7.0부터 모든 멀티플랫폼 리소스는 Android 애셋으로 패키징됩니다.
이를 통해 Android Studio는 Android 소스 세트의 Compose Multiplatform 컴포저블에 대한 미리보기를 생성할 수 있습니다.

> Android Studio 미리보기는 Android 소스 세트의 컴포저블에만 사용할 수 있습니다.
> 또한 최신 AGP 버전 중 하나가 필요합니다: 8.5.2, 8.6.0-rc01 또는 8.7.0-alpha04.
>
{style="warning"}

멀티플랫폼 리소스를 Android 애셋으로 사용하면 Android의 WebView 및 미디어 플레이어 컴포넌트에서 직접 접근할 수 있습니다. 리소스는 `Res.getUri("files/index.html")`와 같은 간단한 경로로 접근할 수 있기 때문입니다.

링크된 리소스 이미지가 포함된 리소스 HTML 페이지를 표시하는 Android 컴포저블의 예시:

```kotlin
// androidMain/kotlin/com/example/webview/App.kt
@OptIn(ExperimentalResourceApi::class)
@Composable
@Preview
fun App() {
    MaterialTheme {
        val uri = Res.getUri("files/webview/index.html")

        // Adding a WebView inside AndroidView with layout as full screen.
        AndroidView(factory = {
            WebView(it).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            }
        }, update = {
            it.loadUrl(uri)
        })
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="AndroidView(factory = { WebView(it).apply"}

이 예시는 다음 단순 HTML 파일과 함께 작동합니다:

```html
<html>
<header>
    <title>
        Cat Resource
    </title>
</header>
<body>
    <img src="cat.jpg">
</body>
</html>
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="<title>Cat Resource</title>"}

이 예시의 두 리소스 파일은 모두 `commonMain` 소스 세트에 있습니다:

![composeResources 디렉터리의 파일 구조](compose-resources-android-webview.png){width="230"}

## 웹 타겟용 리소스 사전 로드

글꼴 및 이미지와 같은 웹 리소스는 `fetch` API를 사용하여 비동기적으로 로드됩니다. 초기 로드 중 또는 느린 네트워크 연결 시 리소스 페치(가져오기)로 인해 [FOUT](https://fonts.google.com/knowledge/glossary/fout)와 같은 시각적 결함이 발생하거나 이미지 대신 플레이스홀더가 표시될 수 있습니다.

이 문제의 전형적인 예시는 `Text()` 컴포넌트에 사용자 지정 글꼴로 텍스트가 포함되어 있지만, 필요한 글리프(glyph)가 포함된 글꼴이 아직 로드 중일 때입니다. 이 경우 사용자는 기본 글꼴로 텍스트를 일시적으로 보거나 문자 대신 빈 상자 또는 물음표를 볼 수도 있습니다. 마찬가지로 이미지 또는 드로어블의 경우, 리소스가 완전히 로드될 때까지 빈 상자 또는 검은색 상자와 같은 플레이스홀더를 관찰할 수 있습니다.

시각적 결함을 방지하려면 브라우저의 내장된 리소스 사전 로드 기능, Compose Multiplatform 사전 로드 API 또는 이 둘의 조합을 사용할 수 있습니다.

### 브라우저 기능을 사용하여 리소스 사전 로드

최신 브라우저에서는 [`rel="preload"` 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)이 있는 `<link>` 태그를 사용하여 리소스를 사전 로드할 수 있습니다.
이 속성은 애플리케이션이 시작하기 전에 글꼴 및 이미지와 같은 리소스를 우선적으로 다운로드하고 캐싱하도록 브라우저에 지시하여 이러한 리소스를 조기에 사용할 수 있도록 합니다.

예를 들어, 브라우저 내에서 글꼴을 사전 로드하는 것을 활성화하려면:

1.  애플리케이션의 웹 배포를 빌드합니다:

```console
   ./gradlew :composeApp:wasmJsBrowserDistribution
```

2.  생성된 `dist` 디렉터리에서 필요한 리소스를 찾아 경로를 저장합니다.
3.  `wasmJsMain/resources/index.html` 파일을 열고 `<head>` 요소 내에 `<link>` 태그를 추가합니다.
4.  `href` 속성을 리소스 경로로 설정합니다:

```html
<link rel="preload" href="./composeResources/username.composeapp.generated.resources/font/FiraMono-Regular.ttf" as="fetch" type="font/ttf" crossorigin/>
```

### Compose Multiplatform 사전 로드 API를 사용하여 리소스 사전 로드
<primary-label ref="Experimental"/>

브라우저에서 리소스를 사전 로드하더라도, 리소스는 렌더링에 적합한 형식인 `FontResource` 및 `DrawableResource`로 변환되어야 하는 원시 바이트로 캐시됩니다. 애플리케이션이 리소스를 처음 요청할 때 변환이 비동기적으로 수행되어 다시 깜박임이 발생할 수 있습니다. 경험을 더욱 최적화하기 위해 Compose Multiplatform 리소스는 리소스의 상위 수준 표현을 위한 자체 내부 캐시를 가지며, 이 캐시도 사전 로드될 수 있습니다.

Compose Multiplatform 1.8.0은 웹 타겟에서 글꼴 및 이미지 리소스를 사전 로드하기 위한 실험적 API를 도입했습니다: `preloadFont()`, `preloadImageBitmap()`, `preloadImageVector()`.

또한 이모티콘과 같은 특수 문자가 필요한 경우 기본 번들 옵션과 다른 대체 글꼴을 설정할 수 있습니다.
대체 글꼴을 지정하려면 `FontFamily.Resolver.preload()` 메서드를 사용하세요.

다음 예시는 사전 로드 및 대체 글꼴 사용 방법을 보여줍니다:

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFontFamilyResolver
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.window.CanvasBasedWindow
import components.resources.demo.shared.generated.resources.*
import components.resources.demo.shared.generated.resources.NotoColorEmoji
import components.resources.demo.shared.generated.resources.Res
import components.resources.demo.shared.generated.resources.Workbench_Regular
import components.resources.demo.shared.generated.resources.font_awesome
import org.jetbrains.compose.resources.ExperimentalResourceApi
import org.jetbrains.compose.resources.configureWebResources
import org.jetbrains.compose.resources.demo.shared.UseResources
import org.jetbrains.compose.resources.preloadFont

@OptIn(ExperimentalComposeUiApi::class, ExperimentalResourceApi::class, InternalComposeUiApi::class)
fun main() {
    configureWebResources {
        // Overrides the resource location
        resourcePathMapping { path -> "./$path" }
    }
    CanvasBasedWindow("Resources + K/Wasm") {
        val font1 by preloadFont(Res.font.Workbench_Regular)
        val font2 by preloadFont(Res.font.font_awesome, FontWeight.Normal, FontStyle.Normal)
        val emojiFont = preloadFont(Res.font.NotoColorEmoji).value
        var fontsFallbackInitialized by remember { mutableStateOf(false) }

        // Uses the preloaded resource for the app's content
        UseResources()

        if (font1 != null && font2 != null && emojiFont != null && fontsFallbackInitialized) {
            println("Fonts are ready")
        } else {
            // Displays the progress indicator to address a FOUT or the app being temporarily non-functional during loading
            Box(modifier = Modifier.fillMaxSize().background(Color.White.copy(alpha = 0.8f)).clickable {  }) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }
            println("Fonts are not ready yet")
        }

        val fontFamilyResolver = LocalFontFamilyResolver.current
        LaunchedEffect(fontFamilyResolver, emojiFont) {
            if (emojiFont != null) {
                // Preloads a fallback font with emojis to render missing glyphs that are not supported by the bundled font
                fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))
                fontsFallbackInitialized = true
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))"}

## 다른 라이브러리 및 리소스와의 상호 작용

### 외부 라이브러리에서 멀티플랫폼 리소스 접근

프로젝트에 포함된 다른 라이브러리를 사용하여 멀티플랫폼 리소스를 처리하려면 플랫폼별 파일 경로를 해당 API에 전달할 수 있습니다.
플랫폼별 경로를 얻으려면 `Res.getUri()` 함수를 리소스에 대한 프로젝트 경로와 함께 호출하세요:

```kotlin
val uri = Res.getUri("files/my_video.mp4")
```

이제 `uri` 변수에 파일의 절대 경로가 포함되므로, 모든 외부 라이브러리는 해당 경로를 사용하여 자신에게 적합한 방식으로 파일에 접근할 수 있습니다.

Android에 특화된 사용을 위해 멀티플랫폼 리소스는 [Android 애셋으로도 패키징됩니다](#compose-multiplatform-resources-as-android-assets).

### 원격 파일

리소스 라이브러리의 맥락에서 애플리케이션의 일부인 파일만 리소스로 간주됩니다.

특수 라이브러리를 사용하여 인터넷에서 URL을 통해 원격 파일을 로드할 수 있습니다:

*   [Compose ImageLoader](https://github.com/qdsfdhvh/compose-imageloader)
*   [Kamel](https://github.com/Kamel-Media/Kamel)
*   [Ktor client](https://ktor.io/)

### Java 리소스 사용

Compose Multiplatform에서 Java 리소스를 사용할 수 있지만, 프레임워크에서 제공하는 확장 기능(생성된 접근자, 멀티모듈 지원, 지역화 등)의 이점을 얻을 수 없습니다.
해당 잠재력을 최대한 활용하려면 멀티플랫폼 리소스 라이브러리로 완전히 전환하는 것을 고려하세요.

Compose Multiplatform 1.7.0부터 `compose.ui` 패키지에서 사용할 수 있는 리소스 API는 더 이상 사용되지 않습니다.
여전히 Java 리소스로 작업해야 하는 경우, Compose Multiplatform 1.7.0 이상으로 업그레이드한 후에도 코드가 작동하도록 다음 구현을 프로젝트에 복사하세요:

```kotlin
@Composable
internal fun painterResource(
    resourcePath: String
): Painter = when (resourcePath.substringAfterLast(".")) {
    "svg" -> rememberSvgResource(resourcePath)
    "xml" -> rememberVectorXmlResource(resourcePath)
    else -> rememberBitmapResource(resourcePath)
}

@Composable
internal fun rememberBitmapResource(path: String): Painter {
    return remember(path) { BitmapPainter(readResourceBytes(path).decodeToImageBitmap()) }
}

@Composable
internal fun rememberVectorXmlResource(path: String): Painter {
    val density = LocalDensity.current
    val imageVector = remember(density, path) { readResourceBytes(path).decodeToImageVector(density) }
    return rememberVectorPainter(imageVector)
}

@Composable
internal fun rememberSvgResource(path: String): Painter {
    val density = LocalDensity.current
    return remember(density, path) { readResourceBytes(path).decodeToSvgPainter(density) }
}

private object ResourceLoader
private fun readResourceBytes(resourcePath: String) =
    ResourceLoader.javaClass.classLoader.getResourceAsStream(resourcePath).readAllBytes()
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="internal fun painterResource(resourcePath: String): Painter"}

## 다음 단계는?

*   iOS, Android 및 데스크톱을 타겟팅하는 Compose Multiplatform 프로젝트에서 리소스를 처리하는 방법을 보여주는 공식 [데모 프로젝트](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)를 확인하세요.
*   앱 내 테마 및 언어와 같은 애플리케이션의 [리소스 환경](compose-resource-environment.md)을 관리하는 방법을 알아보세요.