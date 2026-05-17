[//]: # (title: 멀티플랫폼 리소스 설정 및 구성)

<show-structure depth="3"/>

멀티플랫폼 리소스를 사용하도록 프로젝트를 올바르게 구성하려면 다음 단계를 따르세요:

1. 라이브러리 의존성을 추가합니다.
2. 각 리소스 종류에 필요한 디렉터리를 생성합니다.
3. 한정자(qualified) 리소스를 위한 추가 디렉터리를 생성합니다(예: 다크 UI 테마를 위한 다른 이미지나 지역화된 문자열).

## 빌드 스크립트 및 디렉터리 설정

멀티플랫폼 프로젝트에서 리소스에 액세스하려면 라이브러리 의존성을 추가하고 프로젝트 디렉터리 내에 파일을 구성해야 합니다.

1. `sharedUI` 디렉터리의 `build.gradle.kts` 파일에서 `commonMain` 소스 세트에 의존성을 추가합니다:

   ```kotlin
   kotlin {
       //...
       sourceSets {
           commonMain.dependencies {
               implementation(compose.components.resources)
           }
       }
   }
   ```
   
   > 라이브러리를 직접 참조하려면 [Maven Central의 아티팩트 페이지](https://central.sonatype.com/artifact/org.jetbrains.compose.components/components-resources)에 있는 정규화된 이름(fully qualified name)을 사용하세요.
   {style="tip"}

2. 리소스를 추가하려는 소스 세트 디렉터리(이 예제에서는 `commonMain`)에 `composeResources`라는 새 디렉터리를 생성합니다:

   ![Compose resources project structure](compose-resources-structure.png){width=250}

3. 다음 규칙에 따라 `composeResources` 디렉터리 구조를 구성하세요:

   * 이미지는 `drawable` 디렉터리에 있어야 합니다. Compose Multiplatform은 래스터 이미지(JPEG, PNG, bitmap, WebP)와 벡터 안드로이드 XML 이미지(안드로이드 리소스에 대한 참조가 없는 경우)를 지원합니다.
   * 글꼴은 `font` 디렉터리에 있어야 합니다.
   * 문자열은 `values` 디렉터리에 있어야 합니다.
   * 기타 파일은 `files` 디렉터리에 있어야 하며, 적절하다고 판단되는 폴더 계층 구조를 사용할 수 있습니다.

### 커스텀 리소스 디렉터리

`build.gradle.kts` 파일의 `compose.resources {}` 블록에서 각 소스 세트에 대한 커스텀 리소스 디렉터리를 지정할 수 있습니다. 이러한 각 커스텀 디렉터리도 기본 `composeResources`와 동일한 방식으로 파일을 포함해야 합니다. 즉, 이미지를 위한 `drawable` 하위 디렉터리, 글꼴을 위한 `font` 하위 디렉터리 등이 필요합니다.

특정 폴더를 가리키는 간단한 예제는 다음과 같습니다:

```kotlin
compose.resources {
    customDirectory(
        sourceSetName = "jvmMain",
        directoryProvider = provider { layout.projectDirectory.dir("desktopResources") }
    )
}
```

Gradle 태스크에 의해 생성된 폴더(예: 다운로드된 파일)를 설정할 수도 있습니다:

```kotlin
abstract class DownloadRemoteFiles : DefaultTask() {

    @get:OutputDirectory
    val outputDir = layout.buildDirectory.dir("downloadedRemoteFiles")

    @TaskAction
    fun run() { /* 파일 다운로드를 위한 코드 */ }
}

compose.resources {
    customDirectory(
        sourceSetName = "iosMain",
        directoryProvider = tasks.register<DownloadRemoteFiles>("downloadedRemoteFiles").map { it.outputDir.get() }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="directoryProvider = tasks.register<DownloadRemoteFiles>"}

리소스 액세스 커스터마이징에 대한 자세한 내용은 [액세스 및 사용법](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)에서 확인하세요.

### 커스텀 웹 리소스 경로

`configureWebResources()` 함수를 사용하여 웹 리소스의 경로와 URL을 지정할 수 있습니다:

* 도메인 루트에서 리소스를 참조하려면 상대 경로(`/`로 시작)를 사용하세요.
* 외부 도메인이나 CDN에 호스팅된 리소스를 참조하려면 절대 URL(`http://` 또는 `https://`로 시작)을 사용하세요.

```kotlin
// 리소스를 애플리케이션 관련 경로에 매핑합니다
configureWebResources {
    resourcePathMapping { path -> "/myApp/resources/$path" }
}

// 리소스를 외부 CDN에 매핑합니다
configureWebResources {
    resourcePathMapping { path -> "https://mycdn.com/myApp/res/$path" }
}
```

### `androidLibrary` 타겟의 리소스
<primary-label ref="Experimental"/>

Android Gradle 플러그인 8.8.0 버전부터 `androidLibrary` 타겟에서 생성된 `Res` 클래스와 리소스 접근자(accessor)를 사용할 수 있습니다.
`androidLibrary`에서 멀티플랫폼 리소스 지원을 활성화하려면 다음과 같이 구성을 업데이트하세요:

```
kotlin {
  androidLibrary {
    androidResources.enable = true
  }
}
```

## 한정자 (Qualifiers)

때로는 로캘(locale), 화면 밀도 또는 인터페이스 테마와 같은 환경에 따라 동일한 리소스를 다른 방식으로 표시해야 할 수도 있습니다. 예를 들어, 다른 언어에 맞게 텍스트를 지역화하거나 다크 테마에 맞게 이미지를 조정해야 할 수 있습니다. 이를 위해 라이브러리는 특별한 한정자(qualifier)를 제공합니다.

> [로컬 리소스 환경 관리](compose-resource-environment.md) 튜토리얼에서 리소스 관련 설정을 관리하는 방법을 알아보세요.
>
{style="note"}

`files` 디렉터리의 원시(raw) 파일을 제외한 모든 리소스 유형은 한정자를 지원합니다. 하이픈을 사용하여 디렉터리 이름에 한정자를 추가하세요:

![Qualifiers in multiplatform resources](compose-resources-qualifiers.png){width=250}

라이브러리는 다음 한정자를 지원합니다(우선순위 순): [언어](#language-and-regional-qualifiers), [테마](#theme-qualifier), [밀도](#density-qualifier).

* 여러 종류의 한정자를 함께 적용할 수 있습니다. 예를 들어, "drawable-en-rUS-mdpi-dark"는 미국 지역의 영어(English) 리소스로, 다크 테마의 160 DPI 화면에 적합한 이미지입니다.
* 요청된 한정자가 있는 리소스를 사용할 수 없는 경우, 기본 리소스(한정자가 없는 리소스)가 대신 사용됩니다.

### 언어 및 지역 한정자

언어와 지역 한정자를 조합할 수 있습니다:

* 언어는 두 글자(ISO 639-1) 또는 세 글자(ISO 639-2) [언어 코드](https://www.loc.gov/standards/iso639-2/php/code_list.php)로 정의됩니다.
* 언어 코드에 두 글자로 된 [ISO 3166-1-alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 지역 코드를 추가할 수 있습니다. 지역 코드는 소문자 `r` 접두사를 가져야 합니다(예: `drawable-spa-rMX`).

언어 및 지역 코드는 대소문자를 구분합니다.
지역별 형식 작업에 대한 자세한 내용은 [지역화(Localization)](compose-regional-format.md)에서 확인하세요.

### 테마 한정자

"light" 또는 "dark" 한정자를 추가할 수 있습니다. 그러면 Compose Multiplatform은 현재 시스템 테마에 따라 필요한 리소스를 선택합니다.

### 밀도 한정자

다음과 같은 밀도 한정자를 사용할 수 있습니다:

* "ldpi" – 120 DPI, 0.75배 밀도
* "mdpi" – 160 DPI, 1배 밀도
* "hdpi" – 240 DPI, 1.5배 밀도
* "xhdpi" – 320 DPI, 2배 밀도
* "xxhdpi" – 480 DPI, 3배 밀도
* "xxxhdpi" – 640 DPI, 4배 밀도

시스템에 정의된 화면 밀도에 따라 리소스가 선택됩니다.

## 배포 (Publication)

Compose Multiplatform 1.6.10부터 모든 필수 리소스가 배포용 Maven 아티팩트에 포함됩니다.

이 기능을 활성화하려면 프로젝트에서 Kotlin 2.0.0 이상 및 Gradle 7.6 이상을 사용해야 합니다.

## 다음 단계

* [앱에서 멀티플랫폼 리소스 사용하기](compose-multiplatform-resources-usage.md) 페이지에서 설정한 리소스에 액세스하는 방법과 기본적으로 생성되는 접근자를 커스터마이징하는 방법을 알아보세요.
* iOS, Android 및 데스크톱을 타겟으로 하는 Compose Multiplatform 프로젝트에서 리소스를 처리하는 방법을 보여주는 공식 [데모 프로젝트](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)를 확인해 보세요.