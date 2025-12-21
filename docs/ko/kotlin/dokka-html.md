[//]: # (title: HTML)

> 이 가이드는 Dokka Gradle 플러그인(DGP) v2 모드에 적용됩니다. DGP v1 모드는 더 이상 지원되지 않습니다.
> v1에서 v2 모드로 업그레이드하려면 [마이그레이션 가이드](dokka-migration.md)를 따르세요.
>
{style="note"}

HTML은 Dokka의 기본 권장 출력 형식입니다.
Kotlin 멀티플랫폼, Android, Java 프로젝트를 지원합니다.
또한, 단일 및 다중 프로젝트 빌드를 모두 문서화하는 데 HTML 형식을 사용할 수 있습니다.

HTML 출력 형식의 예시는 다음 문서를 확인하세요:
* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)
* [Gradle](https://docs.gradle.org/current/kotlin-dsl/index.html)

## HTML 문서 생성

HTML은 모든 러너에서 지원하는 출력 형식입니다. HTML 문서를 생성하려면 빌드 도구 또는 러너에 따라 다음 단계를 따르세요.

*   [Gradle](dokka-gradle.md#generate-documentation)의 경우, 다음 작업을 실행할 수 있습니다:
    *   `dokkaGenerate`를 실행하여 [적용된 플러그인에 기반한 사용 가능한 모든 형식](dokka-gradle.md#configure-documentation-output-format)으로 문서를 생성합니다.
        이것은 대부분의 사용자에게 권장되는 작업입니다. IntelliJ IDEA에서 이 작업을 사용하면 출력으로 이동하는 클릭 가능한 링크가 기록됩니다.
    *   `dokkaGeneratePublicationHtml`을 실행하여 HTML 형식으로만 문서를 생성합니다. 이 작업은 출력 디렉토리를 `@OutputDirectory`로 노출합니다. 이 작업은 생성된 파일을 다른 Gradle 작업에서 사용해야 할 때 유용합니다. 예를 들어 서버에 업로드하거나, GitHub Pages 디렉토리로 이동시키거나, `javadoc.jar`로 패키징하는 경우 등이 있습니다. 이 작업은 일상적인 사용을 위한 것이 아니므로 Gradle 작업 그룹에 의도적으로 나열되지 않습니다.

    > IntelliJ IDEA를 사용하는 경우, `dokkaGenerateHtml` Gradle 작업을 볼 수 있습니다.
    > 이 작업은 단순히 `dokkaGeneratePublicationHtml`의 별칭입니다. 두 작업 모두 정확히 동일한 작업을 수행합니다.
    >
    {style="tip"}

*   [Maven](dokka-maven.md#generate-documentation)의 경우, `dokka:dokka` 골(goal)을 실행합니다.
*   [CLI 러너](dokka-cli.md#generate-documentation)의 경우, HTML 의존성을 설정하여 실행합니다.

> 이 형식으로 생성된 HTML 페이지는 모든 것을 올바르게 렌더링하려면 웹 서버에 호스팅되어야 합니다.
>
> [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)와 같은 무료 정적 사이트 호스팅 서비스를 사용할 수 있습니다.
>
> 로컬에서는 [IntelliJ 내장 웹 서버](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)를 사용할 수 있습니다.
>
{style="note"}

## 구성

HTML 형식은 Dokka의 기본 형식입니다. 다음 옵션을 사용하여 구성할 수 있습니다:

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

[JSON 구성](dokka-cli.md#run-with-json-configuration)을 통해:

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

### 구성 옵션

아래 표에는 모든 가능한 구성 옵션과 그 목적이 나와 있습니다.

| **옵션**                              | **설명**                                                                                                                                                                                                                                                                               |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `customAssets`                          | 문서와 함께 번들로 제공될 이미지 에셋의 경로 목록입니다. 이미지 에셋은 모든 파일 확장자를 가질 수 있습니다. 자세한 내용은 [에셋 사용자 지정](#customize-assets)을 참조하세요.                                                                                                             |
| `customStyleSheets`                     | 문서와 함께 번들로 제공되어 렌더링에 사용될 `.css` 스타일시트 경로 목록입니다. 자세한 내용은 [스타일 사용자 지정](#customize-styles)을 참조하세요.                                                                                                                              |
| `templatesDir`                          | 사용자 지정 HTML 템플릿이 포함된 디렉토리의 경로입니다. 자세한 내용은 [템플릿](#templates)을 참조하세요.                                                                                                                                                                                    |
| `footerMessage`                         | 바닥글에 표시될 텍스트입니다.                                                                                                                                                                                                                                                             |
| `separateInheritedMembers`              | 이것은 불리언(boolean) 옵션입니다. `true`로 설정하면 Dokka는 속성/함수와 상속된 속성/상속된 함수를 별도로 렌더링합니다. 기본적으로 비활성화되어 있습니다.                                                                                                                          |
| `mergeImplicitExpectActualDeclarations` | 이것은 불리언(boolean) 옵션입니다. `true`로 설정하면 Dokka는 [expect/actual](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html)로 선언되지 않았지만 동일한 정규화된 이름(fully qualified name)을 가진 선언을 병합합니다. 이는 레거시 코드베이스에 유용할 수 있습니다. 기본적으로 비활성화되어 있습니다. |

Dokka 플러그인 구성에 대한 자세한 내용은 [Dokka 플러그인 구성](dokka-plugins.md#configure-dokka-plugins)을 참조하세요.

## 사용자 지정

문서에 원하는 모양과 느낌을 추가할 수 있도록, HTML 형식은 여러 사용자 지정 옵션을 지원합니다.

### 스타일 사용자 지정

`customStyleSheets` [구성 옵션](#configuration)을 사용하여 자체 스타일시트를 사용할 수 있습니다. 이 스타일시트는 모든 페이지에 적용됩니다.

동일한 이름의 파일을 제공하여 Dokka의 기본 스타일시트를 재정의하는 것도 가능합니다.

| **스타일시트 이름**  | **설명**                                                    |
|----------------------|--------------------------------------------------------------------|
| `style.css`          | 메인 스타일시트, 모든 페이지에 사용되는 대부분의 스타일 포함 |
| `logo-styles.css`    | 헤더 로고 스타일링                                                |
| `prism.css`          | [PrismJS](https://prismjs.com/) 구문 강조 도구용 스타일      |

모든 Dokka 스타일시트의 소스 코드는 [GitHub에서 사용 가능합니다](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles).

### 에셋 사용자 지정

`customAssets` [구성 옵션](#configuration)을 사용하여 문서에 번들로 제공될 자체 이미지를 제공할 수 있습니다.

이 파일들은 `<output>/images` 디렉토리로 복사됩니다.

`customAssets` 속성을 파일 컬렉션([`FileCollection`](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties))과 함께 사용할 수 있습니다:

```kotlin
customAssets.from("example.png", "example2.png")
```

동일한 이름의 파일을 제공하여 Dokka의 이미지와 아이콘을 재정의하는 것이 가능합니다. 가장 유용하고 관련성 있는 것은 헤더에 사용되는 이미지인 `logo-icon.svg`입니다. 나머지는 대부분 아이콘입니다.

Dokka에서 사용되는 모든 이미지는 [GitHub에서 찾을 수 있습니다](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images).

### 로고 변경

로고를 사용자 지정하려면 `logo-icon.svg`에 대해 [자체 에셋을 제공](#customize-assets)하는 것부터 시작할 수 있습니다.

모양이 마음에 들지 않거나 기본 `.svg` 파일 대신 `.png` 파일을 사용하려면, `logo-styles.css` 스타일시트를 [재정의](#customize-styles)하여 사용자 지정할 수 있습니다.

이 작업을 수행하는 방법에 대한 예시는 당사의 [사용자 지정 형식 예제 프로젝트](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example)를 참조하세요.

지원되는 최대 로고 크기는 너비 120픽셀, 높이 36픽셀입니다. 더 큰 이미지를 사용하면 자동으로 크기가 조정됩니다.

### 바닥글 수정

`footerMessage` [구성 옵션](#configuration)을 사용하여 바닥글의 텍스트를 수정할 수 있습니다.

### 템플릿

Dokka는 문서 페이지를 생성하는 데 사용되는 [FreeMarker](https://freemarker.apache.org/) 템플릿을 수정하는 기능을 제공합니다.

헤더를 완전히 변경하거나, 자체 배너/메뉴/검색을 추가하거나, 분석을 로드하거나, 본문 스타일을 변경하는 등 다양한 작업을 할 수 있습니다.

Dokka는 다음 템플릿을 사용합니다.

| **템플릿**                       | **설명**                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `base.ftl`                         | 렌더링될 모든 페이지의 일반적인 디자인을 정의합니다.                                                               |
| `includes/header.ftl`              | 기본적으로 로고, 버전, 소스 세트 선택기, 밝기/어두운 테마 전환 및 검색을 포함하는 페이지 헤더입니다. |
| `includes/footer.ftl`              | `footerMessage` [구성 옵션](#configuration)과 저작권을 포함하는 페이지 바닥글입니다.               |
| `includes/page_metadata.ftl`       | `<head>` 컨테이너 내에서 사용되는 메타데이터입니다.                                                                              |
| `includes/source_set_selector.ftl` | 헤더의 [소스 세트](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 선택기입니다. |

기본 템플릿은 `base.ftl`이며, 나머지 모든 나열된 템플릿을 포함합니다.
모든 Dokka 템플릿의 소스 코드는 [GitHub에서 찾을 수 있습니다](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates).

`templatesDir` [구성 옵션](#configuration)을 사용하여 모든 템플릿을 재정의할 수 있습니다. Dokka는 지정된 디렉토리 내에서 정확한 템플릿 이름을 검색합니다. 사용자 정의 템플릿을 찾지 못하면 기본 템플릿을 사용합니다.

#### 변수

다음 변수는 모든 템플릿 내에서 사용 가능합니다.

| **변수**       | **설명**                                                                                                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}`      | 페이지 이름                                                                                                                                                                                      |
| `${footerMessage}` | `footerMessage` [구성 옵션](#configuration)으로 설정된 텍스트                                                                                                                |
| `${sourceSets}`    | 다중 플랫폼 페이지를 위한 [소스 세트](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)의 널 가능(nullable) 목록입니다. 각 항목에는 `name`, `platform`, `filter` 속성이 있습니다. |
| `${projectName}`   | 프로젝트 이름. `template_cmd` 지시문 내에서만 사용 가능합니다.                                                                                                                         |
| `${pathToRoot}`    | 현재 페이지에서 루트로 가는 경로입니다. 에셋을 찾는 데 유용하며 `template_cmd` 지시문 내에서만 사용 가능합니다.                                                                 |

`projectName` 및 `pathToRoot` 변수는 더 많은 컨텍스트를 필요로 하며, 따라서 나중에 해결되어야 하므로 `template_cmd` 지시문 내에서만 사용 가능합니다:

```html
<@template_cmd name="projectName">
    <span>${projectName}</span>
</@template_cmd>
```

#### 지시문

다음 Dokka 정의 [지시문](https://freemarker.apache.org/docs/ref_directive_userDefined.html)을 사용할 수도 있습니다.

| **변수**    | **설명**                                                                                                                                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>`   | 기본 페이지 콘텐츠.                                                                                                                                                                                                |
| `<@resources/>` | 스크립트 및 스타일시트와 같은 리소스.                                                                                                                                                                            |
| `<@version/>`   | 구성에서 가져온 모듈 버전입니다. [버전 관리 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)이 적용된 경우 버전 내비게이터로 대체됩니다. |