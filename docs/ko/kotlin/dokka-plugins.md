[//]: # (title: Dokka 플러그인)

Dokka는 쉽게 확장하고 고도로 사용자 정의할 수 있도록 처음부터 구축되었으며, 이를 통해 커뮤니티는 기본으로 제공되지 않거나 매우 특정한 기능에 대한 플러그인을 구현할 수 있습니다.

Dokka 플러그인은 다른 프로그래밍 언어 소스 지원부터 독특한 출력 형식까지 다양합니다. 자신만의 KDoc 태그나 어노테이션 지원을 추가하고, KDoc 설명에서 발견되는 다양한 DSL을 Dokka가 렌더링하는 방법을 가르치며, Dokka 페이지를 시각적으로 재설계하여 회사 웹사이트에 원활하게 통합하고, 다른 도구와 통합하는 등 훨씬 더 많은 것을 할 수 있습니다.

Dokka 플러그인을 만드는 방법을 배우고 싶다면 [개발자 가이드](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)를 참조하세요.

## Dokka 플러그인 적용하기

Dokka 플러그인은 별도의 아티팩트로 게시되므로, Dokka 플러그인을 적용하려면 의존성으로 추가하기만 하면 됩니다. 이후 플러그인은 스스로 Dokka를 확장하며, 추가적인 조치는 필요하지 않습니다.

> 동일한 확장 지점(extension point)을 사용하거나 유사한 방식으로 작동하는 플러그인들은 서로 간섭할 수 있습니다.
> 이는 시각적 버그, 일반적인 미정의 동작 또는 빌드 실패로 이어질 수 있습니다. 그러나 Dokka는 변경 가능한 데이터 구조나 객체를 노출하지 않으므로 동시성 문제로 이어지지는 않습니다.
>
> 이와 같은 문제가 발생하면 어떤 플러그인이 적용되었고 어떤 작업을 수행하는지 확인하는 것이 좋습니다.
>
{style="note"}

프로젝트에 [mathjax 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)을 적용하는 방법을 살펴보겠습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

> 이 지침은 Dokka Gradle 플러그인 v1 구성 및 태스크를 반영합니다. Dokka 2.0.0부터 문서 생성과 관련된 여러 구성 옵션, Gradle 태스크, 단계가 업데이트되었으며, 다음이 포함됩니다.
>
> * [Dokka 플러그인 구성](dokka-migration.md#configure-dokka-plugins)
> * [멀티 모듈 프로젝트 작업](dokka-migration.md#share-dokka-configuration-across-modules)
>
> 자세한 내용과 Dokka Gradle Plugin v2의 전체 변경 사항 목록은 [마이그레이션 가이드](dokka-migration.md)를 참조하세요.
>
> {style="note"}

Dokka용 Gradle 플러그인은 플러그인을 전역적으로 또는 특정 출력 형식에만 적용할 수 있도록 편리한 의존성 구성을 생성합니다.

```kotlin
dependencies {
    // Is applied universally
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%")

    // Is applied for the single-module dokkaHtml task only
    dokkaHtmlPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")

    // Is applied for HTML format in multi-project builds
    dokkaHtmlPartialPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")
}
```

> [다중 프로젝트](dokka-gradle.md#multi-project-builds) 빌드를 문서화할 때는 서브 프로젝트뿐만 아니라 상위 프로젝트에도 Dokka 플러그인을 적용해야 합니다.
>
{style="note"}

</tab>
<tab title="Groovy" group-key="groovy">

Dokka용 Gradle 플러그인은 Dokka 플러그인을 전역적으로 또는 특정 출력 형식에만 적용할 수 있도록 편리한 의존성 구성을 생성합니다.

```groovy
dependencies {
    // Is applied universally
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%'

    // Is applied for the single-module dokkaHtml task only
    dokkaHtmlPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'

    // Is applied for HTML format in multi-project builds
    dokkaHtmlPartialPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'
}
```

> [다중 프로젝트](dokka-gradle.md#multi-project-builds) 빌드를 문서화할 때는 서브 프로젝트뿐만 아니라 상위 프로젝트에도 Dokka 플러그인을 적용해야 합니다.
>
{style="note"}

</tab>
<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>mathjax-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

[CLI](dokka-cli.md) 러너를 [명령줄 옵션](dokka-cli.md#run-with-command-line-options)과 함께 사용하는 경우, Dokka 플러그인은 `.jar` 파일로 `-pluginsClasspath`에 전달되어야 합니다.

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./mathjax-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 구성](dokka-cli.md#run-with-json-configuration)을 사용하는 경우, Dokka 플러그인은 `pluginsClasspath` 아래에 지정되어야 합니다.

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./mathjax-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

</tab>
</tabs>

## Dokka 플러그인 구성하기

Dokka 플러그인은 자체 구성 옵션을 가질 수도 있습니다. 사용 가능한 옵션을 확인하려면 사용 중인 플러그인의 문서를 참조하세요.

[HTML](dokka-html.md) 문서를 생성하는 `DokkaBase` 플러그인을 사용자 정의 이미지(`customAssets` 옵션) 추가, 사용자 정의 스타일시트(`customStyleSheets` 옵션) 추가 및 푸터 메시지(`footerMessage` 옵션) 수정을 통해 구성하는 방법을 살펴보겠습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Gradle의 Kotlin DSL은 타입 안전(type-safe) 플러그인 구성을 허용합니다. 이는 `buildscript` 블록의 클래스패스 의존성에 플러그인의 아티팩트를 추가한 다음 플러그인 및 구성 클래스를 임포트함으로써 달성할 수 있습니다.

```kotlin
import org.jetbrains.dokka.base.DokkaBase
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.base.DokkaBaseConfiguration

buildscript {
    dependencies {
        classpath("org.jetbrains.dokka:dokka-base:%dokkaVersion%")
    }
}

tasks.withType<DokkaTask>().configureEach {
    pluginConfiguration<DokkaBase, DokkaBaseConfiguration> {
        customAssets = listOf(file("my-image.png"))
        customStyleSheets = listOf(file("my-styles.css"))
        footerMessage = "(c) 2022 MyOrg"
    }
}
```

또는 JSON을 통해 플러그인을 구성할 수 있습니다. 이 방법을 사용하면 추가적인 의존성이 필요하지 않습니다.

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType<DokkaTask>().configureEach {
    val dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
    }
    """
    pluginsMapConfiguration.set(
        mapOf(
            // fully qualified plugin name to json configuration
            "org.jetbrains.dokka.base.DokkaBase" to dokkaBaseConfiguration
        )
    )
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType(DokkaTask.class) {
    String dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
    }
    """
    pluginsMapConfiguration.set(
            // fully qualified plugin name to json configuration
            ["org.jetbrains.dokka.base.DokkaBase": dokkaBaseConfiguration]
    )
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
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

[CLI](dokka-cli.md) 러너를 [명령줄 옵션](dokka-cli.md#run-with-command-line-options)과 함께 사용하는 경우, `fullyQualifiedPluginName=json` 형식의 JSON 구성을 허용하는 `-pluginsConfiguration` 옵션을 사용하십시오.

여러 플러그인을 구성해야 하는 경우, `^^`로 구분된 여러 값을 전달할 수 있습니다.

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg CLI\"}"
```

[JSON 구성](dokka-cli.md#run-with-json-configuration)을 사용하는 경우, `values`에 JSON 구성을 허용하는 유사한 `pluginsConfiguration` 배열이 있습니다.

```json
{
  "moduleName": "Dokka Example",
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\"}"
    }
  ]
}
```

</tab>
</tabs>

## 주목할 만한 플러그인

다음은 유용하다고 생각할 수 있는 몇 가지 주목할 만한 Dokka 플러그인입니다.

| **이름**                                                                                                                           | **설명**                                                                                              |
|------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [Android documentation plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | Android에서의 문서화 경험을 개선합니다.                                                             |
| [Versioning plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)                       | 버전 선택기를 추가하고 애플리케이션/라이브러리의 다양한 버전에 대한 문서를 정리하는 데 도움을 줍니다. |
| [MermaidJS HTML plugin](https://github.com/glureau/dokka-mermaid)                                                                  | KDoc에 있는 [MermaidJS](https://mermaid-js.github.io/mermaid/#/) 다이어그램 및 시각화를 렌더링합니다.      |
| [Mathjax HTML plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)                        | KDoc에 있는 수학 공식을 예쁘게 출력합니다.                                                                     |
| [Kotlin as Java plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)              | Kotlin 시그니처를 Java 관점에서 보이는 대로 렌더링합니다.                                                    |

Dokka 플러그인 개발자이며 이 목록에 플러그인을 추가하고 싶다면 [Slack](dokka-introduction.md#community) 또는 [GitHub](https://github.com/Kotlin/dokka/)를 통해 관리자에게 연락하세요.