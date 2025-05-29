[//]: # (title: Javadoc)

> Javadoc 출력 형식은 아직 알파 단계이므로, 사용 시 버그를 발견하고 마이그레이션 문제를 겪을 수 있습니다.
> Java의 Javadoc HTML을 입력으로 받아들이는 도구와의 성공적인 통합은 보장되지 않습니다.
> **사용에 대한 모든 책임은 사용자에게 있습니다.**
>
{style="warning"}

Dokka의 Javadoc 출력 형식은 Java의
[Javadoc HTML 형식](https://docs.oracle.com/en/java/javase/19/docs/api/index.html)과 유사합니다.

이 형식은 Javadoc 도구로 생성된 HTML 페이지를 시각적으로 모방하려고 시도하지만, 직접적인 구현이나 정확한 복사본은 아닙니다.

![Screenshot of javadoc output format](javadoc-format-example.png){width=706}

모든 Kotlin 코드와 시그니처는 Java의 관점에서 렌더링됩니다. 이는 이 형식에 기본으로 번들되어 적용되는 당사의
[Kotlin as Java Dokka 플러그인](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)을 통해 달성됩니다.

Javadoc 출력 형식은 [Dokka 플러그인](dokka-plugins.md)으로 구현되었으며, Dokka 팀이 관리합니다.
이는 오픈 소스이며, 소스 코드는 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc)에서 확인할 수 있습니다.

## Javadoc 문서 생성

> Javadoc 형식은 멀티플랫폼 프로젝트를 지원하지 않습니다.
>
{style="warning"}

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka용 Gradle 플러그인](dokka-gradle.md)에는 Javadoc 출력 형식이 포함되어 있습니다. 다음 태스크를 사용할 수 있습니다.

| **태스크**                | **설명**                                                                                                                                                                                              |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaJavadoc`          | 단일 프로젝트의 Javadoc 문서를 생성합니다.                                                                                                                                                        |
| `dokkaJavadocCollector` | 멀티 프로젝트 빌드에서 부모 프로젝트에 대해서만 생성되는 [`Collector`](dokka-gradle.md#collector-tasks) 태스크입니다. 모든 하위 프로젝트에 대해 `dokkaJavadoc`를 호출하고 모든 출력을 단일 가상 프로젝트로 병합합니다. |

`javadoc.jar` 파일은 별도로 생성할 수 있습니다. 자세한 내용은 [`javadoc.jar` 빌드](dokka-gradle.md#build-javadoc-jar)를 참조하십시오.

</tab>
<tab title="Maven" group-key="groovy">

[Dokka용 Maven 플러그인](dokka-maven.md)에는 Javadoc 출력 형식이 내장되어 있습니다. 다음 골(goal)을 사용하여 문서를 생성할 수 있습니다.

| **골(Goal)**           | **설명**                                                              |
|--------------------|------------------------------------------------------------------------------|
| `dokka:javadoc`    | Javadoc 형식으로 문서를 생성합니다.                                    |
| `dokka:javadocJar` | Javadoc 형식의 문서를 포함하는 `javadoc.jar` 파일을 생성합니다. |

</tab>
<tab title="CLI" group-key="cli">

Javadoc 출력 형식은 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)이므로, 플러그인의 JAR 파일을 [다운로드해야](https://repo1.maven.org/maven2/org/jetbrains/dokka/javadoc-plugin/%dokkaVersion%/javadoc-plugin-%dokkaVersion%.jar) 합니다.

Javadoc 출력 형식에는 추가 JAR 파일로 제공해야 하는 두 가지 의존성이 있습니다.

* [kotlin-as-java plugin](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin-%dokkaVersion%.jar)
* [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)을 통해:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 구성](dokka-cli.md#run-with-json-configuration)을 통해:

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

자세한 내용은 CLI 러너 문서에서 [다른 출력 형식](dokka-cli.md#other-output-formats)을 참조하십시오.

</tab>
</tabs>