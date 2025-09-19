[//]: # (title: Kotlin/JS 프로젝트 설정하기)

Kotlin/JS 프로젝트는 Gradle을 빌드 시스템으로 사용합니다. 개발자들이 Kotlin/JS 프로젝트를 쉽게 관리할 수 있도록, JetBrains는 JavaScript 개발에 일반적인 루틴을 자동화하는 헬퍼 태스크와 함께 프로젝트 구성 도구를 제공하는 `kotlin.multiplatform` Gradle 플러그인을 제공합니다.

이 플러그인은 [npm](https://www.npmjs.com/) 또는 [Yarn](https://yarnpkg.com/) 패키지 관리자를 사용하여 백그라운드에서 npm 의존성을 다운로드하고, [webpack](https://webpack.js.org/)을 사용하여 Kotlin 프로젝트에서 JavaScript 번들을 빌드합니다. 의존성 관리 및 구성 조정은 대부분 Gradle 빌드 파일에서 직접 수행할 수 있으며, 전체 제어를 위해 자동으로 생성된 구성을 재정의하는 옵션도 있습니다.

`build.gradle(.kts)` 파일에서 `org.jetbrains.kotlin.multiplatform` 플러그인을 Gradle 프로젝트에 수동으로 적용할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

Kotlin 멀티플랫폼 Gradle 플러그인을 사용하면 빌드 스크립트의 `kotlin {}` 블록에서 프로젝트의 여러 측면을 관리할 수 있습니다.

```groovy
kotlin {
    // ...
}
```

`kotlin {}` 블록 내부에서는 다음 측면을 관리할 수 있습니다.

*   [대상 실행 환경](#execution-environments): 브라우저 또는 Node.js
*   [ES2015 기능 지원](#support-for-es2015-features): 클래스, 모듈 및 제너레이터
*   [출력 세분성 구성](#configure-output-granularity)
*   [TypeScript 선언 파일 생성](#generation-of-typescript-declaration-files-d-ts)
*   [프로젝트 의존성](#dependencies): Maven 및 npm
*   [실행 구성](#run-task)
*   [테스트 구성](#test-task)
*   [번들링](#webpack-bundling) 및 브라우저 프로젝트를 위한 [CSS 지원](#css)
*   [대상 디렉터리](#distribution-target-directory) 및 [모듈 이름](#module-name)
*   [프로젝트의 `package.json` 파일](#package-json-customization)

## 실행 환경

Kotlin/JS 프로젝트는 두 가지 다른 실행 환경을 대상으로 할 수 있습니다.

*   **브라우저**: 브라우저에서 클라이언트 측 스크립팅용
*   [**Node.js**](https://nodejs.org/): 브라우저 외부에서 JavaScript 코드를 실행하기 위함 (예: 서버 측 스크립팅용).

Kotlin/JS 프로젝트의 대상 실행 환경을 정의하려면, 내부에 `browser {}` 또는 `nodejs {}`를 포함한 `js {}` 블록을 추가합니다.

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

`binaries.executable()` 명령어는 Kotlin 컴파일러가 실행 가능한 `.js` 파일을 생성하도록 명시적으로 지시합니다. `binaries.executable()`를 생략하면 컴파일러는 Kotlin 내부 라이브러리 파일만 생성하며, 이 파일은 다른 프로젝트에서 사용될 수 있지만 자체적으로 실행될 수는 없습니다.

> 이는 일반적으로 실행 파일 생성보다 빠르며, 프로젝트의 리프가 아닌 모듈을 다룰 때 가능한 최적화가 될 수 있습니다.
>
{style="tip"}

Kotlin 멀티플랫폼 플러그인은 선택된 환경에서 작동하도록 태스크를 자동으로 구성합니다. 여기에는 애플리케이션 실행 및 테스트에 필요한 환경과 의존성 다운로드 및 설치가 포함됩니다. 이를 통해 개발자는 추가 구성 없이 간단한 프로젝트를 빌드, 실행 및 테스트할 수 있습니다. Node.js를 대상으로 하는 프로젝트의 경우, 기존 Node.js 설치를 사용하는 옵션도 있습니다. [사전 설치된 Node.js 사용하기](#use-pre-installed-node-js) 방법을 알아보세요.

## ES2015 기능 지원

Kotlin은 다음 ES2015 기능에 대한 [실험적](components-stability.md#stability-levels-explained) 지원을 제공합니다.

*   **모듈**: 코드베이스를 단순화하고 유지보수성을 향상시킵니다.
*   **클래스**: OOP 원칙을 통합하여 더 깔끔하고 직관적인 코드를 만들 수 있습니다.
*   **제너레이터**: 최종 번들 크기를 줄이고 디버깅에 도움이 되는 [정지 함수](https://kotlinlang.org/docs/composing-suspending-functions.html) 컴파일용.

지원되는 모든 ES2015 기능을 한 번에 활성화하려면 `build.gradle(.kts)` 파일에 `es2015` 컴파일 대상을 추가하세요.

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    compilerOptions {
        target = "es2015"
    }
}
```

[공식 문서에서 ES2015 (ECMAScript 2015, ES6)에 대해 더 자세히 알아보세요.](https://262.ecma-international.org/6.0/)

## 출력 세분성 구성

컴파일러가 프로젝트에서 `.js` 파일을 출력하는 방식을 선택할 수 있습니다.

*   **모듈별 하나**. 기본적으로 JS 컴파일러는 각 프로젝트 모듈에 대해 별도의 `.js` 파일을 컴파일 결과로 출력합니다.
*   **프로젝트별 하나**. `gradle.properties` 파일에 다음 줄을 추가하여 전체 프로젝트를 단일 `.js` 파일로 컴파일할 수 있습니다.

    ```none
    kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
    ```

*   **파일별 하나**. 각 Kotlin 파일당 하나(또는 파일에 내보내진 선언이 포함된 경우 두 개)의 JavaScript 파일을 생성하는 더 세분화된 출력을 설정할 수 있습니다. 파일별 컴파일 모드를 활성화하려면:
    1.  프로젝트에서 ES2015 기능을 지원하도록 `es2015`를 [컴파일 대상](#support-for-es2015-features)으로 설정합니다.
    2.  `gradle.properties` 파일에 다음 줄을 추가합니다.
        ```none
        kotlin.js.ir.output.granularity=per-file // 'per-module' is the default
        ```

## TypeScript 선언 파일 (`d.ts`) 생성
<primary-label ref="experimental-opt-in"/>

Kotlin/JS 컴파일러는 Kotlin 코드에서 TypeScript 정의를 생성할 수 있습니다. 이 정의는 하이브리드 애플리케이션 작업 시 JavaScript 도구 및 IDE에서 다음 용도로 사용될 수 있습니다.

*   자동 완성 제공
*   정적 분석기 지원
*   JavaScript 및 TypeScript 프로젝트에서 Kotlin 코드 추가 간소화

TypeScript 정의 생성은 [비즈니스 로직 공유 사용 사례](js-overview.md#use-cases-for-kotlin-js)에 특히 유용합니다.

컴파일러는 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation)로 표시된 모든 최상위 선언을 수집하고 `.d.ts` 파일에 TypeScript 정의를 자동으로 생성합니다.

TypeScript 정의를 생성하려면 Gradle 빌드 파일에 명시적으로 구성해야 합니다. [`js {}` 블록](js-project-setup.md#execution-environments) 내의 `build.gradle.kts` 파일에 `generateTypeScriptDefinitions()` 함수를 추가하세요.

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

정의는 해당 웹팩 미적용 JavaScript 코드와 함께 `build/js/packages/<package_name>/kotlin` 디렉터리에서 찾을 수 있습니다.

## 의존성

다른 모든 Gradle 프로젝트와 마찬가지로, Kotlin/JS 프로젝트는 빌드 스크립트의 `dependencies {}` 블록에서 전통적인 Gradle [의존성 선언](https://docs.gradle.org/current/userguide/declaring_dependencies.html)을 지원합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation("org.example.myproject", "1.1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation 'org.example.myproject:1.1.0'
}
```

</tab>
</tabs>

Kotlin 멀티플랫폼 Gradle 플러그인은 또한 빌드 스크립트의 `kotlin {}` 블록에서 특정 소스 세트에 대한 의존성 선언을 지원합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation("org.example.myproject:1.1.0")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jsMain {
            dependencies {
                implementation 'org.example.myproject:1.1.0'
            }
        }
    }
}
```

</tab>
</tabs>

> Kotlin 프로그래밍 언어에서 사용할 수 있는 모든 라이브러리가 JavaScript를 대상으로 할 때 사용 가능한 것은 아닙니다. Kotlin/JS용 아티팩트를 포함하는 라이브러리만 사용할 수 있습니다.
>
{style="note"}

추가하는 라이브러리가 [npm 패키지](#npm-dependencies)에 의존성을 가지고 있다면, Gradle은 이러한 전이적 의존성도 자동으로 해결합니다.

### Kotlin 표준 라이브러리

[표준 라이브러리](https://kotlinlang.org/api/latest/jvm/stdlib/index.html)에 대한 의존성은 자동으로 추가됩니다. 표준 라이브러리 버전은 Kotlin 멀티플랫폼 플러그인 버전과 동일합니다.

멀티플랫폼 테스트의 경우, [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API를 사용할 수 있습니다. 멀티플랫폼 프로젝트를 생성할 때, `commonTest`에 단일 의존성을 사용하여 모든 소스 세트에 테스트 의존성을 추가할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // Brings all the platform dependencies automatically
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // Brings all the platform dependencies automatically
            }
        }
    }
}
```

</tab>
</tabs>

### npm 의존성

JavaScript 세계에서 의존성을 관리하는 가장 일반적인 방법은 [npm](https://www.npmjs.com/)입니다. npm은 가장 큰 JavaScript 모듈 공개 저장소를 제공합니다.

Kotlin 멀티플랫폼 Gradle 플러그인을 사용하면 다른 의존성을 선언하는 방식과 동일하게 Gradle 빌드 스크립트에서 npm 의존성을 선언할 수 있습니다.

npm 의존성을 선언하려면, 의존성 선언 내부에 있는 `npm()` 함수에 해당 이름과 버전을 전달하세요. [npm의 semver 문법](https://docs.npmjs.com/about-semantic-versioning)을 기반으로 하나 이상의 버전 범위를 지정할 수도 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(npm("react", "> 14.0.0 <=16.9.0"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation npm('react', '> 14.0.0 <=16.9.0')
}
```

</tab>
</tabs>

기본적으로 플러그인은 npm 의존성을 다운로드하고 설치하기 위해 [Yarn](https://yarnpkg.com/lang/en/) 패키지 관리자의 별도 인스턴스를 사용합니다. 이는 추가 구성 없이 바로 사용할 수 있지만, [특정 요구 사항에 맞게 조정](#yarn)할 수 있습니다.

대신 [npm](https://www.npmjs.com/) 패키지 관리자를 직접 사용하여 npm 의존성을 다룰 수도 있습니다. npm을 패키지 관리자로 사용하려면, `gradle.properties` 파일에 다음 속성을 설정하세요.

```none
kotlin.js.yarn=false
```

일반 의존성 외에도 Gradle DSL에서 사용할 수 있는 세 가지 유형의 의존성이 더 있습니다. 각 의존성 유형이 언제 가장 잘 사용될 수 있는지 자세히 알아보려면 npm에서 링크된 공식 문서를 참조하세요.

*   `devDependencies`: `devNpm(...)`을 통해
*   `optionalDependencies`: `optionalNpm(...)`을 통해
*   `peerDependencies`: `peerNpm(...)`을 통해

npm 의존성이 설치되면, [Kotlin에서 JS 호출하기](js-interop.md)에 설명된 대로 코드에서 해당 API를 사용할 수 있습니다.

## 실행 태스크

Kotlin 멀티플랫폼 Gradle 플러그인은 추가 구성 없이 순수 Kotlin/JS 프로젝트를 실행할 수 있는 `jsBrowserDevelopmentRun` 태스크를 제공합니다.

브라우저에서 Kotlin/JS 프로젝트를 실행하는 경우, 이 태스크는 `browserDevelopmentRun` 태스크(Kotlin 멀티플랫폼 프로젝트에서도 사용 가능)의 별칭입니다. 이 태스크는 [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)를 사용하여 JavaScript 아티팩트를 제공합니다. `webpack-dev-server`에서 사용하는 구성을 사용자 지정하려면, 예를 들어 서버가 실행되는 포트를 조정하려면 [webpack 구성 파일](#webpack-bundling)을 사용하세요.

Node.js를 대상으로 하는 Kotlin/JS 프로젝트를 실행하려면, `nodeRun` 태스크의 별칭인 `jsNodeDevelopmentRun` 태스크를 사용하세요.

프로젝트를 실행하려면, 표준 수명 주기 `jsBrowserDevelopmentRun` 태스크 또는 해당 별칭을 실행합니다.

```bash
./gradlew jsBrowserDevelopmentRun
```

소스 파일을 변경한 후 애플리케이션의 재빌드를 자동으로 트리거하려면, Gradle의 [지속적인 빌드](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) 기능을 사용하세요.

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

또는

```bash
./gradlew jsBrowserDevelopmentRun -t
```

프로젝트 빌드가 성공하면 `webpack-dev-server`는 브라우저 페이지를 자동으로 새로 고칩니다.

## 테스트 태스크

Kotlin 멀티플랫폼 Gradle 플러그인은 프로젝트를 위한 테스트 인프라를 자동으로 설정합니다. 브라우저 프로젝트의 경우, 필요한 다른 의존성과 함께 [Karma](https://karma-runner.github.io/) 테스트 러너를 다운로드하여 설치하며; Node.js 프로젝트의 경우, [Mocha](https://mochajs.org/) 테스트 프레임워크가 사용됩니다.

플러그인은 또한 다음과 같은 유용한 테스트 기능을 제공합니다.

*   소스 맵 생성
*   테스트 보고서 생성
*   콘솔에 테스트 실행 결과

브라우저 테스트를 실행하기 위해 플러그인은 기본적으로 [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)을 사용합니다. 빌드 스크립트의 `useKarma {}` 블록 내부에 해당 항목을 추가하여 다른 브라우저에서 테스트를 실행하도록 선택할 수도 있습니다.

```groovy
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useIe()
                    useSafari()
                    useFirefox()
                    useChrome()
                    useChromeCanary()
                    useChromeHeadless()
                    usePhantomJS()
                    useOpera()
                }
            }
        }
        binaries.executable()
        // ...
    }
}
```

또는 `gradle.properties` 파일에 브라우저용 테스트 대상을 추가할 수 있습니다.

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

이 접근 방식은 모든 모듈에 대한 브라우저 목록을 정의한 다음, 특정 모듈의 빌드 스크립트에서 특정 브라우저를 추가할 수 있도록 합니다.

Kotlin 멀티플랫폼 Gradle 플러그인은 이러한 브라우저를 자동으로 설치하지 않으며, 실행 환경에서 사용 가능한 브라우저만 사용합니다. 예를 들어, 지속적 통합 서버에서 Kotlin/JS 테스트를 실행하는 경우, 테스트하려는 브라우저가 설치되어 있는지 확인하세요.

테스트를 건너뛰려면, `testTask {}`에 `enabled = false` 줄을 추가하세요.

```groovy
kotlin {
    js {
        browser {
            testTask {
                enabled = false
            }
        }
        binaries.executable()
        // ...
    }
}
```

테스트를 실행하려면, 표준 수명 주기 `check` 태스크를 실행하세요.

```bash
./gradlew check
```

Node.js 테스트 러너가 사용하는 환경 변수를 지정하려면 (예: 테스트에 외부 정보를 전달하거나 패키지 해석을 세밀하게 조정하기 위해), 빌드 스크립트의 `testTask {}` 블록 내에서 키-값 쌍과 함께 `environment()` 함수를 사용하세요.

```groovy
kotlin {
    js {
        nodejs {
            testTask {
                environment("key", "value")
            }
        }
    }
}
```

### Karma 구성

Kotlin 멀티플랫폼 Gradle 플러그인은 빌드 시점에 `build.gradle(.kts)` 파일의 [`kotlin.js.browser.testTask.useKarma {}` 블록](#test-task) 설정을 포함하는 Karma 구성 파일을 자동으로 생성합니다. 이 파일은 `build/js/packages/projectName-test/karma.conf.js`에서 찾을 수 있습니다. Karma에서 사용하는 구성을 조정하려면, 프로젝트 루트의 `karma.config.d`라는 디렉터리 안에 추가 구성 파일을 배치하세요. 이 디렉터리의 모든 `.js` 구성 파일은 빌드 시점에 자동으로 감지되어 생성된 `karma.conf.js`에 병합됩니다.

> 이 경우, 구성 객체는 `config` 전역 객체입니다. 스크립트에서 이를 수정해야 합니다.
>
{style="note"}

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

모든 Karma 구성 기능은 Karma의 [문서](https://karma-runner.github.io/5.0/config/configuration-file.html)에 잘 설명되어 있습니다.

## webpack 번들링

브라우저 대상을 위해 Kotlin 멀티플랫폼 Gradle 플러그인은 널리 알려진 [webpack](https://webpack.js.org/) 모듈 번들러를 사용합니다.

### webpack 버전

Kotlin 멀티플랫폼 플러그인은 webpack %webpackMajorVersion%을 사용합니다.

1.5.0 이전 플러그인 버전으로 생성된 프로젝트가 있다면, 프로젝트의 `gradle.properties`에 다음 줄을 추가하여 해당 버전에서 사용된 webpack %webpackPreviousMajorVersion%으로 일시적으로 전환할 수 있습니다.

```none
kotlin.js.webpack.major.version=4
```

### webpack 태스크

가장 일반적인 webpack 조정은 Gradle 빌드 파일의 `kotlin.js.browser.webpackTask {}` 구성 블록을 통해 직접 수행할 수 있습니다.
*   `outputFileName` - webpack으로 번들링된 출력 파일의 이름입니다. webpack 태스크가 실행된 후 `<projectDir>/build/dist/<targetName>`에 생성됩니다. 기본값은 프로젝트 이름입니다.
*   `output.libraryTarget` - webpack으로 번들링된 출력에 대한 모듈 시스템입니다. [Kotlin/JS 프로젝트에 사용 가능한 모듈 시스템](js-modules.md)에 대해 자세히 알아보세요. 기본값은 `umd`입니다.

```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

`commonWebpackConfig {}` 블록에서 번들링, 실행 및 테스트 태스크에 사용할 공통 webpack 설정을 구성할 수도 있습니다.

### webpack 구성 파일

Kotlin 멀티플랫폼 Gradle 플러그인은 빌드 시점에 표준 webpack 구성 파일을 자동으로 생성합니다. 이 파일은 `build/js/packages/projectName/webpack.config.js`에 있습니다.

webpack 구성에 추가 조정을 하려면, 프로젝트 루트의 `webpack.config.d`라는 디렉터리 안에 추가 구성 파일을 배치하세요. 프로젝트를 빌드할 때, 모든 `.js` 구성 파일은 `build/js/packages/projectName/webpack.config.js` 파일에 자동으로 병합됩니다. 예를 들어, 새로운 [webpack 로더](https://webpack.js.org/loaders/)를 추가하려면 `webpack.config.d` 디렉터리 내의 `.js` 파일에 다음을 추가하세요.

> 이 경우, 구성 객체는 `config` 전역 객체입니다. 스크립트에서 이를 수정해야 합니다.
>
{style="note"}

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

모든 webpack 구성 기능은 [문서](https://webpack.js.org/concepts/configuration/)에 잘 설명되어 있습니다.

### 실행 파일 빌드

webpack을 통해 실행 가능한 JavaScript 아티팩트를 빌드하기 위해, Kotlin 멀티플랫폼 Gradle 플러그인은 `browserDevelopmentWebpack` 및 `browserProductionWebpack` Gradle 태스크를 포함합니다.

*   `browserDevelopmentWebpack`은 개발 아티팩트를 생성하며, 이 아티팩트는 크기가 크지만 생성하는 데 시간이 거의 걸리지 않습니다. 따라서 활발한 개발 중에는 `browserDevelopmentWebpack` 태스크를 사용하세요.

*   `browserProductionWebpack`은 생성된 아티팩트에 데드 코드 제거를 적용하고 결과 JavaScript 파일을 최소화합니다. 이는 시간이 더 걸리지만 크기가 더 작은 실행 파일을 생성합니다. 따라서 프로젝트를 프로덕션용으로 준비할 때는 `browserProductionWebpack` 태스크를 사용하세요.

개발 또는 프로덕션용으로 해당 아티팩트를 얻으려면 이 태스크 중 하나를 실행하세요. 생성된 파일은 [다른 곳에 지정되지 않는 한](#distribution-target-directory) `build/dist`에서 사용할 수 있습니다.

```bash
./gradlew browserProductionWebpack
```

이 태스크는 대상이 실행 파일 생성을 위해 구성된 경우에만 ( `binaries.executable()`를 통해) 사용 가능합니다.

## CSS

Kotlin 멀티플랫폼 Gradle 플러그인은 또한 webpack의 [CSS](https://webpack.js.org/loaders/css-loader/) 및 [스타일](https://webpack.js.org/loaders/style-loader/) 로더를 지원합니다. 모든 옵션은 프로젝트 빌드에 사용되는 [webpack 구성 파일](#webpack-bundling)을 직접 수정하여 변경할 수 있지만, 가장 일반적으로 사용되는 설정은 `build.gradle(.kts)` 파일에서 직접 사용할 수 있습니다.

프로젝트에서 CSS 지원을 켜려면, Gradle 빌드 파일의 `commonWebpackConfig {}` 블록에서 `cssSupport.enabled` 옵션을 설정하세요. 이 구성은 마법사를 사용하여 새 프로젝트를 만들 때 기본적으로 활성화됩니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
browser {
    commonWebpackConfig {
        cssSupport {
            it.enabled = true
        }
    }
}
```

</tab>
</tabs>

또는 `webpackTask {}`, `runTask {}`, `testTask {}`에 대해 독립적으로 CSS 지원을 추가할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
browser {
    webpackTask {
        cssSupport {
            enabled.set(true)
        }
    }
    runTask {
        cssSupport {
            enabled.set(true)
        }
    }
    testTask {
        useKarma {
            // ...
            webpackConfig.cssSupport {
                enabled.set(true)
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
browser {
    webpackTask {
        cssSupport {
            it.enabled = true
        }
    }
    runTask {
        cssSupport {
            it.enabled = true
        }
    }
    testTask {
        useKarma {
            // ...
            webpackConfig.cssSupport {
                it.enabled = true
            }
        }
    }
}
```

</tab>
</tabs>

프로젝트에서 CSS 지원을 활성화하면 `Module parse failed: Unexpected character '@' (14:0)`와 같이 구성되지 않은 프로젝트에서 스타일 시트를 사용하려고 할 때 발생하는 일반적인 오류를 방지하는 데 도움이 됩니다.

`cssSupport.mode`를 사용하여 발견된 CSS를 어떻게 처리할지 지정할 수 있습니다. 다음 값을 사용할 수 있습니다.

*   `"inline"` (기본값): 스타일이 전역 `<style>` 태그에 추가됩니다.
*   `"extract"`: 스타일이 별도 파일로 추출됩니다. 이 파일은 HTML 페이지에서 포함될 수 있습니다.
*   `"import"`: 스타일이 문자열로 처리됩니다. 이는 코드에서 CSS에 접근해야 할 때 유용할 수 있습니다 (예: `val styles = require("main.css")`).

동일한 프로젝트에 다른 모드를 사용하려면 `cssSupport.rules`를 사용하세요. 여기에서 모드와 함께 [포함](https://webpack.js.org/configuration/module/#ruleinclude) 및 [제외](https://webpack.js.org/configuration/module/#ruleexclude) 패턴을 정의하는 `KotlinWebpackCssRules` 목록을 지정할 수 있습니다.

## Node.js

Node.js를 대상으로 하는 Kotlin/JS 프로젝트의 경우, 플러그인은 호스트에 Node.js 환경을 자동으로 다운로드하여 설치합니다. 기존 Node.js 인스턴스가 있는 경우 이를 사용할 수도 있습니다.

### Node.js 설정 구성

각 하위 프로젝트에 대해 Node.js 설정을 구성하거나 프로젝트 전체에 대해 설정할 수 있습니다.

예를 들어, 특정 하위 프로젝트의 Node.js 버전을 설정하려면, `build.gradle(.kts)` 파일의 해당 Gradle 블록에 다음 줄을 추가하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</tab>
</tabs>

모든 하위 프로젝트를 포함하여 프로젝트 전체에 버전을 설정하려면, 동일한 코드를 `allProjects {}` 블록에 적용하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
allprojects {
    project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
        project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</tab>
</tabs>

> `NodeJsRootPlugin` 클래스를 사용하여 프로젝트 전체에 Node.js 설정을 구성하는 것은 더 이상 사용되지 않으며, 결국 지원이 중단될 예정입니다.
>
{style="note"}

### 사전 설치된 Node.js 사용하기

Kotlin/JS 프로젝트를 빌드하는 호스트에 Node.js가 이미 설치되어 있다면, Kotlin 멀티플랫폼 Gradle 플러그인이 자체 Node.js 인스턴스를 설치하는 대신 이를 사용하도록 구성할 수 있습니다.

사전 설치된 Node.js 인스턴스를 사용하려면, `build.gradle(.kts)` 파일에 다음 줄을 추가하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    // Set to `true` for default behavior
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().download = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    // Set to `true` for default behavior
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).download = false
}
```

</tab>
</tabs>

## Yarn

기본적으로 빌드 시점에 선언된 의존성을 다운로드하고 설치하기 위해, 플러그인은 자체 [Yarn](https://yarnpkg.com/lang/en/) 패키지 관리자 인스턴스를 관리합니다. 이는 추가 구성 없이 바로 사용할 수 있지만, 이를 조정하거나 호스트에 이미 설치된 Yarn을 사용할 수 있습니다.

### 추가 Yarn 기능: .yarnrc

추가 Yarn 기능을 구성하려면, 프로젝트 루트에 `.yarnrc` 파일을 배치하세요. 빌드 시점에 자동으로 감지됩니다.

예를 들어, npm 패키지용 사용자 지정 레지스트리를 사용하려면, 프로젝트 루트의 `.yarnrc`라는 파일에 다음 줄을 추가하세요.

```text
registry "http://my.registry/api/npm/"
```

[`.yarnrc`에 대해 더 자세히 알아보려면 공식 Yarn 문서](https://classic.yarnpkg.com/en/docs/yarnrc/)를 방문하세요.

### 사전 설치된 Yarn 사용하기

Kotlin/JS 프로젝트를 빌드하는 호스트에 Yarn이 이미 설치되어 있다면, Kotlin 멀티플랫폼 Gradle 플러그인이 자체 Yarn 인스턴스를 설치하는 대신 이를 사용하도록 구성할 수 있습니다.

사전 설치된 Yarn 인스턴스를 사용하려면, `build.gradle(.kts)`에 다음 줄을 추가하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
    // "true" for default behavior
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
}
 
```

</tab>
</tabs>

### `kotlin-js-store`를 통한 버전 잠금

> `kotlin-js-store`를 통한 버전 잠금은 Kotlin 1.6.10부터 사용할 수 있습니다.
>
{style="note"}

프로젝트 루트의 `kotlin-js-store` 디렉터리는 Kotlin 멀티플랫폼 Gradle 플러그인에 의해 버전 잠금에 필요한 `yarn.lock` 파일을 보관하기 위해 자동으로 생성됩니다. 잠금 파일은 Yarn 플러그인에 의해 완전히 관리되며 `kotlinNpmInstall` Gradle 태스크 실행 중에 업데이트됩니다.

[권장 관행](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)을 따르려면, `kotlin-js-store`와 그 내용을 버전 제어 시스템에 커밋하세요. 이는 모든 머신에서 애플리케이션이 정확히 동일한 의존성 트리로 빌드되도록 보장합니다.

필요한 경우, `build.gradle(.kts)`에서 디렉터리 및 잠금 파일 이름을 모두 변경할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</tab>
</tabs>

> 잠금 파일의 이름을 변경하면 의존성 검사 도구가 해당 파일을 더 이상 인식하지 못할 수 있습니다.
>
{style="warning"}

[ `yarn.lock`에 대해 더 자세히 알아보려면 공식 Yarn 문서](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)를 방문하세요.

### `yarn.lock` 업데이트 보고

Kotlin/JS는 `yarn.lock` 파일이 업데이트되었는지 여부를 알려줄 수 있는 Gradle 설정을 제공합니다. CI 빌드 프로세스 중에 `yarn.lock`이 자동으로 변경된 경우 알림을 받고 싶을 때 이 설정을 사용할 수 있습니다.

*   `YarnLockMismatchReport`: `yarn.lock` 파일 변경 사항이 보고되는 방식을 지정합니다. 다음 값 중 하나를 사용할 수 있습니다.
    *   `FAIL`: 해당 Gradle 태스크를 실패시킵니다. 이것이 기본값입니다.
    *   `WARNING`: 변경 사항에 대한 정보를 경고 로그에 기록합니다.
    *   `NONE`: 보고를 비활성화합니다.
*   `reportNewYarnLock`: 최근에 생성된 `yarn.lock` 파일에 대해 명시적으로 보고합니다. 기본적으로 이 옵션은 비활성화되어 있습니다. 첫 시작 시 새로운 `yarn.lock` 파일을 생성하는 것이 일반적인 관행입니다. 이 옵션을 사용하여 파일이 리포지토리에 커밋되었는지 확인할 수 있습니다.
*   `yarnLockAutoReplace`: Gradle 태스크가 실행될 때마다 `yarn.lock`을 자동으로 대체합니다.

이 옵션들을 사용하려면, `build.gradle(.kts)`를 다음과 같이 업데이트하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).reportNewYarnLock = false // true
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockAutoReplace = false // true
}
```

</tab>
</tabs>

### `--ignore-scripts`를 기본값으로 사용하여 npm 의존성 설치

> 기본적으로 `--ignore-scripts`로 npm 의존성을 설치하는 것은 Kotlin 1.6.10부터 사용할 수 있습니다.
>
{style="note"}

손상된 npm 패키지로부터 악성 코드가 실행될 가능성을 줄이기 위해, Kotlin 멀티플랫폼 Gradle 플러그인은 기본적으로 npm 의존성 설치 중 [수명 주기 스크립트](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts) 실행을 방지합니다.

다음 줄을 `build.gradle(.kts)`에 추가하여 수명 주기 스크립트 실행을 명시적으로 활성화할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> { 
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
```

</tab>
</tabs>

## 배포 대상 디렉터리

기본적으로 Kotlin/JS 프로젝트 빌드 결과는 프로젝트 루트 내의 `/build/dist/<targetName>/<binaryName>` 디렉터리에 있습니다.

> Kotlin 1.9.0 이전에는 기본 배포 대상 디렉터리가 `/build/distributions`였습니다.
>
{style="note" }

프로젝트 배포 파일의 다른 위치를 설정하려면, 빌드 스크립트의 `browser {}` 블록 내부에 `distribution {}` 블록을 추가하고 `set()` 메서드를 사용하여 `outputDirectory` 속성에 값을 할당하세요. 프로젝트 빌드 태스크를 실행하면 Gradle은 출력 번들을 프로젝트 리소스와 함께 이 위치에 저장합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    js {
        browser {
            distribution {
                outputDirectory.set(projectDir.resolve("output"))
            }
        }
        binaries.executable()
        // ...
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    js {
        browser {
            distribution {
                outputDirectory = file("$projectDir/output")
            }
        }
        binaries.executable()
        // ...
    }
}
```

</tab>
</tabs>

## 모듈 이름

해당 `.js` 및 `.d.ts` 파일을 포함하여 JavaScript _모듈_ ( `build/js/packages/myModuleName`에 생성됨)의 이름을 조정하려면 `outputModuleName` 옵션을 사용하세요.

```groovy
js {
    outputModuleName = "myModuleName"
}
```

이는 `build/dist`의 webpack 번들링 출력에는 영향을 미치지 않습니다.

## `package.json` 사용자 지정

`package.json` 파일은 JavaScript 패키지의 메타데이터를 담고 있습니다. npm과 같은 인기 있는 패키지 레지스트리는 게시된 모든 패키지에 이러한 파일이 있어야 한다고 요구합니다. 이들은 이를 사용하여 패키지 게시를 추적하고 관리합니다.

Kotlin 멀티플랫폼 Gradle 플러그인은 빌드 시점에 Kotlin/JS 프로젝트용 `package.json`을 자동으로 생성합니다. 기본적으로 이 파일은 필수 데이터(이름, 버전, 라이선스, 의존성 및 기타 패키지 속성)를 포함합니다.

기본 패키지 속성 외에도 `package.json`은 JavaScript 프로젝트가 어떻게 동작해야 하는지 정의할 수 있으며, 예를 들어 실행 가능한 스크립트를 식별할 수 있습니다.

Gradle DSL을 통해 프로젝트의 `package.json`에 사용자 지정 항목을 추가할 수 있습니다. `package.json`에 사용자 지정 필드를 추가하려면, 컴파일의 `packageJson` 블록에서 `customField()` 함수를 사용하세요.

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

프로젝트를 빌드할 때, 이 코드는 `package.json` 파일에 다음 블록을 추가합니다.

```json
"hello": {
    "one": 1,
    "two": 2
}
```

npm 레지스트리용 `package.json` 파일 작성에 대해 [npm 문서](https://docs.npmjs.com/cli/v6/configuring-npm/package-json)에서 자세히 알아보세요.