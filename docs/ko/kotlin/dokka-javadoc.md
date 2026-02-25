[//]: # (title: Javadoc)
<primary-label ref="alpha"/>

> 이 가이드는 Dokka Gradle 플러그인(DGP) v2 모드에 적용됩니다. DGP v1 모드는 더 이상 지원되지 않습니다.
> v1에서 v2 모드로 업그레이드하려면 [마이그레이션 가이드](dokka-migration.md)를 따르세요.
>
{style="note"}

Dokka의 Javadoc 출력 형식은 Java의 [Javadoc HTML 형식](https://docs.oracle.com/en/java/javase/19/docs/api/index.html)과 유사합니다. 

이 형식은 Javadoc 도구에 의해 생성된 HTML 페이지를 시각적으로 모방하도록 설계되었으나, 직접적인 구현체이거나 완전히 동일한 복사본은 아닙니다.

![Javadoc 출력 형식 스크린샷](javadoc-format-example.png){width=706}

모든 Kotlin 코드와 시그니처(signature)는 Java의 관점에서 보이는 대로 렌더링됩니다. 이는 이 형식에 기본적으로 번들링되어 적용되는 [Kotlin as Java Dokka 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)을 통해 이루어집니다.

Javadoc 출력 형식은 [Dokka 플러그인](dokka-plugins.md)으로 구현되어 있으며 Dokka 팀에서 유지 관리합니다. 오픈 소스이며 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc)에서 소스 코드를 확인할 수 있습니다.

## Javadoc 문서 생성

> Dokka는 멀티 프로젝트 빌드 또는 Kotlin 멀티플랫폼(Multiplatform) 프로젝트에 대해 Javadoc 형식을 지원하지 않습니다.
>
{style="tip"}

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

[Dokka용 Gradle 플러그인](dokka-gradle.md)에는 Javadoc 출력 형식이 포함되어 있습니다. 프로젝트의 `build.gradle.kts` 파일 내 `plugins {}` 블록에 해당 플러그인 ID를 적용해야 합니다.

```kotlin
plugins {
    id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"
}
```

플러그인을 적용하고 나면 다음 태스크들을 실행할 수 있습니다.

* `dokkaGenerate`: [적용된 플러그인에 기반하여 사용 가능한 모든 형식](dokka-gradle.md#configure-documentation-output-format)으로 문서를 생성합니다.
* `dokkaGeneratePublicationJavadoc`: Javadoc 형식으로만 문서를 생성합니다.

`javadoc.jar` 파일은 별도로 생성할 수 있습니다. 자세한 내용은 [`javadoc.jar` 빌드](dokka-gradle.md#build-javadoc-jar)를 참고하세요.

</tab>
<tab title="Maven" group-key="groovy">

[Dokka용 Maven 플러그인](dokka-maven.md)에는 Javadoc 출력 형식이 내장되어 있습니다. 다음 골(goal)들을 사용하여 문서를 생성할 수 있습니다.

| **골(Goal)**        | **설명**                                                                     |
|--------------------|------------------------------------------------------------------------------|
| `dokka:javadoc`    | Javadoc 형식으로 문서를 생성합니다.                                           |
| `dokka:javadocJar` | Javadoc 형식의 문서가 포함된 `javadoc.jar` 파일을 생성합니다.                  |

</tab>
<tab title="CLI" group-key="cli">

Javadoc 출력 형식은 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)이므로, [플러그인의 JAR 파일](https://repo1.maven.org/maven2/org/jetbrains/dokka/javadoc-plugin/%dokkaVersion%/javadoc-plugin-%dokkaVersion%.jar)을 다운로드해야 합니다.

Javadoc 출력 형식에는 추가 JAR 파일로 제공해야 하는 두 개의 의존성이 있습니다.

* [kotlin-as-java 플러그인](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin-%dokkaVersion%.jar)
* [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

[커맨드 라인 옵션](dokka-cli.md#run-with-command-line-options)을 통한 방법:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 설정](dokka-cli.md#run-with-json-configuration)을 통한 방법:

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

자세한 내용은 CLI 러너 문서의 [기타 출력 형식](dokka-cli.md#other-output-formats) 섹션을 참고하세요.

</tab>
</tabs>