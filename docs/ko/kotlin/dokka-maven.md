[//]: # (title: 메이븐)

Maven 기반 프로젝트의 문서를 생성하려면 Dokka용 Maven 플러그인을 사용할 수 있습니다.

> [Dokka용 Gradle 플러그인](dokka-gradle.md)과 비교하여 Maven 플러그인은 기본 기능만 제공하며 다중 모듈 빌드를 지원하지 않습니다.
>
{style="note"}

저희 [Maven 예제](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/maven) 프로젝트를 방문하여 Dokka를 사용하여 Maven 프로젝트를 구성하는 방법을 시험해 볼 수 있습니다.

## Dokka 적용

Dokka를 적용하려면 `dokka-maven-plugin`을 POM 파일의 `plugins` 섹션에 추가해야 합니다:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>%dokkaVersion%</version>
            <executions>
                <execution>
                    <phase>pre-site</phase>
                    <goals>
                        <goal>dokka</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 문서 생성

Maven 플러그인은 다음 목표를 제공합니다:

| **목표**      | **설명**                                                                        |
|---------------|----------------------------------------------------------------------------------------|
| `dokka:dokka` | Dokka 플러그인이 적용된 문서를 생성합니다. 기본적으로 [HTML](dokka-html.md) 형식입니다. |

### 실험적 기능

| **목표**           | **설명**                                                                             |
|--------------------|---------------------------------------------------------------------------------------------|
| `dokka:javadoc`    | [Javadoc](dokka-javadoc.md) 형식으로 문서를 생성합니다.                                    |
| `dokka:javadocJar` | [Javadoc](dokka-javadoc.md) 형식의 문서가 포함된 `javadoc.jar` 파일을 생성합니다. |

### 다른 출력 형식

기본적으로 Dokka용 Maven 플러그인은 [HTML](dokka-html.md) 출력 형식으로 문서를 빌드합니다.

다른 모든 출력 형식은 [Dokka 플러그인](dokka-plugins.md)으로 구현됩니다. 원하는 형식으로 문서를 생성하려면 해당 플러그인을 Dokka 플러그인으로 구성에 추가해야 합니다.

예를 들어, 실험적인 [GFM](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-gfm#readme) 형식을 사용하려면 `gfm-plugin` 아티팩트를 추가해야 합니다:

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

이 구성으로 `dokka:dokka` 목표를 실행하면 GFM 형식의 문서가 생성됩니다.

Dokka 플러그인에 대해 더 알아보려면 [Dokka 플러그인](dokka-plugins.md)을 참조하세요.

## javadoc.jar 빌드

라이브러리를 저장소에 게시하려면 라이브러리의 API 참조 문서가 포함된 `javadoc.jar` 파일을 제공해야 할 수 있습니다.

예를 들어, [Maven Central](https://central.sonatype.org/)에 게시하려면 프로젝트와 함께 `javadoc.jar`을 [반드시](https://central.sonatype.org/publish/requirements/) 제공해야 합니다. 하지만 모든 저장소가 해당 규칙을 가지고 있는 것은 아닙니다.

[Dokka용 Gradle 플러그인](dokka-gradle.md#build-javadoc-jar)과 달리 Maven 플러그인에는 바로 사용할 수 있는 `dokka:javadocJar` 목표가 포함되어 있습니다. 기본적으로 `target` 폴더에 [Javadoc](dokka-javadoc.md) 출력 형식으로 문서를 생성합니다.

내장된 목표가 만족스럽지 않거나 출력을 사용자 정의하려는 경우(예를 들어, Javadoc 대신 [HTML](dokka-html.md) 형식으로 문서를 생성하려는 경우), 다음과 같은 구성으로 Maven JAR 플러그인을 추가하여 유사한 동작을 달성할 수 있습니다:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.3.0</version>
    <executions>
        <execution>
            <goals>
                <goal>test-jar</goal>
            </goals>
        </execution>
        <execution>
            <id>dokka-jar</id>
            <phase>package</phase>
            <goals>
                <goal>jar</goal>
            </goals>
            <configuration>
                <classifier>dokka</classifier>
                <classesDirectory>${project.build.directory}/dokka</classesDirectory>
                <skipIfEmpty>true</skipIfEmpty>
            </configuration>
        </execution>
    </executions>
</plugin>
```

문서 및 해당 `.jar` 아카이브는 `dokka:dokka` 및 `jar:jar@dokka-jar` 목표를 실행하여 생성됩니다:

```Bash
mvn dokka:dokka jar:jar@dokka-jar
```

> 라이브러리를 Maven Central에 게시하는 경우, [javadoc.io](https://javadoc.io/)와 같은 서비스를 사용하여 라이브러리의 API 문서를 무료로 설정 없이 호스팅할 수 있습니다. 이 서비스는 `javadoc.jar`에서 문서 페이지를 직접 가져옵니다. [이 예제](https://javadoc.io/doc/com.trib3/server/latest/index.html)에서 보여듯이 HTML 형식과 잘 작동합니다.
>
{style="tip"}

## 구성 예제

Maven의 플러그인 구성 블록을 사용하여 Dokka를 구성할 수 있습니다.

다음은 문서의 출력 위치만 변경하는 기본 구성의 예시입니다:

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <outputDir>${project.basedir}/target/documentation/dokka</outputDir>
    </configuration>
</plugin>
```

## 구성 옵션

Dokka는 사용자 및 독자의 경험을 맞춤 설정할 수 있는 다양한 구성 옵션을 제공합니다.

아래에는 각 구성 섹션에 대한 몇 가지 예시와 자세한 설명이 있습니다. 페이지 하단에서 [모든 구성 옵션](#complete-configuration)이 적용된 예시도 찾을 수 있습니다.

### 일반 구성

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <skip>false</skip>
        <moduleName>${project.artifactId}</moduleName>
        <outputDir>${project.basedir}/target/documentation</outputDir>
        <failOnWarning>false</failOnWarning>
        <suppressObviousFunctions>true</suppressObviousFunctions>
        <suppressInheritedMembers>false</suppressInheritedMembers>
        <offlineMode>false</offlineMode>
        <sourceDirectories>
            <dir>${project.basedir}/src</dir>
        </sourceDirectories>
        <documentedVisibilities>
            <visibility>PUBLIC</visibility>
            <visibility>PROTECTED</visibility>
        </documentedVisibilities>
        <reportUndocumented>false</reportUndocumented>
        <skipDeprecated>false</skipDeprecated>
        <skipEmptyPackages>true</skipEmptyPackages>
        <suppressedFiles>
            <file>/path/to/dir</file>
            <file>/path/to/file</file>
        </suppressedFiles>
        <jdkVersion>8</jdkVersion>
        <languageVersion>1.7</languageVersion>
        <apiVersion>1.7</apiVersion>
        <noStdlibLink>false</noStdlibLink>
        <noJdkLink>false</noJdkLink>
        <includes>
            <include>packages.md</include>
            <include>extra.md</include>
        </includes>
        <classpath>${project.compileClasspathElements}</classpath>
        <samples>
            <dir>${project.basedir}/samples</dir>
        </samples>
        <sourceLinks>
            <!-- Separate section -->
        </sourceLinks>
        <externalDocumentationLinks>
            <!-- Separate section -->
        </externalDocumentationLinks>
        <perPackageOptions>
            <!-- Separate section -->
        </perPackageOptions>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="skip">
        <p>문서 생성 건너뛰기 여부.</p>
        <p>기본값: `false`</p>
    </def>
    <def title="moduleName">
        <p>프로젝트/모듈을 참조하는 데 사용되는 표시 이름입니다. 목차, 탐색, 로깅 등에 사용됩니다.</p>
        <p>기본값: `{project.artifactId}`</p>
    </def>
    <def title="outputDir">
        <p>형식과 관계없이 문서가 생성되는 디렉터리입니다.</p>
        <p>기본값: `{project.basedir}/target/dokka`</p>
    </def>
    <def title="failOnWarning">
        <p>
            Dokka가 경고 또는 오류를 내보낸 경우 문서 생성을 실패시킬지 여부. 모든 오류 및 경고가 먼저 내보내질 때까지 프로세스가 기다립니다.
        </p>
        <p>이 설정은 `reportUndocumented`와 잘 작동합니다.</p>
        <p>기본값: `false`</p>
    </def>
    <def title="suppressObviousFunctions">
        <p>명백한 함수를 억제할지 여부.</p>
        <p>
            다음과 같은 경우 함수는 명백한 것으로 간주됩니다:</p>
            <list>
                <li>
                    `equals`, `hashCode`, `toString` 등 `kotlin.Any`, `Kotlin.Enum`, `java.lang.Object` 또는
                    `java.lang.Enum`에서 상속된 경우.
                </li>
                <li>
                    컴파일러에 의해 생성된 합성(synthetic) 함수이며, `dataClass.componentN` 또는 `dataClass.copy`와 같이 문서가 없는 경우.
                </li>
            </list>
        <p>기본값: `true`</p>
    </def>
    <def title="suppressInheritedMembers">
        <p>주어진 클래스에서 명시적으로 오버라이드되지 않은 상속된 멤버를 억제할지 여부.</p>
        <p>
            참고: 이는 `equals`/`hashCode`/`toString`와 같은 함수를 억제할 수 있지만, `dataClass.componentN` 및
            `dataClass.copy`와 같은 합성 함수는 억제할 수 없습니다. 이를 위해서는 `suppressObviousFunctions`를 사용하세요.
        </p>
        <p>기본값: `false`</p>
    </def>
    <def title="offlineMode">
        <p>네트워크를 통해 원격 파일/링크를 확인할지 여부.</p>
        <p>
            여기에는 외부 문서 링크 생성을 위해 사용되는 패키지 목록이 포함됩니다.
            예를 들어, 표준 라이브러리의 클래스를 클릭 가능하게 만드는 경우입니다.
        </p>
        <p>
            이 값을 `true`로 설정하면 특정 경우에 빌드 시간을 크게 단축할 수 있지만,
            문서 품질과 사용자 경험을 저하시킬 수도 있습니다. 예를 들어, 표준 라이브러리를 포함하여
            종속성에서 클래스/멤버 링크를 확인하지 않는 경우가 있습니다.
        </p>
        <p>
            참고: 가져온 파일을 로컬에 캐시하고 Dokka에 로컬 경로로 제공할 수 있습니다.
            `externalDocumentationLinks` 섹션을 참조하세요.
        </p>
        <p>기본값: `false`</p>
    </def>
    <def title="sourceDirectories">
        <p>
            분석하고 문서화할 소스 코드 루트입니다.
            허용되는 입력은 디렉터리와 개별 `.kt` / `.java` 파일입니다.
        </p>
        <p>기본값: `{project.compileSourceRoots}`</p>
    </def>
    <def title="documentedVisibilities">
        <p>문서화되어야 하는 가시성 한정자(visibility modifiers) 집합입니다.</p>
        <p>
            이는 `protected`/`internal`/`private` 선언을 문서화하거나, `public` 선언을 제외하고 내부 API만 문서화하려는 경우에 사용할 수 있습니다.
        </p>
        <p>패키지별로 구성할 수 있습니다.</p>
        <p>기본값: `PUBLIC`</p>
    </def>
    <def title="reportUndocumented">
        <p>
            `documentedVisibilities` 및 다른 필터로 필터링된 후 KDoc이 없는 선언, 즉 문서화되지 않은 가시적인 선언에 대해 경고를 발생시킬지 여부입니다.
        </p>
        <p>이 설정은 `failOnWarning`과 잘 작동합니다.</p>
        <p>패키지 레벨에서 재정의할 수 있습니다.</p>
        <p>기본값: `false`</p>
    </def>
    <def title="skipDeprecated">
        <p>`@Deprecated`로 주석된 선언을 문서화할지 여부.</p>
        <p>패키지 레벨에서 재정의할 수 있습니다.</p>
        <p>기본값: `false`</p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            다양한 필터가 적용된 후 가시적인 선언이 없는 패키지를 건너뛸지 여부.
        </p>
        <p>
            예를 들어, `skipDeprecated`가 `true`로 설정되어 있고 패키지에 사용 중단된 선언만 포함된 경우, 해당 패키지는 비어 있는 것으로 간주됩니다.
        </p>
        <p>기본값: `true`</p>
    </def>
    <def title="suppressedFiles">
        <p>
            억제되어야 하는 디렉터리 또는 개별 파일(즉, 해당 파일의 선언은 문서화되지 않음).
        </p>
    </def>
    <def title="jdkVersion">
        <p>Java 타입에 대한 외부 문서 링크를 생성할 때 사용할 JDK 버전입니다.</p>
        <p>
            예를 들어, 일부 public 선언 시그니처에서 `java.util.UUID`를 사용하고 이 옵션이 `8`로 설정된 경우, Dokka는 해당 선언에 대해 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a>으로 외부 문서 링크를 생성합니다.
        </p>
        <p>기본값: JDK 8</p>
    </def>
    <def title="languageVersion">
        <p>
            분석 및 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 환경 설정에 사용되는
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 언어 버전</a>입니다.
        </p>
        <p>기본적으로 Dokka의 임베디드 컴파일러에서 사용 가능한 최신 언어 버전이 사용됩니다.</p>
    </def>
    <def title="apiVersion">
        <p>
            분석 및 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 환경 설정에 사용되는
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 버전</a>입니다.
        </p>
        <p>기본적으로 `languageVersion`에서 추론됩니다.</p>
    </def>
    <def title="noStdlibLink">
        <p>
            Kotlin 표준 라이브러리의 API 참조 문서로 연결되는 외부 문서 링크를 생성할지 여부.
        </p>
        <p>참고: `noStdLibLink`가 `false`로 설정된 경우 링크가 **생성**됩니다.</p>
        <p>기본값: `false`</p>
    </def>
    <def title="noJdkLink">
    <anchor name="includes"/>
        <p>JDK의 Javadoc으로 연결되는 외부 문서 링크를 생성할지 여부.</p>
        <p>JDK Javadoc의 버전은 `jdkVersion` 옵션에 의해 결정됩니다.</p>
        <p>참고: `noJdkLink`가 `false`로 설정된 경우 링크가 **생성**됩니다.</p>
        <p>기본값: `false`</p>
    </def>
    <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">모듈 및 패키지 문서</a>를 포함하는 Markdown 파일 목록입니다.
        </p>
        <p>지정된 파일의 내용은 파싱되어 모듈 및 패키지 설명으로 문서에 포함됩니다.</p>
    </def>
    <def title="classpath">
        <p>분석 및 대화형 샘플을 위한 클래스패스입니다.</p>
        <p>
            이는 종속성에서 가져온 일부 타입이 자동으로 해결/인식되지 않는 경우에 유용합니다.
            이 옵션은 `.jar` 및 `.klib` 파일 모두를 허용합니다.
        </p>
        <p>기본값: `{project.compileClasspathElements}`</p>
    </def>
    <def title="samples">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample KDoc 태그</a>를 통해 참조되는 샘플 함수가 포함된 디렉터리 또는 파일 목록입니다.
        </p>
    </def>
</deflist>

### 소스 링크 구성

`sourceLinks` 구성 블록을 사용하면 각 시그니처에 특정 줄 번호와 함께 `url`로 연결되는 `source` 링크를 추가할 수 있습니다. (줄 번호는 `lineSuffix`를 설정하여 구성할 수 있습니다).

이는 독자들이 각 선언에 대한 소스 코드를 찾는 데 도움이 됩니다.

예를 들어, `kotlinx.coroutines`의 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 함수 문서를 참조하세요.

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <sourceLinks>
            <link>
                <path>src</path>
                <url>https://github.com/kotlin/dokka/tree/master/src</url>
                <lineSuffix>#L</lineSuffix>
            </link>
        </sourceLinks>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="path">
        <p>
            로컬 소스 디렉터리의 경로입니다. 이 경로는 현재 모듈의 루트에 대한 상대 경로여야 합니다.
        </p>
        <p>
            참고: Unix 기반 경로만 허용되며, Windows 스타일 경로는 오류를 발생시킵니다.
        </p>
    </def>
    <def title="url">
        <p>
            GitHub, GitLab, Bitbucket 등 문서 독자가 접근할 수 있는 소스 코드 호스팅 서비스의 URL입니다. 이 URL은 선언의 소스 코드 링크를 생성하는 데 사용됩니다.
        </p>
    </def>
    <def title="lineSuffix">
        <p>
            URL에 소스 코드 줄 번호를 추가하는 데 사용되는 접미사입니다. 이는 독자들이 파일뿐만 아니라 선언의 특정 줄 번호로 이동하는 데 도움이 됩니다.
        </p>
        <p>
            숫자 자체는 지정된 접미사에 추가됩니다. 예를 들어, 이 옵션이 ` #L`로 설정되고 줄 번호가 10이면, 결과 URL 접미사는 ` #L10`입니다.
        </p>
        <p>
            인기 서비스에서 사용되는 접미사:</p>
            <list>
            <li>GitHub: `#L`</li>
            <li>GitLab: `#L`</li>
            <li>Bitbucket: `#lines-`</li>
            </list>
    </def>
</deflist>

### 외부 문서 링크 구성

`externalDocumentationLinks` 블록은 종속성의 외부에 호스팅된 문서로 연결되는 링크 생성을 허용합니다.

예를 들어, `kotlinx.serialization`에서 타입을 사용하는 경우, 기본적으로 문서에서 클릭할 수 없으며 마치 해결되지 않은 것처럼 보입니다. 그러나 `kotlinx.serialization`에 대한 API 참조 문서는 Dokka에 의해 빌드되고 [kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/)에 게시되므로, 이에 대한 외부 문서 링크를 구성할 수 있습니다. 이를 통해 Dokka는 라이브러리에서 타입에 대한 링크를 생성하여 성공적으로 해결하고 클릭할 수 있도록 합니다.

기본적으로 Kotlin 표준 라이브러리 및 JDK에 대한 외부 문서 링크는 구성되어 있습니다.

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <externalDocumentationLinks>
            <link>
                <url>https://kotlinlang.org/api/kotlinx.serialization/</url>
                <packageListUrl>file:/${project.basedir}/serialization.package.list</packageListUrl>
            </link>
        </externalDocumentationLinks>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="url">
        <p>링크할 문서의 루트 URL입니다. 후행 슬래시(trailing slash)를 **포함해야** 합니다.</p>
        <p>
            Dokka는 주어진 URL에 대한 `package-list`를 자동으로 찾고, 선언을 함께 연결하기 위해 최선을 다합니다.
        </p>
        <p>
            자동 해결이 실패하거나 대신 로컬에 캐시된 파일을 사용하려면 `packageListUrl` 옵션을 설정하는 것을 고려하십시오.
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            `package-list`의 정확한 위치입니다. 이는 Dokka가 자동으로 해결하는 것에 의존하는 대안입니다.
        </p>
        <p>
            패키지 목록에는 모듈 및 패키지 이름과 같은 문서 및 프로젝트 자체에 대한 정보가 포함됩니다.
        </p>
        <p>이는 네트워크 호출을 피하기 위해 로컬에 캐시된 파일일 수도 있습니다.</p>
    </def>
</deflist>

### 패키지 옵션

`perPackageOptions` 구성 블록은 `matchingRegex`와 일치하는 특정 패키지에 대한 일부 옵션을 설정할 수 있도록 합니다.

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <perPackageOptions>
            <packageOptions>
                <matchingRegex>.*api.*</matchingRegex>
                <suppress>false</suppress>
                <reportUndocumented>false</reportUndocumented>
                <skipDeprecated>false</skipDeprecated>
                <documentedVisibilities>
                    <visibility>PUBLIC</visibility>
                    <visibility>PRIVATE</visibility>
                    <visibility>PROTECTED</visibility>
                    <visibility>INTERNAL</visibility>
                    <visibility>PACKAGE</visibility>
                </documentedVisibilities>
            </packageOptions>
        </perPackageOptions>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>패키지를 일치시키는 데 사용되는 정규식입니다.</p>
        <p>기본값: `.*`</p>
 </def>
    <def title="suppress">
        <p>이 패키지가 문서 생성 시 건너뛰어져야 하는지 여부.</p>
        <p>기본값: `false`</p>
    </def>
    <def title="documentedVisibilities">
        <p>문서화되어야 하는 가시성 한정자(visibility modifiers) 집합입니다.</p>
        <p>
            이는 이 패키지 내의 `protected`/`internal`/`private` 선언을 문서화하거나, `public` 선언을 제외하고 내부 API만 문서화하려는 경우에 사용할 수 있습니다.
        </p>
        <p>기본값: `PUBLIC`</p>
    </def>
    <def title="skipDeprecated">
        <p>`@Deprecated`로 주석된 선언을 문서화할지 여부.</p>
        <p>이것은 프로젝트/모듈 수준에서 설정할 수 있습니다.</p>
        <p>기본값: `false`</p>
    </def>
    <def title="reportUndocumented">
        <p>
            `documentedVisibilities` 및 다른 필터로 필터링된 후 KDoc이 없는 선언, 즉 문서화되지 않은 가시적인 선언에 대해 경고를 발생시킬지 여부입니다.
        </p>
        <p>이 설정은 `failOnWarning`과 잘 작동합니다.</p>
        <p>기본값: `false`</p>
    </def>
</deflist>

### 전체 구성

아래에서 가능한 모든 구성 옵션이 동시에 적용된 것을 볼 수 있습니다.

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <skip>false</skip>
        <moduleName>${project.artifactId}</moduleName>
        <outputDir>${project.basedir}/target/documentation</outputDir>
        <failOnWarning>false</failOnWarning>
        <suppressObviousFunctions>true</suppressObviousFunctions>
        <suppressInheritedMembers>false</suppressInheritedMembers>
        <offlineMode>false</offlineMode>
        <sourceDirectories>
            <dir>${project.basedir}/src</dir>
        </sourceDirectories>
        <documentedVisibilities>
            <visibility>PUBLIC</visibility>
            <visibility>PRIVATE</visibility>
            <visibility>PROTECTED</visibility>
            <visibility>INTERNAL</visibility>
            <visibility>PACKAGE</visibility>
        </documentedVisibilities>
        <reportUndocumented>false</reportUndocumented>
        <skipDeprecated>false</skipDeprecated>
        <skipEmptyPackages>true</skipEmptyPackages>
        <suppressedFiles>
            <file>/path/to/dir</file>
            <file>/path/to/file</file>
        </suppressedFiles>
        <jdkVersion>8</jdkVersion>
        <languageVersion>1.7</languageVersion>
        <apiVersion>1.7</apiVersion>
        <noStdlibLink>false</noStdlibLink>
        <noJdkLink>false</noJdkLink>
        <includes>
            <include>packages.md</include>
            <include>extra.md</include>
        </includes>
        <classpath>${project.compileClasspathElements}</classpath>
        <samples>
            <dir>${project.basedir}/samples</dir>
        </samples>
        <sourceLinks>
            <link>
                <path>src</path>
                <url>https://github.com/kotlin/dokka/tree/master/src</url>
                <lineSuffix>#L</lineSuffix>
            </link>
        </sourceLinks>
        <externalDocumentationLinks>
            <link>
                <url>https://kotlinlang.org/api/core/kotlin-stdlib/</url>
                <packageListUrl>file:/${project.basedir}/stdlib.package.list</packageListUrl>
            </link>
        </externalDocumentationLinks>
        <perPackageOptions>
            <packageOptions>
                <matchingRegex>.*api.*</matchingRegex>
                <suppress>false</suppress>
                <reportUndocumented>false</reportUndocumented>
                <skipDeprecated>false</skipDeprecated>
                <documentedVisibilities>
                    <visibility>PUBLIC</visibility>
                    <visibility>PRIVATE</visibility>
                    <visibility>PROTECTED</visibility>
                    <visibility>INTERNAL</visibility>
                    <visibility>PACKAGE</visibility>
                </documentedVisibilities>
            </packageOptions>
        </perPackageOptions>
    </configuration>
</plugin>