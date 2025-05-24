---
title: "JavaScript 모듈"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

다양한 인기 있는 모듈 시스템을 위해 Kotlin 프로젝트를 JavaScript 모듈로 컴파일할 수 있습니다. 현재 JavaScript 모듈에 대해 다음과 같은 구성을 지원합니다.

- [*AMD* 및 *CommonJS*와 모두 호환되는 [UMD(Unified Module Definitions)](https://github.com/umdjs/umd).
    UMD 모듈은 가져오지 않거나 모듈 시스템이 없는 경우에도 실행할 수 있습니다. 이는 `browser` 및 `nodejs` 대상에 대한 기본 옵션입니다.
- 특히 [RequireJS](https://requirejs.org/) 라이브러리에서 사용하는 [AMD(Asynchronous Module Definitions)](https://www.amdjs.org/amdjs-api/wiki/AMD).
- Node.js/npm에서 널리 사용되는 [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)
   (`require` 함수 및 `module.exports` 객체).
- Plain. 모듈 시스템을 위해 컴파일하지 마십시오. 전역 범위에서 이름으로 모듈에 액세스할 수 있습니다.

## 브라우저 대상

웹 브라우저 환경에서 코드를 실행하고 UMD 이외의 모듈 시스템을 사용하려는 경우 `webpackTask` 구성 블록에서 원하는 모듈
유형을 지정할 수 있습니다. 예를 들어 CommonJS로 전환하려면 다음을 사용합니다.

```groovy
kotlin {
    js {
        browser {
            webpackTask {
                output.libraryTarget = "commonjs2"
            }
        }
        binaries.executable()
    }
}

```

Webpack은 CommonJS의 두 가지 다른 종류인 `commonjs`와 `commonjs2`를 제공하며, 이는 선언이 사용 가능하게 되는 방식에 영향을 미칩니다.
대부분의 경우 생성된 라이브러리에 `module.exports` 구문을 추가하는 `commonjs2`를 원할 것입니다. 또는 CommonJS 사양을 엄격히 준수하는 `commonjs` 옵션을 선택할 수도 있습니다.
`commonjs`와 `commonjs2`의 차이점에 대해 자세히 알아보려면 [Webpack 리포지토리](https://github.com/webpack/webpack/issues/1114)를 참조하십시오.

## JavaScript 라이브러리 및 Node.js 파일

JavaScript 또는 Node.js 환경에서 사용하기 위한 라이브러리를 만들고 다른 모듈
시스템을 사용하려는 경우 지침이 약간 다릅니다.

### 대상 모듈 시스템 선택

대상 모듈 시스템을 선택하려면 Gradle 빌드 스크립트에서 `moduleKind` 컴파일러 옵션을 설정하십시오.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.js.ir.KotlinJsIrLink> {
    compilerOptions.moduleKind.set(org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlinJs.compilerOptions.moduleKind = org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS
```

</TabItem>
</Tabs>

사용 가능한 값은 `umd`(기본값), `commonjs`, `amd`, `plain`입니다.

:::note
이는 `webpackTask.output.libraryTarget`을 조정하는 것과는 다릅니다. 라이브러리 대상은
_webpack에서 생성된_ 출력(코드가 이미 컴파일된 후)을 변경합니다. `compilerOptions.moduleKind`는
_Kotlin 컴파일러에서_ 생성된 출력을 변경합니다.

:::  

Kotlin Gradle DSL에는 CommonJS 모듈 종류를 설정하는 바로 가기도 있습니다.

```kotlin
kotlin {
    js {
        useCommonJs()
        // ...
    }
}
```

## @JsModule 주석

`external` 클래스, 패키지, 함수 또는 속성이 JavaScript 모듈임을 Kotlin에 알리려면 `@JsModule`
주석을 사용할 수 있습니다. "hello"라는 다음 CommonJS 모듈이 있다고 가정해 보겠습니다.

```javascript
module.exports.sayHello = function (name) { alert("Hello, " + name); }
```

Kotlin에서 다음과 같이 선언해야 합니다.

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

### @JsModule을 패키지에 적용

일부 JavaScript 라이브러리는 함수 및 클래스 대신 패키지(네임스페이스)를 내보냅니다.
JavaScript의 관점에서 볼 때 이는 클래스, 함수 및 속성인 *멤버*를 가진 *객체*입니다.
이러한 패키지를 Kotlin 객체로 가져오는 것은 종종 부자연스럽게 보입니다.
컴파일러는 다음 표기법을 사용하여 가져온 JavaScript 패키지를 Kotlin 패키지에 매핑할 수 있습니다.

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

external class C
```

해당 JavaScript 모듈은 다음과 같이 선언됩니다.

```javascript
module.exports = {
  foo: { /* some code here */ },
  C: { /* some code here */ }
}
```

`@file:JsModule` 주석으로 표시된 파일은 비 외부 멤버를 선언할 수 없습니다.
아래 예제는 컴파일 시간 오류를 생성합니다.

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```

### 더 깊은 패키지 계층 구조 가져오기

이전 예제에서 JavaScript 모듈은 단일 패키지를 내보냅니다.
그러나 일부 JavaScript 라이브러리는 모듈 내에서 여러 패키지를 내보냅니다.
이 경우도 Kotlin에서 지원하지만 가져오는 각 패키지에 대해 새 `.kt` 파일을 선언해야 합니다.

예를 들어 예제를 약간 더 복잡하게 만들어 보겠습니다.

```javascript
module.exports = {
  mylib: {
    pkg1: {
      foo: function () { /* some code here */ },
      bar: function () { /* some code here */ }
    },
    pkg2: {
      baz: function () { /* some code here */ }
    }
  }
}
```

이 모듈을 Kotlin으로 가져오려면 두 개의 Kotlin 소스 파일을 작성해야 합니다.

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")

package extlib.pkg1

external fun foo()

external fun bar()
```

그리고

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")

package extlib.pkg2

external fun baz()
```

### @JsNonModule 주석

선언이 `@JsModule`로 표시되면 JavaScript 모듈로 컴파일하지 않을 때 Kotlin 코드에서 사용할 수 없습니다.
일반적으로 개발자는 JavaScript 모듈과 다운로드 가능한 `.js` 파일을 모두 배포합니다.
프로젝트의 정적 리소스로 복사하여 `<script>` 태그를 통해 포함할 수 있습니다. Kotlin에
비 모듈 환경에서 `@JsModule` 선언을 사용해도 괜찮다고 알리려면 `@JsNonModule` 주석을 추가하십시오. 예를 들어
다음 JavaScript 코드를 고려하십시오.

```javascript
function topLevelSayHello (name) { alert("Hello, " + name); }

if (module && module.exports) {
  module.exports = topLevelSayHello;
}
```

Kotlin에서 다음과 같이 설명할 수 있습니다.

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```

### Kotlin 표준 라이브러리에서 사용하는 모듈 시스템

Kotlin은 Kotlin/JS 표준 라이브러리와 함께 단일 파일로 배포되며, 자체적으로 UMD 모듈로 컴파일되므로
위에서 설명한 모든 모듈 시스템과 함께 사용할 수 있습니다. Kotlin/JS의 대부분의 사용 사례에서는
NPM에서 [`kotlin`](https://www.npmjs.com/package/kotlin)
패키지로도 사용할 수 있는 `kotlin-stdlib-js`에 대한 Gradle 종속성을 사용하는 것이 좋습니다.