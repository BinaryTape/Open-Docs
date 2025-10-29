[//]: # (title: Kotlin 컴파일러 옵션)

각 Kotlin 릴리스에는 지원되는 타겟인 JVM, JavaScript, 그리고 [지원되는 플랫폼](native-overview.md#target-platforms)을 위한 네이티브 바이너리용 컴파일러가 포함되어 있습니다.

이 컴파일러는 다음에서 사용됩니다:
* IDE에서, Kotlin 프로젝트의 __Compile__ 또는 __Run__ 버튼을 클릭할 때.
* Gradle에서, 콘솔 또는 IDE에서 `gradle build`를 호출할 때.
* Maven에서, 콘솔 또는 IDE에서 `mvn compile` 또는 `mvn test-compile`을 호출할 때.

[명령줄 컴파일러 작업하기](command-line.md) 튜토리얼에 설명된 대로 명령줄에서 Kotlin 컴파일러를 수동으로 실행할 수도 있습니다.

## 컴파일러 옵션

Kotlin 컴파일러는 컴파일 프로세스를 조정하기 위한 여러 옵션을 가지고 있습니다.
서로 다른 타겟에 대한 컴파일러 옵션은 각 옵션에 대한 설명과 함께 이 페이지에 나열되어 있습니다.

컴파일러 옵션과 해당 값(_컴파일러 인자_)을 설정하는 방법은 여러 가지가 있습니다:
* IntelliJ IDEA에서, **Settings/Preferences** | **Build, Execution, Deployment** | **Compiler** | **Kotlin Compiler**의 **Additional command line parameters** 텍스트 상자에 컴파일러 인자를 작성합니다.
* Gradle을 사용하는 경우, Kotlin 컴파일 태스크의 `compilerOptions` 속성에 컴파일러 인자를 지정합니다. 자세한 내용은 [Gradle 컴파일러 옵션](gradle-compiler-options.md#how-to-define-options)을 참조하세요.
* Maven을 사용하는 경우, Maven 플러그인 노드의 `<configuration>` 요소에 컴파일러 인자를 지정합니다. 자세한 내용은 [Maven](maven.md#specify-compiler-options)을 참조하세요.
* 명령줄 컴파일러를 실행하는 경우, 유틸리티 호출에 컴파일러 인자를 직접 추가하거나 [argfile](#argfile)에 작성합니다.

  예를 들어:

  ```bash
  $ kotlinc hello.kt -include-runtime -d hello.jar
  ```

  > Windows에서, 구분 문자(공백, `=`, `;`, `,`)를 포함하는 컴파일러 인자를 전달할 때는 해당 인자를 큰따옴표(`"`)로 묶으세요.
  > ```
  > $ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
  > ```
  {style="note"}

## 컴파일러 옵션 스키마

모든 컴파일러 옵션에 대한 공통 스키마는 JAR 아티팩트인 [`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description) 아래에 게시됩니다. 이 아티팩트에는 코드 표현과 모든 컴파일러 옵션 설명의 JSON 동등물(Kotlin을 사용하지 않는 소비자를 위해)이 모두 포함됩니다. 또한 각 옵션이 도입되거나 안정화된 버전과 같은 메타데이터도 포함됩니다.

## 공통 옵션

다음 옵션은 모든 Kotlin 컴파일러에 공통적으로 적용됩니다.

### -version

컴파일러 버전을 표시합니다.

### -verbose

컴파일 프로세스에 대한 세부 정보를 포함하는 상세 로깅 출력을 활성화합니다.

### -script

Kotlin 스크립트 파일을 평가합니다. 이 옵션으로 호출되면, 컴파일러는 주어진 인자들 중 첫 번째 Kotlin 스크립(`*.kts`) 파일을 실행합니다.

### -help (-h)

사용 정보("usage information")를 표시하고 종료합니다. 표준 옵션만 표시됩니다.
고급 옵션을 표시하려면 `-X`를 사용하세요.

### -X

<primary-label ref="experimental-general"/>

고급 옵션에 대한 정보를 표시하고 종료합니다. 이 옵션들은 현재 불안정하며, 이름과 동작이 예고 없이 변경될 수 있습니다.

### -kotlin-home _path_

런타임 라이브러리 검색에 사용되는 Kotlin 컴파일러의 사용자 정의 경로를 지정합니다.

### -P plugin:pluginId:optionName=value

Kotlin 컴파일러 플러그인에 옵션을 전달합니다.
핵심 플러그인과 해당 옵션은 문서의 [핵심 컴파일러 플러그인](components-stability.md#core-compiler-plugins) 섹션에 나열되어 있습니다.

### -language-version _version_

지정된 Kotlin 버전과의 소스 호환성을 제공합니다.

### -api-version _version_

지정된 Kotlin 번들 라이브러리 버전의 선언만 사용하도록 허용합니다.

### -progressive

컴파일러의 [프로그레시브 모드](whatsnew13.md#progressive-mode)를 활성화합니다.

프로그레시브 모드에서는 불안정한 코드에 대한 사용 중단 및 버그 수정이 유예 기간 없이 즉시 적용됩니다.
프로그레시브 모드로 작성된 코드는 하위 호환성을 가지지만, 비-프로그레시브 모드로 작성된 코드는 프로그레시브 모드에서 컴파일 오류를 일으킬 수 있습니다.

### @argfile

주어진 파일에서 컴파일러 옵션을 읽습니다. 이러한 파일에는 값과 소스 파일 경로가 포함된 컴파일러 옵션이 포함될 수 있습니다. 옵션과 경로는 공백으로 구분해야 합니다. 예를 들어:

```
-include-runtime -d hello.jar hello.kt
```

공백을 포함하는 값을 전달하려면 작은따옴표(**'**) 또는 큰따옴표(**"**)로 묶으세요. 값에 따옴표가 포함되어 있다면 백슬래시(**\\**)로 이스케이프하세요.
```
-include-runtime -d 'My folder'
```

예를 들어, 컴파일러 옵션과 소스 파일을 분리하기 위해 여러 인자 파일을 전달할 수도 있습니다.

```bash
$ kotlinc @compiler.options @classes
```

파일이 현재 디렉터리와 다른 위치에 있는 경우 상대 경로를 사용하세요.

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

주어진 정규화된 이름의 요구 사항 어노테이션으로 [옵트인](opt-in-requirements.md)이 필요한 API의 사용을 활성화합니다.

### -Xrepl

<primary-label ref="experimental-general"/>

Kotlin REPL을 활성화합니다.

```bash
kotlinc -Xrepl
```

### -Xannotation-target-all

<primary-label ref="experimental-general"/>

실험적인 어노테이션을 위한 [`all` 사용 지점 타겟](annotations.md#all-meta-target)을 활성화합니다:

```bash
kotlinc -Xannotation-target-all
```

### -Xannotation-default-target=param-property

<primary-label ref="experimental-general"/>

어노테이션 사용 지점 타겟에 대한 새로운 실험적인 [기본 규칙](annotations.md#defaults-when-no-use-site-targets-are-specified)을 활성화합니다:

```bash
kotlinc -Xannotation-default-target=param-property
```

### 경고 관리

#### -nowarn

컴파일 중 모든 경고를 억제합니다.

#### -Werror

모든 경고를 컴파일 오류로 처리합니다.

#### -Wextra

참일 경우 경고를 발생하는 [추가 선언, 표현식 및 타입 컴파일러 검사](whatsnew21.md#extra-compiler-checks)를 활성화합니다.

#### -Xrender-internal-diagnostic-names
<primary-label ref="experimental-general"/>

경고와 함께 내부 진단 이름을 출력합니다. 이는 `-Xwarning-level` 옵션에 대해 구성된 `DIAGNOSTIC_NAME`을 식별하는 데 유용합니다.

#### -Xwarning-level
<primary-label ref="experimental-general"/>

특정 컴파일러 경고의 심각도 수준을 구성합니다:

```bash
kotlinc -Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`: 지정된 경고만 오류로 높입니다.
* `warning`: 지정된 진단에 대해 경고를 발생시키며 기본적으로 활성화됩니다.
* `disabled`: 지정된 경고만 모듈 전체에서 억제합니다.

모듈 전체 규칙과 특정 규칙을 결합하여 프로젝트에서 경고 보고를 조정할 수 있습니다:

| 명령                                            | 설명                                                 |
|----------------------------------------------------|-------------------------------------------------------------|
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning`  | 지정된 경고를 제외한 모든 경고를 억제합니다.        |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning`  | 지정된 경고를 제외한 모든 경고를 오류로 높입니다. |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 지정된 검사를 제외한 모든 추가 검사를 활성화합니다. |

일반 규칙에서 제외할 경고가 많은 경우, [`@argfile`](#argfile)을 사용하여 별도의 파일에 나열할 수 있습니다.

[`-Xrender-internal-diagnostic-names`](#xrender-internal-diagnostic-names)를 사용하여 `DIAGNOSTIC_NAME`을 확인할 수 있습니다.

### -Xdata-flow-based-exhaustiveness
<primary-label ref="experimental-general"/>

데이터 흐름 기반 `when` 표현식 완전성 검사를 활성화합니다.

### -Xallow-reified-type-in-catch
<primary-label ref="experimental-general"/>

`inline` 함수의 `catch` 절에서 `reified` `Throwable` 타입 파라미터에 대한 지원을 활성화합니다.

### Kotlin 계약(contract) 옵션
<primary-label ref="experimental-general"/>

다음 옵션은 실험적인 Kotlin 계약(contract) 기능을 활성화합니다.

#### -Xallow-contracts-on-more-functions

속성 접근자(property accessors), 특정 연산자 함수, 제네릭 타입에 대한 타입 어설션(type assertions)을 포함하여 추가 선언에서 계약(contract)을 활성화합니다.

#### -Xallow-condition-implies-returns-contracts

계약(contract)에서 `returnsNotNull()` 함수를 사용하여 지정된 조건에 대해 null이 아닌 반환 값을 가정할 수 있도록 합니다.

#### -Xallow-holdsin-contract

계약(contract)에서 `holdsIn` 키워드를 사용하여 람다 내부에서 부울 조건이 `true`라고 가정할 수 있도록 합니다.

## Kotlin/JVM 컴파일러 옵션

JVM용 Kotlin 컴파일러는 Kotlin 소스 파일을 Java 클래스 파일로 컴파일합니다.
Kotlin-JVM 컴파일을 위한 명령줄 도구는 `kotlinc`와 `kotlinc-jvm`입니다.
Kotlin 스크립트 파일을 실행하는 데도 사용할 수 있습니다.

[공통 옵션](#common-options) 외에도 Kotlin/JVM 컴파일러는 아래 나열된 옵션을 가지고 있습니다.

### -classpath _path_ (-cp _path_)

지정된 경로에서 클래스 파일을 검색합니다. 클래스패스 요소는 시스템 경로 구분 기호(Windows에서는 **;**, macOS/Linux에서는 **:**)로 구분합니다.
클래스패스는 파일 및 디렉터리 경로, ZIP 또는 JAR 파일을 포함할 수 있습니다.

### -d _path_

생성된 클래스 파일을 지정된 위치에 배치합니다. 위치는 디렉터리, ZIP 또는 JAR 파일일 수 있습니다.

### -include-runtime

결과 JAR 파일에 Kotlin 런타임을 포함합니다. 결과 아카이브를 모든 Java 사용 가능한 환경에서 실행 가능하게 만듭니다.

### -jdk-home _path_

기본 `JAVA_HOME`과 다른 경우 클래스패스에 포함할 사용자 정의 JDK 홈 디렉터리를 사용합니다.

### -Xjdk-release=version

<primary-label ref="experimental-general"/>

생성된 JVM 바이트코드의 타겟 버전을 지정합니다. 클래스패스의 JDK API를 지정된 Java 버전으로 제한합니다.
자동으로 [`-jvm-target version`](#jvm-target-version)을 설정합니다.
가능한 값은 `1.8`, `9`, `10`, ..., `24`입니다.

> 이 옵션은 각 JDK 배포판에 대해 효과가 [보장되지 않습니다](https://youtrack.jetbrains.com/issue/KT-29974).
>
{style="note"}

### -jvm-target _version_

생성된 JVM 바이트코드의 타겟 버전을 지정합니다. 가능한 값은 `1.8`, `9`, `10`, ..., `24`입니다.
기본값은 `%defaultJvmTargetVersion%`입니다.

### -java-parameters

메서드 파라미터에 대한 Java 1.8 리플렉션용 메타데이터를 생성합니다.

### -module-name _name_ (JVM)

생성된 `.kotlin_module` 파일의 사용자 정의 이름을 설정합니다.

### -no-jdk

Java 런타임을 클래스패스에 자동으로 포함하지 않습니다.

### -no-reflect

Kotlin 리플렉션(`kotlin-reflect.jar`)을 클래스패스에 자동으로 포함하지 않습니다.

### -no-stdlib (JVM)

Kotlin/JVM stdlib(`kotlin-stdlib.jar`) 및 Kotlin 리플렉션(`kotlin-reflect.jar`)을 클래스패스에 자동으로 포함하지 않습니다.

### -script-templates _classnames[,]_

스크립트 정의 템플릿 클래스입니다. 정규화된 클래스 이름을 사용하고 쉼표(**,**)로 구분합니다.

### -Xjvm-expose-boxed

<primary-label ref="experimental-general"/>

모듈의 모든 인라인 값 클래스의 박스된 버전을, 해당 클래스를 사용하는 함수의 박스된 변형과 함께 생성하여, 이 둘 모두 Java에서 접근할 수 있도록 합니다. 자세한 내용은 Java에서 Kotlin 호출 가이드의 [인라인 값 클래스](java-to-kotlin-interop.md#inline-value-classes)를 참조하세요.

### -jvm-default _mode_

인터페이스에 선언된 함수가 JVM에서 기본 메서드로 컴파일되는 방식을 제어합니다.

| 모드               | 설명                                                                                                                       |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `enable`           | 인터페이스에 기본 구현을 생성하고 서브클래스 및 `DefaultImpls` 클래스에 브리지 함수를 포함합니다. (기본값) |
| `no-compatibility` | 호환성 브리지와 `DefaultImpls` 클래스를 건너뛰고 인터페이스에 기본 구현만 생성합니다.                  |
| `disable`          | 기본 메서드를 건너뛰고 호환성 브리지와 `DefaultImpls` 클래스만 생성합니다.                                        |

## Kotlin/JS 컴파일러 옵션

JS용 Kotlin 컴파일러는 Kotlin 소스 파일을 JavaScript 코드로 컴파일합니다.
Kotlin-JS 컴파일을 위한 명령줄 도구는 `kotlinc-js`입니다.

[공통 옵션](#common-options) 외에도 Kotlin/JS 컴파일러는 아래 나열된 옵션을 가지고 있습니다.

### -target {es5|es2015}

지정된 ECMA 버전에 대한 JS 파일을 생성합니다.

### -libraries _path_

.meta.js 및 .kjsm 파일을 포함하는 Kotlin 라이브러리 경로이며, 시스템 경로 구분 기호로 구분됩니다.

### -main _{call|noCall}_

실행 시 `main` 함수를 호출해야 하는지 여부를 정의합니다.

### -meta-info

메타데이터를 포함하는 `.meta.js` 및 `.kjsm` 파일을 생성합니다. JS 라이브러리를 생성할 때 이 옵션을 사용합니다.

### -module-kind {umd|commonjs|amd|plain}

컴파일러가 생성하는 JS 모듈의 종류:

- `umd` - [Universal Module Definition](https://github.com/umdjs/umd) 모듈
- `commonjs` - [CommonJS](http://www.commonjs.org/) 모듈
- `amd` - [Asynchronous Module Definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 모듈
- `plain` - 일반 JS 모듈

다양한 JS 모듈 종류와 그 차이점에 대해 자세히 알아보려면 [이](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) 문서를 참조하세요.

### -no-stdlib (JS)

기본 Kotlin/JS stdlib를 컴파일 종속성에 자동으로 포함하지 않습니다.

### -output _filepath_

컴파일 결과의 대상 파일을 설정합니다. 값은 `.js` 파일의 경로와 파일 이름을 포함해야 합니다.

### -output-postfix _filepath_

지정된 파일의 내용을 출력 파일 끝에 추가합니다.

### -output-prefix _filepath_

지정된 파일의 내용을 출력 파일 시작 부분에 추가합니다.

### -source-map

소스 맵을 생성합니다.

### -source-map-base-dirs _path_

지정된 경로를 기본 디렉터리로 사용합니다. 기본 디렉터리는 소스 맵에서 상대 경로를 계산하는 데 사용됩니다.

### -source-map-embed-sources _{always|never|inlining}_

소스 파일을 소스 맵에 포함합니다.

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

Kotlin 코드에서 선언한 변수 및 함수 이름을 소스 맵에 추가합니다.

| 설정 | 설명 | 예시 출력 |
|---|---|---|
| `simple-names` | 변수 이름과 단순 함수 이름이 추가됩니다. (기본값) | `main` |
| `fully-qualified-names` | 변수 이름과 정규화된 함수 이름이 추가됩니다. | `com.example.kjs.playground.main` |
| `no` | 변수 또는 함수 이름이 추가되지 않습니다. | N/A |

### -source-map-prefix

소스 맵의 경로에 지정된 접두사를 추가합니다.

### -Xes-long-as-bigint
<primary-label ref="experimental-general"/>

현대 JavaScript (ES2020)로 컴파일할 때 Kotlin `Long` 값을 표현하기 위해 JavaScript `BigInt` 타입 지원을 활성화합니다.

## Kotlin/Native 컴파일러 옵션

Kotlin/Native 컴파일러는 Kotlin 소스 파일을 [지원되는 플랫폼](native-overview.md#target-platforms)을 위한 네이티브 바이너리로 컴파일합니다.
Kotlin/Native 컴파일을 위한 명령줄 도구는 `kotlinc-native`입니다.

[공통 옵션](#common-options) 외에도 Kotlin/Native 컴파일러는 아래 나열된 옵션을 가지고 있습니다.

### -enable-assertions (-ea)

생성된 코드에서 런타임 어설션을 활성화합니다.

### -g

디버그 정보 생성을 활성화합니다. 이 옵션은 최적화 수준을 낮추므로 [`-opt`](#opt) 옵션과 함께 사용해서는 안 됩니다.

### -generate-test-runner (-tr)

프로젝트에서 유닛 테스트를 실행하기 위한 애플리케이션을 생성합니다.

### -generate-no-exit-test-runner (-trn)

명시적인 프로세스 종료 없이 유닛 테스트를 실행하기 위한 애플리케이션을 생성합니다.

### -include-binary _path_ (-ib _path_)

생성된 klib 파일 내부에 외부 바이너리를 패킹합니다.

### -library _path_ (-l _path_)

라이브러리와 링크합니다. Kotlin/Native 프로젝트에서 라이브러리 사용에 대해 자세히 알아보려면 [Kotlin/Native 라이브러리](native-libraries.md)를 참조하세요.

### -library-version _version_ (-lv _version_)

라이브러리 버전을 설정합니다.

### -list-targets

사용 가능한 하드웨어 타겟을 나열합니다.

### -manifest _path_

매니페스트 추가 파일을 제공합니다.

### -module-name _name_ (Native)

컴파일 모듈의 이름을 지정합니다.
이 옵션은 Objective-C로 내보내진 선언에 대한 이름 접두사를 지정하는 데도 사용할 수 있습니다:
[Kotlin 프레임워크에 대한 사용자 정의 Objective-C 접두사/이름을 어떻게 지정하나요?](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

네이티브 비트코드 라이브러리를 포함합니다.

### -no-default-libs

컴파일러와 함께 배포되는 미리 빌드된 [플랫폼 라이브러리](native-platform-libs.md)와 사용자 코드 링크를 비활성화합니다.

### -nomain

`main` 진입점이 외부 라이브러리에 의해 제공된다고 가정합니다.

### -nopack

라이브러리를 klib 파일로 패킹하지 않습니다.

### -linker-option

바이너리 빌드 중 링커에 인자를 전달합니다. 이는 일부 네이티브 라이브러리에 대해 링크하는 데 사용될 수 있습니다.

### -linker-options _args_

바이너리 빌드 중 링커에 여러 인자를 전달합니다. 인자를 공백으로 구분합니다.

### -nostdlib

stdlib와 링크하지 않습니다.

### -opt

컴파일 최적화를 활성화하고 더 나은 런타임 성능을 가진 바이너리를 생성합니다. 이것은 최적화 수준을 낮추는 [`-g`](#g) 옵션과 함께 사용하는 것을 권장하지 않습니다.

### -output _name_ (-o _name_)

출력 파일의 이름을 설정합니다.

### -entry _name_ (-e _name_)

정규화된 진입점 이름을 지정합니다.

### -produce _output_ (-p _output_)

출력 파일 종류를 지정합니다:

- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### -repo _path_ (-r _path_)

라이브러리 검색 경로입니다. 자세한 내용은 [라이브러리 검색 순서](native-libraries.md#library-search-sequence)를 참조하세요.

### -target _target_

하드웨어 타겟을 설정합니다. 사용 가능한 타겟 목록을 보려면 [`-list-targets`](#list-targets) 옵션을 사용하세요.