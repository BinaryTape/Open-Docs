[//]: # (title: Kotlin 컴파일러 옵션)

Kotlin의 각 릴리스에는 지원되는 대상인 JVM, JavaScript, 그리고 [지원되는 플랫폼](native-overview.md#target-platforms)을 위한 네이티브 바이너리용 컴파일러가 포함되어 있습니다.

이 컴파일러는 다음 경우에 사용됩니다:
* IDE에서 Kotlin 프로젝트의 **컴파일(Compile)** 또는 **실행(Run)** 버튼을 클릭할 때.
* 콘솔 또는 IDE에서 `gradle build`를 호출할 때 Gradle이 사용.
* 콘솔 또는 IDE에서 `mvn compile` 또는 `mvn test-compile`을 호출할 때 Maven이 사용.

[명령줄 컴파일러 작업](command-line.md) 튜토리얼에 설명된 대로 명령줄에서 Kotlin 컴파일러를 수동으로 실행할 수도 있습니다.

## 컴파일러 옵션

Kotlin 컴파일러는 컴파일 과정을 조정하기 위한 다양한 옵션을 가지고 있습니다.
이 페이지에는 각 옵션에 대한 설명과 함께 다양한 대상(target)을 위한 컴파일러 옵션이 나열되어 있습니다.

컴파일러 옵션과 해당 값(_컴파일러 인수_)을 설정하는 방법은 여러 가지가 있습니다:
* IntelliJ IDEA에서 **설정/환경설정(Settings/Preferences)** | **빌드, 실행, 배포(Build, Execution, Deployment)** | **컴파일러(Compiler)** | **Kotlin 컴파일러(Kotlin Compiler)**의 **추가 명령줄 매개변수(Additional command line parameters)** 텍스트 상자에 컴파일러 인수를 작성합니다.
* Gradle을 사용하는 경우, Kotlin 컴파일 작업의 `compilerOptions` 속성에 컴파일러 인수를 지정합니다.
  자세한 내용은 [Gradle 컴파일러 옵션](gradle-compiler-options.md#how-to-define-options)을 참조하세요.
* Maven을 사용하는 경우, Maven 플러그인 노드의 `<configuration>` 요소에 컴파일러 인수를 지정합니다.
  자세한 내용은 [Maven](maven.md#specify-compiler-options)을 참조하세요.
* 명령줄 컴파일러를 실행하는 경우, 유틸리티 호출에 컴파일러 인수를 직접 추가하거나 [아그파일(argfile)](#argfile)에 작성합니다.

  예시:

  ```bash
  $ kotlinc hello.kt -include-runtime -d hello.jar
  ```

  > Windows에서 구분 문자(공백, `=`, `;`, `,`)를 포함하는 컴파일러 인수를 전달할 때, 해당 인수를 이중 따옴표(`"`)로 묶으세요.
  > ```
  > $ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
  > ```
  {style="note"}

## 공통 옵션

다음 옵션은 모든 Kotlin 컴파일러에 공통으로 적용됩니다.

### -version

컴파일러 버전을 표시합니다.

### -nowarn

컴파일 중에 컴파일러가 경고를 표시하지 않도록 억제합니다.

### -Werror

모든 경고를 컴파일 오류로 변환합니다.

### -Wextra

참인 경우 경고를 발생하는 [추가 선언, 표현식 및 타입 컴파일러 검사](whatsnew21.md#extra-compiler-checks)를 활성화합니다.

### -verbose

컴파일 과정에 대한 세부 정보를 포함하는 상세 로깅 출력을 활성화합니다.

### -script

Kotlin 스크립트 파일을 평가합니다. 이 옵션으로 호출되면, 컴파일러는 주어진 인수 중 첫 번째 Kotlin 스크립트(`*.kts`) 파일을 실행합니다.

### -help (-h)

사용법 정보를 표시하고 종료합니다. 표준 옵션만 표시됩니다.
고급 옵션을 표시하려면 `-X`를 사용하세요.

### -X

고급 옵션에 대한 정보를 표시하고 종료합니다. 이 옵션들은 현재 불안정하며, 이름과 동작이 예고 없이 변경될 수 있습니다.

### -kotlin-home _path_

런타임 라이브러리 검색에 사용되는 Kotlin 컴파일러의 사용자 지정 경로를 지정합니다.

### -P plugin:pluginId:optionName=value

Kotlin 컴파일러 플러그인에 옵션을 전달합니다.
핵심 플러그인 및 해당 옵션은 문서의 [핵심 컴파일러 플러그인](components-stability.md#core-compiler-plugins) 섹션에 나열되어 있습니다.

### -language-version _version_

지정된 Kotlin 버전과의 소스 호환성을 제공합니다.

### -api-version _version_

지정된 버전의 Kotlin 번들 라이브러리에서만 선언을 사용할 수 있도록 허용합니다.

### -progressive

컴파일러의 [프로그레시브 모드](whatsnew13.md#progressive-mode)를 활성화합니다.

프로그레시브 모드에서는 불안정한 코드에 대한 사용 중단(deprecations) 및 버그 수정이 점진적인 마이그레이션 주기 없이 즉시 적용됩니다.
프로그레시브 모드에서 작성된 코드는 이전 버전과 호환되지만, 비프로그레시브 모드에서 작성된 코드는 프로그레시브 모드에서 컴파일 오류를 일으킬 수 있습니다.

### @argfile

지정된 파일에서 컴파일러 옵션을 읽습니다. 이러한 파일은 값과 소스 파일의 경로를 포함하는 컴파일러 옵션을 포함할 수 있습니다. 옵션과 경로는 공백으로 구분해야 합니다. 예시:

```
-include-runtime -d hello.jar hello.kt
```

공백을 포함하는 값을 전달하려면 단일 따옴표(**'**) 또는 이중 따옴표(**"**)로 묶으세요. 값이 따옴표를 포함하는 경우, 백슬래시(**\\**)로 이스케이프해야 합니다.
```
-include-runtime -d 'My folder'
```

예를 들어, 컴파일러 옵션과 소스 파일을 분리하기 위해 여러 인수 파일을 전달할 수도 있습니다.

```bash
$ kotlinc @compiler.options @classes
```

파일이 현재 디렉터리와 다른 위치에 있는 경우, 상대 경로를 사용하세요.

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

주어진 정규화된 이름으로 [옵트인이 필요한](opt-in-requirements.md) 요구사항 어노테이션(requirement annotation)을 사용하는 API를 활성화합니다.

### -Xsuppress-warning

예를 들어, [프로젝트 전체에 걸쳐 전역적으로](whatsnew21.md#global-warning-suppression) 특정 경고를 억제합니다:

```bash
kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
```

## Kotlin/JVM 컴파일러 옵션

JVM용 Kotlin 컴파일러는 Kotlin 소스 파일을 Java 클래스 파일로 컴파일합니다.
Kotlin-JVM 컴파일을 위한 명령줄 도구는 `kotlinc`와 `kotlinc-jvm`입니다.
이들을 사용하여 Kotlin 스크립트 파일을 실행할 수도 있습니다.

[공통 옵션](#common-options) 외에도 Kotlin/JVM 컴파일러는 아래 나열된 옵션을 가집니다.

### -classpath _path_ (-cp _path_)

지정된 경로에서 클래스 파일을 검색합니다. 클래스패스 요소는 시스템 경로 구분자(**;** Windows, **:** macOS/Linux)로 구분합니다.
클래스패스는 파일 및 디렉터리 경로, ZIP 또는 JAR 파일을 포함할 수 있습니다.

### -d _path_

생성된 클래스 파일을 지정된 위치에 배치합니다. 이 위치는 디렉터리, ZIP 또는 JAR 파일일 수 있습니다.

### -include-runtime

Kotlin 런타임을 결과 JAR 파일에 포함합니다. 결과 아카이브를 모든 자바 지원 환경에서 실행 가능하도록 만듭니다.

### -jdk-home _path_

기본 `JAVA_HOME`과 다른 경우 클래스패스에 포함할 사용자 지정 JDK 홈 디렉터리를 사용합니다.

### -Xjdk-release=version

생성된 JVM 바이트코드의 대상 버전을 지정합니다. 클래스패스의 JDK API를 지정된 자바 버전으로 제한합니다.
[`-jvm-target version`](#jvm-target-version)을 자동으로 설정합니다.
가능한 값은 `1.8`, `9`, `10`, ..., `21`입니다.

> 이 옵션은 각 JDK 배포판에 대해 [효과가 보장되지 않습니다](https://youtrack.jetbrains.com/issue/KT-29974).
>
{style="note"}

### -jvm-target _version_

생성된 JVM 바이트코드의 대상 버전을 지정합니다. 가능한 값은 `1.8`, `9`, `10`, ..., `21`입니다.
기본값은 `%defaultJvmTargetVersion%`입니다.

### -java-parameters

메서드 매개변수에 대한 Java 1.8 리플렉션을 위한 메타데이터를 생성합니다.

### -module-name _name_ (JVM)

생성된 `.kotlin_module` 파일에 사용자 지정 이름을 설정합니다.

### -no-jdk

클래스패스에 자바 런타임을 자동으로 포함하지 않습니다.

### -no-reflect

클래스패스에 Kotlin 리플렉션(`kotlin-reflect.jar`)을 자동으로 포함하지 않습니다.

### -no-stdlib (JVM)

클래스패스에 Kotlin/JVM 표준 라이브러리(`kotlin-stdlib.jar`)와 Kotlin 리플렉션(`kotlin-reflect.jar`)을 자동으로 포함하지 않습니다.

### -script-templates _classnames[,]_

스크립트 정의 템플릿 클래스입니다. 정규화된 클래스 이름을 사용하고 쉼표(`,`)로 구분합니다.

## Kotlin/JS 컴파일러 옵션

JS용 Kotlin 컴파일러는 Kotlin 소스 파일을 자바스크립트 코드로 컴파일합니다.
Kotlin-JS 컴파일을 위한 명령줄 도구는 `kotlinc-js`입니다.

[공통 옵션](#common-options) 외에도 Kotlin/JS 컴파일러는 아래 나열된 옵션을 가집니다.

### -target {es5|es2015}

지정된 ECMA 버전에 대한 JS 파일을 생성합니다.

### -libraries _path_

`.meta.js` 및 `.kjsm` 파일을 포함하는 Kotlin 라이브러리 경로이며, 시스템 경로 구분자로 구분됩니다.

### -main _{call|noCall}_

`main` 함수가 실행 시 호출되어야 하는지 정의합니다.

### -meta-info

메타데이터가 포함된 `.meta.js` 및 `.kjsm` 파일을 생성합니다. JS 라이브러리를 생성할 때 이 옵션을 사용하세요.

### -module-kind {umd|commonjs|amd|plain}

컴파일러가 생성하는 JS 모듈의 종류:

- `umd` - [유니버설 모듈 정의(Universal Module Definition)](https://github.com/umdjs/umd) 모듈
- `commonjs` - [CommonJS](http://www.commonjs.org/) 모듈
- `amd` - [비동기 모듈 정의(Asynchronous Module Definition)](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 모듈
- `plain` - 일반 JS 모듈

다양한 종류의 JS 모듈과 그 차이점에 대해 자세히 알아보려면 [이](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) 문서를 참조하세요.

### -no-stdlib (JS)

기본 Kotlin/JS 표준 라이브러리를 컴파일 종속성에 자동으로 포함하지 않습니다.

### -output _filepath_

컴파일 결과의 대상 파일을 설정합니다. 값은 이름이 포함된 `.js` 파일의 경로여야 합니다.

### -output-postfix _filepath_

지정된 파일의 내용을 출력 파일의 끝에 추가합니다.

### -output-prefix _filepath_

지정된 파일의 내용을 출력 파일의 시작 부분에 추가합니다.

### -source-map

소스 맵을 생성합니다.

### -source-map-base-dirs _path_

지정된 경로를 기준 디렉터리로 사용합니다. 기준 디렉터리는 소스 맵에서 상대 경로를 계산하는 데 사용됩니다.

### -source-map-embed-sources _{always|never|inlining}_

소스 파일을 소스 맵에 임베드합니다.

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

Kotlin 코드에 선언한 변수 및 함수 이름을 소스 맵에 추가합니다.

| 설정 | 설명 | 출력 예시 |
|---|---|---|
| `simple-names` | 변수 이름과 단순 함수 이름이 추가됩니다. (기본값) | `main` |
| `fully-qualified-names` | 변수 이름과 정규화된 함수 이름이 추가됩니다. | `com.example.kjs.playground.main` |
| `no` | 변수 또는 함수 이름이 추가되지 않습니다. | N/A |

### -source-map-prefix

소스 맵의 경로에 지정된 접두사를 추가합니다.

## Kotlin/Native 컴파일러 옵션

Kotlin/Native 컴파일러는 Kotlin 소스 파일을 [지원되는 플랫폼](native-overview.md#target-platforms)을 위한 네이티브 바이너리로 컴파일합니다.
Kotlin/Native 컴파일을 위한 명령줄 도구는 `kotlinc-native`입니다.

[공통 옵션](#common-options) 외에도 Kotlin/Native 컴파일러는 아래 나열된 옵션을 가집니다.

### -enable-assertions (-ea)

생성된 코드에서 런타임 어설션을 활성화합니다.

### -g

디버그 정보 생성을 활성화합니다. 이 옵션은 최적화 수준을 낮추므로 [`-opt`](#opt) 옵션과 함께 사용하지 않는 것이 좋습니다.

### -generate-test-runner (-tr)

프로젝트에서 단위 테스트를 실행하기 위한 애플리케이션을 생성합니다.

### -generate-no-exit-test-runner (-trn)

명시적인 프로세스 종료 없이 단위 테스트를 실행하기 위한 애플리케이션을 생성합니다.

### -include-binary _path_ (-ib _path_)

생성된 klib 파일 내에 외부 바이너리를 팩(pack)합니다.

### -library _path_ (-l _path_)

라이브러리와 링크합니다. Kotlin/Native 프로젝트에서 라이브러리 사용에 대해 알아보려면 [Kotlin/Native 라이브러리](native-libraries.md)를 참조하세요.

### -library-version _version_ (-lv _version_)

라이브러리 버전을 설정합니다.

### -list-targets

사용 가능한 하드웨어 대상을 나열합니다.

### -manifest _path_

매니페스트 추가 파일을 제공합니다.

### -module-name _name_ (Native)

컴파일 모듈의 이름을 지정합니다.
이 옵션은 Objective-C로 내보내는 선언에 대한 이름 접두사를 지정하는 데도 사용할 수 있습니다:
[Kotlin 프레임워크에 대한 사용자 지정 Objective-C 접두사/이름을 어떻게 지정하나요?](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

네이티브 비트코드 라이브러리를 포함합니다.

### -no-default-libs

컴파일러와 함께 배포되는 사전 빌드된 [플랫폼 라이브러리](native-platform-libs.md)와 사용자 코드를 링크하는 것을 비활성화합니다.

### -nomain

`main` 진입점이 외부 라이브러리에 의해 제공되는 것으로 가정합니다.

### -nopack

라이브러리를 klib 파일로 팩하지 않습니다.

### -linker-option

바이너리 빌드 중 링커에 인수를 전달합니다. 이는 일부 네이티브 라이브러리와 링크하는 데 사용될 수 있습니다.

### -linker-options _args_

바이너리 빌드 중 링커에 여러 인수를 전달합니다. 인수는 공백으로 구분합니다.

### -nostdlib

표준 라이브러리(stdlib)와 링크하지 않습니다.

### -opt

컴파일 최적화를 활성화하고 더 나은 런타임 성능을 가진 바이너리를 생성합니다. 이 옵션은 최적화 수준을 낮추는 [`-g`](#g) 옵션과 함께 사용하지 않는 것이 좋습니다.

### -output _name_ (-o _name_)

출력 파일의 이름을 설정합니다.

### -entry _name_ (-e _name_)

정규화된 진입점 이름을 지정합니다.

### -produce _output_ (-p _output_)

출력 파일 종류를 지정합니다:

- `program` (프로그램)
- `static` (정적)
- `dynamic` (동적)
- `framework` (프레임워크)
- `library` (라이브러리)
- `bitcode` (비트코드)

### -repo _path_ (-r _path_)

라이브러리 검색 경로입니다. 자세한 내용은 [라이브러리 검색 순서](native-libraries.md#library-search-sequence)를 참조하세요.

### -target _target_

하드웨어 대상을 설정합니다. 사용 가능한 대상 목록을 보려면 [`-list-targets`](#list-targets) 옵션을 사용하세요.