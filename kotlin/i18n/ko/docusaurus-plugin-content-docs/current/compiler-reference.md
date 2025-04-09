---
title: "Kotlin 컴파일러 옵션"
---
Kotlin의 각 릴리스에는 지원되는 대상에 대한 컴파일러가 포함됩니다.
[지원되는 플랫폼](native-overview#target-platforms)에 대한 JVM, JavaScript 및 네이티브 바이너리.

이러한 컴파일러는 다음에 의해 사용됩니다.
* Kotlin 프로젝트에 대해 __Compile__ 또는 __Run__ 버튼을 클릭할 때 IDE에서 사용됩니다.
* 콘솔 또는 IDE에서 `gradle build`를 호출할 때 Gradle에서 사용됩니다.
* 콘솔 또는 IDE에서 `mvn compile` 또는 `mvn test-compile`을 호출할 때 Maven에서 사용됩니다.

[명령줄 컴파일러 작업](command-line) 튜토리얼에 설명된 대로 명령줄에서 Kotlin 컴파일러를 수동으로 실행할 수도 있습니다.

## 컴파일러 옵션

Kotlin 컴파일러에는 컴파일 프로세스를 조정하기 위한 여러 옵션이 있습니다.
다양한 대상에 대한 컴파일러 옵션이 각 옵션에 대한 설명과 함께 이 페이지에 나열되어 있습니다.

컴파일러 옵션 및 해당 값(_컴파일러 인수_)을 설정하는 방법에는 여러 가지가 있습니다.
* IntelliJ IDEA에서 **Settings/Preferences** | **Build, Execution, Deployment** | **Compiler** | **Kotlin Compiler**의 **Additional command line parameters** 텍스트 상자에 컴파일러 인수를 작성합니다.
* Gradle을 사용하는 경우 Kotlin 컴파일 작업의 `compilerOptions` 속성에서 컴파일러 인수를 지정합니다.
자세한 내용은 [Gradle 컴파일러 옵션](gradle-compiler-options#how-to-define-options)을 참조하세요.
* Maven을 사용하는 경우 Maven 플러그인 노드의 `<configuration>` 요소에서 컴파일러 인수를 지정합니다.
자세한 내용은 [Maven](maven#specify-compiler-options)을 참조하세요.
* 명령줄 컴파일러를 실행하는 경우 컴파일러 인수를 유틸리티 호출에 직접 추가하거나 [argfile](#argfile)에 작성합니다.

예시:

```bash
$ kotlinc hello.kt -include-runtime -d hello.jar
```

:::note
Windows에서는 구분 기호 문자(공백, `=`, `;`, `,`)가 포함된 컴파일러 인수를 전달할 때
이러한 인수를 큰따옴표(`"`)로 묶습니다.
```
$ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
```

:::

## 공통 옵션

다음 옵션은 모든 Kotlin 컴파일러에 공통적입니다.

### -version

컴파일러 버전을 표시합니다.

### -nowarn

컴파일 중에 컴파일러가 경고를 표시하지 않도록 합니다.

### -Werror

모든 경고를 컴파일 오류로 전환합니다.

### -Wextra

활성화하면 경고를 발생시키는 [추가 선언, 표현식 및 유형 컴파일러 검사](whatsnew21#extra-compiler-checks)를 활성화합니다.

### -verbose

컴파일 프로세스에 대한 세부 정보가 포함된 자세한 로깅 출력을 활성화합니다.

### -script

Kotlin 스크립트 파일을 평가합니다. 이 옵션을 사용하여 호출하면 컴파일러는 지정된 인수 중에서 첫 번째 Kotlin 스크립트(`*.kts`) 파일을 실행합니다.

### -help (-h)

사용 정보을 표시하고 종료합니다. 표준 옵션만 표시됩니다.
고급 옵션을 표시하려면 `-X`를 사용합니다.

### -X

고급 옵션에 대한 정보를 표시하고 종료합니다. 이러한 옵션은 현재 불안정합니다.
이름과 동작은 예고 없이 변경될 수 있습니다.

### -kotlin-home _path_

런타임 라이브러리 검색에 사용되는 Kotlin 컴파일러에 대한 사용자 지정 경로를 지정합니다.

### -P plugin:pluginId:optionName=value

Kotlin 컴파일러 플러그인에 옵션을 전달합니다.
핵심 플러그인 및 해당 옵션은 설명서의 [핵심 컴파일러 플러그인](components-stability#core-compiler-plugins) 섹션에 나열되어 있습니다.

### -language-version _version_

지정된 Kotlin 버전과의 소스 호환성을 제공합니다.

### -api-version _version_

지정된 버전의 Kotlin 번들 라이브러리에서만 선언을 사용할 수 있도록 허용합니다.

### -progressive

컴파일러에 대한 [프로그레시브 모드](whatsnew13#progressive-mode)를 활성화합니다.

프로그레시브 모드에서는 불안정한 코드에 대한 폐기 및 버그 수정이 정상적인 마이그레이션 주기를 거치지 않고 즉시 적용됩니다.
프로그레시브 모드로 작성된 코드는 이전 버전과 호환됩니다. 그러나
비프로그레시브 모드로 작성된 코드는 프로그레시브 모드에서 컴파일 오류를 일으킬 수 있습니다.

### @argfile

지정된 파일에서 컴파일러 옵션을 읽습니다. 이러한 파일에는 값과 함께 컴파일러 옵션
및 소스 파일에 대한 경로가 포함될 수 있습니다. 옵션과 경로는 공백으로 구분해야 합니다. 예시:

```
-include-runtime -d hello.jar hello.kt
```

공백이 포함된 값을 전달하려면 작은따옴표(**'**) 또는 큰따옴표(**"**)로 묶습니다. 값에
따옴표가 포함된 경우 백슬래시(**\\**)로 이스케이프합니다.
```
-include-runtime -d 'My folder'
```

예를 들어 컴파일러 옵션을 소스 파일과 분리하기 위해 여러 인수 파일을 전달할 수도 있습니다.

```bash
$ kotlinc @compiler.options @classes
```

파일이 현재 디렉터리와 다른 위치에 있는 경우 상대 경로를 사용합니다.

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

주어진 정규화된 이름으로 요구 사항 주석이 있는 [옵트인 필요](opt-in-requirements) API의 사용을 활성화합니다.

### -Xsuppress-warning

특정 경고를 [전체 프로젝트에서 전역적으로 표시하지 않도록 합니다](whatsnew21#global-warning-suppression). 예시:

```bash
kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
```

## Kotlin/JVM 컴파일러 옵션

JVM용 Kotlin 컴파일러는 Kotlin 소스 파일을 Java 클래스 파일로 컴파일합니다.
Kotlin에서 JVM 컴파일로의 명령줄 도구는 `kotlinc` 및 `kotlinc-jvm`입니다.
Kotlin 스크립트 파일을 실행하는 데 사용할 수도 있습니다.

[공통 옵션](#common-options) 외에도 Kotlin/JVM 컴파일러에는 아래에 나열된 옵션이 있습니다.

### -classpath _path_ (-cp _path_)

지정된 경로에서 클래스 파일을 검색합니다. 클래스 경로의 요소를 시스템 경로 구분 기호로 구분합니다(**;** Windows, **:** macOS/Linux).
클래스 경로에는 파일 및 디렉터리 경로, ZIP 또는 JAR 파일이 포함될 수 있습니다.

### -d _path_

생성된 클래스 파일을 지정된 위치에 배치합니다. 위치는 디렉터리, ZIP 또는 JAR 파일일 수 있습니다.

### -include-runtime

Kotlin 런타임을 결과 JAR 파일에 포함합니다. 결과 아카이브를 모든 Java 지원
환경에서 실행 가능하게 만듭니다.

### -jdk-home _path_

기본 `JAVA_HOME`과 다른 경우 클래스 경로에 포함할 사용자 지정 JDK 홈 디렉터리를 사용합니다.

### -Xjdk-release=version

생성된 JVM 바이트코드의 대상 버전을 지정합니다. 클래스 경로에 있는 JDK의 API를 지정된 Java 버전으로 제한합니다.
자동으로 [`-jvm-target version`](#jvm-target-version)을 설정합니다.
가능한 값은 `1.8`, `9`, `10`, ..., `21`입니다.

:::note
이 옵션은 각 JDK 배포판에 대해 효과가 있다고 [보장되지 않습니다](https://youtrack.jetbrains.com/issue/KT-29974).

:::

### -jvm-target _version_

생성된 JVM 바이트코드의 대상 버전을 지정합니다. 가능한 값은 `1.8`, `9`, `10`, ..., `21`입니다.
기본값은 `1.8`입니다.

### -java-parameters

메서드 매개 변수에 대한 Java 1.8 리플렉션의 메타데이터를 생성합니다.

### -module-name _name_ (JVM)

생성된 `.kotlin_module` 파일에 대한 사용자 지정 이름을 설정합니다.

### -no-jdk

Java 런타임을 클래스 경로에 자동으로 포함하지 않습니다.

### -no-reflect

Kotlin 리플렉션(`kotlin-reflect.jar`)을 클래스 경로에 자동으로 포함하지 않습니다.

### -no-stdlib (JVM)

Kotlin/JVM stdlib(`kotlin-stdlib.jar`) 및 Kotlin 리플렉션(`kotlin-reflect.jar`)을 자동으로 포함하지 않습니다.
클래스 경로에.

### -script-templates _classnames[,]_

스크립트 정의 템플릿 클래스. 정규화된 클래스 이름을 사용하고 쉼표(`,`)로 구분합니다.

## Kotlin/JS 컴파일러 옵션

JS용 Kotlin 컴파일러는 Kotlin 소스 파일을 JavaScript 코드로 컴파일합니다.
Kotlin에서 JS 컴파일로의 명령줄 도구는 `kotlinc-js`입니다.

[공통 옵션](#common-options) 외에도 Kotlin/JS 컴파일러에는 아래에 나열된 옵션이 있습니다.

### -target _\{es5|es2015\}_

지정된 ECMA 버전에 대한 JS 파일을 생성합니다.

### -libraries _path_

`.meta.js` 및 `.kjsm` 파일이 있는 Kotlin 라이브러리에 대한 경로(시스템 경로 구분 기호로 구분됨).

### -main _\{call|noCall\}_

실행 시 `main` 함수를 호출해야 하는지 여부를 정의합니다.

### -meta-info

메타데이터가 있는 `.meta.js` 및 `.kjsm` 파일을 생성합니다. JS 라이브러리를 만들 때 이 옵션을 사용합니다.

### -module-kind _\{umd|commonjs|amd|plain\}_

컴파일러에서 생성된 JS 모듈의 종류:

- `umd` - [Universal Module Definition](https://github.com/umdjs/umd) 모듈
- `commonjs` - [CommonJS](http://www.commonjs.org/) 모듈
- `amd` - [Asynchronous Module Definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 모듈
- `plain` - 일반 JS 모듈

다양한 종류의 JS 모듈과 그 차이점에 대해 자세히 알아보려면
[이](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) 기사를 참조하세요.

### -no-stdlib (JS)

기본 Kotlin/JS stdlib를 컴파일 종속성에 자동으로 포함하지 않습니다.

### -output _filepath_

컴파일 결과에 대한 대상 파일을 설정합니다. 값은 이름이 포함된 `.js` 파일에 대한 경로여야 합니다.

### -output-postfix _filepath_

지정된 파일의 콘텐츠를 출력 파일의 끝에 추가합니다.

### -output-prefix _filepath_

지정된 파일의 콘텐츠를 출력 파일의 시작 부분에 추가합니다.

### -source-map

소스 맵을 생성합니다.

### -source-map-base-dirs _path_

지정된 경로를 기본 디렉터리로 사용합니다. 기본 디렉터리는 소스 맵에서 상대 경로를 계산하는 데 사용됩니다.

### -source-map-embed-sources _\{always|never|inlining\}_

소스 파일을 소스 맵에 포함합니다.

### -source-map-names-policy _\{simple-names|fully-qualified-names|no\}_

Kotlin 코드에서 선언한 변수 및 함수 이름을 소스 맵에 추가합니다.

| 설정 | 설명 | 출력 예시 |
|---|---|---|
| `simple-names` | 변수 이름과 단순 함수 이름이 추가됩니다. (기본값) | `main` |
| `fully-qualified-names` | 변수 이름과 정규화된 함수 이름이 추가됩니다. | `com.example.kjs.playground.main` |
| `no` | 변수 또는 함수 이름이 추가되지 않습니다. | 해당 없음 |

### -source-map-prefix

지정된 접두사를 소스 맵의 경로에 추가합니다.

## Kotlin/Native 컴파일러 옵션

Kotlin/Native 컴파일러는 Kotlin 소스 파일을 [지원되는 플랫폼](native-overview#target-platforms)용 네이티브 바이너리로 컴파일합니다.
Kotlin/Native 컴파일용 명령줄 도구는 `kotlinc-native`입니다.

[공통 옵션](#common-options) 외에도 Kotlin/Native 컴파일러에는 아래에 나열된 옵션이 있습니다.

### -enable-assertions (-ea)

생성된 코드에서 런타임 어설션을 활성화합니다.

### -g

디버그 정보 방출을 활성화합니다. 이 옵션은 최적화 수준을 낮추고
[`-opt`](#opt) 옵션과 결합해서는 안 됩니다.

### -generate-test-runner (-tr)

프로젝트에서 단위 테스트를 실행하기 위한 애플리케이션을 생성합니다.

### -generate-no-exit-test-runner (-trn)

명시적인 프로세스 종료 없이 단위 테스트를 실행하기 위한 애플리케이션을 생성합니다.

### -include-binary _path_ (-ib _path_)

생성된 klib 파일 내에 외부 바이너리를 패킹합니다.

### -library _path_ (-l _path_)

라이브러리와 링크합니다. Kotlin/Native 프로젝트에서 라이브러리 사용에 대한 자세한 내용은
[Kotlin/Native 라이브러리](native-libraries)를 참조하세요.

### -library-version _version_ (-lv _version_)

라이브러리 버전을 설정합니다.

### -list-targets

사용 가능한 하드웨어 대상을 나열합니다.

### -manifest _path_

매니페스트 추가 파일 제공합니다.

### -module-name _name_ (Native)

컴파일 모듈의 이름을 지정합니다.
이 옵션을 사용하여 Objective-C로 내보낸 선언에 대한 이름 접두사를 지정할 수도 있습니다.
[Kotlin 프레임워크에 대한 사용자 지정 Objective-C 접두사/이름을 지정하려면 어떻게 해야 합니까?](native-faq#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

네이티브 비트코드 라이브러리를 포함합니다.

### -no-default-libs

컴파일러와 함께 배포되는 미리 빌드된 [플랫폼 라이브러리](native-platform-libs)와 함께 사용자 코드를 링크하는 것을 비활성화합니다.

### -nomain

`main` 진입점이 외부 라이브러리에서 제공되는 것으로 가정합니다.

### -nopack

라이브러리를 klib 파일로 패킹하지 않습니다.

### -linker-option

바이너리 빌드 중에 링커에 인수를 전달합니다. 이는 일부 네이티브 라이브러리에 대해 링크하는 데 사용할 수 있습니다.

### -linker-options _args_

바이너리 빌드 중에 링커에 여러 인수를 전달합니다. 공백으로 인수를 구분합니다.

### -nostdlib

stdlib와 링크하지 않습니다.

### -opt

컴파일 최적화를 활성화하고 런타임 성능이 향상된 바이너리를 생성합니다. 최적화 수준을 낮추는
[`-g`](#g) 옵션과 결합하는 것은 권장되지 않습니다.

### -output _name_ (-o _name_)

출력 파일의 이름을 설정합니다.

### -entry _name_ (-e _name_)

정규화된 진입점 이름을 지정합니다.

### -produce _output_ (-p _output_)

출력 파일 종류를 지정합니다.

- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### -repo _path_ (-r _path_)

라이브러리 검색 경로. 자세한 내용은 [라이브러리 검색 순서](native-libraries#library-search-sequence)를 참조하세요.

### -target _target_

하드웨어 대상을 설정합니다. 사용 가능한 대상 목록을 보려면 [`-list-targets`](#list-targets) 옵션을 사용합니다.