[//]: # (title: Dokka 플러그인)

> 이 가이드는 Dokka Gradle 플러그인 (DGP) v2 모드에 적용됩니다. DGP v1 모드는 더 이상 지원되지 않습니다.
> v1 모드에서 v2 모드로 업그레이드하려면 [마이그레이션 가이드](dokka-migration.md)를 따르세요.
>
{style="note"}

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

[mathjax 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)을 프로젝트에 적용하는 방법을 살펴보겠습니다.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dependencies {
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin")
}
```

> * 내장 플러그인(예: HTML 및 Javadoc)은 항상 자동으로 적용됩니다. 이 플러그인들을 구성하기만 하면 되며, 의존성을 선언할 필요가 없습니다.
>
> * 멀티 모듈 프로젝트([멀티 프로젝트 빌드](dokka-gradle.md#multi-project-configuration))를 문서화할 때는 [서브 프로젝트 간에 Dokka 구성 및 플러그인을 공유](dokka-gradle.md#multi-project-configuration)해야 합니다.
>
{style="note"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dependencies {
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin'
}
```

> [멀티 프로젝트](dokka-gradle.md#multi-project-configuration) 빌드를 문서화할 때는 [서브 프로젝트 간에 Dokka 구성을 공유](dokka-gradle.md#multi-project-configuration)해야 합니다.
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

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)과 함께 [CLI](dokka-cli.md) 러너를 사용하는 경우, Dokka 플러그인은 `.jar` 파일로 `-pluginsClasspath`에 전달되어야 합니다.

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

내장 HTML 플러그인에 사용자 정의 이미지(`customAssets` 옵션), 사용자 정의 스타일시트(`customStyleSheets` 옵션) 추가 및 푸터 메시지(`footerMessage` 옵션) 수정을 통해 구성하는 방법을 살펴보겠습니다.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

타입 안전한 방식으로 Dokka 플러그인을 구성하려면 `dokka.pluginsConfiguration {}` 블록을 사용하세요.

```kotlin
dokka {
    pluginsConfiguration.html {
        customAssets.from("logo.png")
        customStyleSheets.from("styles.css")
        footerMessage.set("(c) Your Company")
    }
}
```

Dokka 플러그인 구성의 예시는 [Dokka의 버전 관리 플러그인](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)을 참조하세요.

Dokka는 [사용자 정의 플러그인을 구성](https://github.com/Kotlin/dokka/blob/v2.1.0/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)하여 기능을 확장하고 문서 생성 프로세스를 수정할 수 있도록 합니다.

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    pluginsConfiguration {
        html {
            customAssets.from("logo.png")
            customStyleSheets.from("styles.css")
            footerMessage.set("(c) Your Company")
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
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)과 함께 [CLI](dokka-cli.md) 러너를 사용하는 경우, `fullyQualifiedPluginName=json` 형식의 JSON 구성을 허용하는 `-pluginsConfiguration` 옵션을 사용하세요.

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
| [MermaidJS HTML plugin](https://github.com/glureau/dokka-mermaid)                                                                  | KDoc에서 발견되는 [MermaidJS](https://mermaid-js.github.io/mermaid/#/) 다이어그램 및 시각화를 렌더링합니다.      |
| [Mathjax HTML plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)                        | KDoc에서 발견되는 수학 공식을 예쁘게 출력합니다.                                                                     |
| [Kotlin as Java plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)               | Java 관점에서 보이는 Kotlin 시그니처를 렌더링합니다.                                                    |
| [GFM plugin](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-gfm)                                             | GitHub Flavoured Markdown 형식으로 문서를 생성하는 기능을 추가합니다.                                  |
| [Jekyll plugin](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-jekyll)                                       | Jekyll Flavoured Markdown 형식으로 문서를 생성하는 기능을 추가합니다.                                  |

Dokka 플러그인 개발자이며 이 목록에 플러그인을 추가하고 싶다면 [Slack](dokka-introduction.md#community) 또는 [GitHub](https://github.com/Kotlin/dokka/)를 통해 유지 관리자에게 연락하세요.