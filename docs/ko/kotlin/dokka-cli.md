[//]: # (title: CLI)

어떤 이유로든 [Gradle](dokka-gradle.md) 또는 [Maven](dokka-maven.md) 빌드 도구를 사용할 수 없는 경우, Dokka에는 문서 생성을 위한 명령줄(CLI) 러너가 있습니다.

비교해보면, Dokka용 Gradle 플러그인과 같거나 그 이상의 기능을 제공합니다. 그러나 특히 멀티플랫폼 및 멀티모듈 환경에서는 자동 구성 기능이 없기 때문에 설정하기가 상당히 더 어렵습니다.

## 시작하기

CLI 러너는 별도의 실행 가능한 아티팩트로 Maven Central에 게시됩니다.

[Maven Central](https://central.sonatype.com/artifact/org.jetbrains.dokka/dokka-cli)에서 찾거나 [직접 다운로드](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-cli/%dokkaVersion%/dokka-cli-%dokkaVersion%.jar)할 수 있습니다.

`dokka-cli-%dokkaVersion%.jar` 파일을 컴퓨터에 저장한 상태에서 `-help` 옵션으로 실행하면 사용 가능한 모든 구성 옵션과 그 설명을 볼 수 있습니다:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

이는 `-sourceSet`과 같은 일부 중첩된 옵션에도 적용됩니다:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

## 문서 생성

### 전제 조건

의존성을 관리하는 빌드 도구가 없으므로, 의존성 `.jar` 파일을 직접 제공해야 합니다.

어떤 출력 형식에서든 필요한 의존성 목록은 다음과 같습니다:

| **그룹**              | **아티팩트**                  | **버전**       | **링크**                                                                                                                                                 |
|-----------------------|-------------------------------|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.dokka` | `dokka-base`                  | %dokkaVersion% | [다운로드](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-base/%dokkaVersion%/dokka-base-%dokkaVersion%.jar)                                   |
| `org.jetbrains.dokka` | `analysis-kotlin-descriptors` | %dokkaVersion% | [다운로드](https://repo1.maven.org/maven2/org/jetbrains/dokka/analysis-kotlin-descriptors/%dokkaVersion%/analysis-kotlin-descriptors-%dokkaVersion%.jar) |

[HTML](dokka-html.md) 출력 형식에 필요한 추가 의존성은 다음과 같습니다:

| **그룹**                | **아티팩트**       | **버전** | **링크**                                                                                                           |
|-------------------------|--------------------|-------------|--------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.kotlinx` | `kotlinx-html-jvm` | 0.8.0       | [다운로드](https://repo1.maven.org/maven2/org/jetbrains/kotlinx/kotlinx-html-jvm/0.8.0/kotlinx-html-jvm-0.8.0.jar) |
| `org.freemarker`        | `freemarker`       | 2.3.31      | [다운로드](https://repo1.maven.org/maven2/org/freemarker/freemarker/2.3.31/freemarker-2.3.31.jar)                  |

### 명령줄 옵션으로 실행

CLI 러너를 구성하기 위해 명령줄 옵션을 전달할 수 있습니다.

최소한 다음 옵션을 제공해야 합니다:

*   `-pluginsClasspath` - 다운로드된 의존성으로의 절대/상대 경로 목록이며, 세미콜론(`;`)으로 구분됩니다.
*   `-sourceSet` - 문서를 생성할 코드 소스의 절대 경로
*   `-outputDir` - 문서 출력 디렉터리의 절대/상대 경로

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;./analysis-kotlin-descriptors-%dokkaVersion%.jar;./kotlinx-html-jvm-0.8.0.jar;./freemarker-2.3.31.jar" \
     -sourceSet "-src /home/myCoolProject/src/main/kotlin" \
     -outputDir "./dokka/html"
```

제공된 예시를 실행하면 [HTML](dokka-html.md) 출력 형식으로 문서가 생성됩니다.

더 자세한 구성 정보는 [명령줄 옵션](#command-line-options)을 참조하십시오.

### JSON 구성으로 실행

JSON으로 CLI 러너를 구성할 수 있습니다. 이 경우, JSON 구성 파일의 절대/상대 경로를 첫 번째이자 유일한 인수로 제공해야 합니다. 다른 모든 구성 옵션은 해당 파일에서 파싱됩니다.

```Bash
java -jar dokka-cli-%dokkaVersion%.jar dokka-configuration.json
```

최소한 다음 JSON 구성 파일이 필요합니다:

```json
{
  "outputDir": "./dokka/html",
  "sourceSets": [
    {
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "sourceRoots": [
        "/home/myCoolProject/src/main/kotlin"
      ]
    }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

더 자세한 내용은 [JSON 구성 옵션](#json-configuration)을 참조하십시오.

### 다른 출력 형식

기본적으로 `dokka-base` 아티팩트는 [HTML](dokka-html.md) 출력 형식만 포함합니다.

다른 모든 출력 형식은 [Dokka 플러그인](dokka-plugins.md)으로 구현됩니다. 이를 사용하려면 플러그인 클래스패스에 추가해야 합니다.

예를 들어, 실험적인 [GFM](dokka-markdown.md#gfm) 출력 형식으로 문서를 생성하려면 gfm-plugin의 JAR([다운로드](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar))를 다운로드하여 `pluginsClasspath` 구성 옵션에 전달해야 합니다.

명령줄 옵션을 통해:

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

JSON 구성을 통해:

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

GFM 플러그인을 `pluginsClasspath`에 전달하면 CLI 러너는 GFM 출력 형식으로 문서를 생성합니다.

더 자세한 정보는 [Markdown](dokka-markdown.md) 및 [Javadoc](dokka-javadoc.md#generate-javadoc-documentation) 페이지를 참조하십시오.

## 명령줄 옵션

가능한 모든 명령줄 옵션과 그 자세한 설명 목록을 보려면 다음을 실행하십시오:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

요약:

| 옵션                       | 설명                                                                                                                                                                                           |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `moduleName`               | 프로젝트/모듈의 이름.                                                                                                                                                                           |
| `moduleVersion`            | 문서화된 버전.                                                                                                                                                                                   |
| `outputDir`                | 출력 디렉터리 경로, 기본값은 `./dokka`.                                                                                                                                                          |
| `sourceSet`                | Dokka 소스 세트 구성. 중첩된 구성 옵션을 포함합니다.                                                                                                                                                         |
| `pluginsConfiguration`     | Dokka 플러그인 구성.                                                                                                                                                                      |
| `pluginsClasspath`         | Dokka 플러그인 및 해당 의존성 JAR 목록. 세미콜론으로 구분된 여러 경로를 허용합니다.                                                                                                                              |
| `offlineMode`              | 네트워크를 통해 원격 파일/링크를 확인할지 여부.                                                                                                                                                   |
| `failOnWarning`            | Dokka가 경고 또는 오류를 발생시킨 경우 문서 생성을 실패시킬지 여부.                                                                                                                                                 |
| `delayTemplateSubstitution`| 일부 요소의 치환을 지연할지 여부. 멀티모듈 프로젝트의 증분 빌드에 사용됩니다.                                                                                                                                 |
| `noSuppressObviousFunctions`| `kotlin.Any` 및 `java.lang.Object`에서 상속된 함수와 같은 명백한 함수를 억제할지 여부.                                                                                                                              |
| `includes`                 | 모듈 및 패키지 문서를 포함하는 Markdown 파일. 세미콜론으로 구분된 여러 값을 허용합니다.                                                                                                                                                      |
| `suppressInheritedMembers` | 주어진 클래스에서 명시적으로 오버라이드되지 않은 상속된 멤버를 억제할지 여부.                                                                                                                                            |
| `globalPackageOptions`     | `"matchingRegex,-deprecated,-privateApi,+warnUndocumented,+suppress;+visibility:PUBLIC;..."` 형식의 전역 패키지 구성 옵션 목록. 세미콜론으로 구분된 여러 값을 허용합니다. |
| `globalLinks`              | `{url}^{packageListUrl}` 형식의 전역 외부 문서 링크. `^^`로 구분된 여러 값을 허용합니다.                                                                                                                                                  |
| `globalSrcLink`            | 소스 디렉터리와 코드 탐색을 위한 웹 서비스 간의 전역 매핑. 세미콜론으로 구분된 여러 경로를 허용합니다.                                                                                                                                  |
| `helpSourceSet`            | 중첩된 `-sourceSet` 구성에 대한 도움말을 출력합니다.                                                                                                                                                |
| `loggingLevel`             | 로깅 레벨, 가능한 값: `DEBUG, PROGRESS, INFO, WARN, ERROR`.                                                                                                                                 |
| `help, h`                  | 사용 정보.                                                                                                                                                                                           |

#### 소스 세트 옵션

중첩된 `-sourceSet` 구성에 대한 명령줄 옵션 목록을 보려면 다음을 실행하십시오:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

요약:

| 옵션                       | 설명                                                                                                                                                                    |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sourceSetName`            | 소스 세트의 이름.                                                                                                                                                        |
| `displayName`              | 소스 세트의 표시 이름으로, 내부 및 외부에서 모두 사용됩니다.                                                                                                           |
| `classpath`                | 분석 및 대화형 샘플을 위한 클래스패스. 세미콜론으로 구분된 여러 경로를 허용합니다.                                                                                                               |
| `src`                      | 분석 및 문서화할 소스 코드 루트. 세미콜론으로 구분된 여러 경로를 허용합니다.                                                                                                              |
| `dependentSourceSets`      | `moduleName/sourceSetName` 형식의 종속 소스 세트 이름. 세미콜론으로 구분된 여러 값을 허용합니다.                                                      |
| `samples`                  | 샘플 함수를 포함하는 디렉터리 또는 파일 목록. 세미콜론으로 구분된 여러 경로를 허용합니다. <anchor name="includes-cli"/>                                      |
| `includes`                 | [모듈 및 패키지 문서](dokka-module-and-package-docs.md)를 포함하는 Markdown 파일. 세미콜론으로 구분된 여러 경로를 허용합니다.                              |
| `documentedVisibilities`   | 문서화할 가시성. 세미콜론으로 구분된 여러 값을 허용합니다. 가능한 값: `PUBLIC`, `PRIVATE`, `PROTECTED`, `INTERNAL`, `PACKAGE`.                      |
| `reportUndocumented`       | 문서화되지 않은 선언을 보고할지 여부.                                                                                                                                   |
| `noSkipEmptyPackages`      | 빈 패키지에 대한 페이지를 생성할지 여부.                                                                                                                                    |
| `skipDeprecated`           | 사용되지 않는(deprecated) 선언을 건너뛸지 여부.                                                                                                                                       |
| `jdkVersion`               | JDK Javadocs에 링크하는 데 사용할 JDK 버전.                                                                                                                             |
| `languageVersion`          | 분석 및 샘플 설정에 사용되는 언어 버전.                                                                                                                     |
| `apiVersion`               | 분석 및 샘플 설정에 사용되는 Kotlin API 버전.                                                                                                                   |
| `noStdlibLink`             | Kotlin 표준 라이브러리에 대한 링크를 생성할지 여부.                                                                                                                      |
| `noJdkLink`                | JDK Javadocs에 대한 링크를 생성할지 여부.                                                                                                                                     |
| `suppressedFiles`          | 억제할 파일 경로. 세미콜론으로 구분된 여러 경로를 허용합니다.                                                                                                                              |
| `analysisPlatform`         | 분석 설정에 사용되는 플랫폼.                                                                                                                                         |
| `perPackageOptions`        | `matchingRegexp,-deprecated,-privateApi,+warnUndocumented,+suppress;...` 형식의 패키지 소스 세트 구성 목록. 세미콜론으로 구분된 여러 값을 허용합니다. |
| `externalDocumentationLinks`| `{url}^{packageListUrl}` 형식의 외부 문서 링크. `^^`로 구분된 여러 값을 허용합니다.                                                                                                                                  |
| `srcLink`                  | 소스 디렉터리와 코드 탐색을 위한 웹 서비스 간의 매핑. 세미콜론으로 구분된 여러 경로를 허용합니다.                                                                                                                  |

## JSON 구성

아래에는 각 구성 섹션에 대한 몇 가지 예시와 자세한 설명이 있습니다. 페이지 하단에서 [모든 구성 옵션](#complete-configuration)이 적용된 예시도 찾을 수 있습니다.

### 일반 구성

```json
{
  "moduleName": "Dokka Example",
  "moduleVersion": null,
  "outputDir": "./build/dokka/html",
  "failOnWarning": false,
  "suppressObviousFunctions": true,
  "suppressInheritedMembers": false,
  "offlineMode": false,
  "includes": [
    "module.md"
  ],
  "sourceLinks":  [
    { "_comment": "Options are described in a separate section" }
  ],
  "perPackageOptions": [
    { "_comment": "Options are described in a separate section" }
  ],
  "externalDocumentationLinks":  [
    { "_comment": "Options are described in a separate section" }
  ],
  "sourceSets": [
    { "_comment": "Options are described in a separate section" }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

<deflist collapsible="true">
    <def title="moduleName">
        <p>모듈을 참조하는 데 사용되는 표시 이름입니다. 목차, 내비게이션, 로깅 등에 사용됩니다.</p>
        <p>기본값: <code>root</code></p>
    </def>
    <def title="moduleVersion">
        <p>모듈 버전.</p>
        <p>기본값: 비어 있음</p>
    </def>
    <def title="outputDirectory">
        <p>출력 형식에 관계없이 문서가 생성되는 디렉터리.</p>
        <p>기본값: <code>./dokka</code></p>
    </def>
    <def title="failOnWarning">
        <p>
            Dokka가 경고 또는 오류를 발생시킨 경우 문서 생성을 실패시킬지 여부.
            프로세스는 모든 오류 및 경고가 먼저 발생할 때까지 기다립니다.
        </p>
        <p>이 설정은 <code>reportUndocumented</code>와 함께 잘 작동합니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>명백한 함수를 억제할지 여부.</p>
            다음 조건 중 하나를 만족하면 함수는 명백하다고 간주됩니다:
            <list>
                <li>
                    <code>equals</code>, <code>hashCode</code>, <code>toString</code>과 같이 <code>kotlin.Any</code>, <code>Kotlin.Enum</code>, <code>java.lang.Object</code> 또는
                    <code>java.lang.Enum</code>에서 상속된 경우.
                </li>
                <li>
                    <code>dataClass.componentN</code> 또는 <code>dataClass.copy</code>와 같이 합성(컴파일러에 의해 생성됨)되었으며 문서가 없는 경우.
                </li>
            </list>
        <p>기본값: <code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>주어진 클래스에서 명시적으로 오버라이드되지 않은 상속된 멤버를 억제할지 여부.</p>
        <p>
            참고: 이 옵션은 <code>equals</code> / <code>hashCode</code> / <code>toString</code>과 같은 함수는 억제할 수 있지만, 
            <code>dataClass.componentN</code> 및 <code>dataClass.copy</code>와 같은 합성 함수는 억제할 수 없습니다. 
            이를 위해서는 <code>suppressObviousFunctions</code>를 사용하십시오.
        </p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="offlineMode">
        <anchor name="includes-json"/>
        <p>네트워크를 통해 원격 파일/링크를 확인할지 여부.</p>
        <p>
            여기에는 외부 문서 링크 생성에 사용되는 패키지 목록이 포함됩니다. 
            예를 들어, 표준 라이브러리의 클래스를 클릭 가능하게 만드는 경우입니다. 
        </p>
        <p>
            이 값을 <code>true</code>로 설정하면 특정 경우에 빌드 시간을 크게 단축할 수 있지만,
            문서 품질과 사용자 경험을 저하시킬 수도 있습니다. 예를 들어,
            표준 라이브러리를 포함하여 의존성에서 클래스/멤버 링크를 확인하지 않는 경우입니다.
        </p>
        <p>
            참고: 가져온 파일을 로컬에 캐시하고 
            Dokka에 로컬 경로로 제공할 수 있습니다. <code>externalDocumentationLinks</code> 섹션을 참조하십시오.
        </p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">모듈 및 패키지 문서</a>를 포함하는 Markdown 파일 목록.
        </p>
        <p>지정된 파일의 내용은 파싱되어 모듈 및 패키지 설명으로 문서에 포함됩니다.</p>
        <p>이 옵션은 패키지별로 구성할 수 있습니다.</p>
    </def>
    <def title="sourceSets">
        <p>
          Kotlin <a href="https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets">소스 세트</a>의 개별 및 추가 구성.
        </p>
        <p>가능한 옵션 목록은 <a href="#source-set-configuration">소스 세트 구성</a>을 참조하십시오.</p>
    </def>
    <def title="sourceLinks">
        <p>모든 소스 세트에 적용되는 소스 링크의 전역 구성.</p>
        <p>가능한 옵션 목록은 <a href="#source-link-configuration">소스 링크 구성</a>을 참조하십시오.</p>
    </def>
    <def title="perPackageOptions">
        <p>소스 세트에 관계없이 일치하는 패키지의 전역 구성.</p>
        <p>가능한 옵션 목록은 <a href="#per-package-configuration">패키지별 구성</a>을 참조하십시오.</p>
    </def>
    <def title="externalDocumentationLinks">
        <p>사용되는 소스 세트에 관계없이 외부 문서 링크의 전역 구성.</p>
        <p>가능한 옵션 목록은 <a href="#external-documentation-links-configuration">외부 문서 링크 구성</a>을 참조하십시오.</p>
    </def>
    <def title="pluginsClasspath">
        <p>Dokka 플러그인 및 해당 의존성을 포함하는 JAR 파일 목록.</p>
    </def>
</deflist>

### 소스 세트 구성

Kotlin [소스 세트](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 구성 방법:

```json
{
  "sourceSets": [
    {
      "displayName": "jvm",
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "dependentSourceSets": [
        {
          "scopeId": "dependentSourceSetScopeId",
          "sourceSetName": "dependentSourceSetName"
        }
      ],
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"],
      "reportUndocumented": false,
      "skipEmptyPackages": true,
      "skipDeprecated": false,
      "jdkVersion": 8,
      "languageVersion": "1.7",
      "apiVersion": "1.7",
      "noStdlibLink": false,
      "noJdkLink": false,
      "includes": [
        "module.md"
      ],
      "analysisPlatform": "jvm",
      "sourceRoots": [
        "/home/ignat/IdeaProjects/dokka-debug-mvn/src/main/kotlin"
      ],
      "classpath": [
        "libs/kotlin-stdlib-%kotlinVersion%.jar",
        "libs/kotlin-stdlib-common-%kotlinVersion%.jar"
      ],
      "samples": [
        "samples/basic.kt"
      ],
      "suppressedFiles": [
        "src/main/kotlin/org/jetbrains/dokka/Suppressed.kt"
      ],
      "sourceLinks":  [
        { "_comment": "Options are described in a separate section" }
      ],
      "perPackageOptions": [
        { "_comment": "Options are described in a separate section" }
      ],
      "externalDocumentationLinks":  [
        { "_comment": "Options are described in a separate section" }
      ]
    }
  ]
}
```

<deflist collapsible="true">
    <def title="displayName">
        <p>이 소스 세트를 참조하는 데 사용되는 표시 이름입니다.</p>
        <p>
            이 이름은 외부(예: 문서 독자에게 소스 세트 이름이 표시됨) 및 
            내부(예: <code>reportUndocumented</code>의 로깅 메시지)에서 모두 사용됩니다.
        </p>
        <p>더 나은 대안이 없는 경우 플랫폼 이름을 사용할 수 있습니다.</p>
    </def>
    <def title="sourceSetID">
        <p>소스 세트의 기술 ID</p>
    </def>
    <def title="documentedVisibilities">
        <p>문서화되어야 할 가시성 한정자 집합.</p>
        <p>
            이 옵션은 <code>protected</code>/<code>internal</code>/<code>private</code> 선언을 문서화하거나,
            <code>public</code> 선언을 제외하고 내부 API만 문서화하려는 경우에 사용할 수 있습니다.
        </p>
        <p>이 옵션은 패키지별로 구성할 수 있습니다.</p>
        <p>
            가능한 값:</p>
            <list>
                <li><code>PUBLIC</code></li>
                <li><code>PRIVATE</code></li>
                <li><code>PROTECTED</code></li>
                <li><code>INTERNAL</code></li>
                <li><code>PACKAGE</code></li>
            </list>
        <p>기본값: <code>PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code> 및 다른 필터에 의해 필터링된 후 KDoc이 없는 선언(즉, 보이는 문서화되지 않은 선언)에 대해 경고를 발생시킬지 여부.
        </p>
        <p>이 설정은 <code>failOnWarning</code>과 함께 잘 작동합니다.</p>
        <p>이 옵션은 패키지별로 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            다양한 필터가 적용된 후 보이는 선언이 없는 패키지를 건너뛸지 여부.
        </p>
        <p>
            예를 들어, <code>skipDeprecated</code>가 <code>true</code>로 설정되어 있고 패키지에 사용되지 않는(deprecated) 선언만 포함되어 있다면,
            해당 패키지는 비어 있다고 간주됩니다.
        </p>
        <p>CLI 러너의 기본값은 <code>false</code>입니다.</p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code> 어노테이션이 지정된 선언을 문서화할지 여부.</p>
        <p>이 옵션은 패키지별로 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="jdkVersion">
        <p>Java 타입에 대한 외부 문서 링크를 생성할 때 사용할 JDK 버전.</p>
        <p>
            예를 들어, 일부 공개 선언 시그니처에서 <code>java.util.UUID</code>를 사용하고
            이 옵션이 <code>8</code>로 설정되면, Dokka는 해당 선언에 대해 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a>으로의 외부 문서 링크를 생성합니다.
        </p>
    </def>
    <def title="languageVersion">
        <p>
            분석 및 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 환경 설정에 사용되는
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 언어 버전</a>.
        </p>
    </def>
    <def title="apiVersion">
        <p>
            분석 및 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 환경 설정에 사용되는
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 버전</a>.
        </p>
    </def>
    <def title="noStdlibLink">
        <p>
            Kotlin 표준 라이브러리의 API 참조 문서로 연결되는 외부 문서 링크를 생성할지 여부.
        </p>
        <p>참고: <code>noStdLibLink</code>가 <code>false</code>로 설정되면 링크가 <b>생성됩니다</b>.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="noJdkLink">
        <p>JDK의 Javadoc으로 연결되는 외부 문서 링크를 생성할지 여부.</p>
        <p>JDK Javadoc의 버전은 <code>jdkVersion</code> 옵션에 의해 결정됩니다.</p>
        <p>참고: <code>noJdkLink</code>가 <code>false</code>로 설정되면 링크가 <b>생성됩니다</b>.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">모듈 및 패키지 문서</a>를 포함하는 Markdown 파일 목록.
        </p>
        <p>지정된 파일의 내용은 파싱되어 모듈 및 패키지 설명으로 문서에 포함됩니다.</p>
    </def>
    <def title="analysisPlatform">
        <p>
            코드 분석 및 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 환경 설정에 사용될 플랫폼.
        </p>
        <p>
            가능한 값:</p>
            <list>
                <li><code>jvm</code></li>
                <li><code>common</code></li>
                <li><code>js</code></li>
                <li><code>native</code></li>
            </list>
    </def>
    <def title="sourceRoots">
        <p>
            분석 및 문서화할 소스 코드 루트.
            디렉터리 및 개별 <code>.kt</code> / <code>.java</code> 파일을 입력으로 허용합니다.
        </p>
    </def>
    <def title="classpath">
        <p>분석 및 대화형 샘플을 위한 클래스패스.</p>
        <p>의존성에서 오는 일부 타입이 자동으로 확인/인식되지 않는 경우에 유용합니다.</p>
        <p>이 옵션은 <code>.jar</code> 및 <code>.klib</code> 파일 모두를 허용합니다.</p>
    </def>
    <def title="samples">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc 태그를 통해 참조되는 샘플 함수를 포함하는
            디렉터리 또는 파일 목록.
        </p>
    </def>
    <def title="suppressedFiles">
        <p>문서 생성 시 억제할 파일.</p>
    </def>
    <def title="sourceLinks">
        <p>이 소스 세트에만 적용되는 소스 링크 매개변수 집합.</p>
        <p>가능한 옵션 목록은 <a href="#source-link-configuration">소스 링크 구성</a>을 참조하십시오.</p>
    </def>
    <def title="perPackageOptions">
        <p>이 소스 세트 내에서 일치하는 패키지에 특정한 매개변수 집합.</p>
        <p>가능한 옵션 목록은 <a href="#per-package-configuration">패키지별 구성</a>을 참조하십시오.</p>
    </def>
    <def title="externalDocumentationLinks">
        <p>이 소스 세트에만 적용되는 외부 문서 링크 매개변수 집합.</p>
        <p>가능한 옵션 목록은 <a href="#external-documentation-links-configuration">외부 문서 링크 구성</a>을 참조하십시오.</p>
    </def>
</deflist>

### 소스 링크 구성

`sourceLinks` 구성 블록을 사용하면 각 시그니처에 `source` 링크를 추가하여 특정 줄 번호와 함께 `remoteUrl`로 연결할 수 있습니다. (줄 번호는 `remoteLineSuffix`를 설정하여 구성할 수 있습니다.)

이는 독자가 각 선언의 소스 코드를 찾는 데 도움이 됩니다.

예를 들어, `kotlinx.coroutines`의 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 함수에 대한 문서를 참조하십시오.

모든 소스 세트에 대한 소스 링크를 한 번에 함께 구성하거나, [개별적으로](#source-set-configuration) 구성할 수 있습니다:

```json
{
  "sourceLinks": [
    {
      "localDirectory": "src/main/kotlin",
      "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
      "remoteLineSuffix": "#L"
    }
  ]
}
```

<deflist collapsible="true">
    <def title="localDirectory">
        <p>로컬 소스 디렉터리 경로.</p>
    </def>
    <def title="remoteUrl">
        <p>
            문서 독자가 액세스할 수 있는 GitHub, GitLab, Bitbucket 등과 같은 소스 코드 호스팅 서비스의 URL입니다. 이 URL은 선언의 소스 코드 링크를 생성하는 데 사용됩니다.
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            소스 코드 줄 번호를 URL에 추가하는 데 사용되는 접미사. 이는 독자가 파일뿐만 아니라 선언의 특정 줄 번호로 이동하는 데 도움이 됩니다.
        </p>
        <p>
            숫자는 지정된 접미사에 추가됩니다. 예를 들어,
            이 옵션이 <code>#L</code>로 설정되고 줄 번호가 10이면, 결과 URL 접미사는
            <code>#L10</code>이 됩니다.
        </p>
        <p>
            인기 있는 서비스에서 사용되는 접미사:</p>
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        <p>기본값: 비어 있음 (접미사 없음)</p>
    </def>
</deflist>

### 패키지별 구성

`perPackageOptions` 구성 블록을 사용하면 `matchingRegex`에 의해 일치되는 특정 패키지에 대한 일부 옵션을 설정할 수 있습니다.

모든 소스 세트에 대한 패키지 구성을 한 번에 함께 추가하거나, [개별적으로](#source-set-configuration) 추가할 수 있습니다:

```json
{
  "perPackageOptions": [
    {
      "matchingRegex": ".*internal.*",
      "suppress": false,
      "skipDeprecated": false,
      "reportUndocumented": false,
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
    }
  ]
}
```

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>패키지를 일치시키는 데 사용되는 정규 표현식.</p>
    </def>
    <def title="suppress">
        <p>문서 생성 시 이 패키지를 건너뛸지 여부.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code> 어노테이션이 지정된 선언을 문서화할지 여부.</p>
        <p>이 옵션은 프로젝트/모듈 수준에서 설정할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code> 및 다른 필터에 의해 필터링된 후 KDoc이 없는 선언(즉, 보이는 문서화되지 않은 선언)에 대해 경고를 발생시킬지 여부.
        </p>
        <p>이 설정은 <code>failOnWarning</code>과 함께 잘 작동합니다.</p>
        <p>이 옵션은 소스 세트 수준에서 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>문서화되어야 할 가시성 한정자 집합.</p>
        <p>
            이 옵션은 이 패키지 내의 <code>protected</code>/<code>internal</code>/<code>private</code> 선언을 문서화하거나,
            <code>public</code> 선언을 제외하고 내부 API만 문서화하려는 경우에 사용할 수 있습니다.
        </p>
        <p>소스 세트 수준에서 구성할 수 있습니다.</p>
        <p>기본값: <code>PUBLIC</code></p>
    </def>
</deflist>

### 외부 문서 링크 구성

`externalDocumentationLinks` 블록을 사용하면 의존성의 외부 호스팅 문서로 연결되는 링크를 생성할 수 있습니다.

예를 들어, `kotlinx.serialization`의 타입을 사용하는 경우, 기본적으로 문서에서 클릭할 수 없으며 마치 확인되지 않은 것처럼 보입니다. 그러나 `kotlinx.serialization`의 API 참조 문서는 Dokka에 의해 빌드되고 [kotlinlang.org에 게시](https://kotlinlang.org/api/kotlinx.serialization/)되므로, 이에 대한 외부 문서 링크를 구성할 수 있습니다. 이를 통해 Dokka는 라이브러리에서 타입에 대한 링크를 생성하여 성공적으로 확인되고 클릭 가능하게 만듭니다.

모든 소스 세트에 대한 외부 문서 링크를 한 번에 함께 구성하거나, [개별적으로](#source-set-configuration) 구성할 수 있습니다:

```json
{
  "externalDocumentationLinks": [
    {
      "url": "https://kotlinlang.org/api/kotlinx.serialization/",
      "packageListUrl": "https://kotlinlang.org/api/kotlinx.serialization/package-list"
    }
  ]
}
```

<deflist collapsible="true">
    <def title="url">
        <p>링크할 문서의 루트 URL입니다. 후행 슬래시(trailing slash)를 <b>포함해야 합니다</b>.</p>
        <p>
            Dokka는 주어진 URL에 대한 <code>package-list</code>를 자동으로 찾아 
            선언들을 연결하기 위해 최선을 다합니다.
        </p>
        <p>
            자동 확인이 실패하거나 로컬에 캐시된 파일을 대신 사용하려면, 
            <code>packageListUrl</code> 옵션을 설정하는 것을 고려하십시오.
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code>의 정확한 위치. 이는 Dokka가 자동으로 확인하는 것에 의존하는 대안입니다.
        </p>
        <p>
            패키지 목록은 모듈 및 패키지 이름과 같은 문서 및 프로젝트 자체에 대한 정보를 포함합니다. 
        </p>
        <p>네트워크 호출을 피하기 위해 로컬에 캐시된 파일일 수도 있습니다.</p>
    </def>
</deflist>

### 전체 구성

아래에서는 모든 가능한 구성 옵션이 한 번에 적용된 모습을 볼 수 있습니다.

```json
{
  "moduleName": "Dokka Example",
  "moduleVersion": null,
  "outputDir": "./build/dokka/html",
  "failOnWarning": false,
  "suppressObviousFunctions": true,
  "suppressInheritedMembers": false,
  "offlineMode": false,
  "sourceLinks": [
    {
      "localDirectory": "src/main/kotlin",
      "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
      "remoteLineSuffix": "#L"
    }
  ],
  "externalDocumentationLinks": [
    {
      "url": "https://docs.oracle.com/javase/8/docs/api/",
      "packageListUrl": "https://docs.oracle.com/javase/8/docs/api/package-list"
    },
    {
      "url": "https://kotlinlang.org/api/core/kotlin-stdlib/",
      "packageListUrl": "https://kotlinlang.org/api/core/kotlin-stdlib/package-list"
    }
  ],
  "perPackageOptions": [
    {
      "matchingRegex": ".*internal.*",
      "suppress": false,
      "reportUndocumented": false,
      "skipDeprecated": false,
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
    }
  ],
  "sourceSets": [
    {
      "displayName": "jvm",
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "dependentSourceSets": [
        {
          "scopeId": "dependentSourceSetScopeId",
          "sourceSetName": "dependentSourceSetName"
        }
      ],
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"],
      "reportUndocumented": false,
      "skipEmptyPackages": true,
      "skipDeprecated": false,
      "jdkVersion": 8,
      "languageVersion": "1.7",
      "apiVersion": "1.7",
      "noStdlibLink": false,
      "noJdkLink": false,
      "includes": [
        "module.md"
      ],
      "analysisPlatform": "jvm",
      "sourceRoots": [
        "/home/ignat/IdeaProjects/dokka-debug-mvn/src/main/kotlin"
      ],
      "classpath": [
        "libs/kotlin-stdlib-%kotlinVersion%.jar",
        "libs/kotlin-stdlib-common-%kotlinVersion%.jar"
      ],
      "samples": [
        "samples/basic.kt"
      ],
      "suppressedFiles": [
        "src/main/kotlin/org/jetbrains/dokka/Suppressed.kt"
      ],
      "sourceLinks": [
        {
          "localDirectory": "src/main/kotlin",
          "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
          "remoteLineSuffix": "#L"
        }
      ],
      "externalDocumentationLinks": [
        {
          "url": "https://docs.oracle.com/javase/8/docs/api/",
          "packageListUrl": "https://docs.oracle.com/javase/8/docs/api/package-list"
        },
        {
          "url": "https://kotlinlang.org/api/core/kotlin-stdlib/",
          "packageListUrl": "https://kotlinlang.org/api/core/kotlin-stdlib/package-list"
        }
      ],
      "perPackageOptions": [
        {
          "matchingRegex": ".*internal.*",
          "suppress": false,
          "reportUndocumented": false,
          "skipDeprecated": false,
          "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
        }
      ]
    }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ],
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"separateInheritedMembers\":false,\"footerMessage\":\"© 2021 pretty good Copyright\"}"
    }
  ],
  "includes": [
    "module.md"
  ]
}