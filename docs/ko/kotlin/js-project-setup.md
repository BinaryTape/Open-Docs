---
title: "Kotlin/JS 프로젝트 설정"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin/JS 프로젝트는 빌드 시스템으로 Gradle을 사용합니다. 개발자가 Kotlin/JS 프로젝트를 쉽게 관리할 수 있도록, JavaScript 개발에 일반적인 루틴 자동화를 위한 도우미 작업과 함께 프로젝트 구성 도구를 제공하는 `kotlin.multiplatform` Gradle 플러그인을 제공합니다.

이 플러그인은 [npm](https://www.npmjs.com/) 또는 [Yarn](https://yarnpkg.com/) 패키지 관리자를 사용하여 백그라운드에서 npm 종속성을 다운로드하고 [webpack](https://webpack.js.org/)을 사용하여 Kotlin 프로젝트에서 JavaScript 번들을 빌드합니다. 종속성 관리 및 구성 조정은 Gradle 빌드 파일에서 직접 수행할 수 있으며, 자동 생성된 구성을 재정의하여 완벽하게 제어할 수도 있습니다.

`build.gradle(.kts)` 파일에서 Gradle 프로젝트에 `org.jetbrains.kotlin.multiplatform` 플러그인을 수동으로 적용할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

Kotlin Multiplatform Gradle 플러그인을 사용하면 빌드 스크립트의 `kotlin {}` 블록에서 프로젝트의 여러 측면을 관리할 수 있습니다.

```groovy
kotlin {
    // ...
}
```

`kotlin {}` 블록 내에서 다음 측면을 관리할 수 있습니다.

* [대상 실행 환경](#execution-environments): 브라우저 또는 Node.js
* [ES2015 기능 지원](#support-for-es2015-features): 클래스, 모듈 및 생성기
* [프로젝트 종속성](#dependencies): Maven 및 npm
* [실행 구성](#run-task)
* [테스트 구성](#test-task)
* 브라우저 프로젝트에 대한 [번들링](#webpack-bundling) 및 [CSS 지원](#css)
* [대상 디렉터리](#distribution-target-directory) 및 [모듈 이름](#module-name)
* [프로젝트의 `package.json` 파일](#package-json-customization)

## 실행 환경

Kotlin/JS 프로젝트는 두 가지 다른 실행 환경을 대상으로 할 수 있습니다.

* 브라우저 내 클라이언트 측 스크립팅을 위한 브라우저
* 서버 측 스크립팅과 같이 브라우저 외부에서 JavaScript 코드를 실행하기 위한 [Node.js](https://nodejs.org/).

Kotlin/JS 프로젝트의 대상 실행 환경을 정의하려면 `browser {}` 또는 `nodejs {}`가 있는 `js {}` 블록을 추가합니다.

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

`binaries.executable()` 명령어는 Kotlin 컴파일러가 실행 가능한 `.js` 파일을 내보내도록 명시적으로 지시합니다.
`binaries.executable()`을 생략하면 컴파일러는 다른 프로젝트에서 사용할 수 있지만 자체적으로 실행할 수 없는 Kotlin 내부 라이브러리 파일만 생성합니다.

:::note
일반적으로 실행 파일 생성보다 빠르며, 프로젝트의 리프 모듈이 아닌 모듈을 처리할 때 가능한 최적화 방법이 될 수 있습니다.

Kotlin Multiplatform 플러그인은 선택한 환경에서 작동하도록 해당 작업을 자동으로 구성합니다.
여기에는 애플리케이션 실행 및 테스트에 필요한 환경과 종속성 다운로드 및 설치가 포함됩니다.
이를 통해 개발자는 추가 구성 없이도 간단한 프로젝트를 빌드, 실행 및 테스트할 수 있습니다. Node.js를 대상으로 하는 프로젝트의 경우 기존 Node.js 설치를 사용하는 옵션도 있습니다. [사전 설치된 Node.js 사용 방법](#use-pre-installed-node-js)을 참조하십시오.

## ES2015 기능 지원

Kotlin은 다음 ES2015 기능에 대한 [Experimental](components-stability#stability-levels-explained) 지원을 제공합니다.

* 코드베이스를 간소화하고 유지 관리 용이성을 향상시키는 모듈.
* OOP 원칙을 통합하여 더욱 깔끔하고 직관적인 코드를 생성할 수 있는 클래스.
* 최종 번들 크기를 개선하고 디버깅에 도움이 되는 [suspend 함수](composing-suspending-functions) 컴파일을 위한 생성기.

`build.gradle(.kts)` 파일에 `es2015` 컴파일 대상을 추가하여 지원되는 모든 ES2015 기능을 한 번에 활성화할 수 있습니다.

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        target = "es2015"
    }
}
```

[ES2015 (ECMAScript 2015, ES6)에 대한 자세한 내용은 공식 문서를 참조하십시오](https://262.ecma-international.org/6.0/).

## 종속성

다른 Gradle 프로젝트와 마찬가지로 Kotlin/JS 프로젝트는 빌드 스크립트의 `dependencies {}` 블록에서 기존 Gradle [종속성 선언](https://docs.gradle.org/current/userguide/declaring_dependencies.html)을 지원합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation("org.example.myproject", "1.1.0")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation 'org.example.myproject:1.1.0'
}
```

</TabItem>
</Tabs>

Kotlin Multiplatform Gradle 플러그인은 빌드 스크립트의 `kotlin {}` 블록에서 특정 소스 세트에 대한 종속성 선언도 지원합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

JavaScript를 대상으로 할 때 Kotlin 프로그래밍 언어에서 사용할 수 있는 모든 라이브러리를 사용할 수 있는 것은 아닙니다.
Kotlin/JS에 대한 아티팩트가 포함된 라이브러리만 사용할 수 있습니다.

:::

추가하려는 라이브러리가 [npm의 패키지에 대한 종속성](#npm-dependencies)이 있는 경우 Gradle은 이러한 전이적 종속성도 자동으로 확인합니다.

### Kotlin 표준 라이브러리

[표준 라이브러리](https://kotlinlang.org/api/latest/jvm/stdlib/index.html)에 대한 종속성은 자동으로 추가됩니다. 표준 라이브러리 버전은 Kotlin Multiplatform 플러그인 버전과 동일합니다.

멀티플랫폼 테스트의 경우 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API를 사용할 수 있습니다. 멀티플랫폼 프로젝트를 생성할 때 `commonTest`에서 단일 종속성을 사용하여 모든 소스 세트에 테스트 종속성을 추가할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // Brings all the platform dependencies automatically
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

### npm 종속성

JavaScript 세계에서 종속성을 관리하는 가장 일반적인 방법은 [npm](https://www.npmjs.com/)입니다.
JavaScript 모듈의 가장 큰 공용 리포지토리를 제공합니다.

Kotlin Multiplatform Gradle 플러그인을 사용하면 다른 종속성을 선언하는 것과 마찬가지로 Gradle 빌드 스크립트에서 npm 종속성을 선언할 수 있습니다.

npm 종속성을 선언하려면 종속성 선언 내에서 해당 이름과 버전을 `npm()` 함수에 전달합니다.
[npm의 semver 구문](https://docs.npmjs.com/about-semantic-versioning)을 기반으로 하나 이상의 버전 범위를 지정할 수도 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation(npm("react", "> 14.0.0 &lt;=16.9.0"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation npm('react', '> 14.0.0 &lt;=16.9.0')
}
```

</TabItem>
</Tabs>

기본적으로 플러그인은 [Yarn](https://yarnpkg.com/lang/en/) 패키지 관리자의 별도 인스턴스를 사용하여 npm 종속성을 다운로드하고 설치합니다. 추가 구성 없이 즉시 작동하지만 [특정 요구 사항에 맞게 조정](#yarn)할 수 있습니다.

대신 [npm](https://www.npmjs.com/) 패키지 관리자를 사용하여 npm 종속성을 직접 사용할 수도 있습니다.
npm을 패키지 관리자로 사용하려면 `gradle.properties` 파일에서 다음 속성을 설정합니다.

```none
kotlin.js.yarn=false
```

일반 종속성 외에도 Gradle DSL에서 사용할 수 있는 세 가지 유형의 종속성이 더 있습니다.
각 종속성 유형을 가장 잘 사용할 수 있는 경우에 대한 자세한 내용은 npm에서 연결된 공식 문서를 참조하십시오.

* [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies): `devNpm(...)`을 통해
* [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies): `optionalNpm(...)`을 통해
* [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies): `peerNpm(...)`을 통해

npm 종속성이 설치되면 [Kotlin에서 JS 호출](js-interop)에 설명된 대로 코드에서 해당 API를 사용할 수 있습니다.

## run 작업

Kotlin Multiplatform Gradle 플러그인은 추가 구성 없이 순수 Kotlin/JS 프로젝트를 실행할 수 있는 `jsBrowserDevelopmentRun` 작업을 제공합니다.

브라우저에서 Kotlin/JS 프로젝트를 실행하기 위해 이 작업은 `browserDevelopmentRun` 작업의 별칭입니다 (Kotlin 멀티플랫폼 프로젝트에서도 사용 가능). [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)를 사용하여 JavaScript 아티팩트를 제공합니다.
예를 들어 서버가 실행되는 포트를 조정하는 등 `webpack-dev-server`에서 사용하는 구성을 사용자 지정하려면 [webpack 구성 파일](#webpack-bundling)을 사용하십시오.

Node.js를 대상으로 하는 Kotlin/JS 프로젝트를 실행하려면 `nodeRun` 작업의 별칭인 `jsNodeDevelopmentRun` 작업을 사용합니다.

프로젝트를 실행하려면 표준 수명 주기 `jsBrowserDevelopmentRun` 작업 또는 해당 별칭을 실행합니다.

```bash
./gradlew jsBrowserDevelopmentRun
```

소스 파일을 변경한 후 애플리케이션의 재빌드를 자동으로 트리거하려면 Gradle
[연속 빌드](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) 기능을 사용하십시오.

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

또는

```bash
./gradlew jsBrowserDevelopmentRun -t
```

프로젝트 빌드가 성공하면 `webpack-dev-server`가 자동으로 브라우저 페이지를 새로 고칩니다.

## test 작업

Kotlin Multiplatform Gradle 플러그인은 프로젝트에 대한 테스트 인프라를 자동으로 설정합니다. 브라우저 프로젝트의 경우 필요한 다른 종속성과 함께 [Karma](https://karma-runner.github.io/) 테스트 러너를 다운로드하고 설치합니다.
Node.js 프로젝트의 경우 [Mocha](https://mochajs.org/) 테스트 프레임워크가 사용됩니다.

또한 플러그인은 다음과 같은 유용한 테스트 기능을 제공합니다.

* 소스 맵 생성
* 테스트 보고서 생성
* 콘솔에 테스트 실행 결과 표시

브라우저 테스트를 실행하기 위해 플러그인은 기본적으로 [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README)을 사용합니다. 빌드 스크립트의 `useKarma {}` 블록 내에 해당 항목을 추가하여 테스트를 실행할 다른 브라우저를 선택할 수도 있습니다.

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

또는 `gradle.properties` 파일에 브라우저에 대한 테스트 대상을 추가할 수 있습니다.

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

이 접근 방식을 사용하면 모든 모듈에 대한 브라우저 목록을 정의한 다음 특정 모듈의 빌드 스크립트에 특정 브라우저를 추가할 수 있습니다.

Kotlin Multiplatform Gradle 플러그인은 이러한 브라우저를 자동으로 설치하지 않고 실행 환경에서 사용할 수 있는 브라우저만 사용합니다. 예를 들어 지속적 통합 서버에서 Kotlin/JS 테스트를 실행하는 경우 테스트할 브라우저가 설치되어 있는지 확인하십시오.

테스트를 건너뛰려면 `testTask {}`에 `enabled = false` 줄을 추가합니다.

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

테스트를 실행하려면 표준 수명 주기 `check` 작업을 실행합니다.

```bash
./gradlew check
```

Node.js 테스트 러너에서 사용하는 환경 변수를 지정하려면 (예: 외부 정보를 테스트에 전달하거나 패키지 확인을 미세 조정) 빌드 스크립트의 `testTask {}` 블록 내에서 키-값 쌍과 함께 `environment()` 함수를 사용합니다.

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

Kotlin Multiplatform Gradle 플러그인은 빌드 시점에 `build.gradle(.kts)`의 [`kotlin.js.browser.testTask.useKarma {}` 블록](#test-task)에서 설정을 포함하는 Karma 구성 파일을 자동으로 생성합니다.
파일은 `build/js/packages/projectName-test/karma.conf.js`에서 찾을 수 있습니다.
Karma에서 사용하는 구성을 조정하려면 프로젝트 루트의 `karma.config.d`라는 디렉터리에 추가 구성 파일을 넣습니다. 이 디렉터리의 모든 `.js` 구성 파일은 선택되어 빌드 시점에 생성된 `karma.conf.js` 파일에 자동으로 병합됩니다.

Karma 구성 기능은 Karma의 [문서](https://karma-runner.github.io/5.0/config/configuration-file.html)에 잘 설명되어 있습니다.

## webpack 번들링

브라우저 대상의 경우 Kotlin Multiplatform Gradle 플러그인은 널리 알려진 [webpack](https://webpack.js.org/) 모듈 번들러를 사용합니다.

### webpack 버전

Kotlin Multiplatform 플러그인은 webpack 5를 사용합니다.

플러그인 버전 1.5.0 이전 버전으로 생성된 프로젝트가 있는 경우 다음 줄을 프로젝트의 `gradle.properties`에 추가하여 이러한 버전에서 사용된 webpack 4로 일시적으로 다시 전환할 수 있습니다.

```none
kotlin.js.webpack.major.version=4
```

### webpack 작업

가장 일반적인 webpack 조정은 Gradle 빌드 파일의 `kotlin.js.browser.webpackTask {}` 구성 블록을 통해 직접 수행할 수 있습니다.
* `outputFileName` - 웹팩 출력 파일의 이름입니다. 웹팩 작업을 실행한 후 `<projectDir>/build/dist/<targetName>`에 생성됩니다. 기본값은 프로젝트 이름입니다.
* `output.libraryTarget` - 웹팩 출력에 대한 모듈 시스템입니다. [Kotlin/JS 프로젝트에 사용 가능한 모듈 시스템](js-modules)에 대해 자세히 알아보십시오. 기본값은 `umd`입니다.
  
```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

`commonWebpackConfig {}` 블록에서 번들링, 실행 및 테스트 작업에 사용할 일반적인 webpack 설정을 구성할 수도 있습니다.

### webpack 구성 파일

Kotlin Multiplatform Gradle 플러그인은 빌드 시점에 표준 webpack 구성 파일을 자동으로 생성합니다. `build/js/packages/projectName/webpack.config.js`에 있습니다.

webpack 구성을 추가로 조정하려면 프로젝트 루트의 `webpack.config.d`라는 디렉터리에 추가 구성 파일을 넣습니다. 프로젝트를 빌드할 때 모든 `.js` 구성 파일이 자동으로 `build/js/packages/projectName/webpack.config.js` 파일에 병합됩니다.
예를 들어 새 [webpack 로더](https://webpack.js.org/loaders/)를 추가하려면 `webpack.config.d` 디렉터리 내의 `.js` 파일에 다음을 추가합니다.

:::note
이 경우 구성 객체는 `config` 전역 객체입니다. 스크립트에서 수정해야 합니다.

:::

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

모든 webpack 구성
기능은 [문서](https://webpack.js.org/concepts/configuration/)에 잘 설명되어 있습니다.

### 실행 파일 빌드

webpack을 통해 실행 가능한 JavaScript 아티팩트를 빌드하기 위해 Kotlin Multiplatform Gradle 플러그인에는 `browserDevelopmentWebpack` 및 `browserProductionWebpack` Gradle 작업이 포함되어 있습니다.

* `browserDevelopmentWebpack`은 크기가 더 크지만 생성하는 데 시간이 거의 걸리지 않는 개발 아티팩트를 생성합니다.
따라서 활성 개발 중에는 `browserDevelopmentWebpack` 작업을 사용합니다.

* `browserProductionWebpack`은 생성된 아티팩트에 데드 코드 제거를 적용하고
결과 JavaScript 파일을 최소화합니다. 시간이 더 오래 걸리지만 크기가 더 작은 실행 파일을 생성합니다. 따라서 프로젝트를 프로덕션 용도로 준비할 때는 `browserProductionWebpack` 작업을 사용합니다.
 
 개발 또는 프로덕션에 대한 해당 아티팩트를 얻으려면 이러한 작업 중 하나를 실행합니다. 생성된 파일은 [달리 지정되지 않는 한](#distribution-target-directory) `build/dist`에서 사용할 수 있습니다.

```bash
./gradlew browserProductionWebpack
```

대상에서 실행 파일 생성(via `binaries.executable()`)을 위해 구성된 경우에만 이러한 작업을 사용할 수 있습니다.

## CSS

Kotlin Multiplatform Gradle 플러그인은 webpack의 [CSS](https://webpack.js.org/loaders/css-loader/) 및
[스타일](https://webpack.js.org/loaders/style-loader/) 로더도 지원합니다. 모든 옵션을 수정하여 직접 변경할 수 있지만
프로젝트를 빌드하는 데 사용되는 [webpack 구성 파일](#webpack-bundling)에서 가장 일반적으로 사용되는 설정은 `build.gradle(.kts)` 파일에서 직접 사용할 수 있습니다.

프로젝트에서 CSS 지원을 켜려면 `commonWebpackConfig {}` 블록의 Gradle 빌드 파일에서 `cssSupport.enabled` 옵션을 설정합니다. 이 구성은 마법사를 사용하여 새 프로젝트를 만들 때 기본적으로 활성화됩니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
browser {
    commonWebpackConfig {
        cssSupport {
            it.enabled = true
        }
    }
}
```

</TabItem>
</Tabs>

또는 `webpackTask {}`, `runTask {}` 및 `testTask {}`에 대해 독립적으로 CSS 지원을 추가할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

프로젝트에서 CSS 지원을 활성화하면 `Module parse failed: Unexpected character '@' (14:0)`과 같이 구성되지 않은 프로젝트에서 스타일 시트를 사용하려고 할 때 발생하는 일반적인 오류를 방지하는 데 도움이 됩니다.

`cssSupport.mode`를 사용하여 발생한 CSS를 처리하는 방법을 지정할 수 있습니다. 사용 가능한 값은 다음과 같습니다.

* `"inline"` (기본값): 스타일이 전역 `<style>` 태그에 추가됩니다.
* `"extract"`: 스타일이 별도의 파일로 추출됩니다. 그런 다음 HTML 페이지에서 포함할 수 있습니다.
* `"import"`: 스타일이 문자열로 처리됩니다. 코드에서 CSS에 액세스해야 하는 경우에 유용할 수 있습니다 (예:
`val styles = require("main.css")`).

동일한 프로젝트에 대해 다른 모드를 사용하려면 `cssSupport.rules`를 사용합니다. 여기에서 각 모드를 정의하는 `KotlinWebpackCssRules` 목록과
[include](https://webpack.js.org/configuration/module/#ruleinclude) 및
[exclude](https://webpack.js.org/configuration/module/#ruleexclude) 패턴을 지정할 수 있습니다.

## Node.js

Node.js를 대상으로 하는 Kotlin/JS 프로젝트의 경우 플러그인은 호스트에 Node.js 환경을 자동으로 다운로드하여 설치합니다.
기존 Node.js 인스턴스가 있는 경우 이를 사용할 수도 있습니다.

### Node.js 설정 구성

각 하위 프로젝트에 대해 Node.js 설정을 구성하거나 프로젝트 전체에 대해 설정을 구성할 수 있습니다.

예를 들어 특정 하위 프로젝트에 대한 Node.js 버전을 설정하려면 `build.gradle(.kts)` 파일의 Gradle 블록에 다음 줄을 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</TabItem>
</Tabs>

모든 하위 프로젝트를 포함하여 전체 프로젝트에 대한 버전을 설정하려면 `allProjects {}` 블록에 동일한 코드를 적용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
allprojects {
    project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
        project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</TabItem>
</Tabs>

:::note
전체 프로젝트에 대한 Node.js 설정을 구성하는 데 `NodeJsRootPlugin` 클래스를 사용하는 것은 더 이상 사용되지 않으며 결국 지원이 중단됩니다.

:::

### 사전 설치된 Node.js 사용

Kotlin/JS 프로젝트를 빌드하는 호스트에 Node.js가 이미 설치되어 있는 경우 Kotlin Multiplatform Gradle
플러그인이 자체 Node.js 인스턴스를 설치하는 대신 이를 사용하도록 구성할 수 있습니다.

사전 설치된 Node.js 인스턴스를 사용하려면 `build.gradle(.kts)` 파일에 다음 줄을 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    // Set to `true` for default behavior
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).download = false
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    // Set to `true` for default behavior
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().download = false
}
```

</TabItem>
</Tabs>

## Yarn

기본적으로 빌드 시점에 선언된 종속성을 다운로드하고 설치하기 위해 플러그인은 자체적으로
[Yarn](https://yarnpkg.com/lang/en/) 패키지 관리자 인스턴스를 관리합니다. 추가 구성 없이 즉시 작동하지만
호스트에 이미 설치된 Yarn을 조정하거나 사용할 수 있습니다.

### 추가 Yarn 기능: .yarnrc

추가 Yarn 기능을 구성하려면 프로젝트 루트에 `.yarnrc` 파일을 넣습니다.
빌드 시점에 자동으로 선택됩니다.

예를 들어 npm 패키지에 대한 사용자 지정 레지스트리를 사용하려면 프로젝트 루트의 `.yarnrc`라는 파일에 다음 줄을 추가합니다.

```text
registry "http://my.registry/api/npm/"
```

`.yarnrc`에 대한 자세한 내용은 [공식 Yarn 문서](https://classic.yarnpkg.com/en/docs/yarnrc/)를 참조하십시오.

### 사전 설치된 Yarn 사용

Kotlin/JS 프로젝트를 빌드하는 호스트에 Yarn이 이미 설치되어 있는 경우 Kotlin Multiplatform Gradle
플러그인이 자체 Yarn 인스턴스를 설치하는 대신 이를 사용하도록 구성할 수 있습니다.

사전 설치된 Yarn 인스턴스를 사용하려면 `build.gradle(.kts)`에 다음 줄을 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
    // "true" for default behavior
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
}
 
```

</TabItem>
</Tabs>

### kotlin-js-store를 통한 버전 잠금

:::note
`kotlin-js-store`를 통한 버전 잠금은 Kotlin 1.6.10부터 사용할 수 있습니다.

:::

프로젝트 루트의 `kotlin-js-store` 디렉터리는 버전 잠금에 필요한 `yarn.lock` 파일을 보관하기 위해 Kotlin Multiplatform Gradle 플러그인에 의해 자동으로 생성됩니다. 잠금 파일은 Yarn 플러그인에서 완전히 관리되며
`kotlinNpmInstall` Gradle 작업 실행 중에 업데이트됩니다.

[권장 사례](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)에 따라
`kotlin-js-store` 및 해당 콘텐츠를 버전 제어 시스템에 커밋합니다. 그러면 애플리케이션이 모든 시스템에서 정확히 동일한 종속성 트리로 빌드됩니다.

필요한 경우 `build.gradle(.kts)`에서 디렉터리 이름과 잠금 파일 이름을 모두 변경할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</TabItem>
</Tabs>

:::note
잠금 파일 이름을 변경하면 종속성 검사 도구가 파일을 더 이상 선택하지 못할 수 있습니다.

`yarn.lock`에 대한 자세한 내용은 [공식 Yarn 문서](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)를 참조하십시오.

### yarn.lock 업데이트 보고

Kotlin/JS는 `yarn.lock` 파일이 업데이트되었는지 알려줄 수 있는 Gradle 설정을 제공합니다.
CI 빌드 프로세스 중에 `yarn.lock`이 자동으로 변경된 경우 알림을 받으려면 이러한 설정을 사용할 수 있습니다.

* `YarnLockMismatchReport`: `yarn.lock` 파일의 변경 사항이 보고되는 방식을 지정합니다. 다음 값 중 하나를 사용할 수 있습니다.
    * `FAIL`: 해당 Gradle 작업이 실패합니다. 이것이 기본값입니다.
    * `WARNING`: 경고 로그에 변경 사항에 대한 정보를 씁니다.
    * `NONE`: 보고를 비활성화합니다.
* `reportNewYarnLock`: 최근에 생성된 `yarn.lock` 파일에 대해 명시적으로 보고합니다. 기본적으로 이 옵션은 비활성화되어 있습니다. 새 `yarn.lock` 파일을 처음 시작할 때 생성하는 것이 일반적인 방법입니다. 이 옵션을 사용하면 파일이 리포지토리에 커밋되었는지 확인할 수 있습니다.
* `yarnLockAutoReplace`: Gradle 작업을 실행할 때마다 `yarn.lock`을 자동으로 바꿉니다.

이러한 옵션을 사용하려면 다음과 같이 `build.gradle(.kts)`를 업데이트합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) \{
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
\}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) \{
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).reportNewYarnLock = false // true
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockAutoReplace = false // true
\}
```

</TabItem>
</Tabs>

### 기본적으로 --ignore-scripts로 npm 종속성 설치

기본적으로 `--ignore-scripts`로 npm 종속성 설치는 Kotlin 1.6.10부터 사용할 수 있습니다.

:::

손상된 npm 패키지의 악성 코드 실행 가능성을 줄이기 위해 Kotlin Multiplatform Gradle 플러그인은 기본적으로 npm 종속성 설치 중에 [수명 주기 스크립트](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts) 실행을 방지합니다.

다음 줄을 `build.gradle(.kts)`에 추가하여 수명 주기 스크립트 실행을 명시적으로 활성화할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> { 
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.
```
</TabItem>
</Tabs>