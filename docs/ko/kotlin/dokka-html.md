[//]: # (title: HTML)

> 이 가이드는 Dokka Gradle 플러그인(DGP) v2 모드에 적용됩니다. DGP v1 모드는 더 이상 지원되지 않습니다.
> v1에서 v2 모드로 업그레이드하려면 [마이그레이션 가이드](dokka-migration.md)를 따르세요.
>
{style="note"}

HTML은 Dokka의 기본이자 권장되는 출력 형식(output format)입니다.
Kotlin Multiplatform, Android 및 Java 프로젝트를 지원합니다.
또한, 단일 프로젝트 및 멀티 프로젝트 빌드 모두에 HTML 형식을 사용하여 문서를 생성할 수 있습니다.

HTML 출력 형식의 예시는 다음 문서를 확인하세요:
* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)
* [Gradle](https://docs.gradle.org/current/kotlin-dsl/index.html)

## HTML 문서 생성

출력 형식으로서의 HTML은 모든 러너(runner)에서 지원됩니다. HTML 문서를 생성하려면 빌드 도구 또는 러너에 따라 다음 단계를 따르세요:

* [Gradle](dokka-gradle.md#generate-documentation)의 경우, 다음 태스크를 실행할 수 있습니다: 
  * `dokkaGenerate`: [적용된 플러그인을 기반으로 사용 가능한 모든 형식](dokka-gradle.md#configure-documentation-output-format)으로 문서를 생성합니다.
      대부분의 사용자에게 권장되는 태스크입니다. IntelliJ IDEA에서 이 태스크를 사용할 때, 출력물로 연결되는 클릭 가능한 링크를 로그에 남깁니다.
  * `dokkaGeneratePublicationHtml`: HTML 형식으로만 문서를 생성합니다. 이 태스크는 출력 디렉터리를 `@OutputDirectory`로 노출합니다. 생성된 파일을 서버에 업로드하거나, GitHub Pages 디렉터리로 이동하거나, `javadoc.jar`로 패키징하는 등 다른 Gradle 태스크에서 사용해야 할 때 이 태스크를 사용하세요. 이 태스크는 일상적인 사용을 위한 것이 아니므로 의도적으로 Gradle 태스크 그룹에 나열되지 않습니다.

    > IntelliJ IDEA를 사용하는 경우 `dokkaGenerateHtml` Gradle 태스크가 보일 수 있습니다.
    > 이 태스크는 단순히 `dokkaGeneratePublicationHtml`의 별칭(alias)입니다. 두 태스크 모두 정확히 동일한 작업을 수행합니다.
    >
    {style="tip"}

* [Maven](dokka-maven.md#generate-documentation)의 경우, `dokka:dokka` 골(goal)을 실행합니다.
* [CLI 러너](dokka-cli.md#generate-documentation)의 경우, HTML 의존성을 설정하여 실행합니다.

> 이 형식으로 생성된 HTML 페이지는 모든 항목을 올바르게 렌더링하기 위해 웹 서버에 호스팅되어야 합니다.
>
> [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)와 같은 무료 정적 사이트 호스팅 서비스를 사용할 수 있습니다.
>
> 로컬에서는 [IntelliJ 내장 웹 서버](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)를 사용할 수 있습니다.
>
{style="note"}

## 설정

HTML 형식은 Dokka의 기본 형식입니다. 다음 옵션을 사용하여 설정할 수 있습니다:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// build.gradle.kts

dokka {
    pluginsConfiguration.html {
        customAssets.from("logo.png")
        customStyleSheets.from("styles.css")
        footerMessage.set("(c) Your Company")
        separateInheritedMembers.set(false)
        templatesDir.set(file("dokka/templates"))
        mergeImplicitExpectActualDeclarations.set(false)
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
// build.gradle

dokka {
    pluginsConfiguration {
        html {
            customAssets.from("logo.png")
            customStyleSheets.from("styles.css")
            footerMessage.set("(c) Your Company")
            separateInheritedMembers.set(false)
            templatesDir.set(file("dokka/templates"))
            mergeImplicitExpectActualDeclarations.set(false)
        }
    }
}
```

</tab>
<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <pluginsConfiguration>
            <!-- Fully qualified plugin name -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- Options by name -->
                <customAssets>
                    <asset>${project.basedir}/my-image.png</asset>
                </customAssets>
                <customStyleSheets>
                    <stylesheet>${project.basedir}/my-styles.css</stylesheet>
                </customStyleSheets>
                <footerMessage>(c) MyOrg 2022 Maven</footerMessage>
                <separateInheritedMembers>false</separateInheritedMembers>
                <templatesDir>${project.basedir}/dokka/templates</templatesDir>
                <mergeImplicitExpectActualDeclarations>false</mergeImplicitExpectActualDeclarations>
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)을 통해:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}
"
```

[JSON 설정](dokka-cli.md#run-with-json-configuration)을 통해:

```json
{
  "moduleName": "Dokka Example",
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}"
    }
  ]
}
```

</tab>
</tabs>

### 설정 옵션

아래 표에는 가능한 모든 설정 옵션과 그 용도가 포함되어 있습니다:

| **옵션**                              | **설명**                                                                                                                                                                                                                                                                               |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `customAssets`                          | 문서와 함께 번들로 제공될 이미지 에셋의 경로 리스트입니다. 이미지 에셋은 모든 파일 확장자를 가질 수 있습니다. 자세한 내용은 [에셋 커스터마이징](#customize-assets)을 참조하세요.                                                                                                             |
| `customStyleSheets`                     | 문서와 함께 번들로 제공되고 렌더링에 사용될 `.css` 스타일시트의 경로 리스트입니다. 자세한 내용은 [스타일 커스터마이징](#customize-styles)을 참조하세요.                                                                                                                              |
| `templatesDir`                          | 커스텀 HTML 템플릿이 포함된 디렉터리의 경로입니다. 자세한 내용은 [템플릿](#templates)을 참조하세요.                                                                                                                                                                                    |
| `footerMessage`                         | 푸터(footer)에 표시될 텍스트입니다.                                                                                                                                                                                                                                                             |
| `separateInheritedMembers`              | 불리언(boolean) 옵션입니다. `true`로 설정하면 Dokka는 속성/함수와 상속된 속성/함수를 별도로 렌더링합니다. 기본값은 비활성(`false`)입니다.                                                                                                                          |
| `mergeImplicitExpectActualDeclarations` | 불리언 옵션입니다. `true`로 설정하면 Dokka는 [expect/actual](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html)로 선언되지 않았지만 동일한 정규화된 이름(fully qualified name)을 가진 선언들을 병합합니다. 이는 레거시 코드베이스에서 유용할 수 있습니다. 기본값은 비활성(`false`)입니다. |

Dokka 플러그인 설정에 대한 자세한 내용은 [Dokka 플러그인 설정](dokka-plugins.md#configure-dokka-plugins)을 참조하세요.

## 커스터마이징

문서에 고유한 룩앤필(look and feel)을 추가할 수 있도록 HTML 형식은 다양한 커스터마이징 옵션을 지원합니다.

### 스타일 커스터마이징

`customStyleSheets` [설정 옵션](#configuration)을 사용하여 자신만의 스타일시트를 사용할 수 있습니다. 이 스타일시트는 모든 페이지에 적용됩니다.

동일한 이름의 파일을 제공하여 Dokka의 기본 스타일시트를 재정의(override)할 수도 있습니다:

| **스타일시트 이름**  | **설명**                                                    |
|----------------------|--------------------------------------------------------------------|
| `style.css`          | 메인 스타일시트, 모든 페이지에서 사용되는 대부분의 스타일 포함 |
| `logo-styles.css`    | 헤더 로고 스타일링                                                |
| `prism.css`          | [PrismJS](https://prismjs.com/) 구문 강조기(syntax highlighter)용 스타일      |

Dokka의 모든 스타일시트 소스 코드는 [GitHub에서 확인 가능](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles)합니다.

### 에셋 커스터마이징

`customAssets` [설정 옵](#configuration)션을 사용하여 문서와 함께 번들로 제공될 자신만의 이미지를 제공할 수 있습니다.

이 파일들은 `<output>/images` 디렉터리로 복사됩니다.

`customAssets` 속성에 파일 컬렉션([`FileCollection`](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties))을 사용할 수 있습니다:

```kotlin
customAssets.from("example.png", "example2.png")
```

동일한 이름의 파일을 제공하여 Dokka의 이미지와 아이콘을 재정의할 수 있습니다. 가장 유용하고 관련이 있는 것은 헤더에 사용되는 이미지인 `logo-icon.svg`입니다. 나머지는 대부분 아이콘입니다.

Dokka에서 사용되는 모든 이미지는 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images)에서 찾을 수 있습니다.

### 로고 변경

로고를 커스터마이징하려면 먼저 `logo-icon.svg`에 대해 [자신만의 에셋을 제공](#customize-assets)하는 것부터 시작할 수 있습니다.

모양이 마음에 들지 않거나 기본 `.svg` 파일 대신 `.png` 파일을 사용하려는 경우, [`logo-styles.css` 스타일시트를 재정의](#customize-styles)하여 커스터마이징할 수 있습니다.

이에 대한 예시는 [커스텀 형식 예시 프로젝트](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example)를 참조하세요.

지원되는 최대 로고 크기는 너비 120픽셀, 높이 36픽셀입니다. 더 큰 이미지를 사용하면 자동으로 크기가 조정됩니다.

### 푸터 수정

`footerMessage` [설정 옵션](#configuration)을 사용하여 푸터의 텍스트를 수정할 수 있습니다.

### 템플릿

Dokka는 문서 페이지 생성에 사용되는 [FreeMarker](https://freemarker.apache.org/) 템플릿을 수정할 수 있는 기능을 제공합니다.

헤더를 완전히 변경하거나, 자신만의 배너/메뉴/검색 기능을 추가하거나, 분석 도구(analytics)를 로드하거나, 본문 스타일을 변경하는 등의 작업이 가능합니다.

Dokka는 다음 템플릿을 사용합니다:

| **템플릿**                       | **설명**                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `base.ftl`                         | 렌더링될 모든 페이지의 일반적인 디자인을 정의합니다.                                                               |
| `includes/header.ftl`              | 기본적으로 로고, 버전, 소스 세트 선택기, 라이트/다크 테마 스위치 및 검색 기능이 포함된 페이지 헤더입니다. |
| `includes/footer.ftl`              | `footerMessage` [설정 옵션](#configuration)과 저작권 정보가 포함된 페이지 푸터입니다.               |
| `includes/page_metadata.ftl`       | `<head>` 컨테이너 내에서 사용되는 메타데이터입니다.                                                                              |
| `includes/source_set_selector.ftl` | 헤더에 있는 [소스 세트](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 선택기입니다. |

기본 템플릿은 `base.ftl`이며 나머지 나열된 모든 템플릿을 포함합니다.
Dokka의 모든 템플릿 소스 코드는 [GitHub에서 확인 가능](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates)합니다.

`templatesDir` [설정 옵션](#configuration)을 사용하여 모든 템플릿을 재정의할 수 있습니다. Dokka는 지정된 디렉터리 내에서 정확한 템플릿 이름을 검색합니다. 사용자 정의 템플릿을 찾지 못하면 기본 템플릿을 사용합니다.

#### 변수

모든 템플릿 내에서 다음 변수를 사용할 수 있습니다:

| **변수**           | **설명**                                                                                                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}`      | 페이지 이름                                                                                                                                                                                      |
| `${footerMessage}` | `footerMessage` [설정 옵션](#configuration)에 의해 설정된 텍스트                                                                                                                |
| `${sourceSets}`    | 멀티플랫폼 페이지를 위한 [소스 세트](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)의 null 허용 리스트입니다. 각 항목은 `name`, `platform`, `filter` 속성을 가집니다. |
| `${projectName}`   | 프로젝트 이름입니다. `template_cmd` 지시문 내에서만 사용할 수 있습니다.                                                                                                                         |
| `${pathToRoot}`    | 현재 페이지에서 루트까지의 경로입니다. 에셋 위치를 찾는 데 유용하며 `template_cmd` 지시문 내에서만 사용할 수 있습니다.                                                                 |

변수 `projectName`과 `pathToRoot`는 더 많은 컨텍스트가 필요하므로 `template_cmd` 지시문 내에서만 사용할 수 있으며, 따라서 이후 단계에서 해석되어야 합니다:

```html
<@template_cmd name="projectName">
    <span>${projectName}</span>
</@template_cmd>
```

#### 지시문

다음과 같이 Dokka에서 정의한 [지시문(directives)](https://freemarker.apache.org/docs/ref_directive_userDefined.html)을 사용할 수도 있습니다:

| **변수**    | **설명**                                                                                                                                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>`   | 메인 페이지 콘텐츠.                                                                                                                                                                                                |
| `<@resources/>` | 스크립트 및 스타일시트와 같은 리소스.                                                                                                                                                                            |
| `<@version/>`   | 설정에서 가져온 서브프로젝트 버전. 만약 [버전 관리 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)이 적용된 경우, 버전 네비게이터로 대체됩니다. |