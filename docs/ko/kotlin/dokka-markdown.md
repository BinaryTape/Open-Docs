[//]: # (title: 마크다운)

> 마크다운 출력 형식은 아직 알파 버전이므로, 사용 시 버그가 발생하거나 마이그레이션 문제가 발생할 수 있습니다.
> **사용에 대한 책임은 전적으로 사용자에게 있습니다.**
>
{style="warning"}

Dokka는 [GitHub Flavored](#gfm) 및 [Jekyll](#jekyll)과 호환되는 마크다운 형식으로 문서를 생성할 수 있습니다.

이러한 형식은 출력을 문서 웹사이트에 바로 삽입할 수 있어 문서를 호스팅하는 데 더 많은 자유를 제공합니다. 예를 들어, [OkHttp의 API 참조](https://square.github.io/okhttp/5.x/okhttp/okhttp3/) 페이지를 확인해 보세요.

마크다운 출력 형식은 Dokka 팀이 관리하는 [Dokka 플러그인](dokka-plugins.md)으로 구현되었으며, 오픈 소스입니다.

## GFM

GFM 출력 형식은 [GitHub Flavored Markdown](https://github.github.com/gfm/) 형식으로 문서를 생성합니다.

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka용 Gradle 플러그인](dokka-gradle.md)에는 GFM 출력 형식이 포함되어 있습니다. 다음 태스크를 사용할 수 있습니다:

| **태스크**              | **설명**                                                                                                                                                                                                                         |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaGfm`            | 단일 프로젝트에 대한 GFM 문서를 생성합니다.                                                                                                                                                                                       |
| `dokkaGfmMultiModule` | 멀티 프로젝트 빌드에서 부모 프로젝트만을 위해 생성된 [`MultiModule`](dokka-gradle.md#multi-project-builds) 태스크입니다. 서브 프로젝트에 대한 문서를 생성하고 모든 출력을 공통 목차와 함께 한곳에 모읍니다. |
| `dokkaGfmCollector`   | 멀티 프로젝트 빌드에서 부모 프로젝트만을 위해 생성된 [`Collector`](dokka-gradle.md#collector-tasks) 태스크입니다. 모든 서브 프로젝트에 대해 `dokkaGfm`을 호출하고 모든 출력을 단일 가상 프로젝트로 병합합니다.                                |

</tab>
<tab title="Maven" group-key="groovy">

GFM 형식은 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)으로 구현되어 있으므로, 플러그인 의존성으로 적용해야 합니다:

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>gfm-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

이렇게 설정한 후, `dokka:dokka` 목표를 실행하면 GFM 형식으로 문서가 생성됩니다.

자세한 내용은 [다른 출력 형식](dokka-maven.md#other-output-formats)에 대한 Maven 플러그인 문서를 참조하세요.

</tab>
<tab title="CLI" group-key="cli">

GFM 형식은 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)으로 구현되어 있으므로, [JAR 파일을 다운로드](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)하여 `pluginsClasspath`에 전달해야 합니다.

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)을 통해:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 설정](dokka-cli.md#run-with-json-configuration)을 통해:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

자세한 내용은 [다른 출력 형식](dokka-cli.md#other-output-formats)에 대한 CLI 러너 문서를 참조하세요.

</tab>
</tabs>

소스 코드는 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-gfm)에서 확인할 수 있습니다.

## Jekyll

Jekyll 출력 형식은 [Jekyll](https://jekyllrb.com/)과 호환되는 마크다운 형식으로 문서를 생성합니다.

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka용 Gradle 플러그인](dokka-gradle.md)에는 Jekyll 출력 형식이 포함되어 있습니다. 다음 태스크를 사용할 수 있습니다:

| **태스크**                 | **설명**                                                                                                                                                                                                                         |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaJekyll`            | 단일 프로젝트에 대한 Jekyll 문서를 생성합니다.                                                                                                                                                                                    |
| `dokkaJekyllMultiModule` | 멀티 프로젝트 빌드에서 부모 프로젝트만을 위해 생성된 [`MultiModule`](dokka-gradle.md#multi-project-builds) 태스크입니다. 서브 프로젝트에 대한 문서를 생성하고 모든 출력을 공통 목차와 함께 한곳에 모읍니다. |
| `dokkaJekyllCollector`   | 멀티 프로젝트 빌드에서 부모 프로젝트만을 위해 생성된 [`Collector`](dokka-gradle.md#collector-tasks) 태스크입니다. 모든 서브 프로젝트에 대해 `dokkaJekyll`을 호출하고 모든 출력을 단일 가상 프로젝트로 병합합니다.                             |

</tab>
<tab title="Maven" group-key="groovy">

Jekyll 형식은 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)으로 구현되어 있으므로, 플러그인 의존성으로 적용해야 합니다:

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>jekyll-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

이렇게 설정한 후, `dokka:dokka` 목표를 실행하면 GFM 형식으로 문서가 생성됩니다.

자세한 내용은 [다른 출력 형식](dokka-maven.md#other-output-formats)에 대한 Maven 플러그인 문서를 참조하세요.

</tab>
<tab title="CLI" group-key="cli">

Jekyll 형식은 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)으로 구현되어 있으므로, [JAR 파일을 다운로드](https://repo1.maven.org/maven2/org/jetbrains/dokka/jekyll-plugin/%dokkaVersion%/jekyll-plugin-%dokkaVersion%.jar)해야 합니다. 이 형식은 또한 [GFM](#gfm) 형식을 기반으로 하므로, 의존성으로 함께 제공해야 합니다. 두 JAR 파일 모두 `pluginsClasspath`에 전달되어야 합니다:

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)을 통해:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar;./jekyll-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 설정](dokka-cli.md#run-with-json-configuration)을 통해:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar",
    "./jekyll-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

자세한 내용은 [다른 출력 형식](dokka-cli.md#other-output-formats)에 대한 CLI 러너 문서를 참조하세요.

</tab>
</tabs>

소스 코드는 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-jekyll)에서 확인할 수 있습니다.