[//]: # (title: Dokka 플러그인)

Dokka는 처음부터 쉽게 확장 가능하고 높은 사용자 지정이 가능하도록 설계되었으며, 이를 통해 커뮤니티는 기본적으로 제공되지 않는 누락되거나 매우 특정한 기능을 위한 플러그인을 구현할 수 있습니다.

Dokka 플러그인은 다른 프로그래밍 언어 소스 지원부터 특이한 출력 형식에 이르기까지 다양합니다. 자신만의 KDoc 태그 또는 주석에 대한 지원을 추가하고, KDoc 설명에서 발견되는 다양한 DSL을 Dokka가 렌더링하는 방법을 학습시키고, 회사 웹사이트에 원활하게 통합되도록 Dokka 페이지를 시각적으로 재설계하고, 다른 도구와 통합하는 등 훨씬 더 많은 작업을 수행할 수 있습니다.

Dokka 플러그인을 만드는 방법을 배우려면 [개발자 가이드](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)를 참조하세요.

## Dokka 플러그인 적용

Dokka 플러그인은 별도의 아티팩트(artifact)로 게시되므로, Dokka 플러그인을 적용하려면 의존성으로 추가하기만 하면 됩니다. 그 다음부터는 플러그인 자체가 Dokka를 확장하므로 추가 조치는 필요하지 않습니다.

> 동일한 확장 지점을 사용하거나 유사한 방식으로 작동하는 플러그인은 서로 간섭할 수 있습니다. 이는 시각적 버그, 일반적인 미정의 동작 또는 빌드 실패로 이어질 수 있습니다. 하지만 Dokka는 변경 가능한 데이터 구조나 객체를 노출하지 않으므로 동시성 문제로 이어지지 않습니다.
>
> 이와 같은 문제가 발생하면 어떤 플러그인이 적용되었고 무엇을 하는지 확인하는 것이 좋습니다.
>
{style="note"}

프로젝트에 [mathjax 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)을 적용하는 방법을 살펴보겠습니다.

<tabs group="build-script">
<tab title="코틀린" group-key="kotlin">

Dokka용 Gradle 플러그인은 플러그인을 범용적으로 또는 특정 출력 형식에만 적용할 수 있는 편리한 의존성 구성을 생성합니다.

```kotlin
dependencies {
    // 범용적으로 적용됩니다
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%")

    // 단일 모듈 dokkaHtml 태스크에만 적용됩니다
    dokkaHtmlPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")

    // 다중 프로젝트 빌드에서 HTML 형식에 적용됩니다
    dokkaHtmlPartialPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")
}
```

> [다중 프로젝트](dokka-gradle.md#multi-project-builds) 빌드를 문서화할 때, Dokka 플러그인을 서브프로젝트 내와 상위 프로젝트 모두에 적용해야 합니다.
>
{style="note"}

</tab>
<tab title="그루비" group-key="groovy">

Dokka용 Gradle 플러그인은 Dokka 플러그인을 범용적으로 또는 특정 출력 형식에만 적용할 수 있는 편리한 의존성 구성을 생성합니다.

```groovy
dependencies {
    // 범용적으로 적용됩니다
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%'

    // 단일 모듈 dokkaHtml 태스크에만 적용됩니다
    dokkaHtmlPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'

    // 다중 프로젝트 빌드에서 HTML 형식에 적용됩니다
    dokkaHtmlPartialPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'
}
```

> [다중 프로젝트](dokka-gradle.md#multi-project-builds) 빌드를 문서화할 때, Dokka 플러그인을 서브프로젝트 내와 상위 프로젝트 모두에 적용해야 합니다.
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

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)과 함께 [CLI](dokka-cli.md) 러너를 사용하는 경우, Dokka 플러그인은 `-pluginsClasspath`에 `.jar` 파일로 전달되어야 합니다.

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

## Dokka 플러그인 구성

Dokka 플러그인은 자체적인 구성 옵션을 가질 수도 있습니다. 어떤 옵션을 사용할 수 있는지 확인하려면 사용 중인 플러그인의 문서를 참조하십시오.

[HTML](dokka-html.md) 문서를 생성하는 역할을 하는 `DokkaBase` 플러그인을 자산에 사용자 지정 이미지 추가(`customAssets` 옵션), 사용자 지정 스타일 시트 추가(`customStyleSheets` 옵션), 푸터 메시지 수정(`footerMessage` 옵션)을 통해 구성하는 방법을 살펴보겠습니다.

<tabs group="build-script">
<tab title="코틀린" group-key="kotlin">

Gradle의 코틀린 DSL은 타입 세이프(type-safe) 플러그인 구성을 허용합니다. 이는 `buildscript` 블록의 클래스패스 의존성에 플러그인의 아티팩트를 추가하고, 플러그인 및 구성 클래스를 임포트(import)함으로써 달성할 수 있습니다.

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

또는 JSON을 통해 플러그인을 구성할 수 있습니다. 이 방법은 추가적인 의존성이 필요하지 않습니다.

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
            // 전체 자격 플러그인 이름과 JSON 구성
            "org.jetbrains.dokka.base.DokkaBase" to dokkaBaseConfiguration
        )
    )
}
```

</tab>
<tab title="그루비" group-key="groovy">

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
            // 전체 자격 플러그인 이름과 JSON 구성
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
            <!-- 전체 자격 플러그인 이름 -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- 이름별 옵션 -->
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

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)과 함께 [CLI](dokka-cli.md) 러너를 사용하는 경우, `fullyQualifiedPluginName=json` 형태의 JSON 구성을 허용하는 `-pluginsConfiguration` 옵션을 사용하십시오.

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

다음은 유용하게 사용할 수 있는 주목할 만한 Dokka 플러그인입니다.

| **이름** | **설명** |
|---|---|
| [Android 문서화 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | Android에서의 문서화 경험을 개선합니다 |
| [버전 관리 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning) | 버전 선택기를 추가하고 애플리케이션/라이브러리의 다양한 버전에 대한 문서를 정리하는 데 도움을 줍니다 |
| [MermaidJS HTML 플러그인](https://github.com/glureau/dokka-mermaid) | KDoc에서 발견되는 [MermaidJS](https://mermaid-js.github.io/mermaid/#/) 다이어그램 및 시각화를 렌더링합니다 |
| [Mathjax HTML 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax) | KDoc에서 발견되는 수학 공식을 보기 좋게 출력합니다 |
| [Java 플러그인으로서의 Kotlin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java) | Java 관점에서 Kotlin 시그니처를 렌더링합니다 |

Dokka 플러그인 작성자이고 자신의 플러그인을 이 목록에 추가하고 싶다면, [Slack](dokka-introduction.md#community) 또는 [GitHub](https://github.com/Kotlin/dokka/)를 통해 관리자에게 문의하십시오.