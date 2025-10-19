[//]: # (title: 마크다운)

> 마크다운 출력 형식은 아직 알파 단계이므로, 사용 중 버그가 발생하거나 마이그레이션 문제가 생길 수 있습니다.
> **사용에 따른 위험은 전적으로 사용자 부담입니다.**
>
> 마크다운 및 Jekyll과 같은 실험적 형식은 Dokka 2.0.0에서 기본적으로 지원되지 않습니다. 이러한 형식을 활성화하기 위한 해결 방법은 곧 추가될 예정입니다.
{style="warning"}

Dokka는 [GitHub Flavored](#gfm) 및 [Jekyll](#jekyll) 호환 마크다운 형식으로 문서를 생성할 수 있습니다.

이러한 형식은 생성된 출력을 문서 웹사이트에 바로 삽입할 수 있으므로 문서 호스팅 측면에서 더 많은 자유를 제공합니다. 예를 들어, [OkHttp의 API 참조](https://square.github.io/okhttp/5.x/okhttp/okhttp3/) 페이지를 참조하세요.

마크다운 출력 형식은 Dokka 팀이 관리하는 [Dokka 플러그인](dokka-plugins.md)으로 구현되었으며, 오픈 소스입니다.

## GFM

GFM 출력 형식은 [GitHub Flavored Markdown](https://github.github.com/gfm/)으로 문서를 생성합니다.

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka용 Gradle 플러그인](dokka-gradle.md)에는 GFM 출력 형식이 포함되어 있습니다. 다음 태스크를 사용할 수 있습니다:

| **태스크**              | **설명**                                                                                                                                                                                                                         |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaGfm`            | 단일 프로젝트에 대한 GFM 문서를 생성합니다.                                                                                                                                                                                       |
| `dokkaGfmMultiModule` | 멀티 프로젝트 빌드에서 상위 프로젝트에 대해서만 생성되는 [`MultiModule`](dokka-gradle.md#multi-project-builds) 태스크입니다. 하위 프로젝트에 대한 문서를 생성하고 모든 결과물을 공통 목차와 함께 한 곳에 모읍니다. |
| `dokkaGfmCollector`   | 멀티 프로젝트 빌드에서 상위 프로젝트에 대해서만 생성되는 [`Collector`](dokka-gradle.md#collector-tasks) 태스크입니다. 각 하위 프로젝트에 대해 `dokkaGfm`을 호출하고 모든 결과물을 단일 가상 프로젝트로 병합합니다.                                |

</tab>
<tab title="Maven" group-key="groovy">

GFM 형식은 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)으로 구현되어 있으므로, 플러그인 종속성으로 적용해야 합니다:

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

이것을 설정한 후, `dokka:dokka` 목표(goal)를 실행하면 GFM 형식의 문서가 생성됩니다.

자세한 내용은 Maven 플러그인의 [다른 출력 형식](dokka-maven.md#other-output-formats) 문서를 참조하세요.

</tab>
<tab title="CLI" group-key="cli">

GFM 형식은 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)으로 구현되어 있으므로, [JAR 파일](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)을 다운로드하여 `pluginsClasspath`에 전달해야 합니다.

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)을 통해:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 구성](dokka-cli.md#run-with-json-configuration)을 통해:

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

자세한 내용은 CLI 러너의 [다른 출력 형식](dokka-cli.md#other-output-formats) 문서를 참조하세요.

</tab>
</tabs>

소스 코드는 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-gfm)에서 찾을 수 있습니다.

## Jekyll

Jekyll 출력 형식은 [Jekyll](https://jekyllrb.com/) 호환 마크다운으로 문서를 생성합니다.

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka용 Gradle 플러그인](dokka-gradle.md)에는 Jekyll 출력 형식이 포함되어 있습니다. 다음 태스크를 사용할 수 있습니다:

| **태스크**                 | **설명**                                                                                                                                                                                                                         |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaJekyll`            | 단일 프로젝트에 대한 Jekyll 문서를 생성합니다.                                                                                                                                                                                    |
| `dokkaJekyllMultiModule` | 멀티 프로젝트 빌드에서 상위 프로젝트에 대해서만 생성되는 [`MultiModule`](dokka-gradle.md#multi-project-builds) 태스크입니다. 하위 프로젝트에 대한 문서를 생성하고 모든 결과물을 공통 목차와 함께 한 곳에 모읍니다. |
| `dokkaJekyllCollector`   | 멀티 프로젝트 빌드에서 상위 프로젝트에 대해서만 생성되는 [`Collector`](dokka-gradle.md#collector-tasks) 태스크입니다. 각 하위 프로젝트에 대해 `dokkaJekyll`을 호출하고 모든 결과물을 단일 가상 프로젝트로 병합합니다.                             |

</tab>
<tab title="Maven" group-key="groovy">

Jekyll 형식은 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)으로 구현되어 있으므로, 플러그인 종속성으로 적용해야 합니다:

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

이것을 설정한 후, `dokka:dokka` 목표를 실행하면 GFM 형식의 문서가 생성됩니다.

자세한 내용은 Maven 플러그인의 [다른 출력 형식](dokka-maven.md#other-output-formats) 문서를 참조하세요.

</tab>
<tab title="CLI" group-key="cli">

Jekyll 형식은 [Dokka 플러그인](dokka-plugins.md#apply-dokka-plugins)으로 구현되어 있으므로, [JAR 파일](https://repo1.maven.org/maven2/org/jetbrains/dokka/jekyll-plugin/%dokkaVersion%/jekyll-plugin-%dokkaVersion%.jar)을 다운로드해야 합니다. 이 형식은 [GFM](#gfm) 형식에도 기반하므로, GFM도 종속성으로 제공해야 합니다. 두 JAR 파일 모두 `pluginsClasspath`에 전달되어야 합니다:

[명령줄 옵션](dokka-cli.md#run-with-command-line-options)을 통해:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar;./jekyll-plugin-%dokkaVersion%.jar" \
     ...
```

[JSON 구성](dokka-cli.md#run-with-json-configuration)을 통해:

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

자세한 내용은 CLI 러너의 [다른 출력 형식](dokka-cli.md#other-output-formats) 문서를 참조하세요.

</tab>
</tabs>

소스 코드는 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-jekyll)에서 찾을 수 있습니다.