[//]: # (title: Javadoc)
<primary-label ref="alpha"/>

> 이 가이드는 Dokka Gradle 플러그인(DGP) v2 모드에 적용됩니다. DGP v1 모드는 더 이상 지원되지 않습니다.
> v1에서 v2 모드로 업그레이드하려면 [마이그레이션 가이드](dokka-migration.md)를 따르세요.
>
{style="note"}

Dokka의 Javadoc 출력 형식은 Java의
[Javadoc HTML 형식](https://docs.oracle.com/en/java/javase/19/docs/api/index.html)과 유사합니다.

Javadoc 도구로 생성된 HTML 페이지를 시각적으로 모방하려 하지만, 직접적인 구현이나 정확한 복사본은 아닙니다.

![Screenshot of Javadoc output format](javadoc-format-example.png){width=706}

모든 Kotlin 코드와 시그니처는 Java의 관점에서 렌더링됩니다. 이는 이 형식에 기본으로 번들되어 적용되는
[Kotlin as Java Dokka 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)을 통해 이루어집니다.

Javadoc 출력 형식은 [Dokka 플러그인](dokka-plugins.md)으로 구현되며, Dokka 팀에서 유지보수합니다.
이것은 오픈 소스이며, 소스 코드는 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc)에서 찾을 수 있습니다.

## Javadoc 문서 생성

> Dokka는 멀티 프로젝트 빌드나 Kotlin 멀티플랫폼 프로젝트에 대해 Javadoc 형식을 지원하지 않습니다.
>
{style="tip"}

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

[Dokka용 Gradle 플러그인](dokka-gradle.md)에는 Javadoc 출력 형식이 포함되어 있습니다.
프로젝트의 `build.gradle.kts` 파일 `plugins {}` 블록에 해당 플러그인 ID를 적용해야 합니다.

```kotlin
plugins {
    id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"
}
```

플러그인을 적용하면 다음 작업을 실행할 수 있습니다:

*   `dokkaGenerate`는 [적용된 플러그인에 기반한 모든 사용 가능한 형식](dokka-gradle.md#configure-documentation-output-format)으로 문서를 생성합니다.
*   `dokkaGeneratePublicationJavadoc`는 Javadoc 형식으로만 문서를 생성합니다.

`javadoc.jar` 파일은 별도로 생성할 수 있습니다. 자세한 내용은 [`javadoc.jar` 빌드](dokka-gradle.md#build-javadoc-jar)를 참조하세요.

</tab>
<tab title="Maven" group-key="groovy">

[Dokka용 Maven 플러그인](dokka-maven.md)에는 Javadoc 출력 형식이 내장되어 있습니다. 다음 목표(goal)를 사용하여 문서를 생성할 수 있습니다:

| **Goal**           | **설명**                                                              |
|--------------------|------------------------------------------------------------------------------|
| `dokka:javadoc`    | Javadoc 형식으로 문서를 생성합니다.                                    |
| `dokka:javadocJar` | Javadoc 형식의 문서를 포함하는 `javadoc.jar` 파일을 생성합니다. |

</tab>
<tab title="CLI" group-key="cli">

Javadoc 출력 형식이 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)이므로,
[플러그인의 JAR 파일을 다운로드](https://repo1.maven.org/maven2/org/jetbrains/dokka/javadoc-plugin/%dokkaVersion%/javadoc-plugin-%dokkaVersion%.jar)해야 합니다.

Javadoc 출력 형식에는 추가 JAR 파일로 제공해야 하는 두 가지 의존성(dependency)이 있습니다:

*   [kotlin-as-java plugin](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin-%dokkaVersion%.jar)
*   [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)을 통해:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 설정](dokka-cli.md#run-with-json-configuration)을 통해:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./kotlin-as-java-plugin-%dokkaVersion%.jar",
    "./korte-jvm-3.3.0.jar",
    "./javadoc-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

자세한 내용은 CLI 러너 문서의 [기타 출력 형식](dokka-cli.md#other-output-formats)을 참조하세요.

</tab>
</tabs>